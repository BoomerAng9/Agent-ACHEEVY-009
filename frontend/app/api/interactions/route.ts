/**
 * Discord Interactions Endpoint
 *
 * Handles ALL incoming Discord interactions (slash commands, buttons, etc.)
 * Endpoint URL configured in Discord Developer Portal:
 *   Interactions Endpoint URL: https://plugmein.cloud/api/interactions
 *
 * Discord sends a POST here whenever a user runs a slash command.
 * We verify the signature, then route to the appropriate handler.
 */

import { NextResponse } from 'next/server';
import { verifyKey } from 'discord-interactions';
import { handleInteraction, InteractionType, InteractionResponseType } from '@/lib/discord/handlers';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('X-Signature-Ed25519');
    const timestamp = req.headers.get('X-Signature-Timestamp');
    const body = await req.text();

    if (!signature || !timestamp || !process.env.DISCORD_PUBLIC_KEY) {
      return new NextResponse('Bad Request Signature', { status: 401 });
    }

    // Verify the request is genuinely from Discord
    const isValidRequest = verifyKey(
      body,
      signature,
      timestamp,
      process.env.DISCORD_PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.warn('[Discord] Invalid signature — rejecting request');
      return new NextResponse('Bad Request Signature', { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Handle PING (Type 1) — Required for Discord endpoint verification
    if (interaction.type === InteractionType.PING) {
      console.log('[Discord] PING received — responding with PONG');
      return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    // Route ALL commands through the full handler system
    const response = await handleInteraction(interaction);
    return NextResponse.json(response);
  } catch (error) {
    console.error('[Discord] Interaction error:', error);
    return NextResponse.json(
      {
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
          content: '⚠️ Something went wrong processing your command. Please try again.',
          flags: 64, // EPHEMERAL
        },
      },
      { status: 200 } // Discord expects 200 even for errors
    );
  }
}

// GET returns bot info for health checks
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'A.I.M.S. Discord Interactions',
    commands: ['/acheevy', '/perform', '/research', '/goals', '/usage', '/deploy', '/aims'],
  });
}
