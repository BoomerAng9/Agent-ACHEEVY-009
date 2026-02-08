'use client';

/**
 * ACHEEVY Sandbox — Unified Chat Experience
 *
 * The Manus-level sandbox environment for AIMS. Combines:
 * - Chat with ACHEEVY (Vercel AI SDK + OpenRouter)
 * - File & image upload (all tiers — drag-and-drop + click)
 * - Voice STT via Groq Whisper (paid tiers)
 * - Auto-TTS on ACHEEVY replies via ElevenLabs (paid tiers)
 * - Collaboration Feed sidebar (live agent look-in)
 * - PMO routing visualization
 * - 3-6-9 tier gating
 *
 * "Activity breeds Activity — shipped beats perfect."
 */

import { useChat } from 'ai/react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import {
  Send, Square, Copy, Check, Mic, MicOff, Volume2, VolumeX,
  Paperclip, X, FileText, ImageIcon, Code2, Upload, Sparkles,
  Bot, User, Zap, Trophy, Search, Hammer, Layers, Container, Wand2,
  Building2, DollarSign, Activity, Megaphone, Palette, BookOpen,
  PanelRightClose, PanelRightOpen, Crown, Lock,
  ChevronDown, Flame, Eye, Users,
} from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { useUserTier } from '@/hooks/useUserTier';
import type { UploadedFile } from '@/app/api/upload/route';

// ─────────────────────────────────────────────────────────────
// Types
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

