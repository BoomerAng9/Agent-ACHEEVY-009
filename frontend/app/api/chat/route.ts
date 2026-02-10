/**
 * Chat API Route — Vercel AI SDK + OpenRouter
 *
 * Streams AI responses via OpenRouter (supports Claude, GPT-4, Gemini, etc.)
 * Uses the Vercel AI SDK streamText for proper useChat() compatibility.
 */

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { ACHEEVY_SYSTEM_PROMPT } from '@/lib/acheevy/persona';

export const maxDuration = 60;

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://plugmein.cloud',
    'X-Title': 'A.I.M.S. AI Managed Solutions',
  },
});

const DEFAULT_MODEL = process.env.ACHEEVY_MODEL || 'anthropic/claude-sonnet-4-5';

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();

    const modelId = model || DEFAULT_MODEL;

    const result = await streamText({
      model: openrouter(modelId),
      system: ACHEEVY_SYSTEM_PROMPT,
      messages,
    });

    return result.toAIStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Chat API error';
    console.error('[ACHEEVY Chat]', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
