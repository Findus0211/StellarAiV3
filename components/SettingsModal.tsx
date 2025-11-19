import React from 'react';
import { X, Zap, Activity, Moon, Sun, Palette } from 'lucide-react';
import { AppSettings, AiSpeed, AppTheme } from '../types';
import { THEME_COLORS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const theme = THEME_COLORS[settings.theme];

  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b" style={{ borderColor: theme.border, backgroundColor: theme.nav }}>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Activity style={{ color: theme.accent }} />
            Performance & Appearance
          </h2>
          <button onClick={onClose} className="hover:opacity-70 transition">
            <X size={24} style={{ color: theme.textSec }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Theme Settings */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: theme.textSec }}>
              <Palette size={16} /> Appearance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: AppTheme.DARK, label: 'Dark', icon: <Moon size={16}/> },
                { val: AppTheme.LIGHT, label: 'Light', icon: <Sun size={16}/> },
                { val: AppTheme.LILA, label: 'Lila', icon: <Palette size={16}/> },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleChange('theme', opt.val)}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    settings.theme === opt.val
                      ? 'shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                      : 'hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: settings.theme === opt.val ? `${theme.accent}33` : theme.bg,
                    borderColor: settings.theme === opt.val ? theme.accent : theme.border,
                    color: settings.theme === opt.val ? theme.text : theme.textSec
                  }}
                >
                  {opt.icon}
                  <span className="text-sm font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Speed Settings */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: theme.textSec }}>
              <Zap size={16} /> Processing Speed & Intelligence
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { val: AiSpeed.DEEP_THINKING, label: 'Deep Thinking', desc: 'Gemini 1.5 Pro • Highest Intelligence (Slow)' },
                { val: AiSpeed.NORMAL, label: 'Normal', desc: 'Gemini 2.0 Flash • Balanced (Recommended)' },
                { val: AiSpeed.FAST, label: 'Fast', desc: 'Gemini 2.0 Flash • Optimized Latency' },
                { val: AiSpeed.VERY_FAST, label: 'Very Fast', desc: 'Gemini Flash Lite • Lowest Latency' },
                { val: AiSpeed.EXTREMELY_FAST, label: 'Extremely Fast', desc: 'Gemini Flash Lite • Minimalist Responses' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleChange('speed', opt.val)}
                  className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                    settings.speed === opt.val
                      ? 'shadow-md'
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: settings.speed === opt.val ? `${theme.accent}20` : theme.bg,
                    borderColor: settings.speed === opt.val ? theme.accent : theme.border,
                    color: settings.speed === opt.val ? theme.text : theme.textSec
                  }}
                >
                  <div>
                    <div className="font-bold text-sm">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                  </div>
                  {settings.speed === opt.val && <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" style={{ backgroundColor: theme.accent }} />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t text-right" style={{ borderColor: theme.border, backgroundColor: theme.nav }}>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium transition shadow-lg hover:opacity-90 text-white"
            style={{ backgroundColor: theme.accent }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;