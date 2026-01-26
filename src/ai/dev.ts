import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-voice-personas-for-tts.ts';
import '@/ai/flows/generate-ai-video-from-prompt.ts';
import '@/ai/flows/generate-tts-audio.ts';
import '@/ai/flows/compile-storyboard-video.ts';
