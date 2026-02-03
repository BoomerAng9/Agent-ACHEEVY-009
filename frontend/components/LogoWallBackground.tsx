// frontend/components/LogoWallBackground.tsx
import React from "react";
import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";

interface Props {
  mode?: LogoWallMode;
  children: React.ReactNode;
}

export function LogoWallBackground({ mode = "hero", children }: Props) {
  const overlayClass = {
    hero:    "from-black/30 via-black/60 to-black/80",
    auth:    "from-black/45 via-black/75 to-black/90",
    form:    "from-black/70 via-black/85 to-black/95",
    dashboard: "from-black/55 via-black/75 to-black/90",
  }[mode];

  return (
    <div className="relative min-h-screen bg-[#050507] text-amber-50 overflow-hidden">
      {/* Logo wall / brick layer */}
      <div
        className="pointer-events-none absolute inset-0 bg-center bg-repeat opacity-[0.12] filter grayscale transition-opacity duration-1000"
        style={{ backgroundImage: "url(/images/logos/logo-wall.png)", backgroundSize: '320px' }}
        aria-hidden="true"
      />
      {/* Gradient to fade logo behind content */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br transition-all duration-700",
          overlayClass
        )}
        aria-hidden="true"
      />
      {/* Window layer - implementing the 'Brick and Window' spec (5-10% padding) */}
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
