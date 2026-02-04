
import { LogoWallBackground } from "@/components/LogoWallBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Box, Database, Network, Server, Settings, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <LogoWallBackground mode="dashboard">
      <SiteHeader />
      
      <main className="flex-1 container max-w-7xl py-8 px-4 md:px-6">
         {/* Welcome / Status Bar */}
         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
               <h1 className="text-2xl font-display text-white tracking-wide">Command Center</h1>
               <p className="text-zinc-400 text-sm">Welcome back. Deployment systems are optimal.</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] bg-emerald-950/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Net-Ops: Online
               </span>
               <Link href="/chat">
                   <Button variant="acheevy" size="sm">Open Orchestrator</Button>
               </Link>
            </div>
         </div>

         {/* Plan & Usage */}
         <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="md:col-span-2 border-amber-500/20 bg-gradient-to-br from-amber-950/10 to-transparent">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Zap className="text-amber-400 h-5 w-5" /> Current Plan: Pro Managed
                  </CardTitle>
               </CardHeader>
               <CardContent className="flex flex-col sm:flex-row gap-6 justify-between items-center text-sm">
                  <div className="space-y-1">
                     <p className="text-zinc-400">Next Billing Cycle</p>
                     <p className="font-mono text-white">Feb 28, 2026</p>
                  </div>
                  <div className="flex-1 w-full sm:mx-8 space-y-2">
                      <div className="flex justify-between text-xs uppercase tracking-wider text-zinc-500">
                         <span>Compute Units</span>
                         <span className="text-amber-400">74%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-amber-500 w-[74%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                      </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent border-white/10 hover:bg-white/5 text-xs uppercase tracking-wider">Manage</Button>
               </CardContent>
            </Card>

            <Card className="border-white/5">
                <CardHeader>
                   <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                   <Button variant="glass" className="h-20 flex flex-col gap-2 text-xs">
                       <Settings className="h-5 w-5 text-zinc-400" /> Settings
                   </Button>
                   <Button variant="glass" className="h-20 flex flex-col gap-2 text-xs">
                       <Activity className="h-5 w-5 text-zinc-400" /> Logs
                   </Button>
                </CardContent>
            </Card>
         </div>

         {/* Tactical Grid */}
         <div className="space-y-6">
            <h2 className="text-lg font-display text-white/80 tracking-widest pl-1 border-l-2 border-amber-500">Tactical Resources</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               
               {/* VPS Card */}
               <Card className="group hover:bg-white/5 transition-all">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20"><Server className="h-6 w-6"/></div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                     </div>
                     <CardTitle className="mt-4 text-base">Hostinger VPS</CardTitle>
                     <CardDescription>76.13.96.107 (Primary)</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-zinc-500"><span>CPU</span><span className="text-emerald-400">12%</span></div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[12%]"/></div>
                     </div>
                  </CardContent>
               </Card>

               {/* n8n Card */}
               <Card className="group hover:bg-white/5 transition-all">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/20"><Network className="h-6 w-6"/></div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                     </div>
                     <CardTitle className="mt-4 text-base">n8n Automation</CardTitle>
                     <CardDescription>Workflow Engine</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-white/5 rounded p-2">
                             <div className="text-lg font-bold text-white">12</div>
                             <div className="text-[9px] text-zinc-500 uppercase">Active Flows</div>
                          </div>
                          <div className="bg-white/5 rounded p-2">
                             <div className="text-lg font-bold text-white">184</div>
                             <div className="text-[9px] text-zinc-500 uppercase">Execs</div>
                          </div>
                      </div>
                  </CardContent>
               </Card>

               {/* Postgres Card */}
               <Card className="group hover:bg-white/5 transition-all">
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Database className="h-6 w-6"/></div>
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                     </div>
                     <CardTitle className="mt-4 text-base">PostgreSQL</CardTitle>
                     <CardDescription>Unified Storage</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-zinc-500"><span>Storage</span><span className="text-blue-400">10.6 GB</span></div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[15%]"/></div>
                     </div>
                  </CardContent>
               </Card>

            </div>
         </div>
      </main>
    </LogoWallBackground>
  );
}
