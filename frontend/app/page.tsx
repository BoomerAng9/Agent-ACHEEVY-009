import { HeroAcheevy } from "@/components/HeroAcheevy";
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroAcheevy />
      <div className="flex justify-center mt-8 gap-4">
        <Link href="/dashboard" className="text-amber-200/50 hover:text-amber-200 uppercase tracking-widest text-xs">
          [ Enter Dashboard ]
        </Link>
        <Link href="/sign-in" className="text-amber-200/50 hover:text-amber-200 uppercase tracking-widest text-xs">
          [ Sign In ]
        </Link>
      </div>

      {/* Doctrine — ambient */}
      <div className="mt-12 text-center text-[0.65rem] uppercase tracking-[0.35em] text-amber-200/25 select-none">
        Activity breeds Activity.
      </div>
    </>
  );
}
