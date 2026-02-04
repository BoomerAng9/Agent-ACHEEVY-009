import type { ReactNode } from "react";
import { LogoWallBackground } from "@/components/LogoWallBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <LogoWallBackground mode="auth">
      {/* 
        We removed the flex centering wrapper here to allow 
        each page (sign-in/sign-up) to control its own layout 
        (e.g., split screen, centered card, etc.)
      */}
      {children}
    </LogoWallBackground>
  );
}
