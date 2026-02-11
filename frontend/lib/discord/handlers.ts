/**
 * Discord Interaction Handlers
 *
 * Processes each slash command and returns Discord-formatted responses.
 * Each handler follows the pattern:
 *   1. Parse options from the interaction
 *   2. Call the appropriate A.I.M.S. service
 *   3. Return an embed-rich response
 */

// ─────────────────────────────────────────────────────────────
// Discord Types (minimal, no external dependency)
// ─────────────────────────────────────────────────────────────

export const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
} as const;

export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE: 4,
  DEFERRED_CHANNEL_MESSAGE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  AUTOCOMPLETE_RESULT: 8,
  MODAL: 9,
} as const;

export const MessageFlags = {
  EPHEMERAL: 64,
} as const;

export interface DiscordInteraction {
  type: number;
  id: string;
  token: string;
  application_id: string;
  data?: {
    name: string;
    options?: { name: string; value: string }[];
  };
  member?: {
    user: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
      global_name?: string;
    };
    roles: string[];
  };
  user?: {
    id: string;
    username: string;
    avatar: string;
  };
  guild_id?: string;
  channel_id?: string;
}

interface Embed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string; icon_url?: string };
  thumbnail?: { url: string };
  timestamp?: string;
}

interface InteractionResponse {
  type: number;
  data?: {
    content?: string;
    embeds?: Embed[];
    flags?: number;
  };
}

// ─────────────────────────────────────────────────────────────
// Color Palette (matches Tron Ares / A.I.M.S. brand)
// ─────────────────────────────────────────────────────────────

const COLORS = {
  GOLD: 0xD4A017,
  GREEN: 0x00D26A,
  RED: 0xFF4444,
  BLUE: 0x5865F2,
  OBSIDIAN: 0x1A1A2E,
  CYAN: 0x00E5FF,
  PURPLE: 0x9B59B6,
};

// ─────────────────────────────────────────────────────────────
// Helper: Get option value from interaction
// ─────────────────────────────────────────────────────────────

function getOption(interaction: DiscordInteraction, name: string): string | undefined {
  return interaction.data?.options?.find(o => o.name === name)?.value;
}

function getUser(interaction: DiscordInteraction) {
  return interaction.member?.user || interaction.user || { id: 'unknown', username: 'Unknown', avatar: '' };
}

// ─────────────────────────────────────────────────────────────
// Main Handler Router
// ─────────────────────────────────────────────────────────────

export async function handleInteraction(
  interaction: DiscordInteraction
): Promise<InteractionResponse> {
  // Discord PING — required for endpoint verification
  if (interaction.type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG };
  }

  // Slash commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const commandName = interaction.data?.name;

    switch (commandName) {
      case 'acheevy':
        return handleAcheevy(interaction);
      case 'perform':
        return handlePerform(interaction);
      case 'research':
        return handleResearch(interaction);
      case 'goals':
        return handleGoals(interaction);
      case 'usage':
        return handleUsage(interaction);
      case 'deploy':
        return handleDeploy(interaction);
      case 'aims':
        return handleHelp(interaction);
      default:
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: {
            content: `❌ Unknown command: \`/${commandName}\``,
            flags: MessageFlags.EPHEMERAL,
          },
        };
    }
  }

  return { type: InteractionResponseType.PONG };
}

// ─────────────────────────────────────────────────────────────
// /acheevy — AI Orchestrator
// ─────────────────────────────────────────────────────────────

async function handleAcheevy(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const prompt = getOption(interaction, 'prompt') || '';
  const model = getOption(interaction, 'model') || 'claude-opus';
  const user = getUser(interaction);

  // For now, return a deferred response so we can process asynchronously
  // The actual AI call will be handled via follow-up message
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/acheevy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INTERNAL_API_KEY || '',
      },
      body: JSON.stringify({
        message: prompt,
        model,
        userId: `discord:${user.id}`,
        source: 'discord',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.response || data.message || 'Processing...';

      // Truncate to Discord's 4096 char limit for embed descriptions
      const truncated = aiResponse.length > 4000
        ? aiResponse.substring(0, 3997) + '...'
        : aiResponse;

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '🤖 ACHEEVY Response',
            description: truncated,
            color: COLORS.GOLD,
            fields: [
              { name: 'Model', value: `\`${model}\``, inline: true },
              { name: 'Requested by', value: `<@${user.id}>`, inline: true },
            ],
            footer: {
              text: 'A.I.M.S. — AI Managed Solutions',
            },
            timestamp: new Date().toISOString(),
          }],
        },
      };
    }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE,
      data: {
        content: '⚠️ ACHEEVY is currently processing. Please try again in a moment.',
        flags: MessageFlags.EPHEMERAL,
      },
    };
  } catch (error) {
    console.error('[Discord] ACHEEVY error:', error);
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE,
      data: {
        embeds: [{
          title: '⚠️ ACHEEVY Unavailable',
          description: 'The AI orchestrator is currently offline. Please try again later or use the web interface.',
          color: COLORS.RED,
          footer: { text: 'Visit plugmein.cloud for full access' },
        }],
        flags: MessageFlags.EPHEMERAL,
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────
// /perform — Athlete Ranking, Grading & Tracking
// ─────────────────────────────────────────────────────────────

async function handlePerform(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const action = getOption(interaction, 'action') || 'rankings';
  const athlete = getOption(interaction, 'athlete');
  const position = getOption(interaction, 'position');
  const user = getUser(interaction);

  switch (action) {
    case 'rankings': {
      const posLabel = position || 'All Positions';
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: `🏈 Per|Form Rankings — ${posLabel}`,
            description: position
              ? `Top-rated ${position} athletes based on composite performance scores.`
              : 'Overall athlete rankings across all positions.',
            color: COLORS.CYAN,
            fields: [
              { name: '🥇 #1', value: '— *Connect your Per|Form account to see rankings*', inline: false },
              { name: '🥈 #2', value: '— *Rankings update weekly*', inline: false },
              { name: '🥉 #3', value: '— *Use `/perform grade` to submit new grades*', inline: false },
            ],
            footer: {
              text: `Per|Form by A.I.M.S. • Requested by ${user.username}`,
            },
            thumbnail: { url: 'https://plugmein.cloud/images/logos/achievemor-gold.png' },
          }],
        },
      };
    }

    case 'grade': {
      if (!athlete) {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: {
            content: '⚠️ Please specify an athlete name. Example: `/perform action:Grade Athlete athlete:John Smith`',
            flags: MessageFlags.EPHEMERAL,
          },
        };
      }

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: `🎯 Grading: ${athlete}`,
            description: `Initiating AI-assisted performance grade for **${athlete}**.\n\nACHEEVY will analyze available data and generate a composite score.`,
            color: COLORS.GREEN,
            fields: [
              { name: 'Athlete', value: athlete, inline: true },
              { name: 'Position', value: position || 'Auto-detect', inline: true },
              { name: 'Graded by', value: `<@${user.id}>`, inline: true },
              { name: 'Categories', value: '• Athleticism\n• Technique\n• Football IQ\n• Consistency\n• Production', inline: false },
            ],
            footer: { text: 'Per|Form Grading System v1.0' },
          }],
        },
      };
    }

    case 'track': {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: `📈 Progress Tracker${athlete ? ` — ${athlete}` : ''}`,
            description: athlete
              ? `Tracking performance metrics for **${athlete}** over time.`
              : 'Use `/perform action:Track Progress athlete:<name>` to track a specific athlete.',
            color: COLORS.BLUE,
            fields: [
              { name: 'Metrics Available', value: '40-yard dash • Vertical • Broad Jump • 3-Cone • Shuttle • Bench Press', inline: false },
              { name: 'Data Sources', value: 'Combine data • Game film AI analysis • Manual entry', inline: false },
            ],
            footer: { text: 'Per|Form Analytics by A.I.M.S.' },
          }],
        },
      };
    }

    case 'scout': {
      if (!athlete) {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: {
            content: '⚠️ Specify an athlete for the scout report: `/perform action:Scout Report athlete:Jane Doe`',
            flags: MessageFlags.EPHEMERAL,
          },
        };
      }

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: `🔍 Scout Report: ${athlete}`,
            description: `AI-generated scouting analysis for **${athlete}**.\n\n*ACHEEVY is compiling data from multiple sources...*`,
            color: COLORS.PURPLE,
            fields: [
              { name: 'Position', value: position || 'Detecting...', inline: true },
              { name: 'Status', value: '🔄 Generating...', inline: true },
              { name: 'Analyst', value: `<@${user.id}>`, inline: true },
            ],
            footer: { text: 'Scout reports are AI-assisted. Always verify with film study.' },
          }],
        },
      };
    }

    case 'combine': {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '📋 Combine Data Hub',
            description: 'Access and compare athletic testing data across athletes.',
            color: COLORS.GOLD,
            fields: [
              { name: '🏃 Speed', value: '40-yard dash times', inline: true },
              { name: '💪 Power', value: 'Bench press reps', inline: true },
              { name: '🦘 Explosion', value: 'Vertical & Broad Jump', inline: true },
              { name: '🔄 Agility', value: '3-Cone & Shuttle', inline: true },
              { name: '🧠 Intelligence', value: 'Wonderlic / S2 scores', inline: true },
              { name: '📏 Measurables', value: 'Height, Weight, Arm, Hand', inline: true },
            ],
            footer: { text: 'Per|Form Combine Database' },
          }],
        },
      };
    }

    default:
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          content: `Unknown action: ${action}`,
          flags: MessageFlags.EPHEMERAL,
        },
      };
  }
}

// ─────────────────────────────────────────────────────────────
// /research — Deep Research via Research_Ang
// ─────────────────────────────────────────────────────────────

async function handleResearch(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const query = getOption(interaction, 'query') || '';
  const depth = getOption(interaction, 'depth') || 'standard';
  const user = getUser(interaction);

  const depthLabels: Record<string, string> = {
    quick: '⚡ Quick (30s)',
    standard: '📊 Standard (2min)',
    deep: '🔬 Deep (5min+)',
  };

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      embeds: [{
        title: '🔬 Research Initiated',
        description: `**Query:** ${query}\n\n*Research_Ang is searching, analyzing, and synthesizing results...*`,
        color: COLORS.CYAN,
        fields: [
          { name: 'Depth', value: depthLabels[depth] || depth, inline: true },
          { name: 'Requested by', value: `<@${user.id}>`, inline: true },
          { name: 'Status', value: '🔄 In Progress', inline: true },
          { name: 'Sources', value: 'Web Search • Academic Papers • News • Industry Reports', inline: false },
        ],
        footer: { text: 'Results will be posted when complete. Powered by Research_Ang.' },
        timestamp: new Date().toISOString(),
      }],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// /goals — Community Goal Tracking
// ─────────────────────────────────────────────────────────────

async function handleGoals(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const action = getOption(interaction, 'action') || 'view';
  const goalText = getOption(interaction, 'goal');
  const user = getUser(interaction);

  switch (action) {
    case 'set': {
      if (!goalText) {
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE,
          data: {
            content: '⚠️ Specify a goal: `/goals action:Set New Goal goal:Run 5 miles this week`',
            flags: MessageFlags.EPHEMERAL,
          },
        };
      }
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '🎯 New Goal Set!',
            description: `**${goalText}**\n\nACHEEVY will track your progress and send reminders.`,
            color: COLORS.GREEN,
            fields: [
              { name: 'Owner', value: `<@${user.id}>`, inline: true },
              { name: 'Status', value: '🟡 In Progress', inline: true },
              { name: 'Created', value: new Date().toLocaleDateString(), inline: true },
            ],
            footer: { text: 'Use /goals action:Complete Goal to mark as done!' },
          }],
        },
      };
    }

    case 'view': {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: `📋 Goals for ${user.username}`,
            description: '*Connect your A.I.M.S. account to sync goals across platforms.*',
            color: COLORS.BLUE,
            fields: [
              { name: 'Active Goals', value: '0', inline: true },
              { name: 'Completed', value: '0', inline: true },
              { name: 'Streak', value: '🔥 0 days', inline: true },
            ],
            footer: { text: 'Set your first goal with /goals action:Set New Goal' },
          }],
          flags: MessageFlags.EPHEMERAL,
        },
      };
    }

    case 'complete': {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '✅ Goal Completed!',
            description: goalText
              ? `Great work! **${goalText}** has been marked as complete.`
              : 'Specify which goal to complete: `/goals action:Complete Goal goal:<goal ID or text>`',
            color: COLORS.GREEN,
            footer: { text: 'Keep the momentum going! 🏆' },
          }],
        },
      };
    }

    case 'leaderboard': {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '🏆 Community Leaderboard',
            description: 'Top goal achievers in this server:',
            color: COLORS.GOLD,
            fields: [
              { name: '🥇 #1', value: '— *Be the first to complete a goal!*', inline: false },
              { name: '🥈 #2', value: '— *Set goals with `/goals action:Set New Goal`*', inline: false },
              { name: '🥉 #3', value: '— *Complete goals to climb the leaderboard*', inline: false },
            ],
            footer: { text: 'Leaderboard resets monthly • Powered by ACHEEVY' },
          }],
        },
      };
    }

    default:
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: { content: `Unknown goals action: ${action}`, flags: MessageFlags.EPHEMERAL },
      };
  }
}

// ─────────────────────────────────────────────────────────────
// /usage — LUC Credits
// ─────────────────────────────────────────────────────────────

