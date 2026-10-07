import React, { useState } from 'react';
import { 
  WidgetConfig, 
  PhoneDevice, 
  WallpaperOption 
} from '../types/widget';
import { WidgetRenderer } from './WidgetRenderer';
import { MOCK_APP_ICONS } from '../data/presets';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Search, 
  Camera, 
  MessageCircle, 
  Compass, 
  Headphones, 
  Image as ImageIcon,
  Heart,
  Settings,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';

interface PhoneMockupProps {
  widget: WidgetConfig;
  device: PhoneDevice;
  wallpaper: WallpaperOption;
  widgetSlot: 'top' | 'middle' | 'bottom';
  showAppIcons: boolean;
  onWidgetSlotChange: (slot: 'top' | 'middle' | 'bottom') => void;
  onUpdateWidget?: (updater: (prev: WidgetConfig) => WidgetConfig) => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  widget,
  device,
  wallpaper,
  widgetSlot,
  showAppIcons,
  onWidgetSlotChange,
  onUpdateWidget,
}) => {
  const [currentDate] = useState(() => new Date());

  const hours = currentDate.getHours() % 12 || 12;
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');

  // Choose app icon component
  const renderAppIcon = (iconName: string) => {
    switch (iconName) {
      case 'image': return <ImageIcon className="w-5 h-5 text-white" />;
      case 'message-circle': return <MessageCircle className="w-5 h-5 text-white" />;
      case 'mail': return <Mail className="w-5 h-5 text-white" />;
      case 'compass': return <Compass className="w-5 h-5 text-white" />;
      case 'headphones': return <Headphones className="w-5 h-5 text-white" />;
      case 'map-pin': return <MapPin className="w-5 h-5 text-white" />;
      case 'heart': return <Heart className="w-5 h-5 text-white" />;
      default: return <Settings className="w-5 h-5 text-white" />;
    }
  };

  const isLockScreen = widget.size === 'lock_rect' || widget.size === 'lock_circle';

  return (
    <div className="flex flex-col items-center select-none">
      {/* Phone outer chassis */}
      <div 
        className={`relative transition-all duration-300 shadow-2xl overflow-hidden ${
          device === 'iphone16pro' 
            ? 'w-[375px] h-[750px] rounded-[52px] border-[10px] border-[#292524] bg-black ring-1 ring-white/10' 
            : device === 'pixel9'
            ? 'w-[370px] h-[750px] rounded-[44px] border-[9px] border-[#3f3f46] bg-black ring-1 ring-white/10'
            : device === 'samsung_s24'
            ? 'w-[370px] h-[750px] rounded-[38px] border-[7px] border-[#18181b] bg-black ring-1 ring-white/10'
            : 'w-[365px] h-[730px] rounded-[36px] border border-white/20 bg-neutral-900'
        }`}
      >
        {/* Phone screen background wallpaper */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: wallpaper.style,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Ambient wallpaper tint for contrast */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* Hardware Elements: iPhone Dynamic Island / Pixel Punch-Hole */}
        {device === 'iphone16pro' && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40">
            <div className="w-[108px] h-[28px] bg-black rounded-full flex items-center justify-between px-3 text-white shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-medium">Glance</span>
              </div>
            </div>
          </div>
        )}

        {device === 'pixel9' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40">
            <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-neutral-800" />
          </div>
        )}

        {device === 'samsung_s24' && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40">
            <div className="w-3 h-3 rounded-full bg-black ring-1 ring-neutral-800" />
          </div>
        )}

        {/* Status Bar */}
        <div className="relative z-30 px-7 pt-3.5 pb-2 flex items-center justify-between text-white text-xs font-semibold tracking-tight">
          <span className="tabular-nums drop-shadow-sm font-medium">
            {hours}:{minutes}
          </span>
          <div className="flex items-center gap-1.5 opacity-90 drop-shadow-sm">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center">
              <span className="text-[10px] font-mono mr-1 tabular-nums">98%</span>
              <Battery className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        {/* Lock Screen Mode vs Home Screen Mode */}
        {isLockScreen ? (
          <div className="relative z-20 h-[640px] px-6 flex flex-col justify-between items-center text-white py-6">
            <div className="flex flex-col items-center mt-6">
              <span className="text-sm font-medium opacity-90">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-7xl font-extralight tracking-tight tabular-nums mt-1 drop-shadow-lg">
                {hours}:{minutes}
              </span>

              {/* Complication Widget placement below lock screen clock */}
              <div className="mt-4 flex items-center justify-center">
                <WidgetRenderer widget={widget} interactive onUpdateWidget={onUpdateWidget} />
              </div>
            </div>

            {/* Lock screen bottom shortcuts */}
            <div className="w-full flex items-center justify-between px-4 pb-4">
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ) : (
          /* Home Screen Layout */
          <div className="relative z-20 h-[650px] px-4 flex flex-col justify-between pb-3 pt-2">
            {/* Top / Middle / Bottom Slot Container */}
            <div className="flex-1 flex flex-col justify-start gap-4">
              {/* TOP SLOT */}
              <div className="flex justify-center min-h-[164px] items-center">
                {widgetSlot === 'top' ? (
                  <WidgetRenderer widget={widget} interactive onUpdateWidget={onUpdateWidget} />
                ) : showAppIcons ? (
                  <div className="grid grid-cols-4 gap-4 w-full px-2">
                    {MOCK_APP_ICONS.slice(0, 4).map((app, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 group">
                        <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center shadow-md shadow-black/30 transform transition-transform group-hover:scale-95`}>
                          {renderAppIcon(app.icon)}
                        </div>
                        <span className="text-[11px] text-white/90 font-medium drop-shadow-sm">{app.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button 
                    onClick={() => onWidgetSlotChange('top')}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/50 text-white/60 hover:text-white flex flex-col items-center justify-center text-xs transition-colors"
                  >
                    Click to place widget at Top
                  </button>
                )}
              </div>

              {/* MIDDLE SLOT */}
              <div className="flex justify-center min-h-[164px] items-center">
                {widgetSlot === 'middle' ? (
                  <WidgetRenderer widget={widget} interactive onUpdateWidget={onUpdateWidget} />
                ) : showAppIcons ? (
                  <div className="grid grid-cols-4 gap-4 w-full px-2">
                    {MOCK_APP_ICONS.slice(4, 8).map((app, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 group">
                        <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center shadow-md shadow-black/30 transform transition-transform group-hover:scale-95`}>
                          {renderAppIcon(app.icon)}
                        </div>
                        <span className="text-[11px] text-white/90 font-medium drop-shadow-sm">{app.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button 
                    onClick={() => onWidgetSlotChange('middle')}
                    className="w-full h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/50 text-white/60 hover:text-white flex flex-col items-center justify-center text-xs transition-colors"
                  >
                    Click to place widget in Middle
                  </button>
                )}
              </div>

              {/* BOTTOM SLOT (if user placed it bottom) */}
              {widgetSlot === 'bottom' && (
                <div className="flex justify-center min-h-[164px] items-center">
                  <WidgetRenderer widget={widget} interactive onUpdateWidget={onUpdateWidget} />
                </div>
              )}
            </div>

            {/* Bottom Dock and Home Bar */}
            <div className="pt-2">
              <div className="h-20 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/25 flex items-center justify-around px-2 shadow-lg shadow-black/20">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center shadow-md">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-md">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-zinc-700 flex items-center justify-center shadow-md">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Home Indicator Bar */}
              <div className="w-32 h-1 bg-white/80 rounded-full mx-auto mt-2" />
            </div>
          </div>
        )}
      </div>

      {/* Quick position switcher below phone */}
      <div className="mt-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
        <span className="px-2 text-slate-400 font-medium">Position:</span>
        {(['top', 'middle', 'bottom'] as const).map((slot) => (
          <button
            key={slot}
            onClick={() => onWidgetSlotChange(slot)}
            className={`px-3 py-1 rounded-lg font-medium transition-all capitalize ${
              widgetSlot === slot
                ? 'bg-sky-500 text-white shadow-sm'
                : 'hover:text-white hover:bg-slate-800'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};
