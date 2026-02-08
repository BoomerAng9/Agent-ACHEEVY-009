import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'ACHEEVY Sandbox',
  description: 'Chat with ACHEEVY — your AI executive orchestrator. Upload files, use voice, and watch agents collaborate in real-time through the Chain of Command.',
  openGraph: {
    title: 'ACHEEVY Sandbox | A.I.M.S.',
    description: 'AI-powered sandbox with chat, voice, file upload, and live agent collaboration feed.',
  },
};

export default function AcheevyLayout({ children }: { children: ReactNode }) {
  return children;
}
