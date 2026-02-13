'use client';

/**
 * About A.I.M.S. — Who We Are
 *
 * Company story, mission, and the team behind the platform.
 * Lives on plugmein.cloud — the lore & learn domain.
 */

import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/landing/Footer';

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_URL || 'https://aimanagedsolutions.cloud';

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-full bg-ink text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative py-20 md:py-32 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-marker), "Permanent Marker", cursive' }}
          >
            About A.I.M.S.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gold/70 uppercase tracking-[0.15em] mb-6"
            style={{ fontFamily: 'var(--font-doto), "Doto", monospace' }}
          >
            AI Managed Solutions
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed"
          >
            We are building a full-stack application creation and deployment platform that enables
            anyone to build, deploy, and scale production-ready web applications. We own our
            infrastructure, we leverage state-of-the-art AI agents, and we deploy real production
            applications with custom domains and enterprise-grade scalability.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="wireframe-card p-8"
          >
            <h2 className="text-xl font-bold text-gold mb-3">Our Mission</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Enough with users trying to prompt their way to a successful app. We let them
              conversate their way to a working aiPLUG. Managed Vibe Coding means ACHEEVY
              and the team handle the complexity — users bring the vision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="wireframe-card p-8"
          >
            <h2 className="text-xl font-bold text-gold mb-3">Our Approach</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              No proof, no done. Every task requires evidence. Every deployment goes through
              the Chain of Command. Every agent operates in a sandbox. We don&apos;t cut corners —
              we build them properly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="wireframe-card p-8"
          >
            <h2 className="text-xl font-bold text-gold mb-3">The V.I.B.E.</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Visionary Intelligence Building Everything. The V.I.B.E. isn&apos;t a product — it&apos;s
              the fundamental energy that drives A.I.M.S. The belief that anyone can build anything,
              as long as they have the right team behind them.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="wireframe-card p-8"
          >
            <h2 className="text-xl font-bold text-gold mb-3">Activity Breeds Activity</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Our motto. When one agent moves, they all move. When you build one thing,
              the momentum carries into the next. The platform gets smarter, the agents get
              faster, and your ideas get closer to reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 border-t border-wireframe-stroke">
        <p className="text-sm text-white/40 mb-6">Ready to see what ACHEEVY can build for you?</p>
        <a
          href={`${APP_DOMAIN}/sign-up`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 transition-all"
        >
          Get Started
          <span className="text-lg">→</span>
        </a>
      </section>

      <Footer />
    </main>
  );
}
