import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  description?: string;
}

const colorClasses = {
  primary: 'text-primary bg-primary/10',
  secondary: 'text-secondary bg-secondary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  color = 'primary',
  description,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setTilt({
      x: ((y - centerY) / centerY) * -8,
      y: ((x - centerX) / centerX) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="metric-card cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold">{value}</span>
        {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;
