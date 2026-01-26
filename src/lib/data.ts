import type { Scene, StockVideo, VoicePersona } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const voicePersonas: VoicePersona[] = [
  {
    id: 'male-deep',
    name: 'Male - Deep',
    description: 'A deep, authoritative male voice.',
    gender: 'Male',
  },
  {
    id: 'female-energetic',
    name: 'Female - Energetic',
    description: 'An upbeat and energetic female voice.',
    gender: 'Female',
  },
  {
    id: 'male-narrator',
    name: 'Male - Narrator',
    description: 'A calm and steady male narrator voice.',
    gender: 'Male',
  },
  {
    id: 'female-soft',
    name: 'Female - Soft',
    description: 'A soft and gentle female voice.',
    gender: 'Female',
  },
  {
    id: 'neutral-robot',
    name: 'Neutral - Robotic',
    description: 'A neutral, robotic voice.',
    gender: 'Neutral',
  },
];

const stockVideoUrls = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAnAdventure.mp4',
];

export const stockVideos: StockVideo[] = PlaceHolderImages.map(
  (img, index) => ({
    id: img.id,
    description: img.description,
    url: stockVideoUrls[index % stockVideoUrls.length],
    thumbnailUrl: img.imageUrl,
    imageHint: img.imageHint,
  })
);

export const initialScenes: Scene[] = [
  {
    id: 'scene-1',
    orderIndex: 0,
    duration: 5,
    visual: {
      type: 'empty',
    },
    audio: {
      type: 'tts',
      scriptText: 'In a world of generative art, one tool stands out.',
      voiceId: 'male-narrator',
    },
  },
  {
    id: 'scene-2',
    orderIndex: 1,
    duration: 8,
    visual: {
      type: 'stock',
      url: stockVideos.length > 0 ? stockVideos[0].url : '',
      thumbnailUrl: stockVideos.length > 0 ? stockVideos[0].thumbnailUrl : '',
    },
    audio: {
      type: 'tts',
      scriptText:
        'Welcome to StoryFlow Studio, where your ideas come to life. Effortlessly create stunning videos with the power of AI.',
      voiceId: 'female-energetic',
    },
  },
];
