import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get('OPENWEATHERMAP_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    
    console.log('Weather request received:', { lat, lon, city });

    if (!API_KEY) {
      console.error('OpenWeatherMap API key not configured');
      throw new Error('Weather API key not configured');
    }

    let weatherUrl: string;
    let forecastUrl: string;
    let alertsUrl: string;

    if (lat && lon) {
      // Use coordinates
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      alertsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,daily`;
    } else if (city) {
      // First get coordinates from city name
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
      console.log('Fetching geo data for city:', city);
      
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found');
      }
      
      const { lat: cityLat, lon: cityLon } = geoData[0];
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric`;
      alertsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,daily`;
    } else {
      throw new Error('Either coordinates (lat, lon) or city name is required');
    }

    console.log('Fetching weather data...');

    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ]);

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('Weather data fetched successfully');

    // Try to fetch alerts (may fail on free tier)
    let alerts: any[] = [];
    try {
      const alertsResponse = await fetch(alertsUrl);
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        alerts = alertsData.alerts || [];
      }
    } catch (e) {
      console.log('Alerts not available on free tier');
    }

    // Process hourly forecast (next 24 hours from 3-hour intervals)
    const hourlyForecast = forecastData.list?.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.round(item.main.temp),
      condition: mapCondition(item.weather[0].main),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    })) || [];

    // Process weekly forecast (group by day)
    const dailyMap = new Map();
    forecastData.list?.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          day: date,
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          temps: [],
          condition: mapCondition(item.weather[0].main),
          icon: item.weather[0].icon,
        });
      }
      dailyMap.get(date).temps.push(item.main.temp);
    });

    const weeklyForecast = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => ({
      day: day.day,
      date: day.date,
      condition: day.condition,
      icon: day.icon,
      minTemp: Math.round(Math.min(...day.temps)),
      maxTemp: Math.round(Math.max(...day.temps)),
    }));

    const result = {
      current: {
        city: weatherData.name,
        country: weatherData.sys?.country || '',
        temperature: Math.round(weatherData.main?.temp || 0),
        feelsLike: Math.round(weatherData.main?.feels_like || 0),
        condition: weatherData.weather?.[0]?.main || 'Unknown',
        description: weatherData.weather?.[0]?.description || '',
        icon: weatherData.weather?.[0]?.icon || '01d',
        humidity: weatherData.main?.humidity || 0,
        windSpeed: Math.round((weatherData.wind?.speed || 0) * 3.6), // m/s to km/h
        pressure: weatherData.main?.pressure || 0,
        visibility: Math.round((weatherData.visibility || 0) / 1000), // m to km
        sunrise: weatherData.sys?.sunrise || 0,
        sunset: weatherData.sys?.sunset || 0,
        lat: weatherData.coord?.lat,
        lon: weatherData.coord?.lon,
      },
      hourly: hourlyForecast,
      weekly: weeklyForecast,
      alerts,
    };

    console.log('Response prepared successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-weather function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapCondition(condition: string): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('clear') || conditionLower.includes('sun')) return 'sunny';
  if (conditionLower.includes('cloud') || conditionLower.includes('mist') || conditionLower.includes('fog')) return 'cloudy';
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return 'rainy';
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) return 'snowy';
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return 'stormy';
  return 'cloudy';
}
