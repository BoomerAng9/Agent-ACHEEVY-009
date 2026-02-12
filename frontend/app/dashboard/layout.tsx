// frontend/app/dashboard/layout.tsx
export const dynamic = 'force-dynamic';

import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "../../components/DashboardShell";
import { FloatingACHEEVY } from "../../components/global/FloatingACHEEVY";
import { QuickSwitcher } from "../../components/global/QuickSwitcher";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // Gate ALL dashboard routes behind authentication
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      {/* Persistent global components */}
      <FloatingACHEEVY />
      <QuickSwitcher />
    </>
  );
}
