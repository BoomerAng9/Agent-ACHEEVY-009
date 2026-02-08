import type { ReactNode } from "react";
import { LogoWallBackground } from "@/components/LogoWallBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LogoWallBackground mode="auth">
      <div className="flex h-screen items-center justify-center px-4 py-12 overflow-hidden">
        <section className="wireframe-card w-full max-w-[420px] rounded-[24px] px-10 py-12 text-white bg-[#0A0A0A]/90 backdrop-blur-xl">
          {children}
        </section>
      </div>
    </LogoWallBackground>
  );
}
