export interface Scene {
  id: string;
  orderIndex: number;
  duration: number; // in seconds
  visual: {
    type: 'stock' | 'upload' | 'generated' | 'empty';
    url?: string; // The video source
    prompt?: string; // If generated
    thumbnailUrl?: string;
  };
  audio: {
    type: 'tts';
    scriptText: string;
    voiceId: string;
  };
}

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  gender: 'Male' | 'Female' | 'Neutral';
}

export interface StockVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
  imageHint: string;
  description: string;
}
