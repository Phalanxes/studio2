'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating audio from text using a specified voice persona.
 *
 * - generateTtsAudio - The main function that initiates the flow.
 * - GenerateTtsAudioInput - The input type for the function.
 * - GenerateTtsAudioOutput - The output type for the function.
 */
import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';
import wav from 'wav';

const GenerateTtsAudioInputSchema = z.object({
  scriptText: z.string().describe('The text to be converted to speech.'),
  voiceName: z
    .string()
    .describe('The name of the prebuilt voice to use (e.g., Algenib).'),
});
export type GenerateTtsAudioInput = z.infer<typeof GenerateTtsAudioInputSchema>;

const GenerateTtsAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});

export type GenerateTtsAudioOutput = z.infer<
  typeof GenerateTtsAudioOutputSchema
>;

export async function generateTtsAudio(
  input: GenerateTtsAudioInput
): Promise<GenerateTtsAudioOutput> {
  return generateTtsAudioFlow(input);
}

const generateTtsAudioFlow = ai.defineFlow(
  {
    name: 'generateTtsAudioFlow',
    inputSchema: GenerateTtsAudioInputSchema,
    outputSchema: GenerateTtsAudioOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: input.voiceName},
          },
        },
      },
      prompt: input.scriptText,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
