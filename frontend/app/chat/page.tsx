'use client';

/**
 * Chat w/ACHEEVY — The Definitive Interface
 *
 * Built with Vercel AI SDK (useChat) + n8n PMO pipeline visualization.
 * Streams AI responses via Google Gemini while showing real-time
 * Chain of Command routing (PMO Office → Boomer_Ang Director → Chicken_Hawk).
 */

import { useChat } from 'ai/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import {
  Send, Square, Bot, User, Zap, ChevronDown, Copy, Check,
  Mic, Trophy, Search, Hammer, Layers, Container, Wand2,
  Building2, DollarSign, Activity, Megaphone, Palette, BookOpen,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';

// ─────────────────────────────────────────────────────────────
// PMO Classification Types
// ─────────────────────────────────────────────────────────────

interface PmoClassification {
  pmoOffice: string;
  officeLabel: string;
  director: string;
  confidence: number;
  keywords: string[];
  executionLane: 'deploy_it' | 'guide_me';
  complexity: number;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ACHEEVY_VERBS = ['Deploy', 'Build', 'Create', 'Launch', 'Ship', 'Forge', 'Craft', 'Execute'] as const;

const QUICK_INTENTS = [
  { label: 'Launch Perform', icon: Trophy, prompt: 'Launch the Perform Stack and analyze the latest athlete data' },
  { label: 'Build a Plug', icon: Hammer, prompt: 'I want to build a new plug for my workflow' },
  { label: 'Deep Research', icon: Search, prompt: 'Run deep research on the latest AI agent frameworks' },
  { label: 'Deploy Tool', icon: Container, prompt: 'Deploy my latest build to the VPS production environment' },
  { label: 'Create Workflow', icon: Layers, prompt: 'Create a multi-step n8n automation workflow' },
  { label: 'Browse Skills', icon: Wand2, prompt: 'Show me the available ACHEEVY skills and capabilities' },
] as const;

const PMO_OFFICE_ICONS: Record<string, typeof Building2> = {
  'tech-office': Container,
  'finance-office': DollarSign,
  'ops-office': Activity,
  'marketing-office': Megaphone,
  'design-office': Palette,
  'publishing-office': BookOpen,
};

const BOOMER_ANGS = [
  { id: 'cto', name: 'Boomer_CTO', office: 'tech-office', color: 'emerald' },
  { id: 'cfo', name: 'Boomer_CFO', office: 'finance-office', color: 'blue' },
  { id: 'coo', name: 'Boomer_COO', office: 'ops-office', color: 'violet' },
  { id: 'cmo', name: 'Boomer_CMO', office: 'marketing-office', color: 'pink' },
  { id: 'cdo', name: 'Boomer_CDO', office: 'design-office', color: 'orange' },
  { id: 'cpo', name: 'Boomer_CPO', office: 'publishing-office', color: 'cyan' },
  { id: 'hawk', name: 'Chicken_Hawk', office: 'dispatch', color: 'red' },
] as const;

// ─────────────────────────────────────────────────────────────
// PMO Pipeline Status Bar
// ─────────────────────────────────────────────────────────────

function PipelineStatus({ classification }: { classification: PmoClassification | null }) {
  if (!classification) return null;

  const OfficeIcon = PMO_OFFICE_ICONS[classification.pmoOffice] || Building2;
  const isDeployLane = classification.executionLane === 'deploy_it';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mx-4 mb-2"
    >
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
        {/* Office */}
        <div className="flex items-center gap-2">
          <OfficeIcon className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-medium text-amber-300">{classification.officeLabel}</span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Director */}
        <span className="text-xs font-mono text-amber-200/70">{classification.director}</span>

        <div className="w-px h-4 bg-white/10" />

        {/* Lane */}
        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
          isDeployLane
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {isDeployLane ? 'DEPLOY IT' : 'GUIDE ME'}
        </span>

        {/* Confidence */}
        <div className="ml-auto flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${classification.confidence * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-200/40 font-mono">{Math.round(classification.confidence * 100)}%</span>
        </div>

        {/* Complexity */}
        <span className="text-[10px] text-amber-200/40 font-mono">C:{classification.complexity}</span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Message Bubble
// ─────────────────────────────────────────────────────────────

function MessageBubble({ role, content, isStreaming }: {
  role: string;
  content: string;
  isStreaming?: boolean;
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black text-xs font-bold">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-500/10 border border-amber-500/20">
            <Image
              src="/images/acheevy/acheevy-helmet.png"
              alt="ACHEEVY"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-amber-500/20 text-amber-50 rounded-tr-sm'
              : 'bg-white/[0.03] text-amber-100/90 rounded-tl-sm border border-white/5'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-amber-200 prose-a:text-amber-300 prose-strong:text-amber-100 prose-code:text-amber-300 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
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
                      <pre className="bg-black/60 rounded-lg p-4 overflow-x-auto border border-white/5 my-3">
                        <code className={`${className} text-[13px]`} {...props}>
                          {children}
                        </code>
                      </pre>
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
        </div>

        {/* Copy button for assistant messages */}
        {!isUser && !isStreaming && content && (
          <div className="mt-1 opacity-0 hover:opacity-100 transition-opacity inline-flex">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/10 text-gray-600 hover:text-amber-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Chat Page
// ─────────────────────────────────────────────────────────────

export default function ChatPage() {
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

  const [pmoClassification, setPmoClassification] = useState<PmoClassification | null>(null);
  const [activeDirector, setActiveDirector] = useState<string | null>(null);
  const [currentVerb, setCurrentVerb] = useState('Deploy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydration-safe random verb
  useEffect(() => {
    setCurrentVerb(ACHEEVY_VERBS[Math.floor(Math.random() * ACHEEVY_VERBS.length)]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // PMO Classification — runs when a user message is sent
  const classifyMessage = useCallback(async (message: string) => {
    try {
      const res = await fetch('/api/chat/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        const data = await res.json();
        setPmoClassification(data);
        setActiveDirector(data.director);
      }
    } catch {
      // Classification is non-critical; don't block the chat
    }
  }, []);

  // Enhanced submit that also classifies
  const handleEnhancedSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    classifyMessage(input.trim());
    handleSubmit(e);
  }, [input, isLoading, classifyMessage, handleSubmit]);

  // Quick intent handler
  const handleQuickIntent = useCallback((prompt: string) => {
    setInput(prompt);
    classifyMessage(prompt);
    // Submit after a tick to let the input state update
    setTimeout(() => {
      const form = document.getElementById('chat-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  }, [setInput, classifyMessage]);

  // Keyboard handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = document.getElementById('chat-form') as HTMLFormElement;
      form?.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto h-[calc(100vh-64px)]">
        {/* ── Header Bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-amber-500/20 flex items-center justify-center">
                <Bot className="text-amber-400 w-6 h-6" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0f1a] animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight">Chat w/ACHEEVY</h1>
              <p className="text-[11px] text-amber-300/50">Think It. Prompt It. Let ACHEEVY {currentVerb} it!</p>
            </div>
          </div>

          {/* Agent Shelf */}
          <div className="hidden md:flex items-center gap-1.5">
            {BOOMER_ANGS.map(agent => (
              <div
                key={agent.id}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-default ${
                  activeDirector === agent.name
                    ? 'border-amber-500/30 bg-amber-500/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  activeDirector === agent.name ? 'bg-amber-400 animate-pulse' : 'bg-white/20'
                }`} />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                  {agent.name.replace('Boomer_', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PMO Pipeline Status ── */}
        <AnimatePresence>
          {pmoClassification && <PipelineStatus classification={pmoClassification} />}
        </AnimatePresence>

        {/* ── Chat Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome State */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <span className="text-3xl font-bold text-black">A</span>
                </div>
                <h2 className="text-2xl font-bold text-amber-100 mb-2">Chat w/ACHEEVY</h2>
                <p className="text-amber-100/40 max-w-lg mx-auto mb-10">
                  Your AI executive orchestrator. I route tasks through the Chain of Command
                  — Boomer_Ang directors strategize, Chicken_Hawk dispatches, Lil_Hawks execute.
                </p>

                {/* Quick Intents */}
                <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                  {QUICK_INTENTS.map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => handleQuickIntent(chip.prompt)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-300 transition-all disabled:opacity-50"
                    >
                      <chip.icon className="w-4 h-4" />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  isStreaming={isLoading && i === messages.length - 1 && m.role === 'assistant'}
                />
              ))}
            </AnimatePresence>

            {/* Loading indicator (before first token) */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <div className="px-4 py-3 bg-white/[0.03] rounded-2xl rounded-tl-sm border border-white/5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-amber-400/50 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input Area ── */}
        <div className="border-t border-white/5 bg-black/40 backdrop-blur-sm px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form id="chat-form" onSubmit={handleEnhancedSubmit}>
              <div className="relative flex items-end gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-3 focus-within:border-amber-400/30 transition-colors">
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message ACHEEVY..."
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-transparent text-amber-50 placeholder:text-white/20 resize-none outline-none text-[15px] leading-relaxed max-h-[160px] py-2 px-2"
                />

                {/* Send / Stop */}
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    title="Stop generation"
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex-shrink-0"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    title="Send message"
                    className={`p-3 rounded-xl transition-all flex-shrink-0 ${
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

            <p className="text-center text-[10px] font-mono text-white/15 uppercase tracking-[0.2em] mt-3">
              A.I.M.S. Neural Link v2.0 &bull; Vercel AI SDK &bull; Chain of Command Active
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
