'use client';

/**
 * The Book of V.I.B.E. — Origin Story Page
 *
 * Visionary Intelligence Building Everything.
 * The origin story of ACHEEVY and the energy that creates
 * the technology we use in A.I.M.S. products.
 *
 * Lives on plugmein.cloud — the lore & learn domain.
 */

import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/landing/Footer';
import { BOOK_OF_VIBE } from '@/lib/content/lore';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const CHAPTER_COLORS: Record<string, { border: string; glow: string; text: string }> = {
  gold: { border: 'border-gold/30', glow: 'shadow-[0_0_30px_rgba(212,175,55,0.08)]', text: 'text-gold' },
  amber: { border: 'border-amber-500/30', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.08)]', text: 'text-amber-400' },
  cyan: { border: 'border-cyan-500/30', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.08)]', text: 'text-cyan-400' },
  emerald: { border: 'border-emerald-500/30', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.08)]', text: 'text-emerald-400' },
  blue: { border: 'border-blue-500/30', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.08)]', text: 'text-blue-400' },
  purple: { border: 'border-purple-500/30', glow: 'shadow-[0_0_30px_rgba(147,51,234,0.08)]', text: 'text-purple-400' },
};

export default function BookOfVibePage() {
  return (
    <main className="flex flex-col min-h-full bg-ink text-white">
      <SiteHeader />

      {/* Hero banner */}
      <section className="relative py-20 md:py-32 text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(147,51,234,0.06) 0%, transparent 70%)',
          }}
        />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto px-4"
        >
          <motion.div variants={fadeIn} className="text-5xl mb-4">📖</motion.div>
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-marker), "Permanent Marker", cursive' }}
          >
            {BOOK_OF_VIBE.title}
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-purple-400/80 uppercase tracking-[0.2em] mb-8"
            style={{ fontFamily: 'var(--font-doto), "Doto", monospace' }}
          >
            {BOOK_OF_VIBE.subtitle}
          </motion.p>
          <motion.p variants={fadeIn} className="text-sm md:text-base text-white/40 leading-relaxed max-w-2xl mx-auto">
            {BOOK_OF_VIBE.prologue}
          </motion.p>
        </motion.div>
      </section>

      {/* Chapters */}
      <section className="max-w-4xl mx-auto px-4 pb-20 space-y-12">
        {BOOK_OF_VIBE.chapters.map((chapter) => {
          const colors = CHAPTER_COLORS[chapter.color] || CHAPTER_COLORS.gold;
          return (
            <motion.article
              key={chapter.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className={`wireframe-card p-8 md:p-10 ${colors.border} ${colors.glow}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-mono uppercase tracking-[0.3em] ${colors.text}`}>
                  Chapter {chapter.number}
                </span>
                <div className="h-px flex-1 bg-wireframe-stroke" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{chapter.title}</h2>
              <p className={`text-sm italic mb-6 ${colors.text}/60`}>{chapter.subtitle}</p>
              <p className="text-sm md:text-base text-white/60 leading-relaxed whitespace-pre-line">
                {chapter.content}
              </p>
            </motion.article>
          );
        })}

        {/* Epilogue */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center py-12 border-t border-wireframe-stroke"
        >
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-gold/50 mb-6">Epilogue</p>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl mx-auto italic">
            {BOOK_OF_VIBE.epilogue}
          </p>
          <div className="mt-8">
            <a
              href={process.env.NEXT_PUBLIC_APP_URL || 'https://aimanagedsolutions.cloud'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 transition-all"
            >
              Start Building with ACHEEVY
              <span className="text-lg">→</span>
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
