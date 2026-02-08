import type { ReactNode } from "react";
import { LogoWallBackground } from "@/components/LogoWallBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LogoWallBackground mode="auth">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <section className="auth-glass-card w-full max-w-[420px] rounded-[32px] px-10 py-12 text-amber-50">
          {children}
        </section>
      </div>
    </LogoWallBackground>
  );
}
