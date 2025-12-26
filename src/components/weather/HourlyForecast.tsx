import React from 'react';
import WeatherIcon from './WeatherIcon';
import { HourlyForecast as HourlyForecastType } from '@/services/weatherService';

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="animate-fade-up stagger-1 opacity-0">
      <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
      <div className="glass-card p-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data.map((hour, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-20 p-3 rounded-xl bg-background/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <p className="text-xs text-muted-foreground text-center mb-2">
                {index === 0 ? 'Now' : hour.time}
              </p>
              <div className="flex justify-center mb-2">
                <WeatherIcon icon={hour.icon} size="md" />
              </div>
              <p className="text-sm font-semibold text-center">
                {hour.temperature}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
