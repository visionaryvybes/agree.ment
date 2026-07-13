import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateObject, generateText, streamText } from 'ai';

/**
 * Provider-agnostic AI layer.
 * Works with any OpenAI-compatible API — DeepSeek, Qwen, Kimi, Groq,
 * OpenRouter, or OpenAI itself. Configure via env:
 *
 *   AI_BASE_URL  e.g. https://api.deepseek.com/v1
 *   AI_API_KEY   your key
 *   AI_MODEL     e.g. deepseek-chat
 */
const provider = createOpenAICompatible({
  name: 'agreemint-ai',
  baseURL: process.env.AI_BASE_URL ?? 'https://api.deepseek.com/v1',
  apiKey: process.env.AI_API_KEY,
});

export const MODEL = provider(process.env.AI_MODEL ?? 'deepseek-chat');

export { generateObject, generateText, streamText };
