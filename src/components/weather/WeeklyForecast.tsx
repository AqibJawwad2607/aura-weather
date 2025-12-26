import React from 'react';
import WeatherIcon from './WeatherIcon';
import { DailyForecast } from '@/services/weatherService';

interface WeeklyForecastProps {
  data: DailyForecast[];
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="animate-fade-up stagger-2 opacity-0">
      <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
      <div className="glass-card divide-y divide-border">
        {data.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-24">
                <p className="font-medium">{index === 0 ? 'Today' : day.day}</p>
                <p className="text-xs text-muted-foreground">{day.date}</p>
              </div>
              <WeatherIcon icon={day.icon} size="md" />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm w-10 text-right">
                {day.minTemp}°
              </span>
              <div className="w-24 h-2 rounded-full bg-gradient-to-r from-primary/30 to-warning/50 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-warning rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, ((day.maxTemp - day.minTemp) / 20) * 100)}%`,
                    marginLeft: `${Math.max(0, Math.min(70, ((day.minTemp + 10) / 50) * 100))}%`
                  }}
                />
              </div>
              <span className="font-semibold w-10">
                {day.maxTemp}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
