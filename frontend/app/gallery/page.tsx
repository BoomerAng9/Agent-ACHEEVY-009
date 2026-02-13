'use client';

/**
 * Character Gallery — Meet the A.I.M.S. Team
 *
 * Individual character cards for ACHEEVY, Boomer_Angs,
 * Chicken Hawk, and the Lil_Hawks.
 *
 * Lives on plugmein.cloud — the lore & learn domain.
 */

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SiteHeader } from '@/components/SiteHeader';
import { Footer } from '@/components/landing/Footer';
import { CHARACTERS } from '@/lib/content/lore';

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  gold: { border: 'border-gold/30', bg: 'bg-gold/5', text: 'text-gold', badge: 'bg-gold/10 text-gold border-gold/30' },
  cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
};

export default function GalleryPage() {
  return (
    <main className="flex flex-col min-h-full bg-ink text-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative py-16 md:py-24 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.05) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="text-5xl mb-4">🖼</div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-3 tracking-tight"
            style={{ fontFamily: 'var(--font-marker), "Permanent Marker", cursive' }}
          >
            Character Gallery
          </h1>
          <p className="text-sm text-white/40 max-w-lg mx-auto">
            The agents, entities, and workers that power A.I.M.S. Each one carries the V.I.B.E.
          </p>
        </div>
      </section>

      {/* Character Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
        {CHARACTERS.map((char, i) => {
          const colors = COLOR_MAP[char.color] || COLOR_MAP.gold;
          return (
            <motion.article
              key={char.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`wireframe-card p-6 md:p-8 ${colors.border} hover:${colors.bg} transition-colors`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border ${colors.border} flex-shrink-0 mx-auto md:mx-0`}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-white">{char.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.badge}`}>
                      {char.title}
                    </span>
                  </div>
                  <p className={`text-xs ${colors.text} mb-3 font-mono uppercase tracking-wider`}>
                    {char.role}
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">
                    {char.bio}
                  </p>

                  {/* Abilities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {char.abilities.map((ability) => (
                      <span
                        key={ability}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-white/60 border border-wireframe-stroke"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className={`text-sm italic ${colors.text}/70 border-l-2 ${colors.border} pl-3`}>
                    &ldquo;{char.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <Footer />
    </main>
  );
}
