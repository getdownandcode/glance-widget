import React, { useState, useEffect } from 'react';
import { WidgetConfig } from '../types/widget';
import { WidgetRenderer } from './WidgetRenderer';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  Clock, 
  Battery, 
  Calendar,
  Sparkles,
  Music2,
  Play,
  Pause
} from 'lucide-react';

interface StandByScreenProps {
  widget: WidgetConfig;
  onClose: () => void;
  onUpdateWidget?: (updater: (prev: WidgetConfig) => WidgetConfig) => void;
}

export const StandByScreen: React.FC<StandByScreenProps> = ({
  widget,
  onClose,
  onUpdateWidget,
}) => {
  const [now, setNow] = useState(new Date());
  const [isNightMode, setIsNightMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className={`fixed inset-0 z-50 transition-colors duration-500 flex flex-col justify-between p-6 select-none ${
      isNightMode ? 'bg-black text-red-500' : 'bg-slate-950 text-white'
    }`}>
      {/* Top StandBy status row */}
      <div className="flex items-center justify-between text-xs font-semibold z-20">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            STANDBY WIDGET LIVE
          </span>
          <span className="opacity-60 hidden sm:inline">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Night mode toggle (Red monochrome for bedside) */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Toggle Red Night Vision Mode"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Close Standby */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1 text-xs"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit StandBy</span>
          </button>
        </div>
      </div>

      {/* Center Hero Live Display */}
      <div className="my-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-6xl mx-auto w-full">
        {/* Left: Giant Typography Clock */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-baseline gap-2">
            <span className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight tabular-nums leading-none">
              {hours}:{minutes}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-bold opacity-80">{ampm}</span>
              <span className="text-sm font-mono opacity-60 tabular-nums">:{seconds}</span>
            </div>
          </div>
          <p className="text-sm sm:text-base font-medium opacity-80 mt-2">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {widget.weather.city} {widget.weather.temperature}°{widget.weather.unit}
          </p>
        </div>

        {/* Right: The user's custom designed widget rendered in full interactive glory */}
        <div className="transform scale-110 sm:scale-125 transition-transform">
          <WidgetRenderer
            widget={widget}
            interactive={true}
            onUpdateWidget={onUpdateWidget}
          />
        </div>
      </div>

      {/* Bottom Live Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs gap-3 border-t border-white/10 pt-4 z-20">
        <div className="flex items-center gap-4 opacity-75">
          <span>Battery: {widget.battery.phoneLevel}% ⚡</span>
          <span>Next: {widget.calendar.nextEventTitle} ({widget.calendar.nextEventTime})</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] opacity-60">Tilt or place phone horizontally on stand</span>
        </div>
      </div>
    </div>
  );
};
