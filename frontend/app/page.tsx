/**
 * A.I.M.S. Landing Page
 *
 * Main entry point showcasing real production apps built with A.I.M.S.
 * Instead of conversation starters, we show actual working applications.
 */

import { Hero, FeatureSection } from '@/components/landing/Hero';
import { AppShowcase, BuildPrompts } from '@/components/landing/AppShowcase';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      {/* Hero Section */}
      <Hero />

      {/* Real Apps Showcase */}
      <AppShowcase />

      {/* Build Prompts (Instead of Conversation Starters) */}
      <BuildPrompts />

      {/* Feature Section */}
      <FeatureSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
