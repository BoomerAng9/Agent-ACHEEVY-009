import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Permanent_Marker, Caveat } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-doto' });
const marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker'
});
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat'
});

export const metadata: Metadata = {
  title: 'A.I.M.S. | AI Managed Solutions',
  description: 'Build smarter. Work faster. AI-powered automation platform with ACHEEVY, Model Garden, and Boomer_Ang agents.',
  keywords: ['AI', 'automation', 'agents', 'ACHEEVY', 'business intelligence'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${marker.variable} ${caveat.variable} antialiased min-h-screen bg-[#0a0f1a] text-slate-200 font-sans`}>
        {children}
      </body>
    </html>
  );
}