interface CollabFeedEntry {
  id: string;
  timestamp: string;
  speaker: string;
  role: string;
  type: string;
  message: string;
  depth: number;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const QUICK_INTENTS = [
  { label: 'Launch Perform', icon: Trophy, prompt: 'Launch the Perform Stack and analyze the latest athlete data' },
  { label: 'Build a Plug', icon: Hammer, prompt: 'I want to build a new plug for my workflow' },
  { label: 'Deep Research', icon: Search, prompt: 'Run deep research on the latest AI agent frameworks' },
  { label: 'Deploy Tool', icon: Container, prompt: 'Deploy my latest build to production' },
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
  'hr-office': Users,
  'dtpmo-office': Eye,
};

const FILE_CATEGORY_ICONS: Record<string, typeof FileText> = {
  image: ImageIcon,
  document: FileText,
  code: Code2,
  spreadsheet: FileText,
  archive: FileText,
};

// ─────────────────────────────────────────────────────────────
// Upgrade Prompt (for gated features)
// ─────────────────────────────────────────────────────────────

function UpgradePrompt({ feature, onClose }: { feature: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute bottom-full mb-2 left-0 right-0 mx-4 p-4 rounded-xl bg-[#111] border border-gold/20 shadow-2xl z-50"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
          <Crown className="w-4 h-4 text-gold" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{feature} requires a paid plan</p>
          <p className="text-xs text-white/40 mt-1">
            Upgrade to Garage ($99/mo), Community ($89/mo), or Enterprise ($67/mo) to unlock {feature.toLowerCase()}, code sandbox, and more.
          </p>
          <div className="flex gap-2 mt-3">
            <a
              href="/dashboard/plan"
              className="px-3 py-1.5 text-xs font-medium bg-gold text-black rounded-lg hover:bg-gold-light transition-colors"
            >
              View Plans
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// File Upload Zone
// ─────────────────────────────────────────────────────────────

function FileUploadZone({
  files,
  onFilesAdded,
  onRemove,
  isDragging,
}: {
  files: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onRemove: (id: string) => void;
  isDragging: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (files.length === 0 && !isDragging) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mx-4 mb-2"
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="flex items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-gold/40 bg-gold/5 mb-2">
            <Upload className="w-5 h-5 text-gold" />
            <span className="text-sm text-gold font-medium">Drop files here</span>
          </div>
        )}

        {/* File chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map(file => {
              const Icon = FILE_CATEGORY_ICONS[file.category] || FileText;
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-wireframe-stroke text-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-white/70 max-w-[120px] truncate">{file.name}</span>
                  <span className="text-white/30 font-mono">{(file.size / 1024).toFixed(0)}KB</span>
                  <button
                    onClick={() => onRemove(file.id)}
                    className="p-0.5 rounded hover:bg-white/10 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onFilesAdded(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Collaboration Feed Sidebar
// ─────────────────────────────────────────────────────────────

function CollabFeedSidebar({
  entries,
  isOpen,
  onToggle,
  isFullAccess,
}: {
  entries: CollabFeedEntry[];
  isOpen: boolean;
  onToggle: () => void;
  isFullAccess: boolean;
}) {
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const roleColors: Record<string, string> = {
    acheevy: 'text-gold',
    boomer_ang: 'text-cyan-400',
    chicken_hawk: 'text-red-400',
    lil_hawk: 'text-emerald-400',
    verifier: 'text-violet-400',
    receipt: 'text-blue-400',
    system: 'text-white/40',
  };

  const typeIcons: Record<string, string> = {
    intake: '📥',
    thinking: '🧠',
    classification: '🏷',
    directive: '📋',
    handoff: '🔄',
    squad_assembly: '🦅',
    execution: '⚡',
    verification: '✅',
    nugget: '💬',
    receipt: '🧾',
    debrief: '📊',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 overflow-hidden border-l border-wireframe-stroke bg-[#0A0A0A]/80"
        >
          <div className="flex flex-col h-full w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-wireframe-stroke">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gold/60" />
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 font-mono">
                  Live Look-In
                </span>
                {entries.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <PanelRightClose size={14} />
              </button>
            </div>

            {/* Feed */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1 px-3">
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-8 h-8 text-white/10 mx-auto mb-3" />
                  <p className="text-xs text-white/20 font-mono">Agents standing by</p>
                  <p className="text-[10px] text-white/10 mt-1">
                    Send a message to see the chain of command in action
                  </p>
                </div>
              ) : (
                entries.map((entry) => {
                  const isBlurred = !isFullAccess && (entry.type === 'thinking' || entry.type === 'directive');
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`rounded-lg px-3 py-2 ${
                        isBlurred ? 'bg-white/[0.02] blur-[2px] select-none' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                      style={{ marginLeft: `${entry.depth * 12}px` }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px]">{typeIcons[entry.type] || '•'}</span>
                        <span className={`text-[10px] font-mono font-medium ${roleColors[entry.role] || 'text-white/50'}`}>
                          {entry.speaker}
                        </span>
                        <span className="text-[9px] text-white/20 font-mono ml-auto">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 leading-relaxed">
                        {isBlurred ? 'Upgrade to see agent reasoning...' : entry.message}
                      </p>
                    </motion.div>
                  );
                })
              )}

              {/* Upgrade nudge for free tier */}
              {!isFullAccess && entries.length > 0 && (
                <div className="mt-4 p-3 rounded-lg border border-gold/10 bg-gold/[0.03]">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-3 h-3 text-gold/50" />
                    <span className="text-[10px] text-gold/60 font-medium">Full access with any paid plan</span>
                  </div>
                  <a href="/dashboard/plan" className="text-[10px] text-gold underline">
                    View plans
                  </a>
                </div>
              )}

              <div ref={feedEndRef} />
            </div>

            {/* Footer */}
            <div className="border-t border-wireframe-stroke px-4 py-2">
              <p className="text-[9px] text-white/15 font-mono uppercase tracking-wider text-center">
                Chain of Command Active
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// PMO Pipeline Status
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
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gold/5 border border-gold/10">
        <OfficeIcon className="w-4 h-4 text-gold" />
        <span className="text-xs font-medium text-gold">{classification.officeLabel}</span>
        <div className="w-px h-4 bg-wireframe-stroke" />
        <span className="text-xs font-mono text-white/60">{classification.director}</span>
        <div className="w-px h-4 bg-wireframe-stroke" />
        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
          isDeployLane
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>
          {isDeployLane ? 'DEPLOY IT' : 'GUIDE ME'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${classification.confidence * 100}%` }} />
          </div>
          <span className="text-[10px] text-white/40 font-mono">{Math.round(classification.confidence * 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Message Bubble
// ─────────────────────────────────────────────────────────────

function MessageBubble({
  role,
  content,
  isStreaming,
  attachments,
  onSpeak,
}: {
  role: string;
  content: string;
  isStreaming?: boolean;
  attachments?: UploadedFile[];
  onSpeak?: (text: string) => void;
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
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
            <User className="w-4 h-4 text-gold" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Image
              src="/images/acheevy/acheevy-helmet.png"
              alt="ACHEEVY"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : ''}`}>
            {attachments.map(file => {
              if (file.category === 'image') {
                return (
                  <div key={file.id} className="rounded-lg overflow-hidden border border-wireframe-stroke max-w-[200px]">
                    <img src={file.url} alt={file.name} className="w-full h-auto" />
                    <div className="px-2 py-1 bg-black/40 text-[10px] text-white/40 truncate">{file.name}</div>
                  </div>
                );
              }
              const Icon = FILE_CATEGORY_ICONS[file.category] || FileText;
              return (
                <div key={file.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-wireframe-stroke">
                  <Icon className="w-4 h-4 text-gold/60" />
                  <div>
                    <p className="text-xs text-white/70 truncate max-w-[120px]">{file.name}</p>
                    <p className="text-[9px] text-white/30 font-mono">{(file.size / 1024).toFixed(0)}KB</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gold/10 text-white rounded-tr-sm border border-gold/20'
              : 'wireframe-card text-white/90 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-gold prose-strong:text-white prose-code:text-gold prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return <code className="bg-black/40 px-1.5 py-0.5 rounded text-gold text-[13px]" {...props}>{children}</code>;
                    }
                    return (
                      <pre className="bg-black/60 rounded-lg p-4 overflow-x-auto border border-wireframe-stroke my-3">
                        <code className={`${className} text-[13px]`} {...props}>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && <span className="inline-block w-2 h-5 bg-gold ml-1 animate-pulse" />}
            </div>
          )}
        </div>

        {/* Message actions */}
        {!isUser && !isStreaming && content && (
          <div className="flex items-center gap-1.5 mt-1.5 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-gold transition-colors" title="Copy">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {onSpeak && (
              <button onClick={() => onSpeak(content)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-gold transition-colors" title="Read aloud">
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Sandbox Page
// ─────────────────────────────────────────────────────────────

export default function ACHEEVYSandbox() {
  // ── Chat ──
  const {
    messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput,
  } = useChat({ api: '/api/chat' });

  // ── Tier ──
  const { tier, gates, isPaid } = useUserTier();

  // ── Voice ──
  const voiceInput = useVoiceInput({
    onTranscript: (result) => {
      setInput(result.text);
      if (result.text.trim()) {
        setTimeout(() => {
          const form = document.getElementById('sandbox-form') as HTMLFormElement;
          form?.requestSubmit();
        }, 100);
      }
    },
  });

  const voiceOutput = useVoiceOutput({
    config: { autoPlay: gates.autoTts, provider: 'elevenlabs' },
  });

  // ── State ──
  const [pmoClassification, setPmoClassification] = useState<PmoClassification | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [collabFeed, setCollabFeed] = useState<CollabFeedEntry[]>([]);
  const [feedOpen, setFeedOpen] = useState(false);
  const [upgradePrompt, setUpgradePrompt] = useState<string | null>(null);
  const [messageAttachments, setMessageAttachments] = useState<Map<string, UploadedFile[]>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // ── Auto-TTS on assistant replies (paid tiers only) ──
  useEffect(() => {
    if (!gates.autoTts || !voiceOutput.autoPlayEnabled) return;
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === 'assistant' && !isLoading) {
      // Only speak if it's a new message (not re-render)
      const lastSpoken = sessionStorage.getItem('aims_last_spoken');
      if (lastSpoken !== last.id) {
        sessionStorage.setItem('aims_last_spoken', last.id);
        voiceOutput.speak(last.content);
      }
    }
  }, [messages, isLoading, gates.autoTts, voiceOutput]);

  // ── PMO Classification ──
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
        // Generate collab feed entries
        addCollabEntry('ACHEEVY', 'acheevy', 'intake', `Roger that. Analyzing your request...`);
        addCollabEntry('ACHEEVY', 'acheevy', 'classification', `Routing to ${data.officeLabel} — Director: ${data.director}`);
        addCollabEntry(data.director, 'boomer_ang', 'directive', `Acknowledged. Taking ownership. Lane: ${data.executionLane === 'deploy_it' ? 'Deploy It' : 'Guide Me'}`, 1);
        addCollabEntry('Chicken_Hawk', 'chicken_hawk', 'squad_assembly', `Assembling Lil_Hawk squad for ${data.officeLabel}...`, 1);
      }
    } catch {}
  }, []);

  // ── Collab Feed Helper ──
  const addCollabEntry = useCallback((speaker: string, role: string, type: string, message: string, depth = 0) => {
    setCollabFeed(prev => [...prev, {
      id: `cf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      speaker,
      role,
      type,
      message,
      depth,
    }]);
  }, []);

  // ── File Upload ──
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setUploadedFiles(prev => [...prev, ...data.files]);
      } else {
        const err = await res.json();
        console.error('[Upload]', err.error);
      }
    } catch (err) {
      console.error('[Upload] Failed:', err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  // ── Drag & Drop ──
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileUpload(files);
  }, [handleFileUpload]);

