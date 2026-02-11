// frontend/app/(auth)/sign-in/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { tapScale } from '@/lib/motion/variants';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function SignInPage() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null); // track which provider

  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const authError = searchParams.get('error');

  // ── OAuth Sign In ──────────────────────────────────────────
  const handleOAuthSignIn = async (provider: string) => {
    setError(null);
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to initiate ${provider} sign-in`);
      setIsLoading(null);
    }
  };

  // ── Credentials Sign In ────────────────────────────────────
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setError(null);
    setIsLoading('credentials');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(null);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Sign-in failed. Please try again.');
      setIsLoading(null);
    }
  };

  // Map NextAuth error codes to readable messages
  const getErrorMessage = (code: string | null): string | null => {
    if (!code) return null;
    const messages: Record<string, string> = {
      OAuthSignin: 'Could not start OAuth sign-in. Check provider configuration.',
      OAuthCallback: 'OAuth callback error. Try again.',
      OAuthCreateAccount: 'Could not create OAuth account.',
      Callback: 'Authentication callback error.',
      OAuthAccountNotLinked: 'This email is already linked to another provider.',
      CredentialsSignin: 'Invalid email or password.',
      Default: 'An authentication error occurred.',
    };
    return messages[code] || messages.Default;
  };

  const displayError = error || getErrorMessage(authError);

  return (
    <div className="space-y-8">
      {/* Branded heading */}
      <header className="text-center">
        <h1 className="text-[2.2rem] md:text-[2.5rem] font-display tracking-[0.2em] leading-tight text-gold uppercase">
          A.I.M.S.
        </h1>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/40 font-mono">
          AI Managed Solutions
        </p>
      </header>

      {/* Error display */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center"
        >
          {displayError}
        </motion.div>
      )}

      {!showEmailForm ? (
        <>
          {/* Social auth tiles — wireframe glass squares */}
          <div className="flex justify-center gap-3">
            {/* Google */}
            <motion.button
              {...tapScale}
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading !== null}
              className="wireframe-card flex flex-col items-center justify-center w-[88px] h-[88px] hover-glow-border disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading === 'google' ? (
                <Loader2 className="w-6 h-6 mb-1.5 animate-spin text-white/50" />
              ) : (
                <svg className="w-6 h-6 mb-1.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-[10px] text-white/50">Google</span>
            </motion.button>

            {/* Discord */}
            <motion.button
              {...tapScale}
              onClick={() => handleOAuthSignIn('discord')}
              disabled={isLoading !== null}
              className="wireframe-card flex flex-col items-center justify-center w-[88px] h-[88px] hover-glow-border disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading === 'discord' ? (
                <Loader2 className="w-6 h-6 mb-1.5 animate-spin text-white/50" />
              ) : (
                <svg className="w-6 h-6 mb-1.5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
                </svg>
              )}
              <span className="text-[10px] text-white/50">Discord</span>
            </motion.button>
          </div>

          {/* Email sign-in option */}
          <div className="flex flex-col items-center gap-4">
            <motion.button
              {...tapScale}
              onClick={() => setShowEmailForm(true)}
              className="rounded-lg border border-wireframe-stroke bg-white/5 px-8 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Or sign in with email
            </motion.button>

            <Link
              href="/forgot-password"
              className="text-xs text-white/30 hover:text-gold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </>
      ) : (
        /* Email Form */
        <form onSubmit={handleEmailSignIn} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-white/30 mb-2 font-mono">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-wireframe-stroke text-white placeholder:text-white/20 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30 font-mono">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[0.6rem] text-gold/50 hover:text-gold transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-wireframe-stroke text-white placeholder:text-white/20 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <motion.button
            {...tapScale}
            type="submit"
            disabled={isLoading !== null}
            className="w-full py-3 rounded-lg bg-gold/10 border border-gold/20 text-gold font-medium text-sm uppercase tracking-wider hover:bg-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading === 'credentials' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => { setShowEmailForm(false); setError(null); }}
            className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Back to social sign in
          </button>
        </form>
      )}

      {/* Guest tour */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 border-t border-wireframe-stroke" />
          <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/20 font-mono">or</span>
          <div className="flex-1 border-t border-wireframe-stroke" />
        </div>
        <motion.div {...tapScale} className="w-full">
          <Link
            href="/dashboard"
            className="block w-full py-3 rounded-xl bg-gold text-center text-sm font-medium text-black uppercase tracking-wider hover:bg-gold-light transition-all"
          >
            Guest Tour Mode
          </Link>
        </motion.div>
      </div>

      {/* Create account link */}
      <div className="text-center pt-2">
        <span className="text-xs text-white/30">New here? </span>
        <Link href="/sign-up" className="text-xs text-gold/80 hover:text-gold transition-colors">
          Create access ID
        </Link>
      </div>
    </div>
  );
}
