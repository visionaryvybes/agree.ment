import { google } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';

// Primary model for all AI features
export const MODEL = google('gemini-1.5-pro');

// Re-export google provider (for google.tools.googleSearch etc.)
export { google };

// Re-export AI SDK utilities
export { generateObject, generateText, streamText };
