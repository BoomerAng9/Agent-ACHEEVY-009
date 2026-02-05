'use client';

/**
 * LUC Workspace - Usage Calculator & Quota Management
 *
 * Standalone calculator page where users can:
 * - View quota usage across all service buckets
 * - Estimate impact of planned operations
 * - See warnings at threshold levels (80%)
 * - Manage plan and billing
 *
 * LUC = Live Usage Calculator
 * A.I.M.S. core execution service for quota gating and cost tracking.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitBoardPattern, AIMS_CIRCUIT_COLORS } from '@/components/ui/CircuitBoard';
import {
  SERVICE_BUCKETS,
  LUC_PLANS,
  LUCServiceKey,
  LUCSummary,
  LUCQuote,
} from '@/lib/luc/luc-engine';

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────

const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="16" y1="10" x2="16" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="16" y1="14" x2="16" y2="14.01" />
    <line x1="8" y1="18" x2="8" y2="18.01" />
    <line x1="12" y1="18" x2="16" y2="18" />
  </svg>
);

const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────

function StatusBar({ percent, status }: { percent: number; status: string }) {
  const colors = {
    ok: '#22c55e',
    warning: '#eab308',
    critical: '#f97316',
    blocked: '#ef4444',
  };
  const color = colors[status as keyof typeof colors] || colors.ok;

  return (
    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
    </div>
  );
}

function ServiceCard({
  service,
  onCalculate,
}: {
  service: LUCSummary['services'][0];
  onCalculate: (key: LUCServiceKey) => void;
}) {
  const bucket = SERVICE_BUCKETS[service.key];
  const statusColors = {
    ok: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    critical: 'border-orange-500/30 bg-orange-500/5',
    blocked: 'border-red-500/30 bg-red-500/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${statusColors[service.status]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-medium">{service.name}</h3>
          <p className="text-xs text-gray-400">{bucket?.description}</p>
        </div>
        {service.status !== 'ok' && (
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              service.status === 'warning'
                ? 'bg-yellow-500/20 text-yellow-400'
                : service.status === 'critical'
                ? 'bg-orange-500/20 text-orange-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {service.status.toUpperCase()}
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">
            {service.used.toLocaleString()} / {service.limit.toLocaleString()} {bucket?.unit}s
          </span>
          <span
            className={`font-mono ${
              service.percentUsed >= 90
                ? 'text-red-400'
                : service.percentUsed >= 80
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}
          >
            {service.percentUsed.toFixed(1)}%
          </span>
        </div>
        <StatusBar percent={service.percentUsed} status={service.status} />
      </div>

      {service.overage > 0 && (
        <div className="flex justify-between text-xs mb-3 p-2 rounded bg-red-500/10 border border-red-500/20">
          <span className="text-red-400">Overage: {service.overage.toLocaleString()} {bucket?.unit}s</span>
          <span className="text-red-400 font-mono">${service.overageCost.toFixed(4)}</span>
        </div>
      )}

      <button
        onClick={() => onCalculate(service.key)}
        className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          backgroundColor: AIMS_CIRCUIT_COLORS.primary + '20',
          color: AIMS_CIRCUIT_COLORS.accent,
          border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
        }}
      >
        Calculate Usage
      </button>
    </motion.div>
  );
}

function QuoteCalculator({
  selectedService,
  onClose,
}: {
  selectedService: LUCServiceKey | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number>(1);
  const [quote, setQuote] = useState<LUCQuote | null>(null);
  const [loading, setLoading] = useState(false);

  const bucket = selectedService ? SERVICE_BUCKETS[selectedService] : null;

  const fetchQuote = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      const res = await fetch('/api/luc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'quote',
          userId: 'default-user',
          service: selectedService,
          amount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuote(data.quote);
      }
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedService) {
      fetchQuote();
    }
  }, [selectedService, amount]);

  if (!selectedService || !bucket) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Quote Calculator</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Service</label>
            <div
              className="px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#0f172a', border: '1px solid #2d3a4d' }}
            >
              <div className="text-white font-medium">{bucket.name}</div>
              <div className="text-xs text-gray-400">{bucket.description}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Amount ({bucket.unit}s)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
              className="w-full px-4 py-3 rounded-lg text-white outline-none"
              style={{
                backgroundColor: '#0f172a',
                border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
              }}
            />
          </div>

          {quote && (
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ backgroundColor: '#0f172a', border: '1px solid #2d3a4d' }}
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current Usage</span>
                <span className="text-white">{quote.currentUsed.toLocaleString()} / {quote.limit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">After Operation</span>
                <span className="text-white">{(quote.currentUsed + amount).toLocaleString()}</span>
              </div>
              {quote.wouldExceed && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">Projected Overage</span>
                    <span className="text-yellow-400">{quote.projectedOverage.toLocaleString()} {bucket.unit}s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">Overage Cost</span>
                    <span className="text-yellow-400 font-mono">${quote.projectedCost.toFixed(4)}</span>
                  </div>
                </>
              )}
              <div className="pt-3 border-t border-gray-700 flex items-center gap-2">
                {quote.allowed ? (
                  <>
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    <span className="text-green-400">Operation Allowed</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                    <span className="text-red-400">Operation Blocked - Quota Exceeded</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function LUCWorkspacePage() {
  const [summary, setSummary] = useState<LUCSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<LUCServiceKey | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/luc?userId=default-user');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch LUC summary:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handlePlanChange = async (planId: string) => {
    try {
      await fetch('/api/luc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-plan',
          userId: 'default-user',
          planId,
        }),
      });
      fetchSummary();
    } catch (error) {
      console.error('Failed to update plan:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f1a' }}>
      <CircuitBoardPattern density="sparse" animated={false} glowIntensity={0.1} />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${AIMS_CIRCUIT_COLORS.primary}, ${AIMS_CIRCUIT_COLORS.accent})`,
                  boxShadow: `0 0 20px ${AIMS_CIRCUIT_COLORS.glow}`,
                }}
              >
                <CalculatorIcon className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: AIMS_CIRCUIT_COLORS.secondary }}>
                  LUC - Usage Calculator
                </h1>
                <p className="text-gray-400">
                  Track quotas, estimate costs, and manage your resource usage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Wallet Balance */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: '#1a2234',
                  border: '1px solid #2d3a4d',
                }}
              >
                <WalletIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Balance:</span>
                <span className="font-mono font-bold" style={{ color: AIMS_CIRCUIT_COLORS.accent }}>
                  $250.00
                </span>
              </div>

              <button
                onClick={fetchSummary}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: AIMS_CIRCUIT_COLORS.primary + '20',
                  border: `1px solid ${AIMS_CIRCUIT_COLORS.primary}40`,
                  color: AIMS_CIRCUIT_COLORS.accent,
                }}
              >
                <RefreshIcon className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          </div>
        ) : summary ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
              >
                <div className="text-sm text-gray-400 mb-1">Plan</div>
                <div className="text-xl font-bold" style={{ color: AIMS_CIRCUIT_COLORS.accent }}>
                  {summary.planName}
                </div>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
              >
                <div className="text-sm text-gray-400 mb-1">Overall Usage</div>
                <div
                  className={`text-xl font-bold ${
                    summary.overallPercentUsed >= 80
                      ? 'text-red-400'
                      : summary.overallPercentUsed >= 60
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                >
                  {summary.overallPercentUsed.toFixed(1)}%
                </div>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
              >
                <div className="text-sm text-gray-400 mb-1">Total Overage</div>
                <div className="text-xl font-bold text-red-400">
                  ${summary.totalOverageCost.toFixed(2)}
                </div>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
              >
                <div className="text-sm text-gray-400 mb-1">Billing Cycle Ends</div>
                <div className="text-xl font-bold text-white">
                  {new Date(summary.billingCycleEnd).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {summary.warnings.length > 0 && (
              <div
                className="p-4 rounded-xl mb-8"
                style={{ backgroundColor: '#fef3c720', border: '1px solid #fbbf2440' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-400">Quota Warnings</span>
                </div>
                <ul className="space-y-1">
                  {summary.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-yellow-300/80">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plan Selector */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Change Plan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(LUC_PLANS).map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      summary.planName === plan.name
                        ? 'ring-2'
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: '#1a2234',
                      border: '1px solid #2d3a4d',
                      ringColor: summary.planName === plan.name ? AIMS_CIRCUIT_COLORS.accent : undefined,
                    }}
                  >
                    <div className="text-white font-medium">{plan.name}</div>
                    <div className="text-2xl font-bold mt-1" style={{ color: AIMS_CIRCUIT_COLORS.accent }}>
                      ${plan.monthlyPrice}
                      <span className="text-sm text-gray-400 font-normal">/mo</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {plan.overageThreshold * 100}% overage allowed
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Cards */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Service Quotas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {summary.services.map((service) => (
                  <ServiceCard
                    key={service.key}
                    service={service}
                    onCalculate={setSelectedService}
                  />
                ))}
              </div>
            </div>

            {/* Rate Card */}
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: '#1a2234', border: '1px solid #2d3a4d' }}
            >
              <h2 className="text-lg font-semibold text-white mb-4">Rate Card</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.values(SERVICE_BUCKETS).slice(0, 8).map((bucket) => (
                  <div key={bucket.key}>
                    <div className="text-sm text-gray-400">{bucket.name}</div>
                    <div className="text-white font-mono">
                      ${bucket.overageRate.toFixed(4)} / {bucket.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            Failed to load LUC data
          </div>
        )}
      </div>

      {/* Quote Calculator Modal */}
      <AnimatePresence>
        {selectedService && (
          <QuoteCalculator
            selectedService={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
