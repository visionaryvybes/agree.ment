"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

type Theme = 'dark' | 'light';

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('agreemint-theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('agreemint-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-all duration-500 border flex items-center px-1",
        theme === 'dark'
          ? "bg-white/5 border-white/10"
          : "bg-amber/20 border-amber/30",
        className
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-full transition-all duration-500 flex items-center justify-center",
        theme === 'dark'
          ? "translate-x-0 bg-emerald shadow-[0_0_10px_rgba(0,255,209,0.3)]"
          : "translate-x-7 bg-amber shadow-[0_0_10px_rgba(255,184,0,0.3)]"
      )}>
        {theme === 'dark' ? (
          <Moon size={12} weight="bold" className="text-[#010101]" />
        ) : (
          <Sun size={12} weight="bold" className="text-[#010101]" />
        )}
      </div>
    </button>
  );
}
