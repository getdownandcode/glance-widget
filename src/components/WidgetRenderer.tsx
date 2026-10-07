import React, { useState, useEffect } from 'react';
import { 
  WidgetConfig, 
  WidgetSize, 
  WidgetType 
} from '../types/widget';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Wind, 
  Moon, 
  Battery, 
  BatteryCharging, 
  Zap, 
  Play, 
  Pause, 
  SkipForward, 
  Calendar, 
  Clock, 
  Activity, 
  Flame, 
  Footprints, 
  Camera, 
  FileText, 
  Music2, 
  CreditCard,
  MapPin,
  Watch,
  Headphones
} from 'lucide-react';

interface WidgetRendererProps {
  widget: WidgetConfig;
  customScale?: number;
  interactive?: boolean;
  onUpdateWidget?: (updater: (prev: WidgetConfig) => WidgetConfig) => void;
  id?: string;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  customScale = 1,
  interactive = true,
  onUpdateWidget,
  id,
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState<boolean>(widget.music.isPlaying);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(widget.weather.unit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { theme, size, type } = widget;

  // Format hours and minutes
  const hours = widget.clock.timeFormat === '12h' 
    ? (time.getHours() % 12 || 12).toString() 
    : time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  // Compute container dimensions based on size
  const getDimensions = (s: WidgetSize) => {
    switch (s) {
      case 'small':
        return { width: 164, height: 164, p: 'p-3.5' };
      case 'medium':
        return { width: 346, height: 164, p: 'p-4' };
      case 'large':
        return { width: 346, height: 346, p: 'p-5' };
      case 'lock_rect':
        return { width: 164, height: 68, p: 'p-2.5' };
      case 'lock_circle':
        return { width: 72, height: 72, p: 'p-2' };
      default:
        return { width: 346, height: 164, p: 'p-4' };
    }
  };

  const dims = getDimensions(size);

  // Background style
  const getContainerStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: `${dims.width}px`,
      height: `${dims.height}px`,
      borderRadius: `${theme.borderRadius}px`,
      color: theme.textColor,
      fontFamily: theme.fontFamily === 'mono' 
        ? 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, monospace' 
        : theme.fontFamily === 'serif' 
        ? 'ui-serif, Georgia, Cambria, serif' 
        : theme.fontFamily === 'rounded' 
        ? 'system-ui, -apple-system, sans-serif'
        : 'var(--font-sans, system-ui, -apple-system, sans-serif)',
    };

    if (theme.bgType === 'glass') {
      return {
        ...baseStyle,
        backgroundColor: theme.bgColor,
        backdropFilter: `blur(${theme.glassBlur}px)`,
        WebkitBackdropFilter: `blur(${theme.glassBlur}px)`,
        border: theme.glassBorder ? '1px solid rgba(255, 255, 255, 0.22)' : 'none',
        boxShadow: theme.shadow === 'glow' 
          ? `0 0 24px ${theme.accentColor}44` 
          : '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
      };
    }

