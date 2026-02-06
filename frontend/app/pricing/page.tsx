// frontend/app/pricing/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BASE_TIERS,
  GROUP_STRUCTURES,
  TASK_MULTIPLIERS,
  USAGE_MODIFIERS,
  calculateBill,
  type FrequencyId,
  type GroupId,
  type TaskTypeId,
} from "@/lib/stripe";

export default function PricingPage() {
  const [selectedTier, setSelectedTier] = useState<FrequencyId>("garage");
  const [selectedGroup, setSelectedGroup] = useState<GroupId>("individual");
  const [seatCount, setSeatCount] = useState(1);
  const [taskWeights, setTaskWeights] = useState<Partial<Record<TaskTypeId, number>>>({
    code_gen: 80,
    code_review: 20,
  });

  const bill = calculateBill(selectedTier, selectedGroup, seatCount, taskWeights);

  const updateWeight = (id: TaskTypeId, value: number) => {
    setTaskWeights(prev => {
      const next = { ...prev };
      if (value === 0) {
        delete next[id];
      } else {
        next[id] = value;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/50 mb-3">
            The 3-6-9 Frequency Model
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display">
            BUILD YOUR BILL
          </h1>
          <p className="mt-4 text-sm text-amber-100/60 max-w-xl mx-auto">
            No two users need identical bills. Choose your commitment frequency,
            team size, and task mix. Activity breeds Activity.
          </p>
        </div>

        {/* ─── Dimension 1: Base Frequency ─── */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-amber-200/70 mb-6 font-display">
            1. Choose Your Frequency
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BASE_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              const isVibe = tier.id === "enterprise";
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative rounded-3xl border p-6 text-left transition-all ${
                    isSelected
                      ? "border-amber-300/50 bg-amber-300/5 shadow-[0_0_30px_rgba(251,191,36,0.15)]"
                      : "border-white/10 bg-black/60 hover:border-white/20"
                  }`}
                >
                  {isVibe && (
                    <span className="absolute -top-3 right-4 rounded-full bg-amber-300 px-3 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider">
                      V.I.B.E.
                    </span>
                  )}
                  <p className="text-lg font-bold text-amber-50">{tier.name}</p>
                  <p className="text-[10px] uppercase tracking-wider text-amber-100/40 mt-1">
                    {tier.commitmentMonths > 0
                      ? `${tier.commitmentMonths}-month commitment`
                      : "No commitment"}
                  </p>

                  {tier.monthlyPrice > 0 ? (
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-amber-50">
                        ${tier.monthlyPrice}
                      </span>
                      <span className="text-sm text-amber-100/50">/mo</span>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <span className="text-xl font-bold text-amber-50">Pay as you go</span>
                    </div>
                  )}

                  <p className="mt-1 text-[10px] text-amber-300/60">{tier.discount}</p>

                  <div className="mt-4 space-y-1.5 text-xs text-amber-100/50">
                    {tier.tokensIncluded > 0 && (
                      <p>{(tier.tokensIncluded / 1000).toFixed(0)}K tokens/mo</p>
                    )}
                    {tier.overdraftBuffer > 0 && (
                      <p>{(tier.overdraftBuffer / 1000).toFixed(0)}K overdraft buffer</p>
                    )}
                    {tier.id === "p2p" && (
                      <p>100 tokens per $1</p>
                    )}
                    {isVibe && (
                      <p className="text-amber-300/80 font-semibold">Pay 9 months, get 3 free</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Dimension 3: Group Structure ─── */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-amber-200/70 mb-6 font-display">
            2. Group Structure
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GROUP_STRUCTURES.map((group) => (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group.id);
                  if (group.id === "individual") setSeatCount(1);
                  else if (group.id === "family") setSeatCount(4);
                  else if (group.id === "team") setSeatCount(5);
                  else setSeatCount(25);
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  selectedGroup === group.id
                    ? "border-amber-300/40 bg-amber-300/5"
                    : "border-white/10 bg-black/60 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-semibold text-amber-50">{group.name}</p>
                <p className="text-[10px] text-amber-100/40 mt-0.5">{group.seats} seats</p>
                {group.multiplier > 0 ? (
                  <p className="text-xs text-amber-300/60 mt-2">{group.multiplier}x base price</p>
                ) : (
                  <p className="text-xs text-amber-300/60 mt-2">Custom contract</p>
                )}
              </button>
            ))}
          </div>
          {(selectedGroup === "team" || selectedGroup === "enterprise-group") && (
            <div className="mt-4 flex items-center gap-3">
              <label className="text-xs text-amber-100/50">Seats:</label>
              <input
                type="number"
                value={seatCount}
                onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-20 rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-amber-50 outline-none focus:border-amber-300"
              />
              {selectedGroup === "team" && (
                <span className="text-[10px] text-amber-100/40">+${GROUP_STRUCTURES[2].perSeatAddon}/seat above base</span>
              )}
            </div>
          )}
        </section>

        {/* ─── Dimension 4: Task Mix ─── */}
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-widest text-amber-200/70 mb-6 font-display">
            3. Task Mix (Adjust Weights)
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TASK_MULTIPLIERS.map((task) => {
              const weight = taskWeights[task.id] || 0;
              return (
                <div
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-black/60 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-amber-50">{task.name}</p>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/5 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                      {task.multiplier}x
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-100/40 mb-3">{task.description}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={weight}
                      onChange={(e) => updateWeight(task.id, parseInt(e.target.value))}
                      className="flex-1 accent-amber-300"
                    />
                    <span className="w-10 text-right text-xs font-mono text-amber-100/60">
                      {weight}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── Bill Estimate ─── */}
        <section className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/5 to-black/80 p-8 shadow-[0_0_60px_rgba(251,191,36,0.1)]">
          <h2 className="text-xs uppercase tracking-widest text-amber-200/70 mb-6 font-display">
            Your Bill Estimate
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Plan</p>
              <p className="text-xl font-bold text-amber-50 mt-1">{bill.baseTier.name}</p>
              <p className="text-xs text-amber-100/50">
                {bill.baseTier.commitmentMonths > 0
                  ? `${bill.baseTier.commitmentMonths}-month commitment`
                  : "Pay-as-you-go"}
                {bill.baseTier.deliveredMonths > bill.baseTier.commitmentMonths &&
                  ` (${bill.baseTier.deliveredMonths} months delivered)`}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Group</p>
              <p className="text-xl font-bold text-amber-50 mt-1">{bill.group.name}</p>
              <p className="text-xs text-amber-100/50">{seatCount} seat{seatCount > 1 ? "s" : ""}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Task Multiplier</p>
              <p className="text-xl font-bold text-amber-50 mt-1">{bill.effectiveMultiplier}x</p>
              <p className="text-xs text-amber-100/50">Weighted average</p>
            </div>
          </div>

          <hr className="border-white/5 my-6" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Monthly Base</p>
              <p className="text-2xl font-bold text-amber-50 mt-1">${bill.monthlyBase}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">With Group</p>
              <p className="text-2xl font-bold text-amber-50 mt-1">
                {selectedGroup === "enterprise-group" ? "Custom" : `$${bill.monthlyWithGroup}`}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-300/60">Monthly Estimate</p>
              <p className="text-2xl font-bold text-amber-300 mt-1">
                {selectedGroup === "enterprise-group" ? "Custom" : `$${bill.monthlyEstimate}`}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Commitment Total</p>
              <p className="text-2xl font-bold text-amber-50 mt-1">
                {bill.commitmentTotal > 0 ? `$${bill.commitmentTotal}` : "\u2014"}
              </p>
            </div>
          </div>

          <hr className="border-white/5 my-6" />

          {/* Token Allocation */}
          <div className="flex flex-wrap gap-6 text-xs text-amber-100/50">
            <div>
              <span className="text-amber-100/30">Tokens/mo: </span>
              <span className="text-amber-50 font-semibold">
                {bill.tokensPerMonth > 0
                  ? `${(bill.tokensPerMonth / 1000).toFixed(0)}K`
                  : "Metered (100 per $1)"}
              </span>
            </div>
            <div>
              <span className="text-amber-100/30">Overage: </span>
              <span className="text-amber-50">${USAGE_MODIFIERS.overageRatePer1K}/1K tokens</span>
            </div>
            <div>
              <span className="text-amber-100/30">LUC Calculator: </span>
              <span className="text-emerald-400">Included</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {selectedGroup === "enterprise-group" ? (
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-3 text-sm font-bold text-black hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                Contact Sales
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-3 text-sm font-bold text-black hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                Get Started — ${bill.monthlyEstimate}/mo
              </Link>
            )}
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full border border-amber-300/30 px-8 py-3 text-sm font-semibold text-amber-300 hover:bg-amber-300/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* ─── V.I.B.E. Philosophy ─── */}
        <section className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/40 mb-2">The Frequency Philosophy</p>
          <p className="text-sm text-amber-100/50 max-w-lg mx-auto leading-relaxed">
            The 3-6-9 model aligns with Tesla&apos;s vortex mathematics.
            <strong className="text-amber-100/70"> 3</strong> is the entry point.
            <strong className="text-amber-100/70"> 6</strong> is the axis of balance.
            <strong className="text-amber-100/70"> 9</strong> is completion —
            V.I.B.E. (Vibration, Intelligence, Balance, Energy).
            Pay for 9, receive 12. Activity breeds Activity.
          </p>
        </section>
      </div>
    </div>
  );
}
