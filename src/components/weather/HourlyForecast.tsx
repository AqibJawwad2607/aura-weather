import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

interface HourlyItem {
  time: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
}

interface HourlyForecastProps {
  data: HourlyItem[];
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: CloudLightning,
};

const iconColors = {
  sunny: 'text-warning',
  cloudy: 'text-muted-foreground',
  rainy: 'text-primary',
  snowy: 'text-primary',
  stormy: 'text-secondary',
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="animate-fade-up stagger-1 opacity-0">
      <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
      <div className="glass-card p-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data.map((hour, index) => {
            const Icon = weatherIcons[hour.condition];
            return (
              <div
                key={index}
                className="flex-shrink-0 w-20 p-3 rounded-xl bg-background/50 hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <p className="text-xs text-muted-foreground text-center mb-2">
                  {hour.time}
                </p>
                <div className="flex justify-center mb-2">
                  <Icon className={`w-6 h-6 ${iconColors[hour.condition]} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-sm font-semibold text-center">
                  {hour.temperature}°
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
