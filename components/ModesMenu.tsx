import React, { useState } from 'react';
import { X, ShieldAlert, User, Code, Film, Swords, MessageSquare, Star, Lock } from 'lucide-react';
import { AppSettings, BsdCharacter, AppMode } from '../types';

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

  if (!isOpen) return null;

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNsfwToggle = () => {
    if (settings.nsfwEnabled) {
      // Turning off is free
      handleSettingChange('nsfwEnabled', false);
      setShowPasswordInput(false);
    } else {
      // Turning on requires password
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
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="text-stellar" />
            Modes & Personas
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Modes */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Operation Mode</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => handleSettingChange('mode', mode.id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    settings.mode === mode.id
                      ? 'bg-stellar/20 border-stellar text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600'
                  }`}
                >
                  <div className={`mt-1 ${settings.mode === mode.id ? 'text-stellar' : 'text-gray-500'}`}>{mode.icon}</div>
                  <div>
                    <div className="font-bold">{mode.name}</div>
                    <div className="text-xs opacity-70">{mode.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Characters */}
          <section>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">BSD Persona</h3>
                <div className="text-xs text-gray-500">Select a character to chat with</div>
             </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSettingChange('character', char.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 h-28 ${
                    settings.character === char.id
                      ? 'bg-stellar/20 border-stellar text-white shadow-lg shadow-stellar/10'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:text-gray-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${settings.character === char.id ? 'bg-stellar text-white' : 'bg-gray-700'}`}>
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
          <section className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={16} /> Restricted Settings
            </h3>
             <div className="flex flex-col bg-red-950/20 rounded-xl border border-red-900/30 overflow-hidden">
               <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-900/30 rounded-lg text-red-500">
                      {settings.nsfwEnabled ? <ShieldAlert size={24} /> : <Lock size={24} />}
                    </div>
                    <div>
                      <div className="font-bold text-red-100">NSFW Mode</div>
                      <div className="text-xs text-red-300/60">Disables safety filters. Allows mature content.</div>
                    </div>
                  </div>
                  
                  {!showPasswordInput && (
                    <button
                      onClick={handleNsfwToggle}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                        settings.nsfwEnabled ? 'bg-red-600' : 'bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings.nsfwEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                    </button>
                  )}
              </div>

              {showPasswordInput && (
                 <div className="bg-black/20 p-4 border-t border-red-900/30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs text-red-200 font-mono uppercase">Enter Access Password:</label>
                    <div className="flex gap-2">
                      <input 
                        type="password" 
                        autoFocus
                        className="flex-1 bg-gray-900 border border-red-900/50 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none"
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
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition"
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

        <div className="p-5 border-t border-gray-800 bg-gray-900 text-right">
          <button
            onClick={onClose}
            className="bg-stellar hover:bg-stellar-dark text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-stellar/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModesMenu;