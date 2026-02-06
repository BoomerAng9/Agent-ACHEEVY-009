/**
 * A.I.M.S. 3-6-9 Billing Engine
 *
 * Server-side billing definitions + task multiplier application for LUC.
 * The 3-6-9 model: Test (3mo) → Lock In (6mo) → V.I.B.E. (9mo pays for 12).
 * P2P (Proud to Pay): No commitment, 100 tokens per $1.
 *
 * "Activity breeds Activity."
 */

import logger from '../logger';

// ---------------------------------------------------------------------------
// Task-Based Multipliers — applied to token consumption per action
// ---------------------------------------------------------------------------

export type TaskType = 'CODE_GEN' | 'CODE_REVIEW' | 'ARCHITECTURE' | 'AGENT_SWARM' | 'SECURITY_AUDIT' | 'DEPLOYMENT';

export const TASK_MULTIPLIERS: Record<TaskType, { multiplier: number; label: string }> = {
  CODE_GEN:       { multiplier: 1.0,  label: 'Code Generation' },
  CODE_REVIEW:    { multiplier: 1.2,  label: 'Code Review' },
  ARCHITECTURE:   { multiplier: 1.5,  label: 'Architecture Planning' },
  AGENT_SWARM:    { multiplier: 2.0,  label: 'Agent Swarm Execution' },
  SECURITY_AUDIT: { multiplier: 1.45, label: 'Security Audit' },
  DEPLOYMENT:     { multiplier: 1.1,  label: 'Deployment Jobs' },
};

// ---------------------------------------------------------------------------
// Tier Definitions (mirrors frontend lib/stripe.ts)
// ---------------------------------------------------------------------------

export interface TierConfig {
  id: string;
  name: string;
  commitmentMonths: number;
  deliveredMonths: number;
  monthlyPrice: number;
  tokensIncluded: number;
  overdraftBuffer: number;
}

export const TIER_CONFIGS: TierConfig[] = [
  { id: 'garage',     name: 'Garage',     commitmentMonths: 3,  deliveredMonths: 3,  monthlyPrice: 99, tokensIncluded: 100_000, overdraftBuffer: 50_000 },
  { id: 'community',  name: 'Community',  commitmentMonths: 6,  deliveredMonths: 6,  monthlyPrice: 89, tokensIncluded: 250_000, overdraftBuffer: 150_000 },
  { id: 'enterprise', name: 'Enterprise', commitmentMonths: 9,  deliveredMonths: 12, monthlyPrice: 67, tokensIncluded: 500_000, overdraftBuffer: 500_000 },
  { id: 'p2p',        name: 'P2P',        commitmentMonths: 0,  deliveredMonths: 0,  monthlyPrice: 0,  tokensIncluded: 0,       overdraftBuffer: 0 },
];

// ---------------------------------------------------------------------------
// Overage & P2P Rates
// ---------------------------------------------------------------------------

export const OVERAGE_RATE_PER_1K = 0.06;   // $0.06 per 1K tokens
export const P2P_RATE_PER_100   = 1.00;    // 100 tokens per $1
export const REALTIME_TOPUP_FEE = 0.10;    // +10% convenience

// ---------------------------------------------------------------------------
// Metered Token Calculator
// ---------------------------------------------------------------------------

export interface MeteredUsage {
  rawTokens: number;
  taskType: TaskType;
  multiplier: number;
  effectiveTokens: number;
  costUsd: number;
}

/**
 * Calculate metered token cost for a given task execution.
 * Applies the task-type multiplier to raw token count,
 * then calculates cost based on tier overage or P2P rate.
 */
export function meterTokens(
  rawTokens: number,
  taskType: TaskType,
  tierId: string,
): MeteredUsage {
  const mult = TASK_MULTIPLIERS[taskType]?.multiplier ?? 1.0;
  const effectiveTokens = Math.round(rawTokens * mult);

  // P2P uses flat rate; subscription tiers use overage rate
  const rate = tierId === 'p2p'
    ? P2P_RATE_PER_100 / 100  // $0.01 per token
    : OVERAGE_RATE_PER_1K / 1000;  // $0.00006 per token

  const costUsd = Math.round(effectiveTokens * rate * 10000) / 10000;

  logger.info({
    rawTokens,
    taskType,
    multiplier: mult,
    effectiveTokens,
    costUsd,
    tierId,
  }, '[Billing] Token metering');

  return { rawTokens, taskType, multiplier: mult, effectiveTokens, costUsd };
}

/**
 * Check if user is within their included allocation + buffer.
 */
export function checkAllowance(
  tierId: string,
  monthlyUsedTokens: number,
): { within: boolean; remaining: number; overage: number } {
  const tier = TIER_CONFIGS.find(t => t.id === tierId);
  if (!tier || tierId === 'p2p') {
    return { within: true, remaining: 0, overage: 0 };
  }

  const ceiling = tier.tokensIncluded + tier.overdraftBuffer;
  const remaining = Math.max(ceiling - monthlyUsedTokens, 0);
  const overage = Math.max(monthlyUsedTokens - ceiling, 0);

  return { within: monthlyUsedTokens <= ceiling, remaining, overage };
}
