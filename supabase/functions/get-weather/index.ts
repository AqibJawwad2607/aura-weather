import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Weatherstack Interfaces
interface WeatherstackCurrent {
  observation_time: string;
  temperature: number;
  weather_code: number;
  weather_icons: string[];
  weather_descriptions: string[];
  wind_speed: number;
  wind_degree: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  is_day: string;
}

interface WeatherstackLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  timezone_id: string;
  localtime: string;
  localtime_epoch: number;
  utc_offset: string;
}

interface WeatherstackResponse {
  request: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location: WeatherstackLocation;
  current: WeatherstackCurrent;
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

// Interfaces for our Frontend Response (Contract)
interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

interface HourlyItem {
  time: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  icon: string;
  description: string;
}

interface DailyItem {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  icon: string;
  minTemp: number;
  maxTemp: number;
}

const API_KEY = Deno.env.get('WEATHERSTACK_API_KEY');

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();

    console.log('Weather request received:', { lat, lon, city });

    if (!API_KEY) {
      console.error('Weatherstack API key not configured');
      throw new Error('Weather API key not configured');
    }

    let url: string;

    // Weatherstack Current Weather Endpoint
    // Note: Weatherstack Free Tier uses HTTP, not HTTPS.
    const baseUrl = 'http://api.weatherstack.com/current';

    if (lat && lon) {
      url = `${baseUrl}?access_key=${API_KEY}&query=${lat},${lon}&units=m`;
    } else if (city) {
      url = `${baseUrl}?access_key=${API_KEY}&query=${encodeURIComponent(city)}&units=m`;
    } else {
      throw new Error('Either coordinates (lat, lon) or city name is required');
    }

    console.log('Fetching weather data from Weatherstack...');
    const response = await fetch(url);
    const data: WeatherstackResponse = await response.json();

    if (data.success === false && data.error) {
      console.error('Weatherstack API error:', data.error);
      throw new Error(`Weatherstack API error: ${data.error.info}`);
    }

    if (!data.current || !data.location) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response from Weather API');
    }

    console.log('Weather data fetched successfully');

    // MAPPING LOGIC
    // Since Free Tier doesn't provide forecast, we mock hourly/weekly data based on current
    // to prevent the frontend from breaking or showing empty states.

    const condition = mapWeatherCodeToCondition(data.current.weather_code);
    const description = data.current.weather_descriptions[0] || '';
    const icon = data.current.weather_icons[0] || '';

    // Simulate Hourly Forecast (Next 5 hours)
    // We just reuse current weather with slight variations
    const hourlyForecast: HourlyItem[] = Array.from({ length: 8 }).map((_, i) => {
      const time = new Date();
      time.setHours(time.getHours() + i * 3);
      return {
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temperature: data.current.temperature, // Placeholder
        condition: condition,
        icon: icon,
        description: description,
      };
    });

    // Simulate Weekly Forecast (Next 7 days)
    const weeklyForecast: DailyItem[] = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        day: dayName,
        date: dateStr,
        condition: condition,
        icon: icon,
        minTemp: data.current.temperature - 2, // Placeholder variation
        maxTemp: data.current.temperature + 2,
      };
    });

    const result = {
      current: {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temperature,
        feelsLike: data.current.feelslike,
        condition: data.current.weather_descriptions[0] || 'Unknown', // Using description as main condition text
        description: description,
        icon: icon,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_speed,
        pressure: data.current.pressure,
        visibility: data.current.visibility,
        sunrise: 0, // Not available in current endpoint
        sunset: 0,
        lat: parseFloat(data.location.lat),
        lon: parseFloat(data.location.lon),
      },
      hourly: hourlyForecast,
      weekly: weeklyForecast,
      alerts: [],
    };

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

function mapWeatherCodeToCondition(code: number): 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' {
  // WMO Weather Codes (Weatherstack uses similar codes)
  if (code === 113) return 'sunny';
  if (code >= 116 && code <= 143) return 'cloudy';
  if (code >= 176 && code <= 200) return 'rainy'; // patchy rain
  if (code >= 200 && code <= 299) return 'stormy';
  if (code >= 300 && code <= 350) return 'rainy';
  if (code >= 350 && code <= 395) return 'snowy'; // snow/sleet
  if (code >= 386) return 'stormy';

  // Default fallbacks based on ranges
  if (code > 300) return 'rainy';
  return 'cloudy';
}
