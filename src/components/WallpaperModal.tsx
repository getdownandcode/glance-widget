import React from 'react';
import { WallpaperOption } from '../types/widget';
import { WALLPAPER_PRESETS } from '../data/presets';
import { X, Check, Image as ImageIcon } from 'lucide-react';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: WallpaperOption;
  onSelectWallpaper: (wp: WallpaperOption) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Curated Home Screen Wallpapers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
          {WALLPAPER_PRESETS.map((wp) => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWallpaper(wp);
                onClose();
              }}
              className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all p-1 flex flex-col ${
                currentWallpaper.id === wp.id
                  ? 'border-sky-500 shadow-lg shadow-sky-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div 
                style={{ background: wp.style }}
                className="w-full h-44 rounded-xl flex items-center justify-center relative shadow-inner"
              >
                {currentWallpaper.id === wp.id && (
                  <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{wp.name}</span>
                {currentWallpaper.id === wp.id && (
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Active</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
