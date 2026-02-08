// frontend/app/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, cardLift } from "@/lib/motion/variants";
import { ArsenalShelf } from "@/components/ArsenalShelf";
import {
  MessageSquare,
  Layers,
  Settings,
  CreditCard,
  ArrowRight,
  Hammer,
  Copy,
  Plug,
} from "lucide-react";

const tiles = [
  {
    title: "Chat w/ACHEEVY",
    icon: MessageSquare,
    desc: "Direct orchestrator interface.",
    href: "/dashboard/chat",
  },
  {
    title: "LUC Quotes",
    icon: CreditCard,
    desc: "Resource auditing and budgeting.",
    href: "/dashboard/luc",
  },
  {
    title: "aiPlugs",
    icon: Layers,
    desc: "Deploy capability modules.",
    href: "/dashboard/ai-plugs",
  },
  {
    title: "Build a Plug",
    icon: Hammer,
    desc: "Step-by-step plug builder.",
    href: "/dashboard/build",
  },
  {
    title: "Your Plugs",
    icon: Plug,
    desc: "Manage deployed plugs.",
    href: "/dashboard/plugs",
  },
  {
    title: "Make It Mine",
    icon: Copy,
    desc: "Clone and customize templates.",
    href: "/dashboard/make-it-mine",
  },
  {
    title: "Settings",
    icon: Settings,
    desc: "Workspace and team config.",
    href: "/dashboard/settings",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-gold/50 mb-1 font-mono">
            Executive Console
          </p>
          <h1 className="text-2xl md:text-3xl font-display uppercase tracking-wider text-white">
            A.I.M.S. More Plugs
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[0.6rem] uppercase font-mono text-emerald-400/80 tracking-widest">
            ACHEEVY Online
          </span>
        </div>
      </header>

      {/* Onboarding alert */}
      <div className="wireframe-card overflow-hidden hover:border-gold/20 transition-colors">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-sm font-medium text-white">
              Continue Onboarding?
            </h2>
            <p className="text-xs text-white/40 max-w-sm">
              You haven&apos;t finalized The Park model configuration or
              initialized ByteRover memory.
            </p>
          </div>
          <Link
            href="/onboarding/estimate"
            className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gold-light"
          >
            Run Simulation <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Arsenal shelf — horizontal plug carousel */}
      <ArsenalShelf />

      {/* Tile grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {tiles.map((tile) => (
          <motion.div key={tile.title} variants={staggerItem}>
            <Link
              href={tile.href}
              className="group wireframe-card block p-5 hover:border-gold/20 transition-all"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-wireframe-stroke bg-white/[0.02] text-white/50 group-hover:border-gold/30 group-hover:text-gold transition-colors">
                <tile.icon size={18} />
              </div>
              <h3 className="text-sm font-medium text-white group-hover:text-gold transition-colors">
                {tile.title}
              </h3>
              <p className="mt-1 text-xs text-white/30 leading-relaxed">
                {tile.desc}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[0.55rem] uppercase font-mono tracking-widest text-gold/50">
                  Active
                </span>
                <ArrowRight
                  size={12}
                  className="text-gold/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
