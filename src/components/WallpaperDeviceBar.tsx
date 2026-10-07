import React, { useRef } from 'react';
import { PhoneDevice, WallpaperOption } from '../types/widget';
import { WALLPAPER_PRESETS } from '../data/presets';
import { 
  Smartphone, 
  Upload, 
  Eye, 
  EyeOff, 
  Layers, 
  Check 
} from 'lucide-react';

interface WallpaperDeviceBarProps {
  currentDevice: PhoneDevice;
  onDeviceChange: (device: PhoneDevice) => void;
  currentWallpaper: WallpaperOption;
  onWallpaperChange: (wallpaper: WallpaperOption) => void;
  showAppIcons: boolean;
  onToggleAppIcons: () => void;
}

export const WallpaperDeviceBar: React.FC<WallpaperDeviceBarProps> = ({
  currentDevice,
  onDeviceChange,
  currentWallpaper,
  onWallpaperChange,
  showAppIcons,
  onToggleAppIcons,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const devices: Array<{ id: PhoneDevice; label: string; tag: string }> = [
    { id: 'iphone16pro', label: 'iPhone 16 Pro', tag: 'Dynamic Island' },
    { id: 'pixel9', label: 'Google Pixel 9', tag: 'Material You' },
    { id: 'samsung_s24', label: 'Galaxy S24', tag: 'OneUI Bezel' },
    { id: 'minimal', label: 'Clean Mockup', tag: 'Borderless' },
  ];

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onWallpaperChange({
          id: `custom-${Date.now()}`,
          name: file.name.slice(0, 14),
          style: `url("${url}")`,
          isCustom: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
      {/* Device Chassis Switcher */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          Device:
        </span>
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => onDeviceChange(d.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap ${
                currentDevice === d.id
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wallpaper Carousel */}
      <div className="flex items-center gap-3">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Wallpaper:
        </span>
        <div className="flex items-center gap-2">
          {WALLPAPER_PRESETS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => onWallpaperChange(wp)}
              title={wp.name}
              style={{ background: wp.style }}
              className={`w-7 h-7 rounded-lg border-2 transition-transform transform hover:scale-105 relative ${
                currentWallpaper.id === wp.id ? 'border-sky-400 scale-105 shadow-md shadow-sky-500/20' : 'border-slate-700'
              }`}
            >
              {currentWallpaper.id === wp.id && (
                <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          ))}

          {/* Upload Custom Wallpaper */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomWallpaperUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
            title="Upload custom wallpaper image"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>
      </div>

      {/* App Icons Visibility Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAppIcons}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
            showAppIcons
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
          title="Toggle home screen app icons"
        >
          {showAppIcons ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
          <span>{showAppIcons ? 'Home Grid' : 'Solo Widget'}</span>
        </button>
      </div>
    </div>
  );
};
