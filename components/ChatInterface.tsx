import React, { useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Cpu, Swords, Code, Film } from 'lucide-react';
import { Message, MessageRole, AppSettings, BsdCharacter, AppMode } from '../types';
import ChessBoard from './ChessBoard';
import { THEME_COLORS } from '../constants';

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  settings: AppSettings;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  settings
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const theme = THEME_COLORS[settings.theme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const getPlaceholder = () => {
    if (settings.mode === AppMode.CHESS) return "Your move (e.g., e4, Nf3)...";
    if (settings.mode === AppMode.CODING) return "Ask for code or architectural advice...";
    if (settings.mode === AppMode.SCRIPT_WRITER) return "Describe a scene or dialogue...";
    return "Message Stellar AI...";
  };

  // Helper to process text and extract FEN
  const processMessageContent = (text: string) => {
    const fenRegex = /\[\[FEN: (.*?)\]\]/;
    const match = text.match(fenRegex);
    let content = text;
    let fen: string | null = null;

    if (match) {
      fen = match[1];
      content = text.replace(fenRegex, '').trim();
    }

    return { content, fen };
  };

  const renderEmptyStateIcon = () => {
    switch (settings.mode) {
      case AppMode.CHESS:
        return <Swords size={48} style={{ color: theme.accent }} />;
      case AppMode.CODING:
        return <Code size={48} style={{ color: theme.accent }} />;
      case AppMode.SCRIPT_WRITER:
        return <Film size={48} style={{ color: theme.accent }} />;
      default:
        return <Cpu size={48} style={{ color: theme.accent }} />;
    }
  };

  return (
    <div className="flex flex-col h-full relative transition-colors duration-300" style={{ backgroundColor: theme.bg }}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60" style={{ color: theme.textSec }}>
            <div className="p-6 rounded-full mb-6 animate-pulse-slow relative group" style={{ backgroundColor: theme.card }}>
               {renderEmptyStateIcon()}
               <div className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500" style={{ backgroundColor: theme.accent }}></div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Stellar AI Online</h2>
            <p className="max-w-md mx-auto">
              {settings.mode === AppMode.CHESS ? "Chess Engine initialized. I'll play black unless you ask otherwise." : 
               settings.mode === AppMode.CODING ? "Coding Mode active. Ready to engineer solutions." :
               settings.mode === AppMode.SCRIPT_WRITER ? "Screenwriter Mode active. Ready to draft." :
               "Select a persona or start typing to begin."}
            </p>
            
            <div className="flex gap-2 mt-4 justify-center flex-wrap">
              {settings.character !== BsdCharacter.NONE && (
                <span className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: `${theme.accent}20`, borderColor: `${theme.accent}40`, color: theme.accent }}>
                  {settings.character}
                </span>
              )}
              {settings.mode !== AppMode.CHAT && (
                <span className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm"
                      style={{ backgroundColor: `${theme.accent}20`, borderColor: `${theme.accent}40`, color: theme.accent }}>
                  {settings.mode.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const { content, fen } = processMessageContent(msg.text);
          
          return (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex max-w-[90%] sm:max-w-[80%] gap-3 ${msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border"
                  style={{ 
                    backgroundColor: msg.role === MessageRole.USER ? theme.card : theme.accent,
                    borderColor: theme.border,
                    color: msg.role === MessageRole.USER ? theme.text : '#fff'
                  }}
                >
                  {msg.role === MessageRole.USER ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-2">
                    {content && (
                      <div
                        className={`p-3 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed shadow-md ${
                          msg.role === MessageRole.USER
                            ? 'rounded-tr-none'
                            : 'rounded-tl-none border'
                        }`}
                        style={{
                          backgroundColor: msg.role === MessageRole.USER ? theme.userBubble : theme.botBubble,
                          color: theme.text,
                          borderColor: theme.border
                        }}
                      >
                        <div className={`prose ${theme.prose} prose-p:my-1 prose-pre:p-3 prose-pre:rounded-lg prose-pre:border max-w-none`}>
                          <ReactMarkdown 
                            components={{
                              code: ({node, className, children, ...props}) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const isInline = !match && !String(children).includes('\n');
                                  return isInline ? (
                                      <code className="px-1 py-0.5 rounded font-mono text-xs sm:text-sm border" style={{ backgroundColor: `${theme.bg}AA`, borderColor: theme.border, color: theme.accent }} {...props}>
                                          {children}
                                      </code>
                                  ) : (
                                      <code className={className} {...props}>
                                          {children}
                                      </code>
                                  );
                              }
                            }}
                          >
                              {content}
                          </ReactMarkdown>
                        </div>
                        {msg.role === MessageRole.MODEL && isLoading && msg.id === messages[messages.length - 1].id && content.length === 0 && (
                          <span className="inline-block w-2 h-4 animate-pulse ml-1" style={{ backgroundColor: theme.accent }}/>
                        )}
                      </div>
                    )}
                    
                    {/* Chess Board Rendering */}
                    {fen && <ChessBoard fen={fen} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 backdrop-blur border-t" style={{ borderColor: theme.border, backgroundColor: `${theme.bg}CC` }}>
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 rounded-xl border transition-colors shadow-lg"
             style={{ backgroundColor: theme.inputBg, borderColor: theme.border }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="flex-1 bg-transparent p-3 focus:outline-none resize-none max-h-32 min-h-[48px]"
            style={{ color: theme.text }}
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-lg text-white transition-all flex-shrink-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: theme.accent }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <div className="text-center mt-2 text-[10px] uppercase tracking-widest font-medium" style={{ color: theme.textSec }}>
          {settings.mode.replace('_', ' ')} • {settings.nsfwEnabled ? 'UNRESTRICTED' : 'SECURE'} • {settings.character !== BsdCharacter.NONE ? settings.character : 'STANDARD'}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;