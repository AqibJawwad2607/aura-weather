import React from 'react';
import { AlertTriangle, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onUseLocation?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, onUseLocation }) => {
  return (
    <div className="glass-card p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Unable to Load Weather</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {onUseLocation && (
          <Button onClick={onUseLocation} variant="outline" className="gap-2">
            <MapPin className="w-4 h-4" />
            Use My Location
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
