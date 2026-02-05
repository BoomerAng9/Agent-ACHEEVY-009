'use client';

/**
 * A.I.M.S. Chat Interface
 *
 * Stellar voice-first chat with LED dot-matrix displays,
 * waveform visualization, and industrial design.
 *
 * Brand: A.I.M.S. AI MANAGED SOLUTIONS
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LEDText,
  LEDPanel,
  VoiceWaveform,
  VoiceButton,
  StatusBadge,
  AIMS_COLORS,
} from '@/components/ui/LEDDisplay';
import { NixieTubeDisplay } from '@/components/ui/NixieTube';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const SpeakerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Message Bubble
// ─────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          border ${isUser ? 'border-zinc-700 bg-zinc-800' : 'border-amber-500/30 bg-amber-500/10'}
        `}
      >
        {isUser ? (
          <span className="text-zinc-400 text-sm font-medium">U</span>
        ) : (
          <LEDText text="A" size="sm" color={AIMS_COLORS.champagne} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <LEDPanel showScrews={false} className={`inline-block ${isUser ? 'bg-zinc-800/50' : ''}`}>
          {isUser ? (
            <p className="text-amber-100/90 text-[15px] leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded text-[13px] font-mono"
                          style={{
                            backgroundColor: AIMS_COLORS.deepsea,
                            color: AIMS_COLORS.champagne,
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre
                        className="rounded-lg p-4 overflow-x-auto border border-zinc-800"
                        style={{ backgroundColor: AIMS_COLORS.deepsea }}
                      >
                        <code className={`${className} text-[13px]`} {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: AIMS_COLORS.champagne }}
                        className="hover:underline"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>

              {/* Streaming cursor */}
              {message.isStreaming && (
                <span
                  className="inline-block w-2 h-5 ml-1 animate-pulse"
                  style={{ backgroundColor: AIMS_COLORS.champagne }}
                />
              )}
            </div>
          )}
        </LEDPanel>

        {/* Actions */}
        {!isUser && !message.isStreaming && message.content && (
          <div className="flex items-center gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {copied ? <span className="text-green-400 text-xs">Copied!</span> : <CopyIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onSpeak?.(message.content)}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <SpeakerIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Chat Interface
// ─────────────────────────────────────────────────────────────

interface AIMSChatProps {
  userName?: string;
}

export function AIMSChat({ userName = 'User' }: AIMSChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [tokenCount, setTokenCount] = useState(0);
  const [costEstimate, setCostEstimate] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─────────────────────────────────────────────────────────
  // Auto-scroll
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─────────────────────────────────────────────────────────
  // Simulate audio level when listening
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      return;
    }

    const interval = setInterval(() => {
      setAudioLevel(0.3 + Math.random() * 0.7);
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  // ─────────────────────────────────────────────────────────
  // Handle Send
  // ─────────────────────────────────────────────────────────

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setIsStreaming(true);

    // Update token count (estimate)
    const inputTokens = Math.ceil(inputValue.length / 4);
    setTokenCount(prev => prev + inputTokens);

    // Simulate streaming response
    const responses = [
      `Hello ${userName}! I'm ACHEEVY, your AI assistant from A.I.M.S. `,
      'I can help you with:\n\n',
      '- **Business Strategy** - Planning and execution\n',
      '- **Development** - Code, architecture, deployment\n',
      '- **Content Creation** - Writing, design, media\n',
      '- **Automation** - Workflows and integrations\n\n',
      'What would you like to work on today?',
    ];

    let fullContent = '';
    for (const chunk of responses) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      fullContent += chunk;

      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg.role === 'assistant') {
          lastMsg.content = fullContent;
        }
        return updated;
      });
    }

    // Finalize
    setMessages(prev => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg.role === 'assistant') {
        lastMsg.isStreaming = false;
      }
      return updated;
    });

    // Update token count and cost
    const outputTokens = Math.ceil(fullContent.length / 4);
    setTokenCount(prev => prev + outputTokens);
    setCostEstimate(prev => prev + (inputTokens * 0.015 + outputTokens * 0.075) / 1000);

    setIsStreaming(false);
  }, [inputValue, isStreaming, userName]);

  // ─────────────────────────────────────────────────────────
  // Handle Voice
  // ─────────────────────────────────────────────────────────

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      setIsProcessing(true);
      // Simulate transcription
      setTimeout(() => {
        setInputValue('What can you help me with today?');
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsListening(true);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Keyboard handling
  // ─────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: AIMS_COLORS.deepsea }}>
      {/* Header */}
      <header className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <LEDPanel showScrews={false} className="px-4 py-2">
              <LEDText text="A.I.M.S." size="md" color={AIMS_COLORS.champagne} />
            </LEDPanel>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">AI MANAGED SOLUTIONS</p>
              <StatusBadge status={isListening ? 'listening' : isStreaming ? 'processing' : 'active'} />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Tokens</p>
              <NixieTubeDisplay
                value={tokenCount}
                digits={6}
                size="sm"
                glowColor={AIMS_COLORS.champagne}
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500 uppercase">Cost</p>
              <NixieTubeDisplay
                value={costEstimate}
                digits={6}
                decimals={4}
                size="sm"
                prefix="$"
                glowColor="#22c55e"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Voice Waveform */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <LEDPanel className="py-4">
          <VoiceWaveform
            isActive={isListening || isStreaming}
            audioLevel={isListening ? audioLevel : isStreaming ? 0.5 : 0}
            color={AIMS_COLORS.champagne}
            height={50}
            bars={60}
          />
          {isListening && (
            <p className="text-center text-xs text-zinc-500 mt-2 uppercase tracking-wider">
              Listening...
            </p>
          )}
        </LEDPanel>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <LEDPanel className="inline-block px-8 py-6">
                <LEDText text="ACHEEVY" size="xl" color={AIMS_COLORS.champagne} />
                <p className="text-zinc-500 text-sm mt-4 max-w-md">
                  Voice-first AI assistant. Speak or type to get started.
                </p>
              </LEDPanel>
            </motion.div>
          )}

          {/* Message List */}
          <AnimatePresence>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <LEDPanel className="flex items-end gap-4">
            {/* Voice Button */}
            <VoiceButton
              isListening={isListening}
              isProcessing={isProcessing}
              onClick={handleVoiceToggle}
              size="md"
            />

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Speak or type your message..."
                disabled={isStreaming}
                rows={1}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl
                         text-amber-100/90 placeholder:text-zinc-600 resize-none outline-none
                         focus:border-amber-500/30 transition-colors"
                style={{ minHeight: 48, maxHeight: 120 }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${inputValue.trim()
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }
              `}
              style={{
                boxShadow: inputValue.trim()
                  ? `0 0 20px ${AIMS_COLORS.champagne}44`
                  : 'none',
              }}
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </LEDPanel>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-600 mt-3">
            ACHEEVY by A.I.M.S. • Voice powered by ElevenLabs • AI by OpenRouter
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIMSChat;
