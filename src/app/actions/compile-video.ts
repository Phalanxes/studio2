'use server';
import { compileStoryboardVideo } from '@/ai/flows/compile-storyboard-video';
import type { Scene } from '@/lib/types';

export async function compileVideoAction(scenes: Scene[]) {
  try {
    const result = await compileStoryboardVideo({ scenes });
    return { success: true, videoDataUri: result.videoDataUri };
  } catch (error: any) {
    console.error('Video compilation failed:', error);
    return { success: false, error: error.message };
  }
}
