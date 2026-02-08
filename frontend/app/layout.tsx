import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Providers from '@/components/Providers';

// All fonts are local - no Google Fonts dependency
const doto = localFont({
  src: '../fonts/Doto/Doto-VariableFont_ROND,wght.ttf',
  variable: '--font-doto',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

const permanentMarker = localFont({
  src: '../fonts/Permanent_Marker/PermanentMarker-Regular.ttf',
  variable: '--font-marker',
  display: 'swap',
  fallback: ['cursive'],
});

const caveat = localFont({
  src: '../fonts/Caveat_Brush/CaveatBrush-Regular.ttf',
  variable: '--font-caveat',
  display: 'swap',
  fallback: ['cursive'],
});

const patrickHand = localFont({
  src: '../fonts/Patrick_Hand_SC/PatrickHandSC-Regular.ttf',
  variable: '--font-patrick',
  display: 'swap',
  fallback: ['cursive'],
});

const nabla = localFont({
  src: '../fonts/Nabla/Nabla-Regular-VariableFont_EDPT,EHLT.ttf',
  variable: '--font-nabla',
  display: 'swap',
  fallback: ['fantasy'],
});

export const metadata: Metadata = {
  title: {
    default: 'A.I.M.S. | AI Managed Solutions',
    template: '%s | A.I.M.S.',
  },
  description: 'Build smarter. Work faster. AI-powered management platform with ACHEEVY orchestrator, 25 Boomer_Ang agents, 8 PMO offices, and the 3-6-9 pricing model.',
  keywords: ['AI', 'automation', 'agents', 'ACHEEVY', 'Boomer_Ang', 'PMO', 'AI management', 'business intelligence', 'plugs', 'workflow'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://plugmein.cloud'),
  openGraph: {
    type: 'website',
    siteName: 'A.I.M.S.',
    title: 'A.I.M.S. | AI Managed Solutions',
    description: 'AI-powered management platform. ACHEEVY orchestrates 25 agents across 8 PMO offices. Voice-enabled, sandbox-ready.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A.I.M.S. | AI Managed Solutions',
    description: 'AI-powered management platform with ACHEEVY, Boomer_Ang agents, and the 3-6-9 pricing model.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${doto.variable} ${permanentMarker.variable} ${caveat.variable} ${patrickHand.variable} ${nabla.variable} antialiased min-h-screen bg-[#0A0A0A] text-white font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
