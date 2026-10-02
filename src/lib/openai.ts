import 'server-only';
import OpenAI from 'openai';

// Groq exposes an OpenAI-compatible API, so the OpenAI SDK works with a different base URL.
export const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export function getGroq() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}
