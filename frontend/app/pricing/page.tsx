"use client";

import { useState } from "react";
import Link from "next/link";
import { PRICING_TIERS, type PricingTier } from "@/lib/stripe";
import { ArrowLeft, Check, Sparkles, Zap, Shield } from "lucide-react";

const TIER_ICONS: Record<string, typeof Zap> = {
  starter: Zap,
  pro: Sparkles,
  enterprise: Shield,
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  starter: "Launch your first AI agent with essential orchestration tools.",
  pro: "Scale your operation with full PMO governance and athlete analytics.",
  enterprise: "Unlimited power. Custom agents. White-label ready.",
};

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: PricingTier) => {
    setLoadingTier(tier.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently handle — production would surface this via toast
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-obsidian">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] -translate-y-1/4 rounded-full bg-amber-300/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        {/* Back link */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-200/40 hover:text-amber-200 transition-colors mb-10"
        >
          <ArrowLeft size={12} />
          Back to Sign In
        </Link>

        {/* Header */}
        <header className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/50 mb-3">
            Subscription Tiers
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-amber-50 font-display">
            CHOOSE YOUR PLAN
          </h1>
          <p className="mt-4 text-sm text-amber-100/50 max-w-lg mx-auto leading-relaxed">
            Every plan includes ACHEEVY orchestration, ORACLE verification gates,
            and secure agent infrastructure on obsidian-grade cloud.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {PRICING_TIERS.map((tier) => {
            const isPro = tier.id === "pro";
            const TierIcon = TIER_ICONS[tier.id] || Zap;

            return (
              <div
                key={tier.id}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${
                  isPro
                    ? "border-amber-300/40 bg-gradient-to-b from-amber-400/[0.08] to-black/80 shadow-[0_0_60px_rgba(251,191,36,0.15)] hover:shadow-[0_0_80px_rgba(251,191,36,0.25)] scale-[1.02] lg:scale-105"
                    : "border-white/10 bg-black/60 hover:border-amber-300/20 hover:bg-black/70"
                }`}
              >
                {/* MOST POPULAR badge */}
                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
                    <div className="rounded-b-xl bg-gradient-to-r from-amber-400 to-amber-300 px-5 py-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-8 pt-10">
                  {/* Tier Icon + Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
                        isPro
                          ? "bg-amber-300/20 text-amber-300"
                          : "bg-white/5 text-amber-200/60 group-hover:bg-amber-300/10 group-hover:text-amber-300"
                      }`}
                    >
                      <TierIcon size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-amber-50 font-display tracking-wide uppercase">
                        {tier.name}
                      </h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-amber-100/50 leading-relaxed mb-6">
                    {TIER_DESCRIPTIONS[tier.id]}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-amber-200/40 font-semibold">$</span>
                      <span className="text-5xl font-bold text-amber-50 tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-sm text-amber-100/40 ml-1">/mo</span>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-amber-200/30">
                      {tier.agents === -1 ? "Unlimited" : tier.agents} agent{tier.agents !== 1 ? "s" : ""} &middot; {tier.tokensPerMonth} tokens
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent mb-6" />

                  {/* Features */}
                  <ul className="flex-1 space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            isPro
                              ? "bg-amber-300/20 text-amber-300"
                              : "bg-white/5 text-amber-200/50"
                          }`}
                        >
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span className="text-xs text-amber-100/70 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleCheckout(tier)}
                    disabled={loadingTier === tier.id}
                    className={`flex h-12 w-full items-center justify-center rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 ${
                      isPro
                        ? "bg-gradient-to-r from-amber-400 to-amber-300 text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                        : "border border-amber-300/20 bg-amber-300/5 text-amber-200 hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-amber-100 active:scale-[0.98]"
                    }`}
                  >
                    {loadingTier === tier.id ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </span>
                    ) : (
                      "Get Started"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Taglines */}
        <footer className="mt-20 text-center space-y-4">
          <p className="text-sm text-amber-100/60 italic font-handwriting text-lg">
            &ldquo;Think it. Prompt it. Let ACHEEVY build it.&rdquo;
          </p>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-amber-200/25 select-none">
            Activity breeds Activity.
          </p>
        </footer>
      </div>
    </div>
  );
}
