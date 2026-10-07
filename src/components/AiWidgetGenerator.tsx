import React, { useState } from 'react';
import { WidgetConfig } from '../types/widget';
import { THEME_PRESETS } from '../data/presets';
import { Sparkles, X, Wand2, Check } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AiWidgetGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWidget: (config: WidgetConfig) => void;
  currentWidget: WidgetConfig;
}

export const AiWidgetGenerator: React.FC<AiWidgetGeneratorProps> = ({
  isOpen,
  onClose,
  onApplyWidget,
  currentWidget,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewGenerated, setPreviewGenerated] = useState<WidgetConfig | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Tokyo Nightlife: Cyberpunk neon cyan clock and weather forecast',
    'Nordic Morning: Minimalist sage green weather and daily quote',
    'Executive Black: OLED pure black dual timezone and calendar agenda',
    'Cozy Coffee: Warm pastel peach music player and step counter',
  ];

  const handleGenerate = async (targetPrompt = prompt) => {
    if (!targetPrompt.trim()) return;
    setLoading(true);

    try {
      // Determine theme style and settings based on user prompt semantics
      const p = targetPrompt.toLowerCase();
      let chosenTheme = { ...THEME_PRESETS[0] };
      let newType = currentWidget.type;
      let newCity = currentWidget.weather.city;
      let newQuote = currentWidget.quote.quote;
      let newAuthor = currentWidget.quote.author;
      let songTitle = currentWidget.music.songTitle;
      let artistName = currentWidget.music.artistName;

      if (p.includes('tokyo') || p.includes('cyber') || p.includes('neon')) {
        chosenTheme = { ...THEME_PRESETS[4] }; // Tokyo Cyber Neon
        newType = 'weather_forecast';
        newCity = 'Tokyo, Japan';
      } else if (p.includes('nordic') || p.includes('sage') || p.includes('green') || p.includes('nature')) {
        chosenTheme = { ...THEME_PRESETS[3] }; // Nordic Sage
        newType = 'quote_inspiration';
        newQuote = 'Nature does not hurry, yet everything is accomplished.';
        newAuthor = 'Lao Tzu';
      } else if (p.includes('oled') || p.includes('black') || p.includes('minimal') || p.includes('executive')) {
        chosenTheme = { ...THEME_PRESETS[2] }; // OLED Obsidian
        newType = 'clock_dual';
      } else if (p.includes('coffee') || p.includes('warm') || p.includes('peach') || p.includes('pastel')) {
        chosenTheme = { ...THEME_PRESETS[1] }; // Material Peach
        newType = 'music_player';
        songTitle = 'Sunday Morning Brew';
        artistName = 'Acoustic Sessions';
      } else if (p.includes('fitness') || p.includes('gym') || p.includes('run') || p.includes('steps')) {
        chosenTheme = { ...THEME_PRESETS[0] };
        newType = 'fitness_rings';
      } else if (p.includes('vintage') || p.includes('mac') || p.includes('retro')) {
        chosenTheme = { ...THEME_PRESETS[5] }; // Macintosh
      }

      // Try calling Gemini if API key available in env
      const apiKey = process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert mobile UI designer. Given this user idea for a smartphone widget: "${targetPrompt}". Suggest an inspirational quote or subtitle (max 10 words), and a city name. Output strictly JSON in format: {"quote": "...", "author": "...", "city": "..."}`,
          });
          const text = response.text?.trim() || '';
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed.city) newCity = parsed.city;
          if (parsed.quote) newQuote = parsed.quote;
          if (parsed.author) newAuthor = parsed.author;
        } catch (e) {
          // Graceful fallback to rich semantic synthesizer
        }
      }

      const generatedConfig: WidgetConfig = {
        ...currentWidget,
        name: targetPrompt.slice(0, 24),
        type: newType,
        theme: chosenTheme,
        weather: {
          ...currentWidget.weather,
          city: newCity,
        },
        quote: {
          ...currentWidget.quote,
          quote: newQuote,
          author: newAuthor,
        },
        music: {
          ...currentWidget.music,
          songTitle,
          artistName,
        },
      };

      setPreviewGenerated(generatedConfig);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (previewGenerated) {
      onApplyWidget(previewGenerated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Widget Creator</h3>
              <p className="text-[11px] text-slate-400">Describe any vibe, color palette, or smartphone layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              What kind of widget would you like to build?
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Kyoto travel widget with warm sunset glassmorphism, weather and upcoming itinerary..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Quick inspiration chips */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">Quick Inspiration:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(qp);
                    handleGenerate(qp);
                  }}
                  className="text-[11px] bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-left transition-colors truncate max-w-full"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Result preview preview info */}
          {previewGenerated && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs flex items-center justify-between">
              <div>
                <span className="text-purple-300 font-bold block">Generated Widget Design Ready</span>
                <span className="text-slate-400 text-[11px]">
                  Theme: {previewGenerated.theme.name} · Layout: {previewGenerated.type}
                </span>
              </div>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply to Canvas
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {loading ? 'Designing Widget...' : 'Generate Widget'}
          </button>
        </div>
      </div>
    </div>
  );
};
