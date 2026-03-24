import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, generateText, streamText } from 'ai';

// External engine configuration
const provider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Primary engine for agreement processing and visual checks
export const ENGINE = provider('gemini-1.5-pro'); 

export { generateObject, generateText, streamText, provider as engineProvider };
