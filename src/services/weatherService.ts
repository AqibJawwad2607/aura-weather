import { supabase } from '@/integrations/supabase/client';

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  lat: number;
  lon: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  icon: string;
  description: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  icon: string;
  minTemp: number;
  maxTemp: number;
}

export interface WeatherAlert {
  event: string;
  headline: string;
  description: string;
  start: number;
  end: number;
  severity: string;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  lat: number;
  lon: number;
  url: string;
  tsunami: boolean;
  alert: string | null;
  significance: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  weekly: DailyForecast[];
  alerts: WeatherAlert[];
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('get-weather', {
    body: { city },
  });

  if (error) {
    console.error('Error fetching weather:', error);
    throw new Error(error.message || 'Failed to fetch weather data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('get-weather', {
    body: { lat, lon },
  });

  if (error) {
    console.error('Error fetching weather:', error);
    throw new Error(error.message || 'Failed to fetch weather data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

export async function getEarthquakes(lat?: number, lon?: number, radius?: number): Promise<Earthquake[]> {
  const { data, error } = await supabase.functions.invoke('get-earthquakes', {
    body: { lat, lon, radius },
  });

  if (error) {
    console.error('Error fetching earthquakes:', error);
    throw new Error(error.message || 'Failed to fetch earthquake data');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data.earthquakes || [];
}

export function formatDate(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp * 1000) : new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
