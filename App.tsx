import React, { useState } from 'react';
import { MessageSquare, Image as ImageIcon, Settings, Github, Grid2X2, Box } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import SettingsModal from './components/SettingsModal';
import ModesMenu from './components/ModesMenu';
import { AppSettings, AiSpeed, BsdCharacter, Message, MessageRole, AppMode, AppTheme } from './types';
import { streamChatResponse } from './services/geminiService';
import { THEME_COLORS } from './constants';

// Custom Logo Component
const StellarLogo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 0L24.49 15.51L40 20L24.49 24.49L20 40L15.51 24.49L0 20L15.51 15.51L20 0Z" fill="url(#grad1)"/>
    <circle cx="20" cy="20" r="5" fill="white" fillOpacity="0.9"/>
    <defs>
      <linearGradient id="grad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
  </svg>
);

function App() {
  // State
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModesMenuOpen, setIsModesMenuOpen] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    speed: AiSpeed.NORMAL,
    nsfwEnabled: false,
    mode: AppMode.CHAT,
    character: BsdCharacter.NONE,
    theme: AppTheme.DARK
  });

  // Theme Derived Values
  const theme = THEME_COLORS[settings.theme];

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: Date.now()
    };

    const tempModelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: MessageRole.MODEL,
      text: '',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg, tempModelMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      await streamChatResponse(history, userMsg.text, settings, (textChunk) => {
        setMessages(current => {
          const newMsgs = [...current];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.role === MessageRole.MODEL) {
             lastMsg.text += textChunk;
          }
          return newMsgs;
        });
      });

    } catch (error) {
      console.error(error);
      setMessages(current => {
         const newMsgs = [...current];
         const lastMsg = newMsgs[newMsgs.length - 1];
         lastMsg.text = "**Error:** Failed to get response. Please check connection or safety settings.";
         lastMsg.isError = true;
         return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen font-sans overflow-hidden selection:bg-purple-500/30 transition-colors duration-300" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {/* Sidebar / Nav (Mobile: Bottom, Desktop: Left) */}
      <nav className="hidden md:flex flex-col w-20 border-r items-center py-6 gap-6 z-20 shadow-2xl transition-colors duration-300"
           style={{ backgroundColor: theme.nav, borderColor: theme.border }}>
        <div className="mb-4 hover:scale-110 transition-transform duration-300 cursor-default">
          <StellarLogo />
        </div>
        
        <button
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-xl transition-all relative group`}
          style={{ 
             backgroundColor: activeTab === 'chat' ? theme.card : 'transparent',
             color: activeTab === 'chat' ? theme.accent : theme.textSec
          }}
          title="Chat"
        >
          <MessageSquare size={24} />
          {activeTab === 'chat' && <div className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ backgroundColor: theme.accent }} />}
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`p-3 rounded-xl transition-all relative group`}
          style={{ 
             backgroundColor: activeTab === 'image' ? theme.card : 'transparent',
             color: activeTab === 'image' ? theme.accent : theme.textSec
          }}
          title="Image Generator"
        >
          <ImageIcon size={24} />
          {activeTab === 'image' && <div className="absolute inset-y-2 left-0 w-1 rounded-r-full" style={{ backgroundColor: theme.accent }} />}
        </button>

        <div className="w-8 h-[1px] my-2" style={{ backgroundColor: theme.border }} />

        <button
          onClick={() => setIsModesMenuOpen(true)}
          className={`p-3 rounded-xl transition-all group relative hover:bg-opacity-10`}
          style={{ color: theme.textSec }}
          title="Modes & Personas"
        >
          <Grid2X2 size={24} />
        </button>

        <div className="mt-auto flex flex-col gap-4">
           <a href="https://github.com" target="_blank" rel="noreferrer" className="p-3 transition" style={{ color: theme.textSec }}>
              <Github size={24} />
           </a>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 hover:rotate-90 transition duration-300"
            style={{ color: theme.textSec }}
            title="Performance Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 backdrop-blur border-b flex items-center justify-between px-4 z-30 transition-colors"
           style={{ backgroundColor: `${theme.nav}E6`, borderColor: theme.border }}>
         <div className="font-bold text-xl flex items-center gap-3" style={{ color: theme.text }}>
            <StellarLogo />
            <span className="tracking-tight">Stellar AI</span>
         </div>
         <div className="flex gap-2">
           <button onClick={() => setIsModesMenuOpen(true)} className="p-2" style={{ color: theme.textSec }}>
              <Grid2X2 size={22} />
           </button>
           <button onClick={() => setIsSettingsOpen(true)} className="p-2" style={{ color: theme.textSec }}>
              <Settings size={22} />
           </button>
         </div>
      </div>
      
      {/* Mobile Tab Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around z-30 transition-colors"
           style={{ backgroundColor: theme.nav, borderColor: theme.border }}>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1`} style={{ color: activeTab === 'chat' ? theme.accent : theme.textSec }}>
          <MessageSquare size={20} />
          <span className="text-[10px]">Chat</span>
        </button>
        <button onClick={() => setActiveTab('image')} className={`flex flex-col items-center gap-1`} style={{ color: activeTab === 'image' ? theme.accent : theme.textSec }}>
          <ImageIcon size={20} />
          <span className="text-[10px]">Images</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative pt-16 md:pt-0 pb-16 md:pb-0 h-[100dvh]">
        {activeTab === 'chat' ? (
          <ChatInterface 
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            settings={settings}
          />
        ) : (
          <ImageGenerator settings={settings} />
        )}
      </main>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />
      
      <ModesMenu
        isOpen={isModesMenuOpen}
        onClose={() => setIsModesMenuOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}

export default App;