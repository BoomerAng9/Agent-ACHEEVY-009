'use client';

/**
 * A.I.M.S. Landing Page — Hero + Feature Section
 *
 * Hero: "PLUG ME IN." headline with Remotion animation + two CTAs
 * FeatureSection: 6 wireframe-card feature tiles
 */

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { heroStagger, heroItem, cardLift, staggerContainer, staggerItem } from '@/lib/motion/variants';

// Lazy-load Remotion Player — no SSR
const RemotionPlayer = dynamic(
  () => import('@/components/landing/HeroPlayer'),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden aims-page-bg">
      {/* Gold edge rail */}
      <div className="absolute inset-0 gold-edge-rail pointer-events-none" />

      {/* Content — two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column — Text */}
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={heroItem}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-gold/20 bg-gold/5 text-[0.65rem] uppercase tracking-[0.2em] text-gold/80 font-mono">
                AI-Powered Automation Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={heroItem}
              className="font-display text-5xl md:text-6xl lg:text-7xl uppercase tracking-wider leading-[1.1]"
            >
              <span className="text-gold text-shadow-gold">PLUG ME IN.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={heroItem}
              className="text-lg md:text-xl text-white/50 max-w-lg leading-relaxed"
            >
              AI-orchestrated automation that builds, deploys, and manages
              your entire digital operation.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-medium text-black transition-colors hover:bg-gold-light"
              >
                Chat w/ACHEEVY
              </Link>
              <Link
                href="/dashboard/build"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-wireframe-stroke px-6 py-3.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:border-white/20 hover:text-white"
              >
                Build + Deploy
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={heroItem}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-wireframe-stroke mt-6"
            >
              {[
                { value: '200+', label: 'AI Models' },
                { value: '50+', label: 'Integrations' },
                { value: '∞', label: 'Possibilities' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-display text-gold">
                    {stat.value}
                  </div>
                  <div className="text-[0.65rem] text-white/30 uppercase tracking-wider mt-1 font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — Remotion Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="relative aspect-square max-w-[560px] mx-auto lg:mx-0 w-full"
          >
            {/* Glow behind player */}
            <div className="absolute inset-0 rounded-3xl glow-controlled" />
            <div className="relative rounded-3xl overflow-hidden wireframe-card">
              <RemotionPlayer />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[0.6rem] text-white/20 uppercase tracking-[0.3em] font-mono">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1 rounded-full bg-gold" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Feature Section
// ─────────────────────────────────────────────────────────────

export function FeatureSection() {
  const features = [
    {
      title: 'ACHEEVY Assistant',
      description: 'Your AI executive assistant that orchestrates complex tasks across departments.',
      icon: '🎯',
    },
    {
      title: 'Boomer_Ang Agents',
      description: 'Specialized AI workers that handle everything from research to code generation.',
      icon: '🤖',
    },
    {
      title: 'Model Garden',
      description: '200+ AI models at your fingertips — Claude, GPT, Gemini, and more.',
      icon: '🌱',
    },
    {
      title: 'Circuit Box',
      description: 'Clean system management dashboard for wiring all your integrations.',
      icon: '⚡',
    },
    {
      title: 'LUC Calculator',
      description: 'Real-time usage tracking and quota management with smart gating.',
      icon: '📊',
    },
    {
      title: 'House of Ang',
      description: 'Browse, hire, and manage your team of specialized AI agents.',
      icon: '🏠',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 xl:px-12 bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl uppercase tracking-wider mb-4">
            <span className="text-gold">Everything</span>{' '}
            <span className="text-white">You Need to Build</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto">
            A.I.M.S. provides a complete toolkit for building AI-powered applications
            and automating your workflows.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              {...cardLift}
              className="wireframe-card p-6 cursor-default"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
