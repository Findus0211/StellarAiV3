import React, { useState } from 'react';
import { MessageSquare, Image as ImageIcon, Settings, Github, Grid2X2, Box } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import SettingsModal from './components/SettingsModal';
import ModesMenu from './components/ModesMenu';
import { AppSettings, AiSpeed, BsdCharacter, Message, MessageRole, AppMode } from './types';
import { streamChatResponse } from './services/geminiService';

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
    character: BsdCharacter.NONE
  });

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
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden selection:bg-stellar/30 selection:text-white">
      {/* Sidebar / Nav (Mobile: Bottom, Desktop: Left) */}
      <nav className="hidden md:flex flex-col w-20 bg-gray-900 border-r border-gray-800 items-center py-6 gap-6 z-20 shadow-2xl">
        <div className="mb-4 hover:scale-110 transition-transform duration-300 cursor-default">
          <StellarLogo />
        </div>
        
        <button
          onClick={() => setActiveTab('chat')}
          className={`p-3 rounded-xl transition-all relative group ${activeTab === 'chat' ? 'bg-gray-800 text-stellar shadow-lg shadow-stellar/10' : 'text-gray-500 hover:text-gray-300'}`}
          title="Chat"
        >
          <MessageSquare size={24} />
          {activeTab === 'chat' && <div className="absolute inset-y-2 left-0 w-1 bg-stellar rounded-r-full" />}
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`p-3 rounded-xl transition-all relative group ${activeTab === 'image' ? 'bg-gray-800 text-stellar shadow-lg shadow-stellar/10' : 'text-gray-500 hover:text-gray-300'}`}
          title="Image Generator"
        >
          <ImageIcon size={24} />
          {activeTab === 'image' && <div className="absolute inset-y-2 left-0 w-1 bg-stellar rounded-r-full" />}
        </button>

        <div className="w-8 h-[1px] bg-gray-800 my-2" />

        <button
          onClick={() => setIsModesMenuOpen(true)}
          className={`p-3 rounded-xl transition-all text-gray-500 hover:text-white hover:bg-gray-800 group relative`}
          title="Modes & Personas"
        >
          <Grid2X2 size={24} />
          <span className="absolute left-16 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-gray-700">
            Modes & Characters
          </span>
        </button>

        <div className="mt-auto flex flex-col gap-4">
           <a href="https://github.com" target="_blank" rel="noreferrer" className="p-3 text-gray-500 hover:text-white transition">
              <Github size={24} />
           </a>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 text-gray-500 hover:text-white hover:rotate-90 transition duration-300"
            title="Performance Settings"
          >
            <Settings size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900/90 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 z-30">
         <div className="font-bold text-xl text-white flex items-center gap-3">
            <StellarLogo />
            <span className="tracking-tight">Stellar AI</span>
         </div>
         <div className="flex gap-2">
           <button onClick={() => setIsModesMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
              <Grid2X2 size={22} />
           </button>
           <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-white">
              <Settings size={22} />
           </button>
         </div>
      </div>
      
      {/* Mobile Tab Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t border-gray-800 flex items-center justify-around z-30">
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-stellar' : 'text-gray-500'}`}>
          <MessageSquare size={20} />
          <span className="text-[10px]">Chat</span>
        </button>
        <button onClick={() => setActiveTab('image')} className={`flex flex-col items-center gap-1 ${activeTab === 'image' ? 'text-stellar' : 'text-gray-500'}`}>
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