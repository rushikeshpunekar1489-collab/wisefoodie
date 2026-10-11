import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient() {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in .env.local');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

export function getModel(modelName?: string) {
  const client = getGeminiClient();
  return client.getGenerativeModel({
    model: modelName || process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  });
}
