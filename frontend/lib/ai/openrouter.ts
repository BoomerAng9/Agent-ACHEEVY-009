/**
 * OpenRouter AI Client
 *
 * Uses the Vercel AI SDK with OpenRouter as the unified model gateway.
 * Supports Claude, GPT-4, Gemini, Kimi, and other models.
 */

import { createOpenAI } from '@ai-sdk/openai';
import { streamText, generateText, generateObject } from 'ai';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// OpenRouter Configuration
// ─────────────────────────────────────────────────────────────

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://aims.app',
    'X-Title': 'A.I.M.S. AI Managed Solutions',
  },
});

// ─────────────────────────────────────────────────────────────
// Model Registry
// ─────────────────────────────────────────────────────────────

export const MODELS = {
  // Claude Models
  'claude-opus-4': 'anthropic/claude-opus-4',
  'claude-sonnet-4': 'anthropic/claude-sonnet-4',
  'claude-haiku': 'anthropic/claude-3.5-haiku',

  // GPT Models
  'gpt-4o': 'openai/gpt-4o',
  'gpt-4-turbo': 'openai/gpt-4-turbo',
  'gpt-4o-mini': 'openai/gpt-4o-mini',

  // Gemini Models
  'gemini-2-flash': 'google/gemini-2.0-flash-thinking-exp',
  'gemini-pro': 'google/gemini-pro-1.5',

  // Kimi (Moonshot)
  'kimi-k2': 'moonshot/moonshot-v1-128k',

  // Open Source
  'llama-3.1-70b': 'meta-llama/llama-3.1-70b-instruct',
  'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct',
  'deepseek-v3': 'deepseek/deepseek-chat',

  // Specialized
  'codestral': 'mistralai/codestral-latest',
  'perplexity-online': 'perplexity/llama-3.1-sonar-huge-128k-online',
} as const;

export type ModelId = keyof typeof MODELS;

// ─────────────────────────────────────────────────────────────
// Use Case Model Selection
// ─────────────────────────────────────────────────────────────

export const MODEL_FOR_USE_CASE = {
  // Default conversational
  default: MODELS['claude-opus-4'],

  // Fast responses
  fast: MODELS['gemini-2-flash'],

  // Vision / Image Analysis
  vision: MODELS['claude-opus-4'],

  // Code generation
  code: MODELS['claude-opus-4'],

  // Research / Search
  research: MODELS['perplexity-online'],

  // Long context
  longContext: MODELS['kimi-k2'],

  // Cost-effective
  budget: MODELS['gpt-4o-mini'],
} as const;

// ─────────────────────────────────────────────────────────────
// Streaming Chat
// ─────────────────────────────────────────────────────────────

export interface StreamChatOptions {
  model?: ModelId | string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  onToken?: (token: string) => void;
  onComplete?: (text: string) => void;
  signal?: AbortSignal;
}

export async function streamChat(options: StreamChatOptions) {
  const {
    model = 'claude-opus-4',
    messages,
    systemPrompt,
    temperature = 0.7,
    maxTokens = 4096,
    signal,
  } = options;

  const modelId = MODELS[model as ModelId] || model;

  const result = await streamText({
    model: openrouter(modelId) as any,
    messages: systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages,
    temperature,
    maxTokens,
    abortSignal: signal,
  });

  return result;
}

// ─────────────────────────────────────────────────────────────
// Generate Text (Non-streaming)
// ─────────────────────────────────────────────────────────────

export interface GenerateOptions {
  model?: ModelId | string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generate(options: GenerateOptions) {
  const {
    model = 'claude-opus-4',
    prompt,
    systemPrompt,
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const modelId = MODELS[model as ModelId] || model;

  const result = await generateText({
    model: openrouter(modelId) as any,
    prompt,
    system: systemPrompt,
    temperature,
    maxTokens,
  });

  return result.text;
}

// ─────────────────────────────────────────────────────────────
// Structured Output (with Zod schema)
// ─────────────────────────────────────────────────────────────

export async function generateStructured<T>(
  options: GenerateOptions & { schema: z.ZodSchema<T> }
): Promise<T> {
  const {
    model = 'claude-opus-4',
    prompt,
    systemPrompt,
    schema,
    temperature = 0.3,
    maxTokens = 4096,
  } = options;

  const modelId = MODELS[model as ModelId] || model;

  const result = await generateObject({
    model: openrouter(modelId) as any,
    prompt,
    system: systemPrompt,
    schema,
    temperature,
    maxTokens,
  });

  return result.object;
}

// ─────────────────────────────────────────────────────────────
// Vision / Image Analysis
// ─────────────────────────────────────────────────────────────

export interface VisionOptions {
  model?: ModelId | string;
  images: Array<{ url: string } | { base64: string; mimeType: string }>;
  prompt: string;
  systemPrompt?: string;
}

export async function analyzeImage(options: VisionOptions) {
  const {
    model = 'claude-opus-4',
    images,
    prompt,
    systemPrompt,
  } = options;

  const modelId = MODELS[model as ModelId] || model;

  // Build message content with images
  const imageContent = images.map(img => {
    if ('url' in img) {
      return { type: 'image' as const, image: img.url };
    }
    return {
      type: 'image' as const,
      image: `data:${img.mimeType};base64,${img.base64}`,
    };
  });

  const result = await generateText({
    model: openrouter(modelId) as any,
    messages: [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      {
        role: 'user' as const,
        content: [
          ...imageContent,
          { type: 'text' as const, text: prompt },
        ],
      },
    ],
  });

  return result.text;
}

// ─────────────────────────────────────────────────────────────
// Token Counting (Estimate)
// ─────────────────────────────────────────────────────────────

export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// ─────────────────────────────────────────────────────────────
// Model Cost Estimation
// ─────────────────────────────────────────────────────────────

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'anthropic/claude-opus-4': { input: 0.015, output: 0.075 },
  'anthropic/claude-sonnet-4': { input: 0.003, output: 0.015 },
  'anthropic/claude-3.5-haiku': { input: 0.0008, output: 0.004 },
  'openai/gpt-4o': { input: 0.005, output: 0.015 },
  'openai/gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'google/gemini-2.0-flash-thinking-exp': { input: 0.0, output: 0.0 }, // Free during preview
  'google/gemini-pro-1.5': { input: 0.00125, output: 0.005 },
};

export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model] || { input: 0.01, output: 0.03 };
  return (
    (inputTokens / 1000) * costs.input +
    (outputTokens / 1000) * costs.output
  );
}

export default {
  streamChat,
  generate,
  generateStructured,
  analyzeImage,
  estimateTokens,
  estimateCost,
  MODELS,
  MODEL_FOR_USE_CASE,
};
