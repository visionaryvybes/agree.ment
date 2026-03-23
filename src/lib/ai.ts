import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Single source of truth — import MODEL everywhere
export const MODEL = google('gemini-3.1-pro-preview'); // Using the high-fidelity 3.1 Pro Preview as requested.

// Re-export for convenience
export { generateObject, generateText, streamText, google };
