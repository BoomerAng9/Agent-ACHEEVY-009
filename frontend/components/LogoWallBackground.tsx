
// frontend/components/LogoWallBackground.tsx
import React from "react";
import clsx from "clsx";

type LogoWallMode = "hero" | "auth" | "form" | "dashboard";

interface Props {
  mode?: LogoWallMode;
  children: React.ReactNode;
}

export function LogoWallBackground({ mode = "hero", children }: Props) {
  // Define overlay opacity based on mode
  const overlayClass = {
    hero:    "bg-black/80", 
    auth:    "bg-black/70", 
    form:    "bg-black/85",
    dashboard: "bg-black/90", 
  }[mode];

  return (
    <div className="relative min-h-screen bg-[#050507] text-amber-50 overflow-hidden font-sans">
      {/* Brick Wall: The Logo Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.15] pointer-events-none z-0"
        style={{
             backgroundImage: "url('/images/acheevy/logo-abstract.png')",
             backgroundSize: "400px",
             filter: "grayscale(100%) brightness(0.7)"
        }}
      />
      
      {/* Overlay: To push the wall back */}
      <div className={clsx("fixed inset-0 z-0 pointer-events-none transition-all duration-700", overlayClass)} />

      {/* Window: The Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
         {children}
      </div>
    </div>
  );
}
