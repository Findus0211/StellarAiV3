import React from 'react';
import { X, Zap, Activity } from 'lucide-react';
import { AppSettings, AiSpeed } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-stellar" />
            Performance Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Speed Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Zap size={16} /> Processing Speed & Intelligence
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { val: AiSpeed.DEEP_THINKING, label: 'Deep Thinking', desc: 'Gemini 3.0 Pro • Highest Intelligence (Slow)' },
                { val: AiSpeed.NORMAL, label: 'Normal', desc: 'Gemini 2.5 Flash • Balanced (Recommended)' },
                { val: AiSpeed.FAST, label: 'Fast', desc: 'Gemini 2.5 Flash • Optimized Latency' },
                { val: AiSpeed.VERY_FAST, label: 'Very Fast', desc: 'Gemini Flash Lite • Lowest Latency' },
                { val: AiSpeed.EXTREMELY_FAST, label: 'Extremely Fast', desc: 'Gemini Flash Lite • Minimalist Responses' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleChange('speed', opt.val)}
                  className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                    settings.speed === opt.val
                      ? 'bg-stellar/20 border-stellar text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{opt.label}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                  </div>
                  {settings.speed === opt.val && <div className="w-3 h-3 bg-stellar rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-xs text-gray-400">
             Note: For game modes like Chess or creative tasks like Script Writing, "Normal" or "Deep Thinking" is recommended for best results.
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-800 bg-gray-900 text-right">
          <button
            onClick={onClose}
            className="bg-stellar hover:bg-stellar-dark text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-stellar/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;