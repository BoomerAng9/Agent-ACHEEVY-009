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
  title: 'A.I.M.S. | AI Managed Solutions',
  description: 'Build smarter. Work faster. AI-powered automation platform with ACHEEVY, Model Garden, and Boomer_Ang agents.',
  keywords: ['AI', 'automation', 'agents', 'ACHEEVY', 'business intelligence'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${doto.variable} ${permanentMarker.variable} ${caveat.variable} ${patrickHand.variable} ${nabla.variable} antialiased min-h-screen bg-[#0a0f1a] text-slate-200 font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
