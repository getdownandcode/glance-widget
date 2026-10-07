import React from 'react';
import { 
  Smartphone, 
  Palette, 
  FolderHeart, 
  Zap, 
  Download,
  Share2
} from 'lucide-react';

export type MobileTab = 'phone' | 'designer' | 'vault' | 'standby' | 'export';

interface MobileAppNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  onOpenInstall: () => void;
  isInstallable: boolean;
  isIOS: boolean;
  isInstalled: boolean;
}

export const MobileAppNav: React.FC<MobileAppNavProps> = ({
  activeTab,
  onTabChange,
  onOpenInstall,
  isInstallable,
  isIOS,
  isInstalled,
}) => {
  return (
    <>
      {/* Mobile Install Top Banner (if not installed yet) */}
      {!isInstalled && (
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 px-4 py-2 text-white flex items-center justify-between text-xs z-30 shadow-md">
          <div className="flex items-center gap-2 truncate">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="font-semibold truncate">Get GlanceCraft App on your Phone</span>
          </div>
          <button
            onClick={onOpenInstall}
            className="px-3 py-1 rounded-lg bg-white text-slate-900 font-bold text-[11px] shadow-sm hover:bg-slate-100 shrink-0 ml-2"
          >
            {isInstallable ? 'Install' : isIOS ? 'Add to Home' : 'Install App'}
          </button>
        </div>
      )}

      {/* Native Smartphone Bottom Navigation Bar */}
      <nav className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-2 py-2 flex items-center justify-around z-40 sticky bottom-0 text-[10px] font-medium text-slate-400">
        <button
          onClick={() => onTabChange('phone')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'phone' ? 'text-sky-400 font-bold scale-105' : 'hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span>My Phone</span>
        </button>

        <button
          onClick={() => onTabChange('designer')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'designer' ? 'text-sky-400 font-bold scale-105' : 'hover:text-slate-200'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span>Designer</span>
        </button>

        <button
          onClick={() => onTabChange('vault')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'vault' ? 'text-sky-400 font-bold scale-105' : 'hover:text-slate-200'
          }`}
        >
          <FolderHeart className="w-5 h-5" />
          <span>My Vault</span>
        </button>

        <button
          onClick={() => onTabChange('standby')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'standby' ? 'text-emerald-400 font-bold scale-105' : 'hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>StandBy</span>
        </button>

        <button
          onClick={() => onTabChange('export')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'export' ? 'text-sky-400 font-bold scale-105' : 'hover:text-slate-200'
          }`}
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </nav>
    </>
  );
};