  // ── Submit Handler ──
  const handleEnhancedSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Track attachments for this message
    if (uploadedFiles.length > 0) {
      const msgId = `msg_${Date.now()}`;
      setMessageAttachments(prev => new Map(prev).set(msgId, [...uploadedFiles]));
    }

    classifyMessage(input.trim());

    // Include file context in the message if files are attached
    if (uploadedFiles.length > 0) {
      const fileContext = uploadedFiles.map(f => `[Attached: ${f.name} (${f.category})]`).join(' ');
      const enhancedInput = `${input}\n\n${fileContext}`;
      setInput(enhancedInput);
      setTimeout(() => {
        handleSubmit(e);
        setUploadedFiles([]);
      }, 50);
    } else {
      handleSubmit(e);
    }

    // Add execution entries to collab feed after a delay
    setTimeout(() => {
      addCollabEntry('Lil_Hawk_1', 'lil_hawk', 'execution', 'Executing assigned task...', 2);
    }, 1500);
    setTimeout(() => {
      addCollabEntry('Proof_Ang', 'verifier', 'verification', 'Verifying output quality...', 2);
    }, 3000);
  }, [input, isLoading, uploadedFiles, classifyMessage, handleSubmit, setInput, addCollabEntry]);

  // ── Quick Intent Handler ──
  const handleQuickIntent = useCallback((prompt: string) => {
    setInput(prompt);
    classifyMessage(prompt);
    setTimeout(() => {
      const form = document.getElementById('sandbox-form') as HTMLFormElement;
      form?.requestSubmit();
    }, 50);
  }, [setInput, classifyMessage]);

  // ── Keyboard ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = document.getElementById('sandbox-form') as HTMLFormElement;
      form?.requestSubmit();
    }
  };

  // ── Voice gate check ──
  const handleVoiceClick = useCallback(() => {
    if (!gates.voiceStt) {
      setUpgradePrompt('Voice Input');
      return;
    }
    if (voiceInput.isListening) {
      voiceInput.stopListening();
    } else {
      voiceInput.startListening();
    }
  }, [gates.voiceStt, voiceInput]);

  return (
    <div
      className="relative flex h-[calc(100vh-6rem)] overflow-hidden bg-[#0A0A0A] aims-page-bg rounded-2xl border border-wireframe-stroke"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-wireframe-stroke bg-black/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-lg font-bold text-black">A</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-white">ACHEEVY Sandbox</h1>
              <p className="text-[10px] text-white/40 font-mono">
                {tier.name} &bull; {gates.autoTts ? 'Voice Active' : 'Text Mode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* TTS Toggle (paid only) */}
            {gates.autoTts && (
              <button
                onClick={() => voiceOutput.setAutoPlay(!voiceOutput.autoPlayEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  voiceOutput.autoPlayEnabled ? 'text-gold bg-gold/10' : 'text-white/30 hover:text-white/50'
                }`}
                title={voiceOutput.autoPlayEnabled ? 'Disable auto-TTS' : 'Enable auto-TTS'}
              >
                {voiceOutput.autoPlayEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            )}

            {/* Collab Feed Toggle */}
            <button
              onClick={() => setFeedOpen(!feedOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                feedOpen
                  ? 'border-gold/30 bg-gold/10 text-gold'
                  : 'border-wireframe-stroke bg-white/[0.02] text-white/50 hover:bg-white/5'
              }`}
            >
              <Eye size={14} />
              <span className="text-xs font-mono">Live Feed</span>
              {collabFeed.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
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
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-2xl shadow-gold/30">
                  <span className="text-3xl font-bold text-black font-display">A</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">ACHEEVY Sandbox</h2>
                <p className="text-white/40 max-w-lg mx-auto mb-2">
                  Your AI executive orchestrator. Describe what you need — I route through
                  8 PMO offices, 25 Boomer_Angs strategize, Chicken_Hawk dispatches, Lil_Hawks execute.
                </p>
                <p className="text-[11px] text-gold/40 font-mono mb-8">
                  Drop files, use voice{!isPaid && ' (paid)'}, or type below
                </p>

                {/* Quick Intents */}
                <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
                  {QUICK_INTENTS.map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => handleQuickIntent(chip.prompt)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 wireframe-card px-4 py-2.5 text-sm text-white/60 hover:bg-gold/10 hover:border-gold/20 hover:text-gold transition-all disabled:opacity-50"
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
                  onSpeak={gates.autoTts ? (text) => voiceOutput.speak(text, true) : undefined}
                />
              ))}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-gold animate-pulse" />
                </div>
                <div className="px-4 py-3 wireframe-card rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}

            {/* Voice playback indicator */}
            {voiceOutput.isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3 py-2"
              >
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gold rounded-full animate-pulse"
                      style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/40">ACHEEVY speaking...</span>
                <button onClick={voiceOutput.stop} className="text-xs text-gold hover:underline">Stop</button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── File Upload Zone ── */}
        <FileUploadZone
          files={uploadedFiles}
          onFilesAdded={handleFileUpload}
          onRemove={(id) => setUploadedFiles(prev => prev.filter(f => f.id !== id))}
          isDragging={isDragging}
        />

        {/* ── Upgrade Prompt ── */}
        <AnimatePresence>
          {upgradePrompt && (
            <UpgradePrompt feature={upgradePrompt} onClose={() => setUpgradePrompt(null)} />
          )}
        </AnimatePresence>

        {/* ── Input Area ── */}
        <div className="border-t border-wireframe-stroke bg-black/60 backdrop-blur-xl px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <form id="sandbox-form" onSubmit={handleEnhancedSubmit}>
              <div className="relative flex items-end gap-2 wireframe-card rounded-2xl p-3 focus-within:border-gold/30 transition-colors">
                {/* File attach button — available to ALL tiers */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
                  title="Attach files"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Paperclip className="w-5 h-5" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFileUpload(Array.from(e.target.files));
                    e.target.value = '';
                  }}
                />

                {/* Voice input button — gated for paid tiers */}
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    voiceInput.isListening
                      ? 'bg-red-500/20 text-red-400'
                      : gates.voiceStt
                        ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                        : 'bg-white/5 text-white/20 cursor-default'
                  }`}
                  title={gates.voiceStt ? (voiceInput.isListening ? 'Stop recording' : 'Voice input') : 'Voice input (paid plans)'}
                >
                  {voiceInput.isProcessing ? (
                    <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  ) : voiceInput.isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <div className="relative">
                      <Mic className="w-5 h-5" />
                      {!gates.voiceStt && (
                        <Lock className="w-2.5 h-2.5 absolute -top-1 -right-1 text-gold/60" />
                      )}
                    </div>
                  )}
                </button>

                {/* Text input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={voiceInput.isListening ? 'Listening...' : 'Message ACHEEVY...'}
                  disabled={isLoading}
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder:text-white/20 resize-none outline-none text-[15px] leading-relaxed max-h-[160px] py-2 px-1"
                />

                {/* Send / Stop */}
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    title="Stop"
                    className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex-shrink-0"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim() && uploadedFiles.length === 0}
                    title="Send"
                    className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                      input.trim() || uploadedFiles.length > 0
                        ? 'bg-gold text-black hover:bg-gold-light'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Voice recording indicator */}
            {voiceInput.isListening && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs text-red-400/80">Recording...</span>
                <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-400 transition-all"
                    style={{ width: `${voiceInput.audioLevel * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[9px] font-mono text-white/15 uppercase tracking-[0.2em]">
                A.I.M.S. v2.0 &bull; {tier.name} &bull; Chain of Command Active
              </p>
              {uploadedFiles.length > 0 && (
                <p className="text-[9px] font-mono text-gold/30">
                  {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Collab Feed Toggle (when closed) ── */}
      {!feedOpen && (
        <button
          onClick={() => setFeedOpen(true)}
          className="absolute top-16 right-0 p-2 rounded-l-lg bg-white/5 border border-r-0 border-wireframe-stroke text-white/40 hover:text-gold hover:bg-white/10 transition-colors"
          title="Open Live Feed"
        >
          <PanelRightOpen size={16} />
        </button>
      )}

      {/* ── Collaboration Feed Sidebar ── */}
      <CollabFeedSidebar
        entries={collabFeed}
        isOpen={feedOpen}
        onToggle={() => setFeedOpen(false)}
        isFullAccess={gates.collabFeedFull}
      />

      {/* ── Drag overlay ── */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-gold/40 bg-gold/5">
            <Upload className="w-10 h-10 text-gold" />
            <p className="text-gold font-medium">Drop files to attach</p>
            <p className="text-xs text-white/40">Images, documents, code, datasets — up to 25MB each</p>
          </div>
        </div>
      )}
    </div>
  );
}
