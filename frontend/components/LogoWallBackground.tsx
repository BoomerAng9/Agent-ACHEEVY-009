// frontend/components/LogoWallBackground.tsx
"use client";

import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";

type Props = {
  mode?: LogoWallMode;
  children: React.ReactNode;
};

/**
 * LogoWallBackground — Edge-only gold treatment with technical
 * dot-matrix + grid pattern. Gold ACHIEVEMOR logo appears only
 * as a subtle corner stamp, never tiled across the page.
 */
export function LogoWallBackground({ mode = "hero", children }: Props) {
  // Full dot-matrix + grid for hero/auth; lighter grid-only for dashboard/form
  const bgClass = {
    hero:      "aims-page-bg",
    auth:      "aims-page-bg",
    form:      "bg-[#0A0A0A]",
    dashboard: "bg-[#0A0A0A]",
  }[mode];

  // Gold edge rail for hero/auth modes
  const edgeClass = {
    hero:      "gold-edge-rail",
    auth:      "gold-edge-rail",
    form:      "",
    dashboard: "",
  }[mode];

  return (
    <div className={clsx("relative min-h-screen text-amber-50 overflow-hidden", bgClass, edgeClass)}>
      {/* Subtle grid overlay for dashboard/form (lighter than aims-page-bg) */}
      {(mode === "dashboard" || mode === "form") && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40 bg-grid-fine [background-size:48px_48px]"
          aria-hidden="true"
        />
      )}

      {/* Corner logo stamp — bottom-right, very subtle */}
      {(mode === "hero" || mode === "auth") && (
        <div
          className="pointer-events-none absolute bottom-4 right-4 w-12 h-12 opacity-[0.05] bg-contain bg-no-repeat bg-center z-0 [background-image:url('/images/logos/achievemor-gold.png')]"
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <main className={clsx(
        "relative z-10 min-h-screen flex flex-col",
        mode === "hero" || mode === "dashboard" ? "p-4 md:p-6 lg:p-8 xl:p-12" : "p-0"
      )}>
        <div className={clsx(
          "flex-1 flex flex-col w-full",
          (mode === "hero" || mode === "dashboard") && "rounded-[24px] border border-wireframe-stroke bg-black/20 shadow-wireframe-inner"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
}
