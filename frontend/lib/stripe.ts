/**
 * A.I.M.S. 3-6-9 Pricing Model — Build-Your-Bill
 *
 * The 3-6-9 model follows Tesla's vortex mathematics:
 *   3 = Entry (Test)    — Validate utility
 *   6 = Balance (Lock)  — Mid-term commitment
 *   9 = Completion (V.I.B.E.) — Pay 9, get 3 free (12-month cycle)
 *   P2P = Proud to Pay  — No commitment, appreciation-based metering
 *
 * Build-Your-Bill: No two users need identical bills.
 * 4 Dimensions: Base Frequency × Usage Modifiers × Group Structure × Task Multipliers
 *
 * "Activity breeds Activity."
 */

// ---------------------------------------------------------------------------
// Dimension 1: Base Frequency (Choose One)
// ---------------------------------------------------------------------------

export type FrequencyId = 'garage' | 'community' | 'enterprise' | 'p2p';

export interface BaseTier {
  id: FrequencyId;
  name: string;
  commitmentMonths: number;   // 3, 6, 9 (delivers 12), or 0 for P2P
  deliveredMonths: number;    // what user actually gets
  monthlyPrice: number;       // per-month cost
  tokensIncluded: number;     // monthly token allocation
  overdraftBuffer: number;    // buffer before overage kicks in
  discount: string;           // human-readable discount
  models: string[];           // accessible model tiers
  stripePriceId: string;
}

export const BASE_TIERS: BaseTier[] = [
  {
    id: 'garage',
    name: 'Garage',
    commitmentMonths: 3,
    deliveredMonths: 3,
    monthlyPrice: 99,
    tokensIncluded: 100_000,
    overdraftBuffer: 50_000,
    discount: '0% (baseline)',
    models: ['claude-sonnet-4.5', 'gemini-2.5-pro'],
    stripePriceId: process.env.STRIPE_PRICE_GARAGE || '',
  },
  {
    id: 'community',
    name: 'Community',
    commitmentMonths: 6,
    deliveredMonths: 6,
    monthlyPrice: 89,
    tokensIncluded: 250_000,
    overdraftBuffer: 150_000,
    discount: '10% off monthly',
    models: ['claude-sonnet-4.5', 'claude-opus-4.6', 'gemini-2.5-pro'],
    stripePriceId: process.env.STRIPE_PRICE_COMMUNITY || '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    commitmentMonths: 9,
    deliveredMonths: 12,
    monthlyPrice: 67,
    tokensIncluded: 500_000,
    overdraftBuffer: 500_000,
    discount: '33% off (pay 9 get 3 free)',
    models: ['claude-sonnet-4.5', 'claude-opus-4.6', 'gemini-2.5-pro', 'kimi-k2.5'],
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
  },
  {
    id: 'p2p',
    name: 'P2P (Proud to Pay)',
    commitmentMonths: 0,
    deliveredMonths: 0,
    monthlyPrice: 0,
    tokensIncluded: 0,
    overdraftBuffer: 0,
    discount: 'Pay-as-you-go',
    models: ['claude-sonnet-4.5'],
    stripePriceId: process.env.STRIPE_PRICE_P2P || '',
  },
];

// ---------------------------------------------------------------------------
// Dimension 2: Usage Modifiers
// ---------------------------------------------------------------------------

export const USAGE_MODIFIERS = {
  overageRatePer1K: 0.06,         // $0.06 per 1K tokens over limit
  p2pRatePer100Tokens: 1.00,     // 100 tokens per $1
  realTimeLucConvenience: 0.10,   // +10% convenience fee on market rate top-ups
  lucCalculator: 'included',      // always included — pre-action cost transparency
};

// ---------------------------------------------------------------------------
// Dimension 3: Group Structures (Add-On)
// ---------------------------------------------------------------------------

export type GroupId = 'individual' | 'family' | 'team' | 'enterprise-group';

export interface GroupStructure {
  id: GroupId;
  name: string;
  seats: string;
  multiplier: number;     // applied to base tier price
  perSeatAddon: number;   // extra per seat (0 for individual/family)
}

