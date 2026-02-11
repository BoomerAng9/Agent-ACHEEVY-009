/**
 * Discord Slash Commands — Registration & Definitions
 *
 * All ACHEEVY bot commands for the A.I.M.S. Discord integration.
 * Run this script once to register commands with Discord:
 *   npx ts-node lib/discord/register-commands.ts
 */

export interface SlashCommand {
  name: string;
  description: string;
  type?: number; // 1 = CHAT_INPUT (default)
  options?: CommandOption[];
}

export interface CommandOption {
  name: string;
  description: string;
  type: number; // 3 = STRING, 4 = INTEGER, 5 = BOOLEAN, 6 = USER, 10 = NUMBER
  required?: boolean;
  choices?: { name: string; value: string }[];
}

// ─────────────────────────────────────────────────────────────
// Command Definitions
// ─────────────────────────────────────────────────────────────

export const DISCORD_COMMANDS: SlashCommand[] = [
  // ── ACHEEVY AI Commands ────────────────────────────────
  {
    name: 'acheevy',
    description: '🤖 Ask ACHEEVY anything — your AI orchestrator',
    options: [
      {
        name: 'prompt',
        description: 'What do you want ACHEEVY to do?',
        type: 3,
        required: true,
      },
      {
        name: 'model',
        description: 'Choose the AI model',
        type: 3,
        required: false,
        choices: [
          { name: 'Claude Opus 4.6', value: 'claude-opus' },
          { name: 'Claude Sonnet 4.6', value: 'claude-sonnet' },
          { name: 'Gemini 2.5 Pro', value: 'gemini-pro' },
          { name: 'Qwen 2.5 Coder', value: 'qwen' },
        ],
      },
    ],
  },

  // ── Per|Form Platform ──────────────────────────────────
  {
    name: 'perform',
    description: '🏈 Per|Form — Rank, grade and track athletes',
    options: [
      {
        name: 'action',
        description: 'What do you want to do?',
        type: 3,
        required: true,
        choices: [
          { name: '📊 View Rankings', value: 'rankings' },
          { name: '🎯 Grade Athlete', value: 'grade' },
          { name: '📈 Track Progress', value: 'track' },
          { name: '🔍 Scout Report', value: 'scout' },
          { name: '📋 Combine Data', value: 'combine' },
        ],
      },
      {
        name: 'athlete',
        description: 'Athlete name or ID',
        type: 3,
        required: false,
      },
      {
        name: 'position',
        description: 'Position filter',
        type: 3,
        required: false,
        choices: [
          { name: 'Quarterback', value: 'QB' },
          { name: 'Running Back', value: 'RB' },
          { name: 'Wide Receiver', value: 'WR' },
          { name: 'Tight End', value: 'TE' },
          { name: 'Offensive Line', value: 'OL' },
          { name: 'Defensive Line', value: 'DL' },
          { name: 'Linebacker', value: 'LB' },
          { name: 'Cornerback', value: 'CB' },
          { name: 'Safety', value: 'S' },
        ],
      },
    ],
  },

  // ── Research ────────────────────────────────────────────
  {
    name: 'research',
    description: '🔬 Deep research on any topic via Research_Ang',
    options: [
      {
        name: 'query',
        description: 'What do you want researched?',
        type: 3,
        required: true,
      },
      {
        name: 'depth',
        description: 'Research depth',
        type: 3,
        required: false,
        choices: [
          { name: 'Quick (30 seconds)', value: 'quick' },
          { name: 'Standard (2 minutes)', value: 'standard' },
          { name: 'Deep (5+ minutes)', value: 'deep' },
        ],
      },
    ],
  },

  // ── Community Commands ─────────────────────────────────
  {
    name: 'goals',
    description: '🎯 Set and track community goals',
    options: [
      {
        name: 'action',
        description: 'What do you want to do?',
        type: 3,
        required: true,
        choices: [
          { name: '➕ Set New Goal', value: 'set' },
          { name: '📋 View My Goals', value: 'view' },
          { name: '✅ Complete Goal', value: 'complete' },
          { name: '🏆 Leaderboard', value: 'leaderboard' },
        ],
      },
      {
        name: 'goal',
        description: 'Goal description or ID',
        type: 3,
        required: false,
      },
    ],
  },

  // ── Usage / LUC ────────────────────────────────────────
  {
    name: 'usage',
    description: '📊 Check your A.I.M.S. usage and credits',
  },

  // ── Deploy Dock ────────────────────────────────────────
  {
    name: 'deploy',
    description: '🚀 Deploy Dock — Launch and manage Boomer_Ang agents',
    options: [
      {
        name: 'action',
        description: 'Deployment action',
        type: 3,
        required: true,
        choices: [
          { name: '📋 Status', value: 'status' },
          { name: '🐣 Hatch Agents', value: 'hatch' },
          { name: '🚀 Launch', value: 'launch' },
          { name: '📊 Roster', value: 'roster' },
        ],
      },
    ],
  },

  // ── Help ────────────────────────────────────────────────
  {
    name: 'aims',
    description: '📖 A.I.M.S. help — See all available features',
  },
];

// ─────────────────────────────────────────────────────────────
// Registration Script
// ─────────────────────────────────────────────────────────────

const DISCORD_API_BASE = 'https://discord.com/api/v10';

/**
 * Register all slash commands with Discord (global commands)
 */
export async function registerGlobalCommands(
  applicationId: string,
  botToken: string
): Promise<void> {
  const url = `${DISCORD_API_BASE}/applications/${applicationId}/commands`;

  console.log(`[Discord] Registering ${DISCORD_COMMANDS.length} global commands...`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(DISCORD_COMMANDS),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('[Discord] Failed to register commands:', error);
    throw new Error(`Command registration failed: ${response.status}`);
  }

  const registered = await response.json();
  console.log(`[Discord] ✅ Successfully registered ${registered.length} commands`);
  registered.forEach((cmd: any) => {
    console.log(`  → /${cmd.name}: ${cmd.description}`);
  });
}

/**
 * Register commands for a specific guild (instant, for testing)
 */
export async function registerGuildCommands(
  applicationId: string,
  guildId: string,
  botToken: string
): Promise<void> {
  const url = `${DISCORD_API_BASE}/applications/${applicationId}/guilds/${guildId}/commands`;

  console.log(`[Discord] Registering ${DISCORD_COMMANDS.length} guild commands for ${guildId}...`);

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(DISCORD_COMMANDS),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('[Discord] Failed to register guild commands:', error);
    throw new Error(`Guild command registration failed: ${response.status}`);
  }

  const registered = await response.json();
  console.log(`[Discord] ✅ Registered ${registered.length} commands for guild ${guildId}`);
}
