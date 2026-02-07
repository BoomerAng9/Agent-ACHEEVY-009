/**
 * A.I.M.S. Landing Page
 *
 * Clean, professional landing page for AI Managed Solutions
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, #1a2942 0%, #0a0f1a 70%)',
          }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <span className="text-amber-400 text-lg">✦</span>
            <span className="text-amber-200 text-sm font-medium">AI-Powered Automation Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-amber-400">A.I.M.S:</span>{' '}
            <span className="text-white">Build Your</span>
            <br />
            <span className="text-white">Future.</span>{' '}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Empower Your Vision.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            AI Managed Solutions — An intelligent platform for the next generation
            of builders, powered by autonomous agents, smart workflows, and the
            Boomer_Ang orchestration system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
            >
              Get Started Today
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-amber-200 border border-amber-500/30 hover:bg-amber-500/10 transition-all"
            >
              Talk to ACHEEVY
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: '200+', label: 'AI Models' },
              { value: '50+', label: 'Integrations' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0d1220]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-amber-400">Everything</span>{' '}
              <span className="text-white">You Need to Build</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A.I.M.S. provides a complete toolkit for building AI-powered applications
              and automating your workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'ACHEEVY Assistant',
                description: 'Your AI executive assistant that orchestrates complex tasks across departments.',
                icon: '🎯',
                href: '/dashboard/chat',
              },
              {
                title: 'Boomer_Ang Agents',
                description: 'Specialized AI workers that handle everything from research to code generation.',
                icon: '🤖',
                href: '/dashboard/boomerangs',
              },
              {
                title: 'Model Garden',
                description: '200+ AI models at your fingertips - Claude, GPT, Gemini, and more.',
                icon: '🌱',
                href: '/dashboard/model-garden',
              },
              {
                title: 'Circuit Box',
                description: 'Clean system management dashboard for wiring all your integrations.',
                icon: '⚡',
                href: '/dashboard/circuit-box',
              },
              {
                title: 'LUC Calculator',
                description: 'Real-time usage tracking and quota management with smart gating.',
                icon: '📊',
                href: '/dashboard/luc',
              },
              {
                title: 'House of Ang',
                description: 'Browse, hire, and manage your team of specialized AI agents.',
                icon: '🏠',
                href: '/dashboard/house-of-ang',
              },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group p-6 rounded-2xl bg-[#1a2234] border border-[#2d3a4d] hover:border-amber-500/30 transition-all hover:scale-[1.02]"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-[#1a2234] to-[#0d1220] border border-amber-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join the A.I.M.S. platform and start building AI-powered solutions today.
              No coding required — just describe your vision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/chat"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all hover:scale-105"
              >
                Start Building with ACHEEVY
                <span>→</span>
              </Link>
              <Link
                href="https://github.com/BoomerAng9/AIMS"
                target="_blank"
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-gray-300 border border-[#2d3a4d] hover:bg-white/5 transition-all"
              >
                View on GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#1a2234]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center font-bold text-black">
                A
              </div>
              <span className="text-xl font-bold text-amber-100">A.I.M.S.</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/chat" className="text-gray-400 hover:text-white transition-colors">
                ACHEEVY
              </Link>
              <Link href="/dashboard/model-garden" className="text-gray-400 hover:text-white transition-colors">
                Model Garden
              </Link>
              <Link href="https://github.com/BoomerAng9/AIMS" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} A.I.M.S. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
