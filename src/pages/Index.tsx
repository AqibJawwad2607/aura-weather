import React, { useEffect, useState, useCallback } from 'react';
import { Droplets, Wind, Gauge, Eye, SunMedium, CloudRain, Sunrise, Sunset } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/weather/Navbar';
import WeatherHeroCard from '@/components/weather/WeatherHeroCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import WeeklyForecast from '@/components/weather/WeeklyForecast';
import MetricCard from '@/components/weather/MetricCard';
import AlertsPanel from '@/components/weather/AlertsPanel';
import ErrorState from '@/components/weather/ErrorState';
import { HeroSkeleton, HourlySkeleton, WeeklySkeleton, MetricsSkeleton, AlertsSkeleton } from '@/components/weather/LoadingSkeletons';
import { 
  WeatherData, 
  Earthquake, 
  getWeatherByCity, 
  getWeatherByCoords, 
  getEarthquakes,
  formatTime 
} from '@/services/weatherService';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = useCallback(async (city?: string, coords?: { lat: number; lon: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      let data: WeatherData;
      
      if (coords) {
        data = await getWeatherByCoords(coords.lat, coords.lon);
      } else if (city) {
        data = await getWeatherByCity(city);
      } else {
        // Default to San Francisco
        data = await getWeatherByCity('San Francisco');
      }

      setWeatherData(data);
      
      // Fetch earthquakes for the location
      if (data.current.lat && data.current.lon) {
        try {
          const quakes = await getEarthquakes(data.current.lat, data.current.lon, 500);
          setEarthquakes(quakes);
        } catch (e) {
          console.log('Could not fetch earthquakes:', e);
        }
      }

      toast.success(`Weather loaded for ${data.current.city}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load weather data';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((city: string) => {
    fetchWeatherData(city);
  }, [fetchWeatherData]);

  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast.dismiss();
        fetchWeatherData(undefined, {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        toast.dismiss();
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please search for a city instead.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location unavailable. Please search for a city.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            toast.error('Could not get your location. Please search for a city.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, [fetchWeatherData]);

  useEffect(() => {
    // Try geolocation first, fallback to default city
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(undefined, {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          // Fallback to default city
          fetchWeatherData('San Francisco');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 }
      );
    } else {
      fetchWeatherData('San Francisco');
    }
  }, [fetchWeatherData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Navbar 
          onSearch={handleSearch} 
          onLocationRequest={handleLocationRequest}
          isLoading={isLoading}
          currentCity={weatherData?.current.city}
        />

        <main className="px-4 md:px-6 pb-8 space-y-6">
          {error && !isLoading ? (
            <ErrorState 
              message={error} 
              onRetry={() => fetchWeatherData(weatherData?.current.city || 'San Francisco')}
              onUseLocation={handleLocationRequest}
            />
          ) : (
            <>
              {/* Hero Section */}
              {isLoading ? <HeroSkeleton /> : weatherData && <WeatherHeroCard data={weatherData.current} />}

              {/* Hourly & Weekly Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? <HourlySkeleton /> : weatherData && <HourlyForecast data={weatherData.hourly} />}
                {isLoading ? <WeeklySkeleton /> : weatherData && <WeeklyForecast data={weatherData.weekly} />}
              </div>

              {/* Alerts Section */}
              {isLoading ? (
                <AlertsSkeleton />
              ) : (
                <AlertsPanel 
                  weatherAlerts={weatherData?.alerts || []} 
                  earthquakes={earthquakes}
                />
              )}

              {/* Metrics Grid */}
              {isLoading ? (
                <MetricsSkeleton />
              ) : weatherData && (
                <div className="animate-fade-up stagger-5 opacity-0">
                  <h3 className="text-lg font-semibold mb-4">Weather Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <MetricCard
                      icon={Droplets}
                      label="Humidity"
                      value={weatherData.current.humidity}
                      unit="%"
                      color="primary"
                      description="Current moisture level"
                    />
                    <MetricCard
                      icon={Wind}
                      label="Wind Speed"
                      value={weatherData.current.windSpeed}
                      unit="km/h"
                      color="secondary"
                      description="Current wind conditions"
                    />
                    <MetricCard
                      icon={Gauge}
                      label="Pressure"
                      value={weatherData.current.pressure}
                      unit="hPa"
                      color="success"
                      description="Atmospheric pressure"
                    />
                    <MetricCard
                      icon={Eye}
                      label="Visibility"
                      value={weatherData.current.visibility}
                      unit="km"
                      color="primary"
                      description="Current visibility range"
                    />
                    <MetricCard
                      icon={Sunrise}
                      label="Sunrise"
                      value={formatTime(weatherData.current.sunrise)}
                      color="warning"
                      description="Morning sun rise time"
                    />
                    <MetricCard
                      icon={Sunset}
                      label="Sunset"
                      value={formatTime(weatherData.current.sunset)}
                      color="secondary"
                      description="Evening sun set time"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
