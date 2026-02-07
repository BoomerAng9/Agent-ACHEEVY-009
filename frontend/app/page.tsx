/**
 * A.I.M.S. Landing Page
 *
 * Composes the full brand experience from existing components:
 * - SiteHeader: Sticky nav with ACHEEVY helmet logo
 * - Hero: Circuit board animated hero with stats
 * - HeroAcheevy: Split section with ACHEEVY character
 * - FeatureSection: 6 platform feature cards
 * - AppShowcase: Production-ready app showcase
 * - BuildPrompts: Natural language prompt examples
 * - Footer: Full footer with social links and navigation
 * - FloatingChat: Persistent ACHEEVY chat button
 */

import { Hero, FeatureSection } from '@/components/landing/Hero';
import { HeroAcheevy } from '@/components/HeroAcheevy';
import { MottoBar } from '@/components/MottoBar';
import { AppShowcase, BuildPrompts } from '@/components/landing/AppShowcase';
import { Footer } from '@/components/landing/Footer';
import { SiteHeader } from '@/components/SiteHeader';
import FloatingChat from '@/components/FloatingChat';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      <SiteHeader />
      <Hero />
      <HeroAcheevy />
      <MottoBar />
      <FeatureSection />
      <AppShowcase />
      <BuildPrompts />
      <Footer />
      <FloatingChat />
    </main>
  );
}
