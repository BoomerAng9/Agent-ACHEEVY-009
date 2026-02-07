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
    setTaskWeights((prev) => {
      const next = { ...prev };
      if (value === 0) delete next[id];
      else next[id] = value;
      return next;
    });
  };

  // Pre-calculate all tier × group combinations for the matrix
  const matrixData = BASE_TIERS.filter((t) => t.id !== "p2p").map((tier) =>
    GROUP_STRUCTURES.map((group) => {
      const seats =
        group.id === "individual" ? 1 : group.id === "family" ? 4 : group.id === "team" ? 5 : 25;
      return calculateBill(tier.id, group.id, seats, taskWeights);
    })
  );

  return (
    <div className="min-h-screen bg-obsidian text-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ──────────────────────── Header ──────────────────────── */}
        <div className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-200/50 mb-3">
            The 3-6-9 Frequency Model
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display">
            BUILD YOUR BILL
          </h1>
          <p className="mt-4 text-sm text-amber-100/50 max-w-xl mx-auto">
            No two users need identical bills. The combination matrix lets you
            mix base frequency, group size, and task profile. Activity breeds Activity.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            MATRIX 1 — Base Frequency × Group Structure
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-amber-300/20 to-transparent" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-200/60 font-display whitespace-nowrap">
              Combination Matrix
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-amber-300/20 to-transparent" />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-4 text-left text-[10px] uppercase tracking-widest text-amber-100/40 border-b border-white/5">
                    Group \ Frequency
                  </th>
                  {BASE_TIERS.filter((t) => t.id !== "p2p").map((tier) => (
                    <th
                      key={tier.id}
                      className={`p-4 text-center border-b border-white/5 cursor-pointer transition-colors ${
                        selectedTier === tier.id
                          ? "bg-amber-300/5"
                          : "hover:bg-white/[0.02]"
                      }`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      <p className="text-sm font-bold text-amber-50">{tier.name}</p>
                      <p className="text-[10px] text-amber-100/40 mt-0.5">
                        {tier.commitmentMonths}-month
                      </p>
                      <p className="text-lg font-bold text-amber-300 mt-1">
                        ${tier.monthlyPrice}
                        <span className="text-[10px] text-amber-100/40 font-normal">/mo</span>
                      </p>
                      <p className="text-[9px] text-amber-100/30 mt-0.5">
                        {(tier.tokensIncluded / 1000).toFixed(0)}K tokens
                      </p>
                      {tier.id === "enterprise" && (
                        <span className="inline-block mt-1.5 rounded-full bg-amber-300 px-2 py-0.5 text-[8px] font-bold text-black uppercase tracking-wider">
                          V.I.B.E.
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GROUP_STRUCTURES.map((group, gi) => (
                  <tr
                    key={group.id}
                    className={`cursor-pointer transition-colors ${
                      selectedGroup === group.id
                        ? "bg-amber-300/[0.03]"
                        : "hover:bg-white/[0.015]"
                    }`}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      if (group.id === "individual") setSeatCount(1);
                      else if (group.id === "family") setSeatCount(4);
                      else if (group.id === "team") setSeatCount(5);
                      else setSeatCount(25);
                    }}
                  >
                    <td className="p-4 border-t border-white/5">
                      <p className="text-sm font-semibold text-amber-50">{group.name}</p>
                      <p className="text-[10px] text-amber-100/40">{group.seats} seats</p>
                      {group.multiplier > 0 && (
                        <p className="text-[9px] text-amber-300/50 mt-0.5">
                          {group.multiplier}x base
                          {group.perSeatAddon > 0 && ` + $${group.perSeatAddon}/seat`}
                        </p>
                      )}
                    </td>
                    {matrixData.map((tierRow, ti) => {
                      const cell = tierRow[gi];
                      const isActive =
                        selectedTier === cell.baseTier.id && selectedGroup === group.id;
                      return (
                        <td
                          key={`${ti}-${gi}`}
                          className={`p-4 text-center border-t border-white/5 transition-colors ${
                            isActive
                              ? "bg-amber-300/10 ring-1 ring-inset ring-amber-300/30"
                              : ""
                          }`}
                        >
                          {group.id === "enterprise-group" ? (
                            <span className="text-xs text-amber-100/30 italic">Custom</span>
                          ) : (
                            <>
                              <p className="text-lg font-bold text-amber-50">
                                ${cell.monthlyWithGroup}
                              </p>
                              <p className="text-[9px] text-amber-100/30">/mo base</p>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* P2P row — separate since it's fundamentally different */}
          <div className="mt-3 rounded-2xl border border-white/10 bg-black/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedTier("p2p")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedTier === "p2p"
                    ? "bg-amber-300/10 border border-amber-300/30 text-amber-300"
                    : "border border-white/10 text-amber-100/50 hover:border-white/20"
                }`}
              >
                P2P (Proud to Pay)
              </button>
              <span className="text-xs text-amber-100/40">No commitment</span>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <span className="text-amber-100/40">
                100 tokens / <span className="text-amber-50 font-semibold">$1</span>
              </span>
              <span className="text-amber-100/40">Pay-as-you-go metering</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            MATRIX 2 — Task-Based Multipliers
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-amber-300/20 to-transparent" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-200/60 font-display whitespace-nowrap">
              Task Multipliers
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-amber-300/20 to-transparent" />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-left text-[10px] uppercase tracking-widest text-amber-100/40">
                    Task Type
                  </th>
                  <th className="p-4 text-center text-[10px] uppercase tracking-widest text-amber-100/40">
                    Multiplier
                  </th>
                  <th className="p-4 text-left text-[10px] uppercase tracking-widest text-amber-100/40">
                    Description
                  </th>
                  <th className="p-4 text-center text-[10px] uppercase tracking-widest text-amber-100/40 w-48">
                    Your Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {TASK_MULTIPLIERS.map((task) => {
                  const weight = taskWeights[task.id] || 0;
                  return (
                    <tr key={task.id} className="border-t border-white/5 hover:bg-white/[0.015]">
                      <td className="p-4">
                        <p className="text-sm font-semibold text-amber-50">{task.name}</p>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-block rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1 text-sm font-mono font-bold text-amber-300">
                          {task.multiplier}x
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-amber-100/50">{task.description}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={weight}
                            onChange={(e) => updateWeight(task.id, parseInt(e.target.value))}
                            className="flex-1 accent-amber-300 h-1.5"
                          />
                          <span className="w-10 text-right text-xs font-mono text-amber-100/50">
                            {weight}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-amber-300/10 bg-amber-300/[0.03]">
                  <td className="p-4 text-xs font-semibold text-amber-200/60" colSpan={1}>
                    Effective Multiplier
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-lg font-bold text-amber-300">
                      {bill.effectiveMultiplier}x
                    </span>
                  </td>
                  <td className="p-4 text-xs text-amber-100/40" colSpan={2}>
                    Weighted average applied to your monthly estimate
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            MATRIX 3 — Usage Modifiers (reference)
            ═══════════════════════════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-amber-300/20 to-transparent" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-200/60 font-display whitespace-nowrap">
              Usage Modifiers
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-amber-300/20 to-transparent" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-[10px] uppercase tracking-widest text-amber-100/40 mb-2">
                Overage Rate
              </p>
              <p className="text-xl font-bold text-amber-50">
                ${USAGE_MODIFIERS.overageRatePer1K}
                <span className="text-xs text-amber-100/40 font-normal"> / 1K tokens</span>
              </p>
              <p className="text-[10px] text-amber-100/30 mt-1">
                Beyond included + overdraft buffer
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-[10px] uppercase tracking-widest text-amber-100/40 mb-2">
                P2P Rate
              </p>
              <p className="text-xl font-bold text-amber-50">
                100 tokens
                <span className="text-xs text-amber-100/40 font-normal"> / $1</span>
              </p>
              <p className="text-[10px] text-amber-100/30 mt-1">Proud to Pay metering</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/60 p-5">
              <p className="text-[10px] uppercase tracking-widest text-amber-100/40 mb-2">
                Real-Time LUC Top-Up
              </p>
              <p className="text-xl font-bold text-amber-50">
                +{USAGE_MODIFIERS.realTimeLucConvenience * 100}%
                <span className="text-xs text-amber-100/40 font-normal"> convenience</span>
              </p>
              <p className="text-[10px] text-amber-100/30 mt-1">On-demand during high demand</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-[10px] uppercase tracking-widest text-emerald-400/60 mb-2">
                LUC Calculator
              </p>
              <p className="text-xl font-bold text-emerald-400">Included</p>
              <p className="text-[10px] text-amber-100/30 mt-1">
                Pre-action cost transparency — always on
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            YOUR BILL — Live Estimate
            ═══════════════════════════════════════════════════════════════ */}
        <section className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/5 to-black/80 p-8 shadow-[0_0_60px_rgba(251,191,36,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs uppercase tracking-[0.3em] text-amber-200/60 font-display">
              Your Bill Estimate
            </h2>
            {(selectedGroup === "team" || selectedGroup === "enterprise-group") && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-amber-100/40 uppercase tracking-wider">
                  Seats:
                </label>
                <input
                  type="number"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  className="w-16 rounded-lg border border-white/10 bg-black/60 px-2 py-1 text-sm text-amber-50 text-center outline-none focus:border-amber-300"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Selected Plan */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Frequency</p>
              <p className="text-lg font-bold text-amber-50 mt-1">{bill.baseTier.name}</p>
              <p className="text-[10px] text-amber-100/30 mt-0.5">
                {bill.baseTier.commitmentMonths > 0
                  ? `${bill.baseTier.commitmentMonths}-mo commit`
                  : "No commit"}
                {bill.baseTier.deliveredMonths > bill.baseTier.commitmentMonths &&
                  ` → ${bill.baseTier.deliveredMonths} delivered`}
              </p>
            </div>

            {/* Group */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">Group</p>
              <p className="text-lg font-bold text-amber-50 mt-1">{bill.group.name}</p>
              <p className="text-[10px] text-amber-100/30 mt-0.5">
                {seatCount} seat{seatCount > 1 ? "s" : ""}
                {bill.group.multiplier > 0 && ` @ ${bill.group.multiplier}x`}
              </p>
            </div>

            {/* Monthly Base */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">
                Monthly Base
              </p>
              <p className="text-lg font-bold text-amber-50 mt-1">
                {selectedGroup === "enterprise-group" ? "Custom" : `$${bill.monthlyWithGroup}`}
              </p>
              <p className="text-[10px] text-amber-100/30 mt-0.5">
                Before task multiplier
              </p>
            </div>

            {/* Monthly Estimate (highlighted) */}
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/5 p-4 shadow-[0_0_20px_rgba(251,191,36,0.08)]">
              <p className="text-[10px] uppercase tracking-wider text-amber-300/60">
                Monthly Estimate
              </p>
              <p className="text-2xl font-bold text-amber-300 mt-1">
                {selectedGroup === "enterprise-group" ? "Custom" : `$${bill.monthlyEstimate}`}
              </p>
              <p className="text-[10px] text-amber-100/30 mt-0.5">
                @ {bill.effectiveMultiplier}x task mix
              </p>
            </div>

            {/* Commitment Total */}
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-amber-100/40">
                Commitment Total
              </p>
              <p className="text-lg font-bold text-amber-50 mt-1">
                {bill.commitmentTotal > 0 ? `$${bill.commitmentTotal}` : "\u2014"}
              </p>
              <p className="text-[10px] text-amber-100/30 mt-0.5">
                {bill.tokensPerMonth > 0
                  ? `${(bill.tokensPerMonth / 1000).toFixed(0)}K tokens/mo`
                  : "Metered usage"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
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

        {/* ──────────────────────── V.I.B.E. Philosophy ──────────────────────── */}
        <section className="mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/40 mb-2">
            The Frequency Philosophy
          </p>
          <p className="text-sm text-amber-100/40 max-w-lg mx-auto leading-relaxed">
            The 3-6-9 model aligns with Tesla&apos;s vortex mathematics.
            <strong className="text-amber-100/60"> 3</strong> is the entry point.
            <strong className="text-amber-100/60"> 6</strong> is the axis of balance.
            <strong className="text-amber-100/60"> 9</strong> is completion —
            V.I.B.E. (Vibration, Intelligence, Balance, Energy).
            Pay for 9, receive 12. Activity breeds Activity.
          </p>
        </section>
      </div>
    </div>
  );
}
