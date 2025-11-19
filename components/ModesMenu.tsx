import React, { useState } from 'react';
import { X, ShieldAlert, User, Code, Film, Swords, MessageSquare, Star, Lock } from 'lucide-react';
import { AppSettings, BsdCharacter, AppMode } from '../types';
import { THEME_COLORS } from '../constants';

interface ModesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const ModesMenu: React.FC<ModesMenuProps> = ({ isOpen, onClose, settings, setSettings }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const theme = THEME_COLORS[settings.theme];

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNsfwToggle = () => {
    if (settings.nsfwEnabled) {
      handleSettingChange('nsfwEnabled', false);
      setShowPasswordInput(false);
    } else {
      setShowPasswordInput(true);
      setErrorMsg('');
      setPasswordAttempt('');
    }
  };

  const verifyPassword = () => {
    if (passwordAttempt === '0211') {
      handleSettingChange('nsfwEnabled', true);
      setShowPasswordInput(false);
      setPasswordAttempt('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect password');
      setPasswordAttempt('');
    }
  };

  const characters = [
    { id: BsdCharacter.NONE, name: 'Stellar AI', desc: 'Default Assistant' },
    { id: BsdCharacter.DAZAI, name: 'Osamu Dazai', desc: 'Enigmatic & Suicidal' },
    { id: BsdCharacter.CHUUYA, name: 'Chuuya Nakahara', desc: 'Gravity Manipulator' },
    { id: BsdCharacter.ATSUSHI, name: 'Atsushi Nakajima', desc: 'The Weretiger' },
    { id: BsdCharacter.AKUTAGAWA, name: 'Ryunosuke Akutagawa', desc: 'Silent Rabid Dog' },
    { id: BsdCharacter.RANPO, name: 'Ranpo Edogawa', desc: 'Super Deduction' },
    { id: BsdCharacter.FYODOR, name: 'Fyodor Dostoevsky', desc: 'Crime and Punishment' },
    { id: BsdCharacter.NIKOLAI, name: 'Nikolai Gogol', desc: 'The Clown' },
    { id: BsdCharacter.KUNIKIDA, name: 'Doppo Kunikida', desc: 'The Idealist' },
    { id: BsdCharacter.YOSANO, name: 'Akiko Yosano', desc: 'Thou Shalt Not Die' },
    { id: BsdCharacter.POE, name: 'Edgar Allan Poe', desc: 'Guild Architect' },
  ];

  const modes = [
    { id: AppMode.CHAT, name: 'Chat Mode', icon: <MessageSquare size={20}/>, desc: 'Standard conversation' },
    { id: AppMode.CHESS, name: 'Chess Mode', icon: <Swords size={20}/>, desc: 'Play against a Grandmaster' },
    { id: AppMode.CODING, name: 'Coding Mode', icon: <Code size={20}/>, desc: 'Software Engineering expert' },
    { id: AppMode.SCRIPT_WRITER, name: 'Script Writer', icon: <Film size={20}/>, desc: 'Screenplay formatting' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{ backgroundColor: theme.card, borderColor: theme.border }}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b" style={{ backgroundColor: theme.nav, borderColor: theme.border }}>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.text }}>
            <Star style={{ color: theme.accent }} />
            Modes & Personas
          </h2>
          <button onClick={onClose} className="hover:opacity-70 transition">
            <X size={24} style={{ color: theme.textSec }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Modes */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: theme.textSec }}>Operation Mode</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleSettingChange('mode', mode.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    settings.mode === mode.id
                      ? 'shadow-md'
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: settings.mode === mode.id ? `${theme.accent}20` : theme.bg,
                    borderColor: settings.mode === mode.id ? theme.accent : theme.border,
                    color: settings.mode === mode.id ? theme.text : theme.textSec
                  }}
                >
                  <div className="mt-1" style={{ color: settings.mode === mode.id ? theme.accent : theme.textSec }}>{mode.icon}</div>
                  <div>
                    <div className="font-bold" style={{ color: settings.mode === mode.id ? theme.text : theme.textSec }}>{mode.name}</div>
                    <div className="text-xs opacity-70">{mode.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Characters */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.textSec }}>BSD Persona</h3>
                <div className="text-xs" style={{ color: theme.textSec }}>Select a character</div>
             </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSettingChange('character', char.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 h-28 ${
                    settings.character === char.id
                      ? 'shadow-md'
                      : 'hover:opacity-90'
                  }`}
                   style={{
                    backgroundColor: settings.character === char.id ? `${theme.accent}20` : theme.bg,
                    borderColor: settings.character === char.id ? theme.accent : theme.border,
                    color: settings.character === char.id ? theme.text : theme.textSec
                  }}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: settings.character === char.id ? theme.accent : theme.border, color: '#fff' }}
                  >
                     <User size={16} />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-sm leading-tight">{char.name}</span>
                     <span className="text-[10px] opacity-60 mt-1 line-clamp-1">{char.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Dangerous Settings */}
          <section className="border-t pt-6" style={{ borderColor: theme.border }}>
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={16} /> Restricted Settings
            </h3>
             <div className="flex flex-col rounded-xl border border-red-900/30 overflow-hidden" style={{ backgroundColor: `${theme.bg}40` }}>
               <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-900/30 rounded-lg text-red-500">
                      {settings.nsfwEnabled ? <ShieldAlert size={24} /> : <Lock size={24} />}
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: theme.text }}>NSFW Mode</div>
                      <div className="text-xs text-red-400/80">Disables safety filters. Allows mature content.</div>
                    </div>
                  </div>
                  
                  {!showPasswordInput && (
                    <button
                      onClick={handleNsfwToggle}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                        settings.nsfwEnabled ? 'bg-red-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.nsfwEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  )}
              </div>

              {showPasswordInput && (
                 <div className="p-4 border-t border-red-900/30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2" style={{ backgroundColor: `${theme.nav}80` }}>
                    <label className="text-xs text-red-400 font-mono uppercase">Enter Access Password:</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        autoFocus
                        className="flex-1 border border-red-900/50 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
                        style={{ backgroundColor: theme.bg, color: theme.text }}
                        placeholder="Password required..."
                        value={passwordAttempt}
                        onChange={(e) => setPasswordAttempt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && verifyPassword()}
                      />
                      <button 
                        onClick={verifyPassword}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition"
                      >
                        Unlock
                      </button>
                      <button 
                        onClick={() => { setShowPasswordInput(false); setPasswordAttempt(''); setErrorMsg(''); }}
                        className="px-3 py-2 rounded-lg text-sm transition text-white"
                        style={{ backgroundColor: theme.border }}
                      >
                        Cancel
                      </button>
                    </div>
                    {errorMsg && <div className="text-red-400 text-xs font-bold mt-1">{errorMsg}</div>}
                 </div>
              )}
            </div>
          </section>

        </div>

        <div className="p-5 border-t text-right" style={{ backgroundColor: theme.nav, borderColor: theme.border }}>
          <button
            onClick={onClose}
            className="text-white px-8 py-3 rounded-xl font-bold transition shadow-lg"
            style={{ backgroundColor: theme.accent }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModesMenu;