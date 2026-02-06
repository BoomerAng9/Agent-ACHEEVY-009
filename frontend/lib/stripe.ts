/**
 * Stripe Subscription Configuration — A.I.M.S. Monetization
 *
 * Pricing tiers for the platform:
 * - Starter: $29/mo — 1 agent, 50k tokens/mo, basic ACHEEVY
 * - Pro: $99/mo — 5 agents, 500k tokens/mo, full PMO + Per|Form
 * - Enterprise: $299/mo — Unlimited agents, 2M tokens/mo, custom Boomer_Angs
 *
 * Add STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET to .env
 */

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: 'month';
  features: string[];
  agents: number;
  tokensPerMonth: string;
  stripePriceId: string; // Set from Stripe dashboard
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    agents: 1,
    tokensPerMonth: '50,000',
    stripePriceId: process.env.STRIPE_PRICE_STARTER || '',
    features: [
      'ACHEEVY orchestrator',
      '1 active Boomer_Ang',
      '50k tokens / month',
      'LUC cost tracking',
      'Basic Circuit Box config',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    interval: 'month',
    agents: 5,
    tokensPerMonth: '500,000',
    stripePriceId: process.env.STRIPE_PRICE_PRO || '',
    features: [
      'Everything in Starter',
      '5 active Boomer_Angs',
      '500k tokens / month',
      'Full PMO governance',
      'Per|Form athlete cards',
      'PREP_SQUAD_ALPHA pipeline',
      'Lil_Hawk squads',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    interval: 'month',
    agents: -1, // unlimited
    tokensPerMonth: '2,000,000',
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    features: [
      'Everything in Pro',
      'Unlimited Boomer_Angs',
      '2M tokens / month',
      'Custom agent spawning',
      'House of Ang full access',
      'Priority support',
      'White-label option',
    ],
  },
];
