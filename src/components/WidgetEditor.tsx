import React, { useState } from 'react';
import { 
  WidgetConfig, 
  WidgetSize, 
  WidgetType, 
  WidgetTheme, 
  BgType 
} from '../types/widget';
import { THEME_PRESETS } from '../data/presets';
import { 
  Clock, 
  CloudSun, 
  Calendar, 
  Battery, 
  Activity, 
  Music, 
  Quote, 
  Image as ImageIcon, 
  Grid2X2, 
  Sliders, 
  Sparkles, 
  Type, 
  Palette, 
  Maximize2,
  RefreshCw,
  Shuffle
} from 'lucide-react';

interface WidgetEditorProps {
  widget: WidgetConfig;
  onChange: (updated: WidgetConfig) => void;
  onOpenAiModal: () => void;
}

export const WidgetEditor: React.FC<WidgetEditorProps> = ({
  widget,
  onChange,
  onOpenAiModal,
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'theme' | 'data'>('type');

  const updateTheme = (fields: Partial<WidgetTheme>) => {
    onChange({
      ...widget,
      theme: {
        ...widget.theme,
        ...fields,
      },
    });
  };

  const widgetTypes: Array<{ type: WidgetType; label: string; icon: React.ReactNode; desc: string }> = [
    { type: 'hybrid_dash', label: 'All-in-One Stack', icon: <Sliders className="w-4 h-4" />, desc: 'Clock, weather & agenda combo' },
    { type: 'clock_dual', label: 'Clock & Dual Time', icon: <Clock className="w-4 h-4" />, desc: 'Digital, analog & international cities' },
    { type: 'weather_forecast', label: 'Live Weather', icon: <CloudSun className="w-4 h-4" />, desc: 'Conditions, hourly forecast strip' },
    { type: 'calendar_events', label: 'Agenda & Calendar', icon: <Calendar className="w-4 h-4" />, desc: 'Today date & upcoming meetings' },
    { type: 'battery_system', label: 'Battery & System', icon: <Battery className="w-4 h-4" />, desc: 'Phone, Watch & AirPods gauges' },
    { type: 'fitness_rings', label: 'Fitness & Activity', icon: <Activity className="w-4 h-4" />, desc: 'Apple/Pixel style activity rings' },
    { type: 'music_player', label: 'Media Player', icon: <Music className="w-4 h-4" />, desc: 'Now playing & sound waves' },
    { type: 'quote_inspiration', label: 'Daily Wisdom', icon: <Quote className="w-4 h-4" />, desc: 'Curated quotes & inspiration' },
    { type: 'photo_frame', label: 'Photo Frame', icon: <ImageIcon className="w-4 h-4" />, desc: 'Personal photo & memories' },
    { type: 'quick_launcher', label: 'Speed Dial', icon: <Grid2X2 className="w-4 h-4" />, desc: 'Fast shortcuts to favorite tools' },
  ];

  const sizeOptions: Array<{ size: WidgetSize; label: string; gridDesc: string }> = [
    { size: 'small', label: 'Small', gridDesc: '2×2 Grid' },
    { size: 'medium', label: 'Medium', gridDesc: '4×2 Grid' },
    { size: 'large', label: 'Large', gridDesc: '4×4 Grid' },
    { size: 'lock_rect', label: 'Lock Rect', gridDesc: 'Lock Screen' },
    { size: 'lock_circle', label: 'Lock Circle', gridDesc: 'Complication' },
  ];

  // Randomizer for quick inspiration
  const handleRandomize = () => {
    const randomTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
    const cities = ['Tokyo', 'New York', 'London', 'Paris', 'Zurich', 'Seoul', 'Sydney'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomTemp = Math.floor(Math.random() * 30) + 55;

    onChange({
      ...widget,
      theme: randomTheme,
      weather: {
        ...widget.weather,
        city: randomCity,
        temperature: randomTemp,
      },
      battery: {
        ...widget.battery,
        phoneLevel: Math.floor(Math.random() * 40) + 60,
      },
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200">
      {/* Editor Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('type')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'type' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Widget & Size
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'theme' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Style & Theme
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'data' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Data & Content
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-medium shadow-sm transition-all"
            title="Generate widget style with AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>
          <button
            onClick={handleRandomize}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Surprise Me (Randomize style)"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* TAB 1: WIDGET TYPE & SIZE */}
        {activeTab === 'type' && (
          <div className="space-y-6">
            {/* Size Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Widget Size
              </label>
              <div className="grid grid-cols-5 gap-2">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    onClick={() => onChange({ ...widget, size: opt.size })}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      widget.size === opt.size
                        ? 'border-sky-500 bg-sky-500/10 text-white ring-1 ring-sky-500'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{opt.gridDesc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget Category Type */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Widget Purpose & Layout
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {widgetTypes.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onChange({ ...widget, type: item.type })}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      widget.type === item.type
                        ? 'border-sky-500 bg-sky-500/10 text-white ring-1 ring-sky-500'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${widget.type === item.type ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: THEME & AESTHETICS */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            {/* Presets Grid */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Curated Design Themes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onChange({ ...widget, theme: preset })}
                    className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      widget.theme.id === preset.id
                        ? 'border-sky-500 ring-1 ring-sky-500 bg-slate-800'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <span className="text-xs font-bold text-slate-200 truncate">{preset.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{preset.bgType}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Style Engine */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Background Engine
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['glass', 'gradient', 'solid'] as BgType[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateTheme({ bgType: mode })}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize text-center transition-all ${
                      widget.theme.bgType === mode
                        ? 'border-sky-500 bg-sky-500/10 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'glass' ? 'iOS Glass' : mode}
                  </button>
                ))}
              </div>

              {widget.theme.bgType === 'glass' && (
                <div className="space-y-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Blur Strength</span>
                      <span className="font-mono">{widget.theme.glassBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={widget.theme.glassBlur}
                      onChange={(e) => updateTheme({ glassBlur: Number(e.target.value) })}
                      className="w-full accent-sky-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Glass Tint</span>
                    </div>
                    <input
                      type="text"
                      value={widget.theme.bgColor}
                      onChange={(e) => updateTheme({ bgColor: e.target.value })}
                      placeholder="e.g. rgba(255, 255, 255, 0.2)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {widget.theme.bgType === 'gradient' && (
                <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Gradient Start</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={widget.theme.gradientFrom}
                        onChange={(e) => updateTheme({ gradientFrom: e.target.value })}
                        className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={widget.theme.gradientFrom}
                        onChange={(e) => updateTheme({ gradientFrom: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Gradient End</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={widget.theme.gradientTo}
                        onChange={(e) => updateTheme({ gradientTo: e.target.value })}
                        className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={widget.theme.gradientTo}
                        onChange={(e) => updateTheme({ gradientTo: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {widget.theme.bgType === 'solid' && (
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Solid Fill Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={widget.theme.bgColor.startsWith('#') ? widget.theme.bgColor : '#000000'}
                      onChange={(e) => updateTheme({ bgColor: e.target.value })}
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={widget.theme.bgColor}
                      onChange={(e) => updateTheme({ bgColor: e.target.value })}
                      className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Typography & Accent Palette */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Colors & Geometry
              </label>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Accent</label>
                  <div className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700">
                    <input
                      type="color"
                      value={widget.theme.accentColor}
                      onChange={(e) => updateTheme({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded border-0 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-300 truncate">{widget.theme.accentColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Text</label>
                  <div className="flex items-center gap-2 bg-slate-800/60 p-1.5 rounded-lg border border-slate-700">
                    <input
                      type="color"
                      value={widget.theme.textColor.startsWith('#') ? widget.theme.textColor : '#ffffff'}
                      onChange={(e) => updateTheme({ textColor: e.target.value })}
                      className="w-6 h-6 rounded border-0 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-300 truncate">{widget.theme.textColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Font Face</label>
                  <select
                    value={widget.theme.fontFamily}
                    onChange={(e) => updateTheme({ fontFamily: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                  >
                    <option value="sans">Modern Sans</option>
                    <option value="mono">Tabular Mono</option>
                    <option value="serif">Editorial Serif</option>
                    <option value="rounded">Rounded Touch</option>
                  </select>
                </div>
              </div>

              {/* Corner Radius & Border toggle */}
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Corner Radius</span>
                    <span className="font-mono">{widget.theme.borderRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="36"
                    value={widget.theme.borderRadius}
                    onChange={(e) => updateTheme({ borderRadius: Number(e.target.value) })}
                    className="w-full accent-sky-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-slate-300">Specular Hairline Border (iOS Style)</span>
                  <input
                    type="checkbox"
                    checked={widget.theme.glassBorder}
                    onChange={(e) => updateTheme({ glassBorder: e.target.checked })}
                    className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATA & CONTENT FIELDS */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Custom Content Values
              </label>
              <span className="text-[11px] text-sky-400 font-mono">Live Sync</span>
            </div>

            {/* Weather Specific */}
            {(widget.type === 'weather_forecast' || widget.type === 'hybrid_dash') && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Weather Location & Temp</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">City Name</label>
                    <input
                      type="text"
                      value={widget.weather.city}
                      onChange={(e) => onChange({
                        ...widget,
                        weather: { ...widget.weather, city: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Temperature ({widget.weather.unit}°)</label>
                    <input
                      type="number"
                      value={widget.weather.temperature}
                      onChange={(e) => onChange({
                        ...widget,
                        weather: { ...widget.weather, temperature: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Condition</label>
                    <select
                      value={widget.weather.condition}
                      onChange={(e) => onChange({
                        ...widget,
                        weather: { ...widget.weather, condition: e.target.value as any }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                    >
                      <option value="Sunny">Sunny</option>
                      <option value="Partly Cloudy">Partly Cloudy</option>
                      <option value="Rainy">Rainy</option>
                      <option value="Thunderstorm">Thunderstorm</option>
                      <option value="Snowy">Snowy</option>
                      <option value="Night Clear">Night Clear</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Unit</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onChange({ ...widget, weather: { ...widget.weather, unit: 'F' } })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                          widget.weather.unit === 'F' ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        °F
                      </button>
                      <button
                        onClick={() => onChange({ ...widget, weather: { ...widget.weather, unit: 'C' } })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                          widget.weather.unit === 'C' ? 'bg-sky-500 text-white border-sky-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        °C
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Clock Specific */}
            {(widget.type === 'clock_dual' || widget.type === 'hybrid_dash') && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Clock & Second Timezone</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Format</label>
                    <select
                      value={widget.clock.timeFormat}
                      onChange={(e) => onChange({
                        ...widget,
                        clock: { ...widget.clock, timeFormat: e.target.value as any }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                    >
                      <option value="12h">12-Hour (AM/PM)</option>
                      <option value="24h">24-Hour (Military)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Style</label>
                    <select
                      value={widget.clock.style}
                      onChange={(e) => onChange({
                        ...widget,
                        clock: { ...widget.clock, style: e.target.value as any }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs"
                    >
                      <option value="digital">Digital Large</option>
                      <option value="analog">Analog Dial Face</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Secondary City</label>
                    <input
                      type="text"
                      value={widget.clock.secondaryCity}
                      onChange={(e) => onChange({
                        ...widget,
                        clock: { ...widget.clock, secondaryCity: e.target.value }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">UTC Offset Hours</label>
                    <input
                      type="number"
                      value={widget.clock.secondaryOffset}
                      onChange={(e) => onChange({
                        ...widget,
                        clock: { ...widget.clock, secondaryOffset: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Calendar & Agenda Specific */}
            {(widget.type === 'calendar_events' || widget.type === 'hybrid_dash') && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Agenda & Next Event</h4>
                <div>
                  <label className="text-slate-400 block mb-1">Event Title</label>
                  <input
                    type="text"
                    value={widget.calendar.nextEventTitle}
                    onChange={(e) => onChange({
                      ...widget,
                      calendar: { ...widget.calendar, nextEventTitle: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Event Time</label>
                  <input
                    type="text"
                    value={widget.calendar.nextEventTime}
                    onChange={(e) => onChange({
                      ...widget,
                      calendar: { ...widget.calendar, nextEventTime: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Fitness & Activity Specific */}
            {widget.type === 'fitness_rings' && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Activity Goals & Current</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Move Calories</label>
                    <input
                      type="number"
                      value={widget.fitness.moveCalories}
                      onChange={(e) => onChange({
                        ...widget,
                        fitness: { ...widget.fitness, moveCalories: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Steps Count</label>
                    <input
                      type="number"
                      value={widget.fitness.stepsCount}
                      onChange={(e) => onChange({
                        ...widget,
                        fitness: { ...widget.fitness, stepsCount: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Music Player Specific */}
            {widget.type === 'music_player' && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Media Track</h4>
                <div>
                  <label className="text-slate-400 block mb-1">Song Title</label>
                  <input
                    type="text"
                    value={widget.music.songTitle}
                    onChange={(e) => onChange({
                      ...widget,
                      music: { ...widget.music, songTitle: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={widget.music.artistName}
                    onChange={(e) => onChange({
                      ...widget,
                      music: { ...widget.music, artistName: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Quotes Specific */}
            {widget.type === 'quote_inspiration' && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Wisdom Quote</h4>
                <div>
                  <label className="text-slate-400 block mb-1">Quote Text</label>
                  <textarea
                    rows={3}
                    value={widget.quote.quote}
                    onChange={(e) => onChange({
                      ...widget,
                      quote: { ...widget.quote, quote: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Author</label>
                  <input
                    type="text"
                    value={widget.quote.author}
                    onChange={(e) => onChange({
                      ...widget,
                      quote: { ...widget.quote, author: e.target.value }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Battery Specific */}
            {(widget.type === 'battery_system' || widget.type === 'hybrid_dash') && (
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">Power Levels (%)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Phone</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={widget.battery.phoneLevel}
                      onChange={(e) => onChange({
                        ...widget,
                        battery: { ...widget.battery, phoneLevel: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Watch</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={widget.battery.watchLevel}
                      onChange={(e) => onChange({
                        ...widget,
                        battery: { ...widget.battery, watchLevel: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">AirPods</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={widget.battery.budsLevel}
                      onChange={(e) => onChange({
                        ...widget,
                        battery: { ...widget.battery, budsLevel: Number(e.target.value) }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