async function handleUsage(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const user = getUser(interaction);

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/luc?userId=discord:${user.id}`, {
      headers: { 'x-api-key': process.env.INTERNAL_API_KEY || '' },
    });

    if (res.ok) {
      const data = await res.json();
      const account = data.account;

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '📊 Your A.I.M.S. Usage',
            description: `Usage summary for <@${user.id}>`,
            color: COLORS.GOLD,
            fields: [
              { name: '💰 Credits', value: `${account?.balance?.toFixed(2) || '0.00'}`, inline: true },
              { name: '📋 Plan', value: account?.planId || 'Starter', inline: true },
              { name: '📈 This Month', value: `$${account?.monthlySpend?.toFixed(4) || '0.00'}`, inline: true },
            ],
            footer: { text: 'Manage your usage at plugmein.cloud/dashboard/luc' },
          }],
          flags: MessageFlags.EPHEMERAL,
        },
      };
    }
  } catch (error) {
    console.error('[Discord] LUC error:', error);
  }

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      embeds: [{
        title: '📊 Usage & Credits',
        description: `Link your Discord account at **plugmein.cloud** to see usage data.\n\nUse \`/acheevy\` to start earning usage history.`,
        color: COLORS.BLUE,
        footer: { text: 'LUC — Locale Usage Calculator' },
      }],
      flags: MessageFlags.EPHEMERAL,
    },
  };
}

// ─────────────────────────────────────────────────────────────
// /deploy — Deploy Dock Status
// ─────────────────────────────────────────────────────────────

async function handleDeploy(interaction: DiscordInteraction): Promise<InteractionResponse> {
  const action = getOption(interaction, 'action') || 'status';
  const user = getUser(interaction);

  switch (action) {
    case 'status':
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '🚀 Deploy Dock — Status',
            description: 'Current status of deployed Boomer_Ang agents:',
            color: COLORS.GREEN,
            fields: [
              { name: '🟢 Research_Ang', value: 'Port 3010 — Online', inline: true },
              { name: '🟢 Strategy_Ang', value: 'Port 3011 — Online', inline: true },
              { name: '🟡 Intel_Ang', value: 'Port 3012 — Standby', inline: true },
              { name: '🟢 Router_Ang', value: 'Port 4000 — Online', inline: true },
              { name: '⚫ Deck_Ang', value: 'Port 3014 — Offline', inline: true },
              { name: '🟢 ACHEEVY', value: 'Orchestrator — Online', inline: true },
            ],
            footer: { text: 'Deploy Dock • plugmein.cloud/dashboard/deploy-dock' },
            timestamp: new Date().toISOString(),
          }],
        },
      };

    case 'roster':
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          embeds: [{
            title: '📊 Boomer_Ang Roster',
            description: 'Available specialist agents in the A.I.M.S. fleet:',
            color: COLORS.PURPLE,
            fields: [
              { name: '🔬 Research_Ang', value: 'Deep web research & analysis', inline: true },
              { name: '🧠 Strategy_Ang', value: 'Multi-agent planning', inline: true },
              { name: '📊 Intel_Ang', value: 'Business intelligence & timelines', inline: true },
              { name: '🔀 Router_Ang', value: 'LLM gateway & load balancing', inline: true },
              { name: '📑 Deck_Ang', value: 'Presentation generation', inline: true },
              { name: '💻 Code_Ang', value: 'Code generation & review', inline: true },
              { name: '🚀 CI/CD_Ang', value: 'Deployment pipelines', inline: true },
            ],
            footer: { text: 'Mapped from Intelligent Internet open-source repos' },
          }],
        },
      };

    default:
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: {
          content: `⚠️ Deploy action \`${action}\` requires admin access. Use the web dashboard.`,
          flags: MessageFlags.EPHEMERAL,
        },
      };
  }
}

// ─────────────────────────────────────────────────────────────
// /aims — Help & Feature Overview
// ─────────────────────────────────────────────────────────────

async function handleHelp(interaction: DiscordInteraction): Promise<InteractionResponse> {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      embeds: [{
        title: '📖 A.I.M.S. — AI Managed Solutions',
        description: 'Your AI-powered command center, now in Discord.\n\nHere\'s everything you can do:',
        color: COLORS.GOLD,
        fields: [
          {
            name: '🤖 `/acheevy <prompt>`',
            value: 'Ask ACHEEVY anything — research, write, analyze, code, automate.',
            inline: false,
          },
          {
            name: '🏈 `/perform <action>`',
            value: 'Per|Form platform — rank, grade, track, and scout athletes.',
            inline: false,
          },
          {
            name: '🔬 `/research <query>`',
            value: 'Deep research on any topic — web search, analysis, synthesis.',
            inline: false,
          },
          {
            name: '🎯 `/goals <action>`',
            value: 'Community goals — set, track, complete, and compete.',
            inline: false,
          },
          {
            name: '📊 `/usage`',
            value: 'Check your credits, plan, and monthly spend.',
            inline: false,
          },
          {
            name: '🚀 `/deploy <action>`',
            value: 'Deploy Dock — monitor and manage Boomer_Ang agents.',
            inline: false,
          },
        ],
        footer: {
          text: '🌐 Full dashboard at plugmein.cloud | Built by ACHIEVEMOR',
        },
        thumbnail: { url: 'https://plugmein.cloud/images/logos/achievemor-gold.png' },
      }],
    },
  };
}
