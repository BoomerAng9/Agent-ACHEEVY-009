// frontend/components/LogoWallBackground.tsx
"use client";

import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";

type Props = {
  mode?: LogoWallMode;
  children: React.ReactNode;
};

/**
 * LogoWallBackground — tiles the real ACHIEVEMOR gold logo as a
 * repeating background pattern with mode-based opacity and gradient overlay.
 */
export function LogoWallBackground({ mode = "hero", children }: Props) {
  const patternOpacity = {
    hero:      "opacity-[0.18]",
    auth:      "opacity-[0.22]",
    form:      "opacity-[0.10]",
    dashboard: "opacity-[0.08]",
  }[mode];

  const overlayClass = {
    hero:      "from-black/40 via-black/60 to-black/80",
    auth:      "from-black/30 via-black/50 to-black/70",
    form:      "from-black/70 via-black/85 to-black/95",
    dashboard: "from-black/55 via-black/75 to-black/90",
  }[mode];

  return (
    <div className="relative min-h-screen bg-[#050507] text-amber-50 overflow-hidden">
      {/* Layer 0: Tiled ACHIEVEMOR gold logo */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 transition-opacity duration-1000 bg-repeat [background-size:220px_220px] [background-image:url('/images/logos/achievemor-gold.png')]",
          patternOpacity
        )}
        aria-hidden="true"
      />

      {/* Layer 1: Depth gradient overlay */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br transition-all duration-700",
          overlayClass
        )}
        aria-hidden="true"
      />

      {/* Layer 2: Content */}
      <main className={clsx(
        "relative z-10 min-h-screen flex flex-col",
        mode === "hero" || mode === "dashboard" ? "p-4 md:p-8 lg:p-12" : "p-0"
      )}>
        <div className={clsx(
          "flex-1 flex flex-col w-full",
          (mode === "hero" || mode === "dashboard") && "rounded-[32px] border border-white/5 bg-black/20 backdrop-blur-[2px] shadow-2xl"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
