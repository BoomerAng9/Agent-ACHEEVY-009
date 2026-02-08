// frontend/components/DashboardShell.tsx
"use client";

import type { ReactNode } from "react";
import { DashboardNav } from "./DashboardNav";
import { LogoWallBackground } from "./LogoWallBackground";
import { DynamicTagline } from "./DynamicTagline";
import { MottoBar } from "./MottoBar";

type Props = {
  children: ReactNode;
};

export function DashboardShell({ children }: Props) {
  return (
    <LogoWallBackground mode="dashboard">
      <div className="flex max-h-screen overflow-hidden">
        {/* Left rail — wireframe glass sidebar */}
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-wireframe-stroke bg-black/60 backdrop-blur-xl lg:flex">
          <div className="px-4 py-5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-sm uppercase tracking-wider text-amber-50">
                A.I.M.S.
              </span>
              <span className="text-[0.55rem] uppercase tracking-[0.12em] text-white/40">
                by ACHIEVEMOR
              </span>
            </div>
            <p className="mt-1 text-[0.65rem] text-white/40">
              ACHEEVY command center
            </p>
          </div>

          {/* Navigation — scrollable */}
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            <DashboardNav />
          </div>

          {/* Live status card */}
          <div className="mx-3 mb-3 wireframe-card px-3 py-3 text-[0.75rem] text-white/70">
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-gold/60 font-mono">
              Live status
            </p>
            <p className="mt-1">
              ACHEEVY is online and ready to orchestrate Boomer_Angs.
            </p>
            <p className="mt-1 text-white/50">
              LUC tracking:{" "}
              <span className="font-semibold text-gold">real-time</span>.
            </p>
          </div>

          {/* Dynamic tagline */}
          <div className="px-3 pb-4">
            <DynamicTagline compact />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex flex-1 flex-col max-h-screen overflow-hidden">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-wireframe-stroke bg-[#0A0A0A]/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 xl:px-12">
            <div className="flex flex-col">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-gold/60 font-mono">
                Dashboard
              </span>
              <span className="text-sm text-white/80">
                Think it. Prompt it. Let ACHEEVY manage it.
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* LUC pill */}
              <div className="hidden items-center gap-2 rounded-lg border border-wireframe-stroke bg-black/60 px-3 py-1.5 text-xs text-white/60 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="font-mono text-[0.65rem]">LUC</span>
                <span className="text-gold font-semibold">$0.00</span>
              </div>
              {/* User chip */}
              <button className="flex items-center gap-2 rounded-lg border border-wireframe-stroke bg-black/60 px-2.5 py-1.5 text-xs text-white/70 hover:border-white/20 transition-colors">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-gold to-gold-dark" />
                <span>My account</span>
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 xl:px-12">
            <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Doctrine — ambient reinforcement */}
      <MottoBar position="fixed" />
    </LogoWallBackground>
  );
}
