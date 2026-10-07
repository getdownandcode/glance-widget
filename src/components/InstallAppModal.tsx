import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X, Check, ArrowRight } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header with App Icon */}
        <div className="p-6 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800 text-center relative flex flex-col items-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-sky-500/20 mb-3 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-sky-400" />
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-white">Install GlanceCraft App</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Run as a standalone smartphone application with zero browser bars, instant launch, and full-screen StandBy widgets.
          </p>
        </div>

        {/* Content & Platform-Specific Instructions */}
        <div className="p-6 space-y-4 text-xs">
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-bold text-white text-sm">App Already Installed!</p>
              <p className="text-slate-300 text-xs">GlanceCraft is already installed on your device's home screen.</p>
            </div>
          ) : isInstallable ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-800/40 text-slate-300">
                <p className="font-semibold text-white mb-1">Android & Desktop Chrome:</p>
                <p className="text-slate-400">Tap the button below to add GlanceCraft directly to your smartphone app drawer and home screen.</p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-98 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {installSuccess ? 'App Installed!' : 'Install App to Device'}
              </button>
            </div>
          ) : isIOS ? (
            <div className="space-y-3">
              <p className="font-bold text-white text-sm">How to install on iPhone & iPad:</p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Step 1: Tap Share</span>
                    <span className="text-slate-400 text-[11px]">In Safari's bottom toolbar, tap the square Share button with an arrow pointing up.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Step 2: Add to Home Screen</span>
                    <span className="text-slate-400 text-[11px]">Scroll down in the action sheet and select <strong>"Add to Home Screen"</strong>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Step 3: Launch Native App</span>
                    <span className="text-slate-400 text-[11px]">Tap <strong>Add</strong> at top right. GlanceCraft will launch from your home screen just like an App Store app!</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Universal instructions for any mobile browser */
            <div className="space-y-3">
              <p className="font-bold text-white text-sm">Add to Smartphone Home Screen:</p>
              <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-700/60 space-y-2 text-slate-300">
                <p>1. Open your mobile browser's menu (three dots in Chrome or Share button in Safari).</p>
                <p>2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                <p>3. The GlanceCraft widget icon will appear right on your phone's home screen!</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
