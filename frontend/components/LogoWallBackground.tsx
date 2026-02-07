// frontend/components/LogoWallBackground.tsx
"use client";

import React from "react";
import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";
type LogoColorway = "champagne" | "deepsea";

interface Props {
  mode?: LogoWallMode;
  colorway?: LogoColorway;
  children: React.ReactNode;
}

/**
 * Diagonal rounded-bar pattern that forms the structural "brick" surface.
 * UI elements are the "windows" cut into this wall.
 *
 * The SVG renders capsule-shaped bars at 45 degrees with a 3D embossed effect,
 * tiled across the entire viewport.
 */
function DiagonalBarPattern({ colorway }: { colorway: LogoColorway }) {
  const color = colorway === "champagne"
    ? { bar: "#B8962E", highlight: "#D4AF37", shadow: "#6B5B1F", glow: "rgba(212,175,55,0.15)" }
    : { bar: "#0E7490", highlight: "#22D3EE", shadow: "#064E5C", glow: "rgba(34,211,238,0.12)" };

  // Each bar is a rounded rect rotated -45deg. We define several bars at
  // varying lengths/positions to match the logo pattern.
  const bars = [
    { x: 20,  y: 10,  w: 80,  h: 18 },
    { x: 110, y: 10,  w: 50,  h: 18 },
    { x: 10,  y: 40,  w: 50,  h: 18 },
    { x: 70,  y: 40,  w: 100, h: 18 },
    { x: 30,  y: 70,  w: 70,  h: 18 },
    { x: 115, y: 70,  w: 55,  h: 18 },
    { x: 5,   y: 100, w: 90,  h: 18 },
    { x: 105, y: 100, w: 65,  h: 18 },
    { x: 45,  y: 130, w: 60,  h: 18 },
    { x: 120, y: 130, w: 40,  h: 18 },
    { x: 15,  y: 160, w: 55,  h: 18 },
    { x: 80,  y: 160, w: 85,  h: 18 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="diag-bars"
          x="0" y="0"
          width="180" height="180"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          {bars.map((b, i) => (
            <React.Fragment key={i}>
              {/* Shadow / depth */}
              <rect
                x={b.x + 1} y={b.y + 1}
                width={b.w} height={b.h}
                rx={b.h / 2}
                fill={color.shadow}
                opacity={0.6}
              />
              {/* Main bar */}
              <rect
                x={b.x} y={b.y}
                width={b.w} height={b.h}
                rx={b.h / 2}
                fill={color.bar}
                opacity={0.9}
              />
              {/* Top-edge highlight */}
              <rect
                x={b.x + 2} y={b.y + 1}
                width={b.w - 4} height={3}
                rx={1.5}
                fill={color.highlight}
                opacity={0.4}
              />
            </React.Fragment>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#diag-bars)`} />
    </svg>
  );
}

export function LogoWallBackground({ mode = "hero", colorway = "champagne", children }: Props) {
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
      {/* Layer 0: Diagonal bar pattern — the structural "brick" material */}
      <div
        className={clsx("pointer-events-none absolute inset-0 transition-opacity duration-1000", patternOpacity)}
        aria-hidden="true"
      >
        <DiagonalBarPattern colorway={colorway} />
      </div>

      {/* Layer 1: Depth gradient — bars recede behind content */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 bg-gradient-to-br transition-all duration-700",
          overlayClass
        )}
        aria-hidden="true"
      />

      {/* Layer 2: Window layer — content cut into the wall */}
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
