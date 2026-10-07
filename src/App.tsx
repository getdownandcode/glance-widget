import React, { useState } from 'react';
import { 
  WidgetConfig, 
  PhoneDevice, 
  WallpaperOption 
} from './types/widget';
import { 
  DEFAULT_WIDGET_CONFIG, 
  WALLPAPER_PRESETS 
} from './data/presets';
import { usePWAInstall } from './hooks/usePWAInstall';
import { TopNav } from './components/TopNav';
import { PhoneMockup } from './components/PhoneMockup';
import { WidgetRenderer } from './components/WidgetRenderer';
import { WidgetEditor } from './components/WidgetEditor';
import { WallpaperDeviceBar } from './components/WallpaperDeviceBar';
import { ExportModal } from './components/ExportModal';
import { AiWidgetGenerator } from './components/AiWidgetGenerator';
import { WallpaperModal } from './components/WallpaperModal';
import { StandByScreen } from './components/StandByScreen';
import { WidgetVault } from './components/WidgetVault';
import { MobileAppNav, MobileTab } from './components/MobileAppNav';
import { InstallAppModal } from './components/InstallAppModal';
import { 
  Smartphone, 
  Download, 
  Zap, 
  Sparkles, 
  Layers, 
  Settings,
  Share2
} from 'lucide-react';

export default function App() {
  const [widget, setWidget] = useState<WidgetConfig>(DEFAULT_WIDGET_CONFIG);
  const [device, setDevice] = useState<PhoneDevice>('iphone16pro');
  const [wallpaper, setWallpaper] = useState<WallpaperOption>(WALLPAPER_PRESETS[0]);
  const [widgetSlot, setWidgetSlot] = useState<'top' | 'middle' | 'bottom'>('top');
  const [showAppIcons, setShowAppIcons] = useState<boolean>(true);

  // Mobile App active tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('phone');

  // Modals & Fullscreen states
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isStandByOpen, setIsStandByOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // PWA Hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const handleTabChange = (tab: MobileTab) => {
    if (tab === 'standby') {
      setIsStandByOpen(true);
      return;
    }
    if (tab === 'export') {
      setIsExportOpen(true);
      return;
    }
    setMobileTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Bar */}
      <TopNav
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        activeView={mobileTab === 'phone' ? 'preview' : mobileTab === 'designer' ? 'editor' : 'wallpapers'}
        onViewChange={(v) => {
          if (v === 'editor') setMobileTab('designer');
          else if (v === 'preview') setMobileTab('phone');
          else if (v === 'wallpapers') setIsWallpaperModalOpen(true);
        }}
      />

      {/* Main App Content Viewport based on active tab */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* TAB 1: PHONE HOME SCREEN PREVIEW */}
        {mobileTab === 'phone' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Phone Screen Area */}
            <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 relative">
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Sub-header Controls */}
              <div className="w-full max-w-xl flex items-center justify-between mb-4 z-10 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{widget.name}</span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="capitalize">{widget.type.replace('_', ' ')}</span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span className="uppercase text-[11px] font-mono font-medium text-sky-400">{widget.size}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsStandByOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>StandBy Mode</span>
                  </button>

                  <button
                    onClick={() => setMobileTab('designer')}
                    className="hidden lg:flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    Edit Style
                  </button>
                </div>
              </div>

              {/* Phone Mockup Canvas */}
              <div className="my-auto py-2 z-10 flex flex-col items-center">
                <PhoneMockup
                  widget={widget}
                  device={device}
                  wallpaper={wallpaper}
                  widgetSlot={widgetSlot}
                  showAppIcons={showAppIcons}
                  onWidgetSlotChange={setWidgetSlot}
                  onUpdateWidget={(updater) => setWidget(updater(widget))}
                />
              </div>
            </div>

            {/* Desktop side editor */}
            <aside className="hidden lg:flex w-[420px] xl:w-[460px] border-l border-slate-800 flex-col z-20 shrink-0">
              <WidgetEditor
                widget={widget}
                onChange={setWidget}
                onOpenAiModal={() => setIsAiOpen(true)}
              />
            </aside>
          </div>
        )}

        {/* TAB 2: MOBILE DESIGNER */}
        {mobileTab === 'designer' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-900">
            {/* Live Widget Float Sticky at top for mobile reference */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col items-center justify-center shrink-0">
              <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Live Widget Output
              </div>
              <div className="transform scale-95 transition-transform">
                <WidgetRenderer widget={widget} interactive={true} />
              </div>
            </div>

            {/* Full Editor panel */}
            <div className="flex-1 overflow-y-auto">
              <WidgetEditor
                widget={widget}
                onChange={setWidget}
                onOpenAiModal={() => setIsAiOpen(true)}
              />
            </div>
          </div>
        )}

        {/* TAB 3: WIDGET VAULT */}
        {mobileTab === 'vault' && (
          <div className="flex-1 overflow-y-auto">
            <WidgetVault
              currentWidget={widget}
              onSelectWidget={(selected) => {
                setWidget(selected);
                setMobileTab('phone');
              }}
              onEditWidget={(selected) => {
                setWidget(selected);
                setMobileTab('designer');
              }}
            />
          </div>
        )}

        {/* Hidden reference render for high-resolution PNG canvas capture */}
        <div className="fixed -left-[9999px] -top-[9999px]">
          <WidgetRenderer
            id="live-studio-widget"
            widget={widget}
            customScale={1}
            interactive={false}
          />
        </div>
      </main>

      {/* Bottom Device & Wallpaper Control Bar (When in Phone Tab) */}
      {mobileTab === 'phone' && (
        <WallpaperDeviceBar
          currentDevice={device}
          onDeviceChange={setDevice}
          currentWallpaper={wallpaper}
          onWallpaperChange={setWallpaper}
          showAppIcons={showAppIcons}
          onToggleAppIcons={() => setShowAppIcons(!showAppIcons)}
        />
      )}

      {/* Native Smartphone Bottom Navigation Bar */}
      <MobileAppNav
        activeTab={mobileTab}
        onTabChange={handleTabChange}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        isInstallable={isInstallable}
        isIOS={isIOS}
        isInstalled={isInstalled}
      />

      {/* Fullscreen StandBy Live Widget Screen */}
      {isStandByOpen && (
        <StandByScreen
          widget={widget}
          onClose={() => setIsStandByOpen(false)}
          onUpdateWidget={(updater) => setWidget(updater(widget))}
        />
      )}

      {/* Modals */}
      <ExportModal
        widget={widget}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <AiWidgetGenerator
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onApplyWidget={setWidget}
        currentWidget={widget}
      />

      <WallpaperModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
        currentWallpaper={wallpaper}
        onSelectWallpaper={setWallpaper}
      />
    </div>
  );
}
