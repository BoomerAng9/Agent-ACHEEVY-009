/* frontend/components/HeroAcheevy.tsx */
export function HeroAcheevy() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">
          The Hybrid Business Architect
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-amber-50 md:text-5xl font-display">
          Think it. Speak it.<br/>ACHEEVY builds it.
        </h1>
        <p className="max-w-xl text-sm text-amber-100/80">
          Orchestrate Boomer_Ang agents, aiPlugs, and A.I.M.S. workflows from a
          single executive console, while you stay in the loop as final approver.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button className="rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-6 py-2.5 text-sm font-semibold text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-shadow">
            Start my project
          </button>
          <button className="rounded-full border border-amber-200/40 bg-black/30 px-5 py-2.5 text-sm text-amber-100 hover:bg-black/50 transition-colors">
            Watch ACHEEVY in action
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="relative mx-auto max-w-sm">
          <img
            src="/images/acheevy/acheevy-office-plug.png"
            alt="ACHEEVY holding an aiPlug cube"
            className="mx-auto w-full drop-shadow-[0_40px_120px_rgba(0,0,0,0.9)] animate-hover-float"
          />
        </div>
      </div>
    </section>
  );
}
