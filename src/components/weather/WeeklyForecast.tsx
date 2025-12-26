import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

interface DayForecast {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  minTemp: number;
  maxTemp: number;
}

interface WeeklyForecastProps {
  data: DayForecast[];
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

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ data }) => {
  return (
    <div className="animate-fade-up stagger-2 opacity-0">
      <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
      <div className="glass-card divide-y divide-border">
        {data.map((day, index) => {
          const Icon = weatherIcons[day.condition];
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-24">
                  <p className="font-medium">{day.day}</p>
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                </div>
                <Icon className={`w-6 h-6 ${iconColors[day.condition]} group-hover:scale-110 transition-transform`} />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-10 text-right">
                  {day.minTemp}°
                </span>
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-primary/30 to-warning/50 relative overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-warning rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((day.maxTemp - day.minTemp) / 20) * 100}%`,
                      marginLeft: `${((day.minTemp + 5) / 40) * 100}%`
                    }}
                  />
                </div>
                <span className="font-semibold w-10">
                  {day.maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;
