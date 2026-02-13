// frontend/components/LogoWallBackground.tsx
"use client";

import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";

type Props = {
  mode?: LogoWallMode;
  children: React.ReactNode;
};

/**
 * LogoWallBackground — Premium branded environment
 *
 * Clean, high-end spatial design inspired by a branded office/lobby.
 * No grid, no matrix, no tiled logos — just a premium dark environment
 * with subtle gold accent lighting and the ACHIEVEMOR logo as a
 * tasteful centered watermark.
 */
export function LogoWallBackground({ mode = "hero", children }: Props) {
  return (
    <div className={clsx(
      "relative text-white",
      mode === "dashboard" ? "h-full overflow-hidden bg-ink" : "min-h-full bg-ink"
    )}>
      {/* Base gradient — premium dark with warm undertone */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(212,175,55,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(212,175,55,0.02) 0%, transparent 50%),
            linear-gradient(180deg, #0B0E14 0%, #080A10 50%, #0B0E14 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Ambient gold glow — top-left corner accent (like lobby lighting) */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-[600px] h-[600px] z-0"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(212,175,55,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient gold glow — bottom-right corner */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] z-0"
        style={{
          background: 'radial-gradient(circle at 100% 100%, rgba(212,175,55,0.025) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* ACHIEVEMOR logo — single centered watermark, tasteful */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-[0.025] bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/images/logos/achievemor-gold.png')" }}
        />
      </div>

      {/* Cinematic vignette — dark edges, premium depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle horizontal line — like a floor reflection */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px z-0"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(212,175,55,0.08) 50%, transparent 90%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <main className={clsx(
        "relative z-10 flex flex-col",
        mode === "dashboard" ? "h-full" : "min-h-full",
        mode === "hero" ? "p-4 md:p-6 lg:p-8 xl:p-12" : "p-0"
      )}>
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
