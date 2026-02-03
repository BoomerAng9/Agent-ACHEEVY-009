import type { ReactNode } from "react";
import { LogoWallBackground } from "@/components/LogoWallBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LogoWallBackground mode="auth">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <section className="auth-glass-card w-full max-w-md rounded-[32px] p-8 text-amber-50">
          {children}
        </section>
      </div>
    </LogoWallBackground>
  );
}
