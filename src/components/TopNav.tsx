import React from 'react';
import { Sparkles, Download, Smartphone } from 'lucide-react';

interface TopNavProps {
  onOpenExport: () => void;
  onOpenAi: () => void;
  activeView: 'editor' | 'preview' | 'wallpapers';
  onViewChange: (view: 'editor' | 'preview' | 'wallpapers') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenExport,
  onOpenAi,
  activeView,
  onViewChange,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand title wordmark */}
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); onViewChange('editor'); }}
        className="text-base font-extrabold tracking-tight text-white flex items-center gap-2"
      >
        <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
          G
        </span>
        GlanceCraft
      </a>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onViewChange('editor')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'editor' ? 'text-white font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Studio Canvas
        </button>
        <button
          onClick={() => onViewChange('preview')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'preview' ? 'text-white font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Device Preview
        </button>
        <button
          onClick={() => onViewChange('wallpapers')}
          className={`transition-colors whitespace-nowrap ${
            activeView === 'wallpapers' ? 'text-white font-semibold' : 'hover:text-slate-200'
          }`}
        >
          Wallpapers
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenAi}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Creator
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400 active:scale-98 rounded-lg shadow-sm shadow-sky-500/20 transition-all whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          Export Widget
        </button>
      </div>
    </header>
  );
};
