'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting AI voice personas for text-to-speech (TTS) based on the input script text.
 *
 * The flow uses an LLM to analyze the script text and suggest appropriate voice personas.
 *
 * @remarks
 * - `suggestVoicePersonasForTTS`: The main function that initiates the flow.
 * - `SuggestVoicePersonasInput`: The input type for the function, containing the script text.
 * - `SuggestVoicePersonasOutput`: The output type, containing an array of suggested voice persona IDs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestVoicePersonasInputSchema = z.object({
  scriptText: z
    .string()
    .describe('The script text for which voice personas are to be suggested.'),
});

export type SuggestVoicePersonasInput = z.infer<
  typeof SuggestVoicePersonasInputSchema
>;

const SuggestVoicePersonasOutputSchema = z.object({
  suggestedVoiceIds: z
    .array(z.string())
    .describe('An array of suggested voice persona IDs.'),
});

export type SuggestVoicePersonasOutput = z.infer<
  typeof SuggestVoicePersonasOutputSchema
>;

export async function suggestVoicePersonasForTTS(
  input: SuggestVoicePersonasInput
): Promise<SuggestVoicePersonasOutput> {
  return suggestVoicePersonasForTTSFlow(input);
}

const suggestVoicePersonasPrompt = ai.definePrompt({
  name: 'suggestVoicePersonasPrompt',
  input: {schema: SuggestVoicePersonasInputSchema},
  output: {schema: SuggestVoicePersonasOutputSchema},
  prompt: `You are an AI voice persona suggestion expert. Given the following script text, suggest three appropriate voice persona IDs.

Script Text: {{{scriptText}}}

Return the voice persona IDs as a JSON array.  The voiceId should exist.

Example of acceptable voiceIds: Algenib, Achernar

{
  "suggestedVoiceIds": ["Algenib", "Achernar", "someOtherId"]
}
`,
});

const suggestVoicePersonasForTTSFlow = ai.defineFlow(
  {
    name: 'suggestVoicePersonasForTTSFlow',
    inputSchema: SuggestVoicePersonasInputSchema,
    outputSchema: SuggestVoicePersonasOutputSchema,
  },
  async input => {
    const {output} = await suggestVoicePersonasPrompt(input);
    return output!;
  }
);
