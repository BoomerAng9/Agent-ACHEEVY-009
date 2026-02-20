'use client';

import { motion } from 'framer-motion';
import { BroadcastSegment } from '../engine';
import { useEffect, useState } from 'react';

export function MockDraftSet({ segment }: { segment: BroadcastSegment }) {
    const [ticker, setTicker] = useState<{ teamAbbrev: string; team: string; needs: string[] }[]>([]);

    useEffect(() => {
        // Quick fetch for the draft order to build the crawler
        fetch('/api/perform/draft/news')
            .then(r => r.json())
            .then(d => {
                if (d.data?.teamNeeds) {
                    setTicker(d.data.teamNeeds);
                }
            });
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black">

            {/* Massive 3D Logo / Focus Element */}
            <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="w-96 h-96 border-4 border-gold/10 rounded-full flex items-center justify-center absolute shadow-[0_0_150px_rgba(218,165,32,0.1)]"
            >
                <div className="w-64 h-64 bg-gold/5 blur-3xl rounded-full" />
            </motion.div>

            {/* Primary Presenter Area */}
            <div className="w-full max-w-5xl z-10 flex flex-col items-center bg-black/60 backdrop-blur-3xl border-t border-b border-gold/30 py-16 px-12 mb-12 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                <h3 className="text-[5rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter leading-none text-center">
                    Mock Draft <span className="text-gold">1.0</span>
                </h3>
                <p className="text-xl text-gold mt-6 tracking-[0.4em] uppercase font-bold text-center border-b border-gold/20 pb-4">
                    Projecting The First Round
                </p>

                <div className="mt-8 flex gap-6 text-center text-white/60">
                    <div className="w-48 bg-white/5 border border-white/10 p-4 rounded-xl">
                        <span className="text-3xl font-black text-white block">#1</span>
                        <span className="text-xs tracking-widest uppercase">Las Vegas Raiders</span>
                    </div>
                    <div className="w-48 bg-white/5 border border-white/10 p-4 rounded-xl">
                        <span className="text-3xl font-black text-white block">#2</span>
                        <span className="text-xs tracking-widest uppercase">New York Jets</span>
                    </div>
                    <div className="w-48 bg-white/5 border border-white/10 p-4 rounded-xl">
                        <span className="text-3xl font-black text-white block">#3</span>
                        <span className="text-xs tracking-widest uppercase">Arizona Cardinals</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
