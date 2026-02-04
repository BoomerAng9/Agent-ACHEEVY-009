
import { LogoWallBackground } from "@/components/LogoWallBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Box, Cpu, Network } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <LogoWallBackground mode="hero">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 text-center">
           <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-8">
                 <div className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                    System Online
                 </div>
                 
                 <h1 className="text-4xl font-display uppercase tracking-widest text-white sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    A.I.M.S. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">AI Managed Systems</span>
                 </h1>
                 
                 <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We take powerful open-source AI tools and ship them as simple, managed solutions for you. No config. Just results.
                 </p>
                 
                 <div className="flex flex-col gap-4 min-[400px]:flex-row">
                    <Link href="/chat">
                       <Button variant="acheevy" size="lg" className="h-12 px-8">
                          Chat with ACHEEVY <Bot className="ml-2 h-5 w-5" />
                       </Button>
                    </Link>
                    <Link href="/dashboard">
                       <Button variant="glass" size="lg" className="h-12 px-8">
                          View Dashboard
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-white/5 bg-black/20 backdrop-blur-sm">
           <div className="container px-4 md:px-6">
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                 <Card className="bg-white/5 border-white/10 hover:border-amber-500/30 transition-all">
                    <CardHeader>
                       <Network className="h-10 w-10 text-amber-400 mb-2" />
                       <CardTitle>Automation & Workflows</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-zinc-400">
                          Complex business logic automated behind the scenes. We route your requests to the best agents for the job.
                       </p>
                    </CardContent>
                 </Card>
                 
                 <Card className="bg-white/5 border-white/10 hover:border-amber-500/30 transition-all">
                    <CardHeader>
                       <Box className="h-10 w-10 text-cyan-400 mb-2" />
                       <CardTitle>Containerized Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-zinc-400">
                          We wrap industry-standard open source software in secure, managed Docker containers deployed instantly.
                       </p>
                    </CardContent>
                 </Card>
                 
                 <Card className="bg-white/5 border-white/10 hover:border-amber-500/30 transition-all">
                    <CardHeader>
                       <Cpu className="h-10 w-10 text-emerald-400 mb-2" />
                       <CardTitle>AI Orchestrator</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-zinc-400">
                          ACHEEVY is your single point of contact. Speak your intent, and the system builds the infrastructure.
                       </p>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </section>
      </main>
    </LogoWallBackground>
  );
}
