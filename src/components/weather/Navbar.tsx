import React, { useState } from 'react';
import { Search, Moon, Sun, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onSearch?: (city: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search city..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
      </form>

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
    </nav>
  );
};

export default Navbar;
