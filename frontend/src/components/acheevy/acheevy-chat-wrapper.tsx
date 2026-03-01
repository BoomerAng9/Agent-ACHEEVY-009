/**
 * ACHEEVY-009 — Chat Wrapper
 * Empty-state wrapper with branded greeting, quick-prompt chips,
 * and pipeline badge. Passes through to normal chat when messages exist.
 */

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'

const GREETINGS = [
    'What are we building today?',
    'Ready to execute. What\'s the mission?',
    'ACHEEVY online. Drop your task.',
    'Let\'s ship something. What do you need?',
]

const QUICK_PROMPTS = [
    { label: 'Build a landing page', prompt: 'Build a modern landing page with hero section, features grid, and CTA' },
    { label: 'Research a topic', prompt: 'Do deep research on ' },
    { label: 'Review my code', prompt: 'Review and refactor the following code for production quality: ' },
    { label: 'Create a presentation', prompt: 'Create a professional slide deck about ' },
    { label: 'Automate a workflow', prompt: 'Design an automation workflow that ' },
    { label: 'Deploy to production', prompt: 'Help me deploy this application to production with ' },
]

interface AcheevyChatWrapperProps {
    children: React.ReactNode
    hasMessages: boolean
    onQuickPrompt?: (prompt: string) => void
}

export function AcheevyChatWrapper({ children, hasMessages, onQuickPrompt }: AcheevyChatWrapperProps) {
    const [greeting] = useState(
        () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    )

    const handleQuickPrompt = useCallback(
        (prompt: string) => onQuickPrompt?.(prompt),
        [onQuickPrompt]
    )

    if (hasMessages) return <>{children}</>

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
            {/* ACHEEVY Identity */}
            <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Avatar */}
                <motion.div
                    className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#D4881F]
                        flex items-center justify-center"
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(212,175,55,0.2)',
                            '0 0 40px rgba(212,175,55,0.4)',
                            '0 0 20px rgba(212,175,55,0.2)',
                        ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <span className="text-3xl">⚡</span>
                    <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#39FF14]
                            flex items-center justify-center text-[10px]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ✦
                    </motion.div>
                </motion.div>

                {/* Name + Greeting */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold acheevy-gradient-text">
                        ACHEEVY
                    </h1>
                    <p className="text-xs text-white/40 mt-1 font-mono">
                        Agent-ACHEEVY-009 &middot; Full Capability Mode
                    </p>
                    <motion.p
                        className="text-white/60 mt-3 text-base"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {greeting}
                    </motion.p>
                </div>
            </motion.div>

            {/* Quick Prompts */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-2xl w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                {QUICK_PROMPTS.map((qp) => (
                    <motion.button
                        key={qp.label}
                        className="text-left px-3 py-2.5 rounded-xl border border-white/10
                            bg-white/[0.02] backdrop-blur-sm
                            hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5
                            transition-all group cursor-pointer"
                        onClick={() => handleQuickPrompt(qp.prompt)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="text-xs text-white/60 group-hover:text-white/80">
                            {qp.label}
                        </span>
                        <span className="inline ml-1 text-[10px] text-white/20 group-hover:text-[#D4AF37]">
                            →
                        </span>
                    </motion.button>
                ))}
            </motion.div>

            {/* Pipeline Badge */}
            <motion.div
                className="flex items-center gap-2 text-[9px] text-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="font-mono">
                    NtNtN → ii-researcher → II-Commons → ii-agent → ORACLE → AIMS Bridge
                </span>
            </motion.div>

            {/* Pass-through for chat input */}
            {children}
        </div>
    )
}

export default AcheevyChatWrapper
