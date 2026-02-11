// frontend/app/(auth)/sign-in/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { tapScale } from '@/lib/motion/variants';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

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

  // ── Tron Ares Aesthetic Variants ───────────────────────────
  const circuitryEntry = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const glowPulse = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(251,191,36,0.1)',
        '0 0 40px rgba(251,191,36,0.3)',
        '0 0 20px rgba(251,191,36,0.1)'
      ],
      transition: { duration: 3, repeat: Infinity }
    }
  };

  // ── Handlers ───────────────────────────────────────────────
  const handleOAuthSignIn = async (provider: string) => {
    setError(null);
    setIsLoading(provider);
    try {
      // Simulate "deploying" auth request
      await new Promise(r => setTimeout(r, 600)); 
      await signIn(provider, { callbackUrl });
    } catch (err) {
      setError(`Failed to initiate ${provider} sequence`);
      setIsLoading(null);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Credentials required for system access');
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
        setError('Access Denied: Invalid credentials');
        setIsLoading(null);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('System Error: Authentication failed');
      setIsLoading(null);
    }
  };

  const decodeError = (code: string | null) => {
    if (!code) return null;
    const map: Record<string, string> = {
      OAuthSignin: 'OAuth handshake failed',
      OAuthCallback: 'Callback verification failed',
      CredentialsSignin: 'Invalid identity credentials',
      Default: 'Authentication system error'
    };
    return map[code] || 'Unknown error occurred';
  };

  const activeError = error || decodeError(authError);

  return (
    <div className="relative min-h-[600px] flex flex-col items-center justify-center p-6 space-y-8 w-full max-w-md mx-auto">
      
      {/* ── Background Grid (CSS) ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[30px] border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,rgba(0,0,0,0)_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-50" />
      </div>

      {/* ── Master Control Entity ──────────────────────────── */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={circuitryEntry}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-6">
          {/* Glowing Aura */}
          <motion.div 
            variants={glowPulse}
            animate="animate"
            className="absolute inset-0 rounded-full bg-gold/5 blur-xl"
          />
          
          {/* ACHEEVY Helmet */}
          <div className="relative w-full h-full rounded-2xl overflow-hidden ring-1 ring-gold/20 shadow-2xl shadow-black/50 bg-black/40 backdrop-blur-sm">
             <Image
              src="/images/acheevy/acheevy-helmet.png"
              alt="ACHEEVY Master Control"
              fill
              className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
            />
          </div>
          
          {/* Connection Line */}
          <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-gradient-to-b from-gold/40 to-transparent" />
        </div>

        {/* Branding */}
        <div className="text-center space-y-2 mb-2">
           <div className="relative w-48 h-12 mx-auto">
             <Image
               src="/images/logos/achievemor-gold.png"
               alt="ACHIEVEMOR"
               fill
               className="object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
             />
           </div>
           <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
             System Access Portal
           </p>
        </div>
      </motion.div>

      {/* ── Auth Interface ─────────────────────────────────── */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full z-10"
      >
        {activeError && (
          <div className="mb-6 p-3 bg-red-900/20 border-l-2 border-red-500 text-red-400 text-xs font-mono">
            ⚠ ERROR: {activeError}
          </div>
        )}

        {!showEmailForm ? (
          <div className="space-y-4">
             {/* Google Button - "Mainframe Access" */}
             <button
               onClick={() => handleOAuthSignIn('google')}
               disabled={isLoading !== null}
               className="group relative w-full h-14 overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
             >
               <div className="absolute inset-0 flex items-center justify-center gap-3">
                 {isLoading === 'google' ? (
                   <Loader2 className="w-5 h-5 text-gold animate-spin" />
                 ) : (
                   <>
                     <svg className="w-5 h-5 mt-[1px]" viewBox="0 0 24 24">
                        <path fill="#FFFF" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                     </svg>
                     <span className="font-sans text-sm tracking-wide text-white/90 group-hover:text-white">
                       Sign in with Google
                     </span>
                   </>
                 )}
               </div>
               {/* Hover Effect Line */}
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
             </button>

             {/* Discord Button */}
             <button
               onClick={() => handleOAuthSignIn('discord')}
               disabled={isLoading !== null}
               className="group relative w-full h-14 overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/10 transition-all duration-300 disabled:opacity-50"
             >
               <div className="absolute inset-0 flex items-center justify-center gap-3">
                 {isLoading === 'discord' ? (
                   <Loader2 className="w-5 h-5 text-[#5865F2] animate-spin" />
                 ) : (
                   <>
                     <svg className="w-5 h-5 text-[#5865F2] mt-[1px]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/>
                     </svg>
                     <span className="font-sans text-sm tracking-wide text-white/90 group-hover:text-white">
                       Sign in with Discord
                     </span>
                   </>
                 )}
               </div>
               <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5865F2] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
             </button>

             {/* Divider */}
             <div className="flex items-center gap-4 py-2">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
               <span className="text-[10px] uppercase tracking-widest text-white/20">or</span>
               <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             </div>

             {/* Email Toggle */}
             <motion.button
               whileTap={{ scale: 0.98 }}
               onClick={() => setShowEmailForm(true)}
               className="w-full h-12 rounded-lg border border-white/5 text-xs uppercase tracking-widest text-white/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all"
             >
               Use Access Credentials
             </motion.button>
          </div>
        ) : (
          /* Email Form */
          <form onSubmit={handleEmailSignIn} className="space-y-5">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-[0.6rem] uppercase tracking-[0.2em] text-white/30 mb-2 font-mono group-focus-within:text-gold/50 transition-colors">
                  Identity (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all text-sm font-mono"
                  placeholder="agent@achievemor.io"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="group">
                 <div className="flex justify-between items-center mb-2">
                  <label className="text-[0.6rem] uppercase tracking-[0.2em] text-white/30 font-mono group-focus-within:text-gold/50 transition-colors">
                    Passcode
                  </label>
                  <Link href="/forgot-password" className="text-[0.6rem] text-white/20 hover:text-gold transition-colors">
                    RECOVER?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/10 focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all text-sm font-mono"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading !== null}
              className="relative w-full h-12 rounded-lg bg-gold/10 border border-gold/30 text-gold font-medium text-xs uppercase tracking-[0.2em] hover:bg-gold/20 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              {isLoading === 'credentials' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  INITIATE SESSION
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => { setShowEmailForm(false); setError(null); }}
              className="w-full text-center text-[10px] uppercase tracking-widest text-white/30 hover:text-white/50 transition-colors"
            >
              Return to Mainframe
            </button>
          </form>
        )}

      </motion.div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="absolute bottom-6 text-center">
         <div className="flex items-center gap-2 mb-2 justify-center">
           <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono">
             System Status: Online
           </span>
         </div>
         <p className="text-[9px] text-white/10 max-w-[200px] mx-auto leading-relaxed">
           UNAUTHORIZED ACCESS IS PROHIBITED. <br/>
           ALL ACTIVITY IS LOGGED AND MONITORIED BY ACHEEVY.
         </p>
      </div>

    </div>
  );
}
