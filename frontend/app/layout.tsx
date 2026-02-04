
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// We import Doto via Google Fonts in CSS usually, or next/font/google if available. 
// Assuming standard Next.js next/font usage for optimal loading:
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'A.I.M.S. | AI Managed Systems',
  description: 'AI Managed Systems powered by ACHEEVY. No config. Just results.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen bg-obsidian text-slate-200 font-sans`}>
        {/* We moved layout wrappers for Nav and Background into specific pages to support different modes (hero vs dashboard vs auth) 
            properly without hacking global layout state. */}
        {children}
      </body>
    </html>
  );
}
