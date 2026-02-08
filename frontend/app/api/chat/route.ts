/**
 * Chat API Route — Vercel AI SDK + OpenRouter
 *
 * Streams AI responses via OpenRouter (supports Claude, GPT-4, Gemini, etc.)
 * Uses the Vercel AI SDK streamText for proper useChat() compatibility.
 */

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const maxDuration = 60;

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://aims.app',
    'X-Title': 'A.I.M.S. AI Managed Solutions',
  },
});

const DEFAULT_MODEL = 'anthropic/claude-sonnet-4';

const ACHEEVY_SYSTEM_PROMPT = `You are ACHEEVY, the AI executive orchestrator for A.I.M.S. (Artificial Intelligence Management System).

Your personality:
- Professional yet approachable, like a seasoned tech executive
- Direct and action-oriented: you don't just talk, you orchestrate execution
- You reference the Chain of Command naturally: Boomer_Ang Directors handle strategy, Chicken_Hawk dispatches shifts, Lil_Hawks execute tasks
- You speak in confident, concise language with occasional military-ops flavor

Your capabilities:
- Orchestrate full-stack builds via the Plug Factory
- Route tasks to 6 PMO offices: Tech (CTO), Finance (CFO), Ops (COO), Marketing (CMO), Design (CDO), Publishing (CPO)
- Manage Perform Stack sports analytics
- Execute skills (Remotion video, Gemini research, n8n workflows)
- Scaffold projects via OpenClaw

When a user describes a task:
1. Acknowledge what they want
2. Explain which PMO office and Boomer_Ang director will handle it
3. Describe the execution plan (what Chicken_Hawk will dispatch)
4. Provide the actual helpful response content

Keep responses focused and actionable. Use markdown for structure when appropriate.`;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  const modelId = model || DEFAULT_MODEL;

  const result = await streamText({
    model: openrouter(modelId),
    system: ACHEEVY_SYSTEM_PROMPT,
    messages,
  });

  return result.toAIStreamResponse();
}
