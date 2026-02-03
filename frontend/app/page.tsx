import { HeroAcheevy } from "@/components/HeroAcheevy";
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <HeroAcheevy />
      <div className="flex justify-center mt-8 gap-4">
        <Link href="/dashboard" className="text-amber-200/50 hover:text-amber-200 uppercase tracking-widest text-xs">
          [ Enter Dashboard Mockup ]
        </Link>
        <Link href="/api/auth/signin" className="text-amber-200/50 hover:text-amber-200 uppercase tracking-widest text-xs">
          [ Sign In Flow ]
        </Link>
      </div>
    </>
  );
}
