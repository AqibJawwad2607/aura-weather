import React from 'react';
import { Droplets, Wind, Gauge, Eye, SunMedium, CloudRain } from 'lucide-react';
import Navbar from '@/components/weather/Navbar';
import WeatherHeroCard from '@/components/weather/WeatherHeroCard';
import HourlyForecast from '@/components/weather/HourlyForecast';
import WeeklyForecast from '@/components/weather/WeeklyForecast';
import MetricCard from '@/components/weather/MetricCard';
import { currentWeather, hourlyForecast, weeklyForecast, weatherMetrics } from '@/data/mockWeatherData';

const Index = () => {
  const handleSearch = (city: string) => {
    console.log('Searching for:', city);
    // API integration would go here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <Navbar onSearch={handleSearch} />

        <main className="px-4 md:px-6 pb-8 space-y-6">
          {/* Hero Section */}
          <WeatherHeroCard {...currentWeather} />

          {/* Hourly & Weekly Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HourlyForecast data={hourlyForecast} />
            <WeeklyForecast data={weeklyForecast} />
          </div>

          {/* Metrics Grid */}
          <div className="animate-fade-up stagger-3 opacity-0">
            <h3 className="text-lg font-semibold mb-4">Weather Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <MetricCard
                icon={Droplets}
                label="Humidity"
                value={weatherMetrics.humidity.value}
                unit={weatherMetrics.humidity.unit}
                color="primary"
                description={weatherMetrics.humidity.description}
              />
              <MetricCard
                icon={Wind}
                label="Wind Speed"
                value={weatherMetrics.windSpeed.value}
                unit={weatherMetrics.windSpeed.unit}
                color="secondary"
                description={weatherMetrics.windSpeed.description}
              />
              <MetricCard
                icon={Gauge}
                label="Pressure"
                value={weatherMetrics.pressure.value}
                unit={weatherMetrics.pressure.unit}
                color="success"
                description={weatherMetrics.pressure.description}
              />
              <MetricCard
                icon={Eye}
                label="Visibility"
                value={weatherMetrics.visibility.value}
                unit={weatherMetrics.visibility.unit}
                color="primary"
                description={weatherMetrics.visibility.description}
              />
              <MetricCard
                icon={SunMedium}
                label="UV Index"
                value={weatherMetrics.uvIndex.value}
                color="warning"
                description={weatherMetrics.uvIndex.description}
              />
              <MetricCard
                icon={CloudRain}
                label="Precipitation"
                value={weatherMetrics.precipitation.value}
                unit={weatherMetrics.precipitation.unit}
                color="primary"
                description={weatherMetrics.precipitation.description}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
