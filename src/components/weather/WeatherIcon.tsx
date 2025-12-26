import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun, CloudMoon, Moon, CloudFog } from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  icon, 
  size = 'md', 
  animated = true,
  className = '' 
}) => {
  const sizeClass = sizeClasses[size];
  const animationClass = animated ? 'transition-transform duration-300 hover:scale-110' : '';
  
  // Map OpenWeatherMap icon codes to Lucide icons and colors
  const getIconComponent = () => {
    // Icon codes: https://openweathermap.org/weather-conditions
    // Format: XXd (day) or XXn (night)
    const isNight = icon.endsWith('n');
    const code = icon.slice(0, 2);
    
    switch (code) {
      case '01': // Clear sky
        return isNight 
          ? <Moon className={`${sizeClass} text-indigo-300 ${animationClass} ${className}`} />
          : <Sun className={`${sizeClass} text-warning ${animationClass} animate-pulse-glow ${className}`} />;
      
      case '02': // Few clouds
        return isNight
          ? <CloudMoon className={`${sizeClass} text-indigo-300 ${animationClass} ${className}`} />
          : <CloudSun className={`${sizeClass} text-warning ${animationClass} ${className}`} />;
      
      case '03': // Scattered clouds
      case '04': // Broken clouds
        return <Cloud className={`${sizeClass} text-muted-foreground ${animationClass} ${className}`} />;
      
      case '09': // Shower rain
      case '10': // Rain
        return <CloudRain className={`${sizeClass} text-primary ${animationClass} ${className}`} />;
      
      case '11': // Thunderstorm
        return <CloudLightning className={`${sizeClass} text-secondary ${animationClass} ${className}`} />;
      
      case '13': // Snow
        return <CloudSnow className={`${sizeClass} text-primary ${animationClass} ${className}`} />;
      
      case '50': // Mist/fog
        return <CloudFog className={`${sizeClass} text-muted-foreground ${animationClass} ${className}`} />;
      
      default:
        return <Cloud className={`${sizeClass} text-muted-foreground ${animationClass} ${className}`} />;
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {getIconComponent()}
    </div>
  );
};

export default WeatherIcon;
