'use server';
/**
 * @fileOverview A flow to compile a storyboard into a single video.
 *
 * - compileStoryboardVideo - A function that handles the video compilation process.
 * - CompileVideoInput - The input type for the function.
 * - CompileVideoOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Scene } from '@/lib/types';

const CompileVideoInputSchema = z.object({
  scenes: z.array(z.any()),
});
export type CompileVideoInput = z.infer<typeof CompileVideoInputSchema>;

const CompileVideoOutputSchema = z.object({
  videoDataUri: z.string().describe('The compiled video as a data URI.'),
});
export type CompileVideoOutput = z.infer<typeof CompileVideoOutputSchema>;

export async function compileStoryboardVideo(
  input: CompileVideoInput
): Promise<CompileVideoOutput> {
  return compileStoryboardVideoFlow(input);
}

const compileStoryboardVideoFlow = ai.defineFlow(
  {
    name: 'compileStoryboardVideoFlow',
    inputSchema: CompileVideoInputSchema,
    outputSchema: CompileVideoOutputSchema,
  },
  async ({ scenes }) => {
    const totalDuration = scenes.reduce(
      (acc: number, scene: Scene) => acc + scene.duration,
      0
    );

    const fullScript = scenes
      .map((scene: Scene) => scene.audio.scriptText)
      .join(' ');

    const prompt = `Generate a video illustrating the following story: "${fullScript}"`;

    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: prompt,
      config: {
        durationSeconds: Math.min(totalDuration, 59),
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const fetch = (await import('node-fetch')).default;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is required to download the video');
    }

    const videoDownloadResponse = await fetch(
      `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      throw new Error('Failed to fetch video');
    }

    const arrayBuffer = await videoDownloadResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Video = buffer.toString('base64');
    const videoDataUri = `data:video/mp4;base64,${base64Video}`;

    return {
      videoDataUri,
    };
  }
);
