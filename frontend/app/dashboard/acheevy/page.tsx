'use client';

/**
 * ACHEEVY Dashboard Chat Page
 *
 * Enhanced chat interface with Deploy Platform integration + Live Ops Theater.
 * Uses Vercel AI SDK (useChat) with PMO classification and shift tracking.
 */

import { useChat } from 'ai/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { Send, Square, Copy, Check, Mic } from 'lucide-react';
import { AIMS_CIRCUIT_COLORS, CircuitBoardPattern } from '@/components/ui/CircuitBoard';
import { LiveOpsTheater } from '@/components/deploy-platform/LiveOpsTheater';

// ─────────────────────────────────────────────────────────────
// Icons (inline SVGs for deploy-specific actions)
// ─────────────────────────────────────────────────────────────

const DeployIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const YardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M12 7V3M7 7V4M17 7V4" />
    <path d="M6 14h4M14 14h4" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Quick Actions
// ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { id: 'deploy', label: 'Deploy It', icon: DeployIcon, prompt: 'Deploy my latest changes to staging' },
  { id: 'guide', label: 'Guide Me', icon: SparklesIcon, prompt: 'Help me plan my next deployment' },
  { id: 'status', label: 'Check Status', icon: YardIcon, prompt: "What's the status of my current shift?" },
];

function QuickActions({ onSelect, disabled }: { onSelect: (prompt: string) => void; disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onSelect(action.prompt)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-amber-100/70 hover:bg-white/10 hover:text-amber-100 hover:border-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Message Component
// ─────────────────────────────────────────────────────────────

function ChatMessage({
  role,
  content,
  isStreaming,
  shiftId,
  onWatchShift,
}: {
  role: string;
  content: string;
  isStreaming?: boolean;
  shiftId?: string;
  onWatchShift?: (shiftId: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold">
            U
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30">
            <Image
              src="/images/acheevy/acheevy-helmet.png"
              alt="ACHEEVY"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="flex items-center justify-center w-full h-full text-amber-400 font-bold">A</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`text-xs font-medium mb-1 ${isUser ? 'text-amber-400' : 'text-amber-300'}`}>
          {isUser ? 'You' : 'ACHEEVY'}
        </div>

        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-amber-500/20 text-amber-50 rounded-tr-sm'
              : 'bg-white/[0.03] text-amber-100/90 rounded-tl-sm border border-white/5'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-[15px]">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-code:text-amber-300 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 text-[13px]" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="relative group my-3">
                        <pre className="bg-black/60 rounded-lg p-4 overflow-x-auto border border-white/5">
                          <code className={`${className} text-[13px]`} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline">
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse" />
              )}
            </div>
          )}

          {/* Shift Watch Button */}
          {shiftId && onWatchShift && (
            <button
              onClick={() => onWatchShift(shiftId)}
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors text-xs"
            >
              <YardIcon className="w-4 h-4" />
              Watch Shift in Live Ops Theater
            </button>
          )}
        </div>

        {/* Copy */}
        {!isUser && !isStreaming && content && (
          <div className="flex items-center gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-amber-300 transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────

export default function ACHEEVYChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setInput,
  } = useChat({
    api: '/api/chat',
  });

  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);
  const [showTheater, setShowTheater] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Detect deploy-related messages and create shift IDs
  useEffect(() => {
    if (messages.length < 2) return;
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser && (lastUser.content.toLowerCase().includes('deploy') || lastUser.content.toLowerCase().includes('shift'))) {
      if (!activeShiftId) {
        setActiveShiftId(`SH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      }
    }
  }, [messages, activeShiftId]);

  // Quick action handler
  const handleQuickAction = useCallback((prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      const form = document.getElementById('acheevy-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  }, [setInput]);

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = document.getElementById('acheevy-form') as HTMLFormElement;
      form?.requestSubmit();
    }
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-64px)] overflow-hidden" style={{ backgroundColor: AIMS_CIRCUIT_COLORS.background }}>
      {/* Background Pattern */}
      <CircuitBoardPattern density="sparse" animated glowIntensity={0.15} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-xl font-bold text-black">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-amber-100">ACHEEVY</h1>
            <p className="text-xs text-gray-500">AI Executive Assistant</p>
          </div>
        </div>

        {activeShiftId && (
          <button
            onClick={() => setShowTheater(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            <YardIcon className="w-4 h-4" />
            <span className="text-sm">Live Ops Theater</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <span className="text-3xl font-bold text-black">A</span>
              </div>
              <h2 className="text-2xl font-bold text-amber-100 mb-2">Hello! I'm ACHEEVY</h2>
              <p className="text-amber-100/50 max-w-md mx-auto mb-8">
                Your AI executive assistant. I orchestrate deployments through the Circuit Box,
                commanding the Chicken_Hawk engine and Lil_Hawk workers to execute your requests.
              </p>
              <QuickActions onSelect={handleQuickAction} disabled={isLoading} />
            </motion.div>
          )}

          {/* Message List */}
          <AnimatePresence>
            {messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                isStreaming={isLoading && i === messages.length - 1 && m.role === 'assistant'}
                shiftId={m.content.toLowerCase().includes('deploy') ? activeShiftId || undefined : undefined}
                onWatchShift={(shiftId) => {
                  setActiveShiftId(shiftId);
                  setShowTheater(true);
                }}
              />
            ))}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form id="acheevy-form" onSubmit={handleSubmit}>
            <div className="relative flex items-end gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3 focus-within:border-amber-400/30 transition-colors">
              {/* Mic Button */}
              <button
                type="button"
                className="p-3 rounded-xl bg-white/5 text-amber-100/60 hover:bg-white/10 hover:text-amber-100 transition-colors"
                title="Voice input (coming soon)"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message ACHEEVY..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-amber-50 placeholder:text-white/20 resize-none outline-none text-[15px] leading-relaxed max-h-[200px] py-2"
              />

              {/* Send/Stop */}
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  title="Stop generation"
                  className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Square className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  title="Send message"
                  className={`p-3 rounded-xl transition-all ${
                    input.trim()
                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                      : 'bg-white/5 text-amber-100/30 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-xs text-gray-600 mt-3">
            ACHEEVY orchestrates via Circuit Box &rarr; Chicken_Hawk &rarr; Lil_Hawks
          </p>
        </div>
      </div>

      {/* Live Ops Theater Modal */}
      <LiveOpsTheater
        shiftId={activeShiftId || undefined}
        isOpen={showTheater}
        onClose={() => setShowTheater(false)}
      />
    </div>
  );
}
