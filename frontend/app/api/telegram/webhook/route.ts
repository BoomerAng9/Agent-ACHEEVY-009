/**
 * Telegram Webhook API — Entry point for ACHEEVY via Telegram
 *
 * POST /api/telegram/webhook
 * Receives Telegram Bot updates, routes messages through ACHEEVY intake.
 *
 * Setup:
 *   1. Set TELEGRAM_BOT_TOKEN in environment
 *   2. Register webhook: curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://plugmein.cloud/api/telegram/webhook"
 *   3. Messages flow: Telegram → this webhook → ACHEEVY chat → response → Telegram reply
 *
 * Required env: TELEGRAM_BOT_TOKEN
 * Safety: deny-by-default — only text messages processed, no code execution
 */

import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { buildSystemPrompt } from '@/lib/acheevy/persona';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || '',
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
});

const DEFAULT_MODEL = process.env.ACHEEVY_MODEL || process.env.OPENROUTER_MODEL || 'google/gemini-3.0-flash';

// ── Telegram API Types ──

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    text?: string;
    date: number;
  };
}

// ── Telegram API Helper ──

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });

    if (!res.ok) {
      console.error(`[Telegram] sendMessage failed: ${res.status}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Telegram] sendMessage error:', err);
    return false;
  }
}

async function sendTypingAction(chatId: number): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: 'typing',
      }),
    });
  } catch {
    // Non-critical, ignore
  }
}

// ── Webhook Handler ──

export async function POST(req: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'TELEGRAM_BOT_TOKEN not configured' },
      { status: 503 },
    );
  }

  try {
    const update: TelegramUpdate = await req.json();

    // Only handle text messages
    if (!update.message?.text) {
      return NextResponse.json({ ok: true });
    }

    const { text, chat, from } = update.message;
    const chatId = chat.id;
    const userName = from.first_name || from.username || 'User';

    // Built-in commands
    if (text === '/start') {
      await sendTelegramMessage(
        chatId,
        `Welcome to *A.I.M.S.* — AI Managed Solutions.\n\nI'm ACHEEVY, your AI executive orchestrator. Send me any message or command and I'll handle it.\n\n*Commands:*\n/start — Welcome\n/help — Help\n/status — System status\n/health — Service health\n\nOr just type naturally.\n\n_Activity Breeds Activity_`,
      );
      return NextResponse.json({ ok: true });
    }

    if (text === '/help') {
      await sendTelegramMessage(
        chatId,
        `*ACHEEVY Commands:*\n\n/start — Welcome message\n/help — This help text\n/status — System status & active services\n/health — Health check all services\n\n*Or send any message:*\n• Ask questions → AI-powered answers\n• Give instructions → Routes to agents\n• Request tasks → Dispatches to Chicken Hawk\n\nAll messages flow through ACHEEVY orchestration.`,
      );
      return NextResponse.json({ ok: true });
    }

    // /status — Query UEF gateway for system status
    if (text === '/status') {
      await sendTypingAction(chatId);
      try {
        const uefUrl = process.env.UEF_GATEWAY_URL || process.env.NEXT_PUBLIC_UEF_GATEWAY_URL || 'http://127.0.0.1:3001';
        const [gatewayRes, coreRes] = await Promise.allSettled([
          fetch(`${uefUrl}/health`, { signal: AbortSignal.timeout(5000) }),
          fetch(`${process.env.CHICKENHAWK_CORE_URL || 'http://127.0.0.1:4001'}/status`, { signal: AbortSignal.timeout(5000) }),
        ]);
        const gateway = gatewayRes.status === 'fulfilled' ? await gatewayRes.value.json() : null;
        const core = coreRes.status === 'fulfilled' ? await coreRes.value.json() : null;
        const lines = [
          '*A.I.M.S. System Status*\n',
          `UEF Gateway: ${gateway ? '🟢 Online' : '🔴 Offline'}`,
          gateway ? `  Uptime: ${Math.round(gateway.uptime)}s` : '',
          `\nChicken Hawk: ${core ? '🟢 Online' : '🔴 Offline'}`,
          core ? `  LLM: ${core.engine?.llm_provider || 'unknown'}` : '',
          core ? `  Adapters: ${core.engine?.registered_adapters?.length || 0}` : '',
          core ? `  Active manifests: ${Object.keys(core.engine?.active_manifests || {}).length}` : '',
        ].filter(Boolean);
        await sendTelegramMessage(chatId, lines.join('\n'));
      } catch {
        await sendTelegramMessage(chatId, '⚠️ Could not reach backend services.');
      }
      return NextResponse.json({ ok: true });
    }

    // /health — Quick health check of all services
    if (text === '/health') {
      await sendTypingAction(chatId);
      const services = [
        { name: 'UEF Gateway', url: process.env.UEF_GATEWAY_URL || 'http://127.0.0.1:3001' },
        { name: 'CH Core', url: process.env.CHICKENHAWK_CORE_URL || 'http://127.0.0.1:4001' },
        { name: 'CH Policy', url: process.env.CHICKENHAWK_POLICY_URL || 'http://127.0.0.1:4002' },
        { name: 'CH Audit', url: process.env.CHICKENHAWK_AUDIT_URL || 'http://127.0.0.1:4003' },
        { name: 'CH Voice', url: process.env.CHICKENHAWK_VOICE_URL || 'http://127.0.0.1:4004' },
      ];
      const results = await Promise.allSettled(
        services.map(s => fetch(`${s.url}/health`, { signal: AbortSignal.timeout(3000) }))
      );
      const lines = ['*Service Health*\n'];
      results.forEach((r, i) => {
        lines.push(`${r.status === 'fulfilled' && r.value.ok ? '🟢' : '🔴'} ${services[i].name}`);
      });
      await sendTelegramMessage(chatId, lines.join('\n'));
      return NextResponse.json({ ok: true });
    }

    // All other messages (including slash commands) → route through ACHEEVY LLM
    // Strip leading slash for natural language processing
    const userMessage = text.startsWith('/') ? text.slice(1) : text;

    // Show typing indicator
    await sendTypingAction(chatId);

    // Route through ACHEEVY chat (direct OpenRouter — no gateway needed for Telegram)
    const systemPrompt = buildSystemPrompt({
      additionalContext: `User "${userName}" is messaging via Telegram. Keep responses concise (under 4000 chars) and use Markdown formatting. If they ask about system status, services, or health — you can reference the /status and /health commands.`,
    });

    const result = await streamText({
      model: openrouter(DEFAULT_MODEL),
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    // Collect full response
    let fullResponse = '';
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    // Truncate for Telegram's 4096 char limit
    if (fullResponse.length > 4000) {
      fullResponse = fullResponse.slice(0, 3990) + '\n\n_(truncated)_';
    }

    // Send response back to Telegram
    await sendTelegramMessage(chatId, fullResponse || 'I couldn\'t generate a response. Please try again.');

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    console.error('[Telegram]', message);
    // Return 200 to prevent Telegram from retrying
    return NextResponse.json({ ok: true, error: message });
  }
}

// GET handler — for webhook verification
export async function GET() {
  return NextResponse.json({
    service: 'aims-telegram-webhook',
    status: TELEGRAM_BOT_TOKEN ? 'configured' : 'missing_token',
    required_env: 'TELEGRAM_BOT_TOKEN',
    setup_command: TELEGRAM_BOT_TOKEN
      ? 'Webhook ready. Register with: POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://plugmein.cloud/api/telegram/webhook'
      : 'Set TELEGRAM_BOT_TOKEN environment variable first.',
  });
}
