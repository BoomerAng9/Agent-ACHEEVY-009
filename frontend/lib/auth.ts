/**
 * NextAuth.js Configuration — A.I.M.S. Authentication
 *
 * Supports:
 * - Google OAuth (primary)
 * - Credentials (email/password) for dev/fallback
 *
 * Roles:
 * - OWNER: Platform super admin (env: OWNER_EMAILS)
 * - USER: Regular customer
 *
 * Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET to .env
 */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

export type UserRole = 'OWNER' | 'USER' | 'DEMO_USER';

const IS_DEMO = process.env.DEMO_MODE === 'true';

/**
 * Owner email whitelist — comma-separated in OWNER_EMAILS env var.
 * These users get full super admin access.
 */
function getOwnerEmails(): string[] {
  const raw = process.env.OWNER_EMAILS || '';
  return raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const owners = getOwnerEmails();
  // In dev with no OWNER_EMAILS set, treat the dev user as owner
  if (owners.length === 0 && process.env.NODE_ENV !== 'production') return true;
  return owners.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth — primary auth method
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          }),
        ]
      : []),

    // GitHub OAuth — for social integration + sign-in
    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
          }),
        ]
      : []),

    // Credentials — email/password (fallback / dev / demo)
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Demo mode — allow any login with DEMO_USER role
        if (IS_DEMO && credentials.email.endsWith('@demo.plugmein.cloud')) {
          return {
            id: `demo-${Date.now()}`,
            name: 'Demo Explorer',
            email: credentials.email,
            image: null,
          };
        }

        // Owner bypass — allows platform owner to sign in with any password
        // until a real user DB is wired up
        if (isOwnerEmail(credentials.email)) {
          return {
            id: 'owner-1',
            name: 'ACHEEVY Operator',
            email: credentials.email,
            image: null,
          };
        }

        // Non-owner credentials require a real DB (not yet wired)
        if (process.env.NODE_ENV === 'production' && !IS_DEMO) {
          return null;
        }

        return {
          id: 'dev-user-1',
          name: 'ACHEEVY Operator',
          email: credentials.email,
          image: null,
        };
      },
    }),
  ],

  pages: {
    signIn: '/sign-in',
    newUser: '/onboarding/1',
  },

  session: {
    strategy: 'jwt',
    maxAge: IS_DEMO ? 4 * 60 * 60 : 30 * 24 * 60 * 60, // 4h demo, 30d production
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        if (IS_DEMO && !isOwnerEmail(user.email)) {
          token.role = 'DEMO_USER';
        } else {
          token.role = isOwnerEmail(user.email) ? 'OWNER' : 'USER';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.userId;
        (session.user as Record<string, unknown>).role = token.role || 'USER';
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
