/**
 * NextAuth.js Configuration — A.I.M.S. Authentication
 *
 * Supports:
 * - Google OAuth (primary)
 * - Credentials (email/password) for dev/fallback
 *
 * Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET to .env
 */
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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

    // Credentials — email/password (fallback / dev)
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: Replace with real DB lookup when persistence layer is added
        if (!credentials?.email || !credentials?.password) return null;

        // Placeholder: accept any email/password in dev, reject in prod
        if (process.env.NODE_ENV === 'production') {
          return null; // Force OAuth in production until DB is wired
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        (session.user as Record<string, unknown>).id = token.userId;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
