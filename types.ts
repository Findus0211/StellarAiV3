export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
  isError?: boolean;
  images?: string[];
  fen?: string; // Chess board state
}

export enum AiSpeed {
  DEEP_THINKING = 'DEEP_THINKING',
  NORMAL = 'NORMAL',
  FAST = 'FAST',
  VERY_FAST = 'VERY_FAST',
  EXTREMELY_FAST = 'EXTREMELY_FAST'
}

export enum BsdCharacter {
  NONE = 'NONE',
  DAZAI = 'DAZAI',
  CHUUYA = 'CHUUYA',
  ATSUSHI = 'ATSUSHI',
  AKUTAGAWA = 'AKUTAGAWA',
  RANPO = 'RANPO',
  FYODOR = 'FYODOR',
  NIKOLAI = 'NIKOLAI',
  KUNIKIDA = 'KUNIKIDA',
  YOSANO = 'YOSANO',
  POE = 'POE'
}

export enum AppMode {
  CHAT = 'CHAT',
  CHESS = 'CHESS',
  CODING = 'CODING',
  SCRIPT_WRITER = 'SCRIPT_WRITER'
}

export enum AppTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  LILA = 'LILA'
}

export interface AppSettings {
  speed: AiSpeed;
  nsfwEnabled: boolean;
  mode: AppMode;
  character: BsdCharacter;
  theme: AppTheme;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  id: string;
}