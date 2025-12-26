import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, MapPin, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onSearch?: (city: string) => void;
  onLocationRequest?: () => void;
  isLoading?: boolean;
  currentCity?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onLocationRequest, isLoading, currentCity }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
      setSearchValue('');
    }
  };

  return (
    <nav className="w-full py-4 px-4 md:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight hidden sm:block">
          Weather<span className="text-primary">Sphere</span>
        </h1>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="flex-1 max-w-md mx-4"
      >
        <div className="relative group">
          {isLoading ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          )}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={currentCity ? `${currentCity} — Search another city...` : "Search city..."}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            disabled={isLoading}
          />
        </div>
      </form>

      <div className="flex items-center gap-2">
        <button
          onClick={onLocationRequest}
          disabled={isLoading}
          className="w-10 h-10 rounded-xl bg-card/50 border border-border backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          aria-label="Use my location"
          title="Use my location"
        >
          <MapPin className="w-5 h-5 text-primary" />
        </button>

        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-card/50 border border-border backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all hover:scale-105 active:scale-95"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-warning" />
          ) : (
            <Moon className="w-5 h-5 text-secondary" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