export const GROUP_STRUCTURES: GroupStructure[] = [
  { id: 'individual', name: 'Individual', seats: '1', multiplier: 1.0, perSeatAddon: 0 },
  { id: 'family', name: 'Family', seats: 'Up to 4', multiplier: 1.5, perSeatAddon: 0 },
  { id: 'team', name: 'Team', seats: '5–20', multiplier: 2.5, perSeatAddon: 10 },
  { id: 'enterprise-group', name: 'Enterprise', seats: '21+', multiplier: 0, perSeatAddon: 0 }, // custom contract
];

// ---------------------------------------------------------------------------
// Dimension 4: Task-Based Multipliers (Per-Action)
// ---------------------------------------------------------------------------

export type TaskTypeId = 'code_gen' | 'code_review' | 'architecture' | 'agent_swarm' | 'security_audit' | 'deployment';

export interface TaskMultiplier {
  id: TaskTypeId;
  name: string;
  multiplier: number;
  description: string;
}

export const TASK_MULTIPLIERS: TaskMultiplier[] = [
  { id: 'code_gen', name: 'Code Generation', multiplier: 1.0, description: 'Standard token consumption' },
  { id: 'code_review', name: 'Code Review', multiplier: 1.2, description: 'Slightly higher for context analysis' },
  { id: 'architecture', name: 'Architecture Planning', multiplier: 1.5, description: 'Multi-file context required' },
  { id: 'agent_swarm', name: 'Agent Swarm Execution', multiplier: 2.0, description: 'Parallel agent orchestration' },
  { id: 'security_audit', name: 'Security Audit', multiplier: 1.45, description: 'Premium security multiplier' },
  { id: 'deployment', name: 'Deployment Jobs', multiplier: 1.1, description: 'CI/CD pipeline execution' },
];

// ---------------------------------------------------------------------------
// Bill Calculator
// ---------------------------------------------------------------------------

export interface BillEstimate {
  baseTier: BaseTier;
  group: GroupStructure;
  taskMix: Array<{ task: TaskMultiplier; weight: number }>;
  effectiveMultiplier: number;
  monthlyBase: number;
  monthlyWithGroup: number;
  monthlyEstimate: number;
  commitmentTotal: number;
  tokensPerMonth: number;
}

export function calculateBill(
  tierId: FrequencyId,
  groupId: GroupId,
  seatCount: number,
  taskWeights: Partial<Record<TaskTypeId, number>>,
): BillEstimate {
  const tier = BASE_TIERS.find(t => t.id === tierId)!;
  const group = GROUP_STRUCTURES.find(g => g.id === groupId)!;

  // Build task mix
  const taskMix = TASK_MULTIPLIERS.map(t => ({
    task: t,
    weight: taskWeights[t.id] || 0,
  })).filter(m => m.weight > 0);

  // Calculate effective task multiplier (weighted average)
  const totalWeight = taskMix.reduce((s, m) => s + m.weight, 0);
  const effectiveMultiplier = totalWeight > 0
    ? taskMix.reduce((s, m) => s + (m.task.multiplier * m.weight), 0) / totalWeight
    : 1.0;

  // Base monthly price
  const monthlyBase = tier.monthlyPrice;

  // Group pricing
  const monthlyWithGroup = groupId === 'enterprise-group'
    ? 0 // custom contract
    : (monthlyBase * group.multiplier) + (group.perSeatAddon * Math.max(seatCount - 1, 0));

  // Apply task multiplier to estimate actual cost
  const monthlyEstimate = Math.round(monthlyWithGroup * effectiveMultiplier * 100) / 100;

  // Commitment total
  const commitmentTotal = Math.round(monthlyEstimate * tier.commitmentMonths * 100) / 100;

  return {
    baseTier: tier,
    group,
    taskMix,
    effectiveMultiplier: Math.round(effectiveMultiplier * 100) / 100,
    monthlyBase,
    monthlyWithGroup: Math.round(monthlyWithGroup * 100) / 100,
    monthlyEstimate,
    commitmentTotal,
    tokensPerMonth: tier.tokensIncluded,
  };
}
