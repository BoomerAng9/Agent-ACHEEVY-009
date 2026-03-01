/**
 * ACHEEVY-009 — Pipeline Dashboard
 * Real-time pipeline visualizer + task routing cards.
 * Shows NtNtN → ii-researcher → II-Commons → ii-agent → ORACLE → AIMS Bridge
 *
 * Tasks badged "ACHEEVY" execute on plugmein.cloud.
 * Tasks badged "→ AIMS" route to aimanagedsolutions.cloud.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface PipelineStage {
    id: string
    label: string
    engine: string
    status: 'idle' | 'active' | 'complete' | 'error'
    icon: string
}

export interface TaskCard {
    id: string
    title: string
    description: string
    prompt: string
    category: 'build' | 'research' | 'deploy' | 'analyze'
    route: 'acheevy' | 'aims'
}

const PIPELINE_STAGES: PipelineStage[] = [
    { id: 'intake', label: 'Intake', engine: 'NtNtN', status: 'idle', icon: '✦' },
    { id: 'research', label: 'Research', engine: 'ii-researcher', status: 'idle', icon: '🔍' },
    { id: 'plan', label: 'Plan', engine: 'II-Commons', status: 'idle', icon: '🧠' },
    { id: 'execute', label: 'Execute', engine: 'ii-agent', status: 'idle', icon: '⚡' },
    { id: 'verify', label: 'Verify', engine: 'ORACLE', status: 'idle', icon: '🛡' },
    { id: 'deploy', label: 'Deploy', engine: 'AIMS Bridge', status: 'idle', icon: '🚀' },
]

const TASK_CARDS: TaskCard[] = [
    {
        id: 'full-stack',
        title: 'Build Full-Stack App',
        description: 'Generate, test, and deploy a complete application',
        prompt: 'Build a modern full-stack application with authentication, dashboard, and API',
        category: 'build',
        route: 'acheevy',
    },
    {
        id: 'deep-research',
        title: 'Deep Research',
        description: 'Multi-source investigation with citations and analysis',
        prompt: 'Research the current state of ',
        category: 'research',
        route: 'acheevy',
    },
    {
        id: 'code-review',
        title: 'Code Review & Refactor',
        description: 'Analyze codebase, find issues, apply fixes',
        prompt: 'Review and refactor the following code for production quality: ',
        category: 'analyze',
        route: 'acheevy',
    },
    {
        id: 'deploy-production',
        title: 'Deploy to Production',
        description: 'Route to AIMS for infrastructure execution',
        prompt: 'Deploy this application to production with ',
        category: 'deploy',
        route: 'aims',
    },
    {
        id: 'create-slides',
        title: 'Create Presentation',
        description: 'Generate slide decks with data and visuals',
        prompt: 'Create a professional slide deck about ',
        category: 'build',
        route: 'acheevy',
    },
    {
        id: 'automate-workflow',
        title: 'Automate Workflow',
        description: 'Build n8n/automation pipelines via AIMS',
        prompt: 'Design an automation workflow that ',
        category: 'deploy',
        route: 'aims',
    },
]

const CATEGORY_COLORS: Record<string, { gradient: string; border: string; badge: string }> = {
    build: {
        gradient: 'from-[#D4AF37] to-[#D4881F]',
        border: 'border-[#D4AF37]/30',
        badge: 'bg-[#D4AF37]/15 text-[#D4AF37]',
    },
    research: {
        gradient: 'from-[#4FC3F7] to-[#0288D1]',
        border: 'border-[#4FC3F7]/30',
        badge: 'bg-[#4FC3F7]/15 text-[#4FC3F7]',
    },
    analyze: {
        gradient: 'from-[#39FF14] to-[#00C853]',
        border: 'border-[#39FF14]/30',
        badge: 'bg-[#39FF14]/15 text-[#39FF14]',
    },
    deploy: {
        gradient: 'from-[#FF6B35] to-[#D4881F]',
        border: 'border-[#FF6B35]/30',
        badge: 'bg-[#FF6B35]/15 text-[#FF6B35]',
    },
}

function PipelineVisualizer({ stages }: { stages: PipelineStage[] }) {
    return (
        <div className="flex items-center gap-1 w-full overflow-x-auto py-3 px-1">
            {stages.map((stage, i) => (
                <div key={stage.id} className="flex items-center">
                    <motion.div
                        className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-colors
                            ${stage.status === 'active' ? 'border-[#D4AF37] bg-[#D4AF37]/10' : ''}
                            ${stage.status === 'complete' ? 'border-[#39FF14] bg-[#39FF14]/10' : ''}
                            ${stage.status === 'error' ? 'border-red-500 bg-red-500/10' : ''}
                            ${stage.status === 'idle' ? 'border-white/10 bg-white/[0.03]' : ''}
                        `}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <div className="flex items-center gap-1">
                            <span className="text-xs">{stage.icon}</span>
                            <span className="text-[10px] font-medium whitespace-nowrap text-white/80">
                                {stage.label}
                            </span>
                        </div>
                        <span className="text-[9px] text-white/30 font-mono">{stage.engine}</span>
                    </motion.div>
                    {i < stages.length - 1 && (
                        <span className="text-white/15 mx-0.5 text-xs">›</span>
                    )}
                </div>
            ))}
        </div>
    )
}

interface AcheevyDashboardProps {
    onTaskSelect: (task: TaskCard) => void
    className?: string
}

export function AcheevyDashboard({ onTaskSelect, className = '' }: AcheevyDashboardProps) {
    const [stages] = useState<PipelineStage[]>(PIPELINE_STAGES)
    const [hoveredTask, setHoveredTask] = useState<string | null>(null)

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {/* Pipeline Visualizer */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-3">
                <div className="flex items-center gap-2 mb-1">
                    <motion.div
                        className="w-2 h-2 rounded-full bg-[#39FF14]"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        ACHEEVY Pipeline
                    </span>
                    <span className="text-[9px] text-white/20 ml-auto hidden sm:inline">
                        NtNtN → Research → Plan → Execute → Verify → Deploy
                    </span>
                </div>
                <PipelineVisualizer stages={stages} />
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                <AnimatePresence>
                    {TASK_CARDS.map((task) => {
                        const colors = CATEGORY_COLORS[task.category]
                        return (
                            <motion.button
                                key={task.id}
                                className={`relative text-left p-4 rounded-xl border ${colors.border}
                                    bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04]
                                    transition-colors group cursor-pointer`}
                                onClick={() => onTaskSelect(task)}
                                onMouseEnter={() => setHoveredTask(task.id)}
                                onMouseLeave={() => setHoveredTask(null)}
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                layout
                            >
                                {/* Route Badge */}
                                <div className={`absolute top-2 right-2 text-[8px] font-bold uppercase
                                    px-1.5 py-0.5 rounded
                                    ${task.route === 'aims'
                                        ? 'bg-[#FF6B35]/20 text-[#FF6B35]'
                                        : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                    }`}>
                                    {task.route === 'aims' ? '→ AIMS' : 'ACHEEVY'}
                                </div>

                                {/* Icon */}
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3
                                    bg-gradient-to-br ${colors.gradient} text-black text-sm`}>
                                    {task.category === 'build' && '⚡'}
                                    {task.category === 'research' && '🔍'}
                                    {task.category === 'analyze' && '🔬'}
                                    {task.category === 'deploy' && '🌐'}
                                </div>

                                <h4 className="text-sm font-semibold text-white/90 mb-1 pr-14">
                                    {task.title}
                                </h4>
                                <p className="text-[11px] text-white/40 leading-relaxed">
                                    {task.description}
                                </p>

                                <motion.div
                                    className="flex items-center gap-1 mt-3 text-[10px] text-white/25
                                        group-hover:text-white/50 transition-colors"
                                    animate={{ x: hoveredTask === task.id ? 3 : 0 }}
                                >
                                    <span>Start task →</span>
                                </motion.div>
                            </motion.button>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Routing Legend */}
            <div className="flex items-center gap-4 text-[9px] text-white/25 justify-center">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span>ACHEEVY = executes here (plugmein.cloud)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                    <span>→ AIMS = routes to aimanagedsolutions.cloud</span>
                </div>
            </div>
        </div>
    )
}

export default AcheevyDashboard
