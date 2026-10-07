import React, { useState, useEffect } from 'react';
import { WidgetConfig } from '../types/widget';
import { THEME_PRESETS, DEFAULT_WIDGET_CONFIG } from '../data/presets';
import { WidgetRenderer } from './WidgetRenderer';
import { 
  FolderHeart, 
  Plus, 
  Copy, 
  Trash2, 
  Check, 
  Sparkles, 
  Smartphone,
  Edit3
} from 'lucide-react';

interface WidgetVaultProps {
  currentWidget: WidgetConfig;
  onSelectWidget: (widget: WidgetConfig) => void;
  onEditWidget: (widget: WidgetConfig) => void;
}

const VAULT_STORAGE_KEY = 'glancecraft_saved_widgets_v1';

export const WidgetVault: React.FC<WidgetVaultProps> = ({
  currentWidget,
  onSelectWidget,
  onEditWidget,
}) => {
  const [savedWidgets, setSavedWidgets] = useState<WidgetConfig[]>(() => {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback
    }

    // Default starter library
    return [
      DEFAULT_WIDGET_CONFIG,
      {
        ...DEFAULT_WIDGET_CONFIG,
        id: 'tokyo-neon-01',
        name: 'Tokyo Cyber Clock',
        type: 'clock_dual',
        size: 'medium',
        theme: THEME_PRESETS[4], // Tokyo Cyber
        clock: {
          ...DEFAULT_WIDGET_CONFIG.clock,
          primaryCity: 'Tokyo Local',
          secondaryCity: 'London UTC',
          secondaryOffset: -9,
        },
      },
      {
        ...DEFAULT_WIDGET_CONFIG,
        id: 'obsidian-fitness-01',
        name: 'Obsidian Rings',
        type: 'fitness_rings',
        size: 'small',
        theme: THEME_PRESETS[2], // OLED Black
      },
      {
        ...DEFAULT_WIDGET_CONFIG,
        id: 'nordic-sage-01',
        name: 'Nordic Calm Quote',
        type: 'quote_inspiration',
        size: 'medium',
        theme: THEME_PRESETS[3], // Nordic Sage
        quote: {
          quote: 'Adopt the pace of nature: her secret is patience.',
          author: 'Ralph Waldo Emerson',
          category: 'Mindfulness',
        },
      },
      {
        ...DEFAULT_WIDGET_CONFIG,
        id: 'peach-music-01',
        name: 'Sunset Beats',
        type: 'music_player',
        size: 'medium',
        theme: THEME_PRESETS[1], // Material Peach
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(savedWidgets));
    } catch (e) {
      console.error(e);
    }
  }, [savedWidgets]);

  const handleSaveCurrent = () => {
    const newWidget: WidgetConfig = {
      ...currentWidget,
      id: `widget-${Date.now()}`,
      name: `${currentWidget.name} (Copy)`,
    };
    setSavedWidgets([newWidget, ...savedWidgets]);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedWidgets.length <= 1) return;
    setSavedWidgets(savedWidgets.filter((w) => w.id !== id));
  };

  const handleDuplicate = (w: WidgetConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup: WidgetConfig = {
      ...w,
      id: `widget-${Date.now()}`,
      name: `${w.name} (Dupe)`,
    };
    setSavedWidgets([dup, ...savedWidgets]);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">My Widget Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Your saved widget designs saved offline on this smartphone. Tap any widget to mount it to your phone.
          </p>
        </div>

        <button
          onClick={handleSaveCurrent}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-98 text-white text-xs font-semibold shadow-md shadow-sky-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Save Current Widget to Vault
        </button>
      </div>

      {/* Grid of Saved Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedWidgets.map((item) => {
          const isActive = currentWidget.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectWidget(item)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 bg-slate-900/60 backdrop-blur-md relative group ${
                isActive
                  ? 'border-sky-500 shadow-xl shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.name}
                    {isActive && (
                      <span className="text-[10px] bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-semibold">
                        Active on Phone
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400 capitalize">
                    {item.type.replace('_', ' ')} · {item.size}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditWidget(item);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Customize"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(item, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {savedWidgets.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview Container */}
              <div className="flex items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5 overflow-hidden min-h-[170px]">
                <WidgetRenderer widget={item} interactive={false} />
              </div>

              {/* Mount CTA Button */}
              <button
                onClick={() => onSelectWidget(item)}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Mounted on Home Screen
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5" />
                    Mount to Smartphone Preview
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
