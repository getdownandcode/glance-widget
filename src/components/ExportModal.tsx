import React, { useState } from 'react';
import { WidgetConfig } from '../types/widget';
import { 
  generateScriptableCode, 
  generateKwgtFormulas, 
  generateWidgetsmithJson, 
  generateHtmlSnippet 
} from '../utils/codeGenerators';
import { exportWidgetAsPng } from '../utils/canvasExport';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Smartphone, 
  Code2, 
  FileJson, 
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface ExportModalProps {
  widget: WidgetConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  widget,
  isOpen,
  onClose,
}) => {
  const [activeFormat, setActiveFormat] = useState<'png' | 'scriptable' | 'kwgt' | 'json' | 'html'>('png');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const getCodeContent = () => {
    switch (activeFormat) {
      case 'scriptable':
        return generateScriptableCode(widget);
      case 'kwgt':
        return generateKwgtFormulas(widget);
      case 'json':
        return generateWidgetsmithJson(widget);
      case 'html':
        return generateHtmlSnippet(widget);
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const text = getCodeContent();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      await exportWidgetAsPng('live-studio-widget', widget);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Export to Your Smartphone</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveFormat('png')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFormat === 'png' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Retina PNG
          </button>
          <button
            onClick={() => setActiveFormat('scriptable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFormat === 'scriptable' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            iOS Scriptable (JS)
          </button>
          <button
            onClick={() => setActiveFormat('kwgt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFormat === 'kwgt' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Android KWGT
          </button>
          <button
            onClick={() => setActiveFormat('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFormat === 'json' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            Widgetsmith JSON
          </button>
          <button
            onClick={() => setActiveFormat('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeFormat === 'html' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Web Embed
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeFormat === 'png' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Retina Graphic Image Download</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Downloads a 3x resolution PNG graphic rendered to your custom size ({widget.size}). Perfect for custom photo widgets, Widgy, or lock screen wallpapers on both iOS and Android.
                </p>

                <button
                  onClick={handleDownloadPng}
                  disabled={isExporting}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-98 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Generating PNG...' : 'Download High-Res PNG'}
                </button>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h5 className="font-bold text-slate-100">How to set on your phone:</h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Transfer or AirDrop the downloaded PNG image to your smartphone photo gallery.</li>
                  <li>Add a standard photo widget (e.g. Apple Photos widget, Widgetsmith, or Android Gallery widget) to your home screen.</li>
                  <li>Select this graphic image to display your custom designed widget in pixel-perfect sharpness!</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Instructions banner */}
              {activeFormat === 'scriptable' && (
                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200">
                  <span className="font-bold block text-white mb-0.5">iOS Scriptable Setup:</span>
                  1. Download free app <strong>Scriptable</strong> from App Store. 2. Tap '+' to create a new script. 3. Paste the code below and tap Done. 4. Add a Scriptable widget to your Home Screen and pick this script!
                </div>
              )}

              {activeFormat === 'kwgt' && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200">
                  <span className="font-bold block text-white mb-0.5">Android KWGT Setup:</span>
                  Open <strong>KWGT Kustom Widget</strong> on Android. Insert a new widget on your home screen, go to Globals/Items, and apply the formatted formula strings below.
                </div>
              )}

              {/* Code viewer */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono">
                    {activeFormat === 'scriptable' ? 'widget.js' : activeFormat === 'kwgt' ? 'kwgt_formulas.txt' : activeFormat === 'json' ? 'config.json' : 'widget.html'}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 text-xs font-mono text-slate-300 overflow-x-auto max-h-72 leading-relaxed selection:bg-sky-500 selection:text-white">
                  {getCodeContent()}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Compatible with iOS 16/17/18 & Android 13/14/15</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