    if (theme.bgType === 'gradient') {
      return {
        ...baseStyle,
        background: `linear-gradient(${theme.gradientAngle}deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        border: theme.glassBorder ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
        boxShadow: theme.shadow === 'glow' ? `0 0 20px ${theme.accentColor}40` : '0 4px 18px rgba(0, 0, 0, 0.18)',
      };
    }

    if (theme.bgType === 'solid') {
      return {
        ...baseStyle,
        backgroundColor: theme.bgColor,
        border: theme.glassBorder ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
        boxShadow: theme.shadow === 'glow' ? `0 0 20px ${theme.accentColor}33` : '0 4px 16px rgba(0, 0, 0, 0.16)',
      };
    }

    // Default mesh / glass
    return {
      ...baseStyle,
      backgroundColor: theme.bgColor,
      border: '1px solid rgba(255, 255, 255, 0.15)',
    };
  };

  const getWeatherIcon = (cond: string, sizeClass = 'w-5 h-5') => {
    switch (cond) {
      case 'Sunny':
        return <Sun className={`${sizeClass} text-amber-400`} />;
      case 'Rainy':
        return <CloudRain className={`${sizeClass} text-sky-400`} />;
      case 'Thunderstorm':
        return <CloudLightning className={`${sizeClass} text-yellow-300`} />;
      case 'Snowy':
        return <Snowflake className={`${sizeClass} text-cyan-300`} />;
      case 'Windy':
        return <Wind className={`${sizeClass} text-slate-300`} />;
      case 'Night Clear':
        return <Moon className={`${sizeClass} text-indigo-300`} />;
      default:
        return <Cloud className={`${sizeClass} text-sky-200`} />;
    }
  };

  // Weather temperature converted
  const displayTemp = tempUnit === 'F' ? widget.weather.temperature : Math.round(((widget.weather.temperature - 32) * 5) / 9);
  const displayHigh = tempUnit === 'F' ? widget.weather.high : Math.round(((widget.weather.high - 32) * 5) / 9);
  const displayLow = tempUnit === 'F' ? widget.weather.low : Math.round(((widget.weather.low - 32) * 5) / 9);

  return (
    <div
      id={id}
      style={{
        transform: `scale(${customScale})`,
        transformOrigin: 'center center',
      }}
      className="relative select-none transition-all duration-200 group"
    >
      <div 
        style={getContainerStyle()} 
        className={`relative overflow-hidden flex flex-col justify-between ${dims.p}`}
      >
        {/* Render specific widget type */}
        {type === 'clock_dual' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium tracking-wider uppercase opacity-80" style={{ color: theme.subtextColor }}>
                {widget.clock.primaryCity}
              </span>
              <span className="text-[11px] font-semibold" style={{ color: theme.accentColor }}>
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {widget.clock.style === 'analog' ? (
              <div className="flex items-center justify-center my-auto">
                <div className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center shadow-inner" style={{ borderColor: theme.accentColor + '80' }}>
                  {/* Hour hand */}
                  <div 
                    className="absolute w-1 rounded-full origin-bottom"
                    style={{
                      height: '24px',
                      backgroundColor: theme.textColor,
                      transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)`,
                      bottom: '50%',
                    }}
                  />
                  {/* Minute hand */}
                  <div 
                    className="absolute w-0.5 rounded-full origin-bottom"
                    style={{
                      height: '34px',
                      backgroundColor: theme.textColor,
                      transform: `rotate(${time.getMinutes() * 6}deg)`,
                      bottom: '50%',
                    }}
                  />
                  {/* Second hand */}
                  <div 
                    className="absolute w-0.5 rounded-full origin-bottom"
                    style={{
                      height: '38px',
                      backgroundColor: theme.accentColor,
                      transform: `rotate(${time.getSeconds() * 6}deg)`,
                      bottom: '50%',
                    }}
                  />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                </div>
              </div>
            ) : (
              <div className="my-auto">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight tabular-nums leading-none">
                    {hours}:{minutes}
                  </span>
                  {widget.clock.showSeconds && (
                    <span className="text-sm font-semibold opacity-70 tabular-nums">
                      :{seconds}
                    </span>
                  )}
                  {widget.clock.timeFormat === '12h' && (
                    <span className="text-xs font-bold uppercase ml-1 opacity-80 tracking-widest">
                      {ampm}
                    </span>
                  )}
                </div>
              </div>
            )}

            {size !== 'small' && size !== 'lock_rect' && size !== 'lock_circle' && (
              <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'rgba(255,255,255,0.12)', color: theme.subtextColor }}>
                <span>{widget.clock.secondaryCity}</span>
                <span className="font-mono tabular-nums font-medium">
                  {((time.getUTCHours() + widget.clock.secondaryOffset + 24) % 24).toString().padStart(2, '0')}:{minutes}
                  <span className="text-[10px] ml-1 opacity-75">
                    ({widget.clock.secondaryOffset >= 0 ? `+${widget.clock.secondaryOffset}` : widget.clock.secondaryOffset}h)
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {type === 'weather_forecast' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wide flex items-center gap-1.5" style={{ color: theme.subtextColor }}>
                  <MapPin className="w-3 h-3" />
                  {widget.weather.city}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span 
                    onClick={() => interactive && setTempUnit(u => u === 'C' ? 'F' : 'C')}
                    className="text-3xl font-extrabold tracking-tight tabular-nums cursor-pointer hover:opacity-80"
                    title="Click to toggle °C / °F"
                  >
                    {displayTemp}°
                  </span>
                  <span className="text-xs font-medium uppercase opacity-75">{tempUnit}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {getWeatherIcon(widget.weather.condition, 'w-7 h-7')}
                <span className="text-[11px] font-medium mt-1" style={{ color: theme.subtextColor }}>
                  {widget.weather.condition}
                </span>
              </div>
            </div>

            {size === 'small' ? (
              <div className="flex items-center justify-between text-[11px] pt-1" style={{ color: theme.subtextColor }}>
                <span>H: {displayHigh}°</span>
                <span>L: {displayLow}°</span>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t grid grid-cols-4 gap-1 text-center" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
                {widget.weather.forecast.map((fc, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[10px] opacity-75">{fc.time}</span>
                    <div className="my-0.5">{getWeatherIcon(fc.icon === 'sunny' ? 'Sunny' : 'Partly Cloudy', 'w-4 h-4')}</div>
                    <span className="text-[11px] font-semibold tabular-nums">
                      {tempUnit === 'F' ? fc.temp : Math.round(((fc.temp - 32) * 5) / 9)}°
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {type === 'calendar_events' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color: theme.accentColor }}>
                {widget.calendar.monthName} {widget.calendar.year}
              </span>
              <Calendar className="w-4 h-4 opacity-75" />
            </div>

            <div className="flex items-center gap-3 my-1">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10 shrink-0">
                <span className="text-[9px] uppercase font-bold tracking-wider" style={{ color: theme.accentColor }}>
                  {widget.calendar.currentDayName.slice(0, 3)}
                </span>
                <span className="text-xl font-extrabold tabular-nums leading-none">
                  {widget.calendar.currentDayNumber}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate leading-snug">
                  {widget.calendar.nextEventTitle}
                </p>
                <p className="text-[11px] font-medium mt-0.5 truncate tabular-nums" style={{ color: theme.subtextColor }}>
                  {widget.calendar.nextEventTime}
                </p>
              </div>
            </div>

            {size !== 'small' && (
              <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'rgba(255,255,255,0.12)', color: theme.subtextColor }}>
                <span className="truncate max-w-[200px]">Later: {widget.calendar.secondEventTitle}</span>
                <span className="font-mono text-[11px] tabular-nums shrink-0">{widget.calendar.secondEventTime}</span>
              </div>
            )}
          </div>
        )}

        {type === 'battery_system' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide" style={{ color: theme.subtextColor }}>
                Power & Hardware
              </span>
              <Zap className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
            </div>

            <div className="grid grid-cols-3 gap-2 my-auto">
              {/* Phone */}
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/10">
                <div className="relative">
                  <Battery className="w-5 h-5 text-emerald-400" />
                  {widget.battery.isPhoneCharging && (
                    <Zap className="w-2.5 h-2.5 absolute -top-1 -right-1 text-yellow-300 fill-yellow-300" />
                  )}
                </div>
                <span className="text-sm font-bold tabular-nums mt-1">{widget.battery.phoneLevel}%</span>
                <span className="text-[9px] opacity-75">Phone</span>
              </div>

              {/* Watch */}
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/10">
                <Watch className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-bold tabular-nums mt-1">{widget.battery.watchLevel}%</span>
                <span className="text-[9px] opacity-75">Watch</span>
              </div>

              {/* Buds */}
              <div className="flex flex-col items-center p-2 rounded-xl bg-white/5 border border-white/10">
                <Headphones className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold tabular-nums mt-1">{widget.battery.budsLevel}%</span>
                <span className="text-[9px] opacity-75">AirPods</span>
              </div>
            </div>

            {size !== 'small' && (
              <div className="flex items-center justify-between text-[11px] pt-1" style={{ color: theme.subtextColor }}>
                <span>Storage: {widget.battery.storageUsedPct}% used</span>
                <span className="text-emerald-400 font-medium">Wi-Fi Connected</span>
              </div>
            )}
          </div>
        )}

        {type === 'fitness_rings' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide" style={{ color: theme.subtextColor }}>
                Daily Activity
              </span>
              <Activity className="w-4 h-4 text-rose-500" />
            </div>

            <div className="flex items-center justify-around my-auto">
              {/* Concentric rings simulation */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Move Ring */}
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(244,63,94,0.2)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset={264 - (264 * Math.min(widget.fitness.moveCalories / widget.fitness.moveGoal, 1))} 
                  />

                  {/* Exercise Ring */}
                  <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="32" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="201"
                    strokeDashoffset={201 - (201 * Math.min(widget.fitness.exerciseMinutes / widget.fitness.exerciseGoal, 1))} 
                  />

                  {/* Stand Ring */}
                  <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="22" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="138"
                    strokeDashoffset={138 - (138 * Math.min(widget.fitness.standHours / widget.fitness.standGoal, 1))} 
                  />
                </svg>
                <Flame className="w-4 h-4 absolute text-rose-400" />
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-bold tabular-nums">{widget.fitness.moveCalories}</span>
                  <span className="opacity-60 text-[10px]">/{widget.fitness.moveGoal} CAL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold tabular-nums">{widget.fitness.exerciseMinutes}</span>
                  <span className="opacity-60 text-[10px]">/{widget.fitness.exerciseGoal} MIN</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="font-bold tabular-nums">{widget.fitness.standHours}</span>
                  <span className="opacity-60 text-[10px]">/{widget.fitness.standGoal} HRS</span>
                </div>
              </div>
            </div>

            {size !== 'small' && (
              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10" style={{ color: theme.subtextColor }}>
                <span className="flex items-center gap-1">
                  <Footprints className="w-3 h-3 text-sky-400" />
                  {widget.fitness.stepsCount.toLocaleString()} steps
                </span>
                <span className="tabular-nums font-mono">{widget.fitness.distanceKm} km</span>
              </div>
            )}
          </div>
        )}

        {type === 'music_player' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider uppercase opacity-80" style={{ color: theme.subtextColor }}>
                Now Playing
              </span>
              <Music2 className="w-4 h-4" style={{ color: theme.accentColor }} />
            </div>

            <div className="flex items-center gap-3 my-auto">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center shrink-0 shadow-md">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold truncate leading-tight">
                  {widget.music.songTitle}
                </h4>
                <p className="text-[11px] truncate mt-0.5" style={{ color: theme.subtextColor }}>
                  {widget.music.artistName}
                </p>
                {/* Waveform indicator */}
                <div className="flex items-center gap-0.5 mt-1.5 h-3">
                  {[40, 80, 55, 100, 65, 30, 90, 45, 70, 85].map((h, idx) => (
                    <span 
                      key={idx} 
                      className={`w-0.5 rounded-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                      style={{ 
                        height: isPlaying ? `${h}%` : '20%', 
                        backgroundColor: theme.accentColor 
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              {/* Scrub line */}
              <div className="flex-1 mr-3 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${widget.music.progressPercent}%`, backgroundColor: theme.accentColor }} 
                />
              </div>
              <button 
                onClick={() => interactive && setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="Play / Pause"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
            </div>
          </div>
        )}

        {type === 'quote_inspiration' && (
          <div className="h-full flex flex-col justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-75" style={{ color: theme.accentColor }}>
              {widget.quote.category}
            </span>
            <blockquote className="my-auto text-xs font-medium leading-relaxed italic line-clamp-3">
              "{widget.quote.quote}"
            </blockquote>
            <p className="text-[11px] font-semibold text-right" style={{ color: theme.subtextColor }}>
              — {widget.quote.author}
            </p>
          </div>
        )}

        {type === 'photo_frame' && (
          <div className="h-full flex flex-col justify-between relative -m-1">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-900 group">
              <img 
                src={widget.photo.imageUrl} 
                alt={widget.photo.caption} 
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${
                  widget.photo.filter === 'warm' ? 'sepia-[0.25] contrast-105' :
                  widget.photo.filter === 'noir' ? 'grayscale contrast-125' :
                  widget.photo.filter === 'film' ? 'saturate-150 contrast-110' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                <span className="text-xs font-semibold drop-shadow truncate">{widget.photo.caption}</span>
                <span className="text-[10px] opacity-75 font-mono">{widget.photo.dateLabel}</span>
              </div>
            </div>
          </div>
        )}

        {type === 'quick_launcher' && (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold tracking-wide" style={{ color: theme.subtextColor }}>
                Speed Dial
              </span>
              <span className="text-[10px] opacity-75">4 Tools</span>
            </div>
            <div className="grid grid-cols-2 gap-2 my-auto">
              {widget.quickLauncher.items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/10"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.color }}>
                    {item.icon === 'camera' && <Camera className="w-3.5 h-3.5 text-white" />}
                    {item.icon === 'file-text' && <FileText className="w-3.5 h-3.5 text-white" />}
                    {item.icon === 'music' && <Music2 className="w-3.5 h-3.5 text-white" />}
                    {item.icon === 'credit-card' && <CreditCard className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs font-semibold truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'hybrid_dash' && (
          <div className="h-full flex flex-col justify-between">
            {/* Top row: Clock + Weather */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight tabular-nums leading-none">
                    {hours}:{minutes}
                  </span>
                  <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">{ampm}</span>
                </div>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: theme.subtextColor }}>
                  {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="text-sm font-bold tabular-nums">
                    {displayTemp}°{tempUnit}
                  </div>
                  <div className="text-[10px] opacity-75" style={{ color: theme.subtextColor }}>
                    {widget.weather.city}
                  </div>
                </div>
                {getWeatherIcon(widget.weather.condition, 'w-6 h-6')}
              </div>
            </div>

            {/* Bottom row: Next Event & Battery bar */}
            <div className="pt-2 border-t flex items-center justify-between text-xs" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
              <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: theme.accentColor }} />
                <span className="truncate text-[11px] font-medium">{widget.calendar.nextEventTitle}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] tabular-nums" style={{ color: theme.subtextColor }}>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                <span>{widget.battery.phoneLevel}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Lock screen complications */}
        {size === 'lock_rect' && (
          <div className="absolute inset-0 p-2.5 flex items-center justify-between bg-black/60 rounded-xl text-white">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              <div>
                <p className="text-[11px] font-semibold truncate leading-none">{widget.calendar.nextEventTitle}</p>
                <p className="text-[9px] opacity-75 mt-0.5 tabular-nums">{widget.calendar.nextEventTime}</p>
              </div>
            </div>
            <span className="text-xs font-bold tabular-nums">{displayTemp}°</span>
          </div>
        )}

        {size === 'lock_circle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full text-white text-center p-1">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold tabular-nums mt-0.5">{widget.battery.phoneLevel}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
