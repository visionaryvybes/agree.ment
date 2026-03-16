import { google } from '@ai-sdk/google'
import { generateObject, generateText, streamText } from 'ai'

// Single source of truth — import MODEL everywhere
export const MODEL = google('gemini-3.1-pro-preview')

// Re-export for convenience
export { generateObject, generateText, streamText }
