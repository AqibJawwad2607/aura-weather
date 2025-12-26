import React from 'react';
import { AlertTriangle, CloudLightning, Wind, Thermometer, Droplets, AlertOctagon, X } from 'lucide-react';
import { WeatherAlert, Earthquake } from '@/services/weatherService';

interface AlertsPanelProps {
  weatherAlerts: WeatherAlert[];
  earthquakes: Earthquake[];
  onDismiss?: (type: 'weather' | 'earthquake', id: string) => void;
}

const severityColors = {
  extreme: 'bg-danger/20 border-danger text-danger',
  severe: 'bg-warning/20 border-warning text-warning',
  moderate: 'bg-primary/20 border-primary text-primary',
  minor: 'bg-muted/20 border-muted-foreground text-muted-foreground',
};

const earthquakeColors = {
  green: 'bg-success/20 border-success',
  yellow: 'bg-warning/20 border-warning',
  orange: 'bg-warning/20 border-warning',
  red: 'bg-danger/20 border-danger',
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({ weatherAlerts, earthquakes }) => {
  const hasAlerts = weatherAlerts.length > 0 || earthquakes.length > 0;

  if (!hasAlerts) {
    return (
      <div className="animate-fade-up stagger-4 opacity-0">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-success" />
          Alerts & Warnings
        </h3>
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-success" />
          </div>
          <p className="text-muted-foreground">No active alerts in your area</p>
          <p className="text-sm text-muted-foreground mt-1">Stay safe and check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up stagger-4 opacity-0">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        Alerts & Warnings
        <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
          {weatherAlerts.length + earthquakes.length}
        </span>
      </h3>
      
      <div className="space-y-3">
        {/* Weather Alerts */}
        {weatherAlerts.map((alert, index) => {
          const severity = (alert.severity?.toLowerCase() || 'moderate') as keyof typeof severityColors;
          const colorClass = severityColors[severity] || severityColors.moderate;
          
          return (
            <div
              key={`weather-${index}`}
              className={`glass-card p-4 border-l-4 ${colorClass} transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
                  <CloudLightning className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold truncate">{alert.event}</h4>
                    <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                      {severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {alert.headline || alert.description}
                  </p>
                  {alert.start && alert.end && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Earthquake Alerts */}
        {earthquakes.map((quake) => {
          const alertLevel = quake.alert || 'green';
          const colorClass = earthquakeColors[alertLevel as keyof typeof earthquakeColors] || earthquakeColors.green;
          
          return (
            <div
              key={quake.id}
              className={`glass-card p-4 border-l-4 ${colorClass} transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-danger" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold">
                      M{quake.magnitude.toFixed(1)} Earthquake
                    </h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      quake.magnitude >= 5 ? 'bg-danger/20 text-danger' :
                      quake.magnitude >= 4 ? 'bg-warning/20 text-warning' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {quake.magnitude >= 5 ? 'Strong' : quake.magnitude >= 4 ? 'Moderate' : 'Light'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quake.place}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Depth: {quake.depth.toFixed(1)}km</span>
                    <span>{new Date(quake.time).toLocaleString()}</span>
                    {quake.tsunami && (
                      <span className="text-danger font-medium">⚠️ Tsunami Risk</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPanel;
