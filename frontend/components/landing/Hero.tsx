'use client';

/**
 * A.I.M.S. Landing Page Hero
 *
 * Main hero section with branding and call-to-action.
 * Adapted from NurdsCode vision with A.I.M.S. branding.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CircuitBoardPattern, AIMS_CIRCUIT_COLORS } from '@/components/ui/CircuitBoard';

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────────────────────

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${AIMS_CIRCUIT_COLORS.background} 0%, #000 100%)`,
        }}
      />

      {/* Circuit Pattern */}
      <CircuitBoardPattern
        animated={mounted}
        density="medium"
        glowIntensity={0.3}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${AIMS_CIRCUIT_COLORS.background}80 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            backgroundColor: AIMS_CIRCUIT_COLORS.primary + '20',
            border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
          }}
        >
          <SparkleIcon className="w-4 h-4" style={{ color: AIMS_CIRCUIT_COLORS.accent }} />
          <span className="text-sm font-medium" style={{ color: AIMS_CIRCUIT_COLORS.secondary }}>
            AI-Powered Automation Platform
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span style={{ color: AIMS_CIRCUIT_COLORS.accent }}>A.I.M.S:</span>{' '}
          <span className="text-white">Build Your</span>
          <br />
          <span className="text-white">Future.</span>{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${AIMS_CIRCUIT_COLORS.primary}, ${AIMS_CIRCUIT_COLORS.accent})`,
            }}
          >
            Empower Your Vision.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12"
        >
          AI Managed Solutions - An intelligent platform for the next generation
          of builders, powered by autonomous agents, smart workflows, and the
          Boomer_Ang orchestration system.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${AIMS_CIRCUIT_COLORS.primary}, ${AIMS_CIRCUIT_COLORS.accent})`,
              boxShadow: `0 0 30px ${AIMS_CIRCUIT_COLORS.glow}`,
            }}
          >
            Get Started Today
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/model-garden"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
            style={{
              color: AIMS_CIRCUIT_COLORS.secondary,
              border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}60`,
            }}
          >
            Explore the Platform
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
        >
          {[
            { value: '200+', label: 'AI Models Available' },
            { value: '50+', label: 'Integrations' },
            { value: '∞', label: 'Possibilities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold mb-1"
                style={{ color: AIMS_CIRCUIT_COLORS.accent }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2"
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: AIMS_CIRCUIT_COLORS.primary }}
            />
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
      description: '200+ AI models at your fingertips - Claude, GPT, Gemini, and more.',
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
    <section className="py-20 px-6" style={{ backgroundColor: '#0a0f1a' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span style={{ color: AIMS_CIRCUIT_COLORS.accent }}>Everything</span>{' '}
            <span className="text-white">You Need to Build</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A.I.M.S. provides a complete toolkit for building AI-powered applications
            and automating your workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl transition-all hover:scale-105"
              style={{
                backgroundColor: '#1a2234',
                border: '1px solid #2d3a4d',
              }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
