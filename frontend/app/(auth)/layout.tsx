import type { ReactNode } from "react";
import { LogoWallBackground } from "@/components/LogoWallBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LogoWallBackground mode="auth">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-[28px] border border-amber-50/10 bg-gradient-to-b from-white/10 via-black/70 to-black/90 p-8 text-amber-50 shadow-[0_32px_96px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          {children}
        </section>
      </div>
    </LogoWallBackground>
  );
}
