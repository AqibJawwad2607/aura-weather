import React from 'react';
import WeatherIcon from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';
import { CurrentWeather, formatDate } from '@/services/weatherService';

interface WeatherHeroCardProps {
  data: CurrentWeather;
}

const WeatherHeroCard: React.FC<WeatherHeroCardProps> = ({ data }) => {
  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden animate-fade-up">
      {/* Background gradient orb */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-secondary/20 to-primary/10 rounded-full blur-3xl opacity-40" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Left side - Location & Temp */}
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">{formatDate()}</p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-1">
                {data.city}, <span className="text-muted-foreground font-normal">{data.country}</span>
              </h2>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-7xl md:text-8xl font-light tracking-tighter gradient-text">
                {data.temperature}
              </span>
              <span className="text-3xl text-muted-foreground">°C</span>
            </div>
            
            <p className="text-lg text-muted-foreground">
              Feels like <span className="text-foreground font-medium">{data.feelsLike}°C</span>
            </p>
          </div>
          
          {/* Right side - Condition & Stats */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <WeatherIcon icon={data.icon} size="lg" />
              </div>
              <div>
                <span className="text-xl font-medium block">{data.condition}</span>
                <span className="text-sm text-muted-foreground capitalize">{data.description}</span>
              </div>
            </div>
            
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="font-semibold">{data.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Wind className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wind</p>
                  <p className="font-semibold">{data.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHeroCard;
