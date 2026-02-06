'use client';

/**
 * App Showcase Component
 *
 * Displays real production apps built with A.I.M.S.
 * Instead of conversation starter bubbles, shows actual working applications
 * that users can try immediately.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AIMS_CIRCUIT_COLORS } from '@/components/ui/CircuitBoard';

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
  </svg>
);

const RocketIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const StoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface AppShowcaseItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  demoLink: string;
  builtIn: string;
  status: 'live' | 'demo' | 'coming-soon';
}

// ─────────────────────────────────────────────────────────────
// Showcase Data
// ─────────────────────────────────────────────────────────────

const SHOWCASE_APPS: AppShowcaseItem[] = [
  {
    id: 'luc',
    name: 'LUC - Usage Calculator',
    tagline: 'Track, Estimate, Optimize',
    description: 'Production-ready usage calculator with quota tracking, cost estimation, and execution gating. 8 industry presets included.',
    icon: <CalculatorIcon className="w-8 h-8" />,
    gradient: 'from-amber-500 to-orange-500',
    features: [
      'Real-time quota tracking',
      'Industry presets (SaaS, AI, E-commerce, etc.)',
      'Import/Export functionality',
      'Usage history & analytics',
      'File-based persistence',
    ],
    demoLink: '/dashboard/luc',
    builtIn: '< 30 minutes',
    status: 'live',
  },
  {
    id: 'garage-to-global',
    name: 'Garage to Global',
    tagline: 'From Side Hustle to Empire',
    description: 'Complete e-commerce seller suite with AI-powered best practices for Shopify, Amazon, KDP, and Etsy.',
    icon: <StoreIcon className="w-8 h-8" />,
    gradient: 'from-emerald-500 to-teal-500',
    features: [
      'E-commerce best practices engine',
      'Multi-platform adapters (Shopify, Amazon, KDP, Etsy)',
      'Listing SEO optimizer',
      'Marketing automation',
      '5-stage growth journey',
    ],
    demoLink: '/dashboard/boomerangs',
    builtIn: '< 1 hour',
    status: 'live',
  },
  {
    id: 'buy-in-bulk',
    name: 'Buy in Bulk',
    tagline: 'Smart Shopping at Scale',
    description: 'Boomer_Ang-powered shopping assistant that scouts deals, compares prices, and optimizes bulk purchases.',
    icon: <ShoppingCartIcon className="w-8 h-8" />,
    gradient: 'from-blue-500 to-indigo-500',
    features: [
      'AI price comparison',
      'Deal scouting agents',
      'Cart optimization',
      'Purchase workflow automation',
      'Never shares payment info',
    ],
    demoLink: '/dashboard/boomerangs',
    builtIn: '< 45 minutes',
    status: 'demo',
  },
];

// ─────────────────────────────────────────────────────────────
// App Card Component
// ─────────────────────────────────────────────────────────────

function AppCard({ app, index }: { app: AppShowcaseItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl"
      style={{
        backgroundColor: '#1a2234',
        border: '1px solid #2d3a4d',
      }}
    >
      {/* Gradient Accent Bar */}
      <div className={`h-1 bg-gradient-to-r ${app.gradient}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${app.gradient} text-white`}
            >
              {app.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{app.name}</h3>
              <p className="text-sm text-gray-400">{app.tagline}</p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              app.status === 'live'
                ? 'bg-green-500/20 text-green-400'
                : app.status === 'demo'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {app.status === 'live' ? 'LIVE' : app.status === 'demo' ? 'DEMO' : 'COMING SOON'}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4">{app.description}</p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {app.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {feature}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <ZapIcon className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-400">
              Built with A.I.M.S. in{' '}
              <span className="text-amber-400 font-semibold">{app.builtIn}</span>
            </span>
          </div>
          <Link
            href={app.demoLink}
            className="flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
            style={{ color: AIMS_CIRCUIT_COLORS.accent }}
          >
            Try it now
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        className={`absolute inset-0 bg-gradient-to-br ${app.gradient} pointer-events-none`}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function AppShowcase() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#0a0f1a' }}>
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: AIMS_CIRCUIT_COLORS.primary + '20',
              border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
            }}
          >
            <RocketIcon className="w-4 h-4" style={{ color: AIMS_CIRCUIT_COLORS.accent }} />
            <span className="text-sm font-medium" style={{ color: AIMS_CIRCUIT_COLORS.secondary }}>
              Production-Ready Apps
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: AIMS_CIRCUIT_COLORS.accent }}>Real Apps.</span>{' '}
            <span className="text-white">Built Fast.</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            These aren't mockups or demos. These are production-ready applications
            built with A.I.M.S. in under an hour. Try them now.
          </p>
        </motion.div>

        {/* App Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SHOWCASE_APPS.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>

        {/* Build Your Own CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-8 rounded-2xl"
          style={{
            backgroundColor: '#1a2234',
            border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
            boxShadow: `0 0 60px ${AIMS_CIRCUIT_COLORS.glow}20`,
          }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            What Will You Build?
          </h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Tell ACHEEVY what you need. A.I.M.S. will build it. Fast.
            No coding required. Just describe your vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${AIMS_CIRCUIT_COLORS.primary}, ${AIMS_CIRCUIT_COLORS.accent})`,
                boxShadow: `0 0 30px ${AIMS_CIRCUIT_COLORS.glow}`,
              }}
            >
              Start Building with ACHEEVY
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="https://github.com/BoomerAng9/AIMS"
              target="_blank"
              className="flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-gray-300 transition-all hover:text-white hover:bg-white/5"
              style={{
                border: '1px solid #2d3a4d',
              }}
            >
              View on GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Quote Prompts (Instead of Conversation Starters)
// ─────────────────────────────────────────────────────────────

export function BuildPrompts() {
  const prompts = [
    {
      title: 'Build me a usage calculator',
      description: 'Track API calls, storage, and compute with quota limits and overage billing.',
      result: 'LUC Calculator',
    },
    {
      title: 'Help me sell online',
      description: 'Set up my e-commerce business from scratch with AI-powered best practices.',
      result: 'Garage to Global Suite',
    },
    {
      title: 'Find me the best deals',
      description: 'Scout products across retailers and optimize my bulk purchases.',
      result: 'Buy in Bulk Agent',
    },
    {
      title: 'Manage my AI costs',
      description: 'Create dashboards and alerts for my multi-model AI spending.',
      result: 'AI Platform Calculator',
    },
  ];

  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#0a0f1a' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            Just Tell ACHEEVY What You Need
          </h2>
          <p className="text-gray-400">
            No technical jargon required. Speak naturally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.map((prompt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href="/dashboard/chat"
                className="block p-5 rounded-xl transition-all hover:scale-[1.02] group"
                style={{
                  backgroundColor: '#1a2234',
                  border: '1px solid #2d3a4d',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <ZapIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1 group-hover:text-amber-400 transition-colors">
                      "{prompt.title}"
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">{prompt.description}</p>
                    <span className="text-xs text-amber-400/80">
                      Creates: {prompt.result}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AppShowcase;
