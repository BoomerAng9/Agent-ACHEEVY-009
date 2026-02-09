// frontend/app/api/auth/demo-session/route.ts
import { NextResponse } from "next/server";

/**
 * GET /api/auth/demo-session
 *
 * When DEMO_MODE=true, auto-creates a guest session and redirects to /dashboard.
 * Uses NextAuth credentials provider under the hood.
 */
export async function GET() {
  const isDemo = process.env.DEMO_MODE === "true";

  if (!isDemo) {
    return NextResponse.redirect(new URL("/sign-in", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  // Generate a unique guest ID
  const guestId = `demo-guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Redirect to the NextAuth sign-in endpoint with demo credentials
  const signInUrl = new URL("/api/auth/callback/credentials", process.env.NEXTAUTH_URL || "http://localhost:3000");
  signInUrl.searchParams.set("email", `${guestId}@demo.plugmein.cloud`);
  signInUrl.searchParams.set("password", "demo-access");
  signInUrl.searchParams.set("callbackUrl", "/dashboard");

  // In practice, we redirect to the sign-in page with pre-filled demo credentials
  // The credentials provider in auth.ts handles DEMO_USER role assignment
  const redirectUrl = new URL("/sign-in", process.env.NEXTAUTH_URL || "http://localhost:3000");
  redirectUrl.searchParams.set("demo", "true");
  redirectUrl.searchParams.set("callbackUrl", "/dashboard");

  return NextResponse.redirect(redirectUrl);
}
