import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export function hasGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim().length > 10 && !key.includes('placeholder'));
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim().length < 10) {
    return null;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey.trim());
    return genAI;
  } catch (err) {
    console.warn('Failed to initialize GoogleGenerativeAI client:', err);
    return null;
  }
}

export function getModel(modelName?: string) {
  const client = getGeminiClient();
  if (!client) return null;

  const targetModel = modelName || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return client.getGenerativeModel({
    model: targetModel,
  });
}
