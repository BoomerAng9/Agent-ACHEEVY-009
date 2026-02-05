# LUC SDK

**Layered Usage Calculator** - A framework-agnostic library for usage tracking, quota gating, and cost estimation.

[![npm version](https://badge.fury.io/js/%40plugmein%2Fluc-sdk.svg)](https://www.npmjs.com/package/@plugmein/luc-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

LUC (Layered Usage Calculator) helps you:

- **Track usage** across multiple services/resources
- **Gate execution** based on quotas (pre-flight checks)
- **Calculate costs** including overage pricing
- **Manage plans** with different quota limits
- **Export data** for billing and analytics

Originally developed for real estate applications, LUC has been re-engineered as a general-purpose library that works across any industry.

### Options

| Option | Description |
|--------|-------------|
| **Open Source SDK** | `npm install @plugmein/luc-sdk` - Self-host, full control |
| **Hosted Version** | [luc.plugmein.cloud](https://luc.plugmein.cloud) - No setup, voice-enabled with ACHEEVY |

## Installation

```bash
npm install @plugmein/luc-sdk
# or
yarn add @plugmein/luc-sdk
# or
pnpm add @plugmein/luc-sdk
```

## Quick Start

```typescript
import { quickStart, SAAS_PRESET } from '@plugmein/luc-sdk';

// Create a LUC instance with the SaaS preset
const { engine } = quickStart('user-123', 'startup', SAAS_PRESET);

// Check if an action is allowed (pre-flight)
const canRun = engine.canExecute('api_calls', 100);
if (!canRun.allowed) {
  console.log('Blocked:', canRun.reason);
  return;
}

// Execute your action...
await myApiCall();

// Debit the usage after success
const result = engine.debit('api_calls', 100);

if (result.warning) {
  console.log(result.warning); // "Warning: API Calls at 85% of quota"
}

// Get a summary of all usage
const summary = engine.getSummary();
console.log(`Overall usage: ${summary.overallPercentUsed.toFixed(1)}%`);
```

## Industry Presets

LUC comes with pre-configured setups for common industries:

```typescript
import {
  REAL_ESTATE_PRESET,   // Property listings, leads, virtual tours
  SAAS_PRESET,          // API calls, users, storage, compute
  AI_PLATFORM_PRESET,   // LLM tokens, embeddings, inference
  ECOMMERCE_PRESET,     // Products, orders, inventory
  HEALTHCARE_PRESET,    // Patient records, appointments, prescriptions
  CONTENT_CREATOR_PRESET // Video, audio, transcription
} from '@plugmein/luc-sdk';

// List all available presets
import { listPresets } from '@plugmein/luc-sdk';
console.log(listPresets());
```

## Custom Configuration

Create your own configuration for any use case:

```typescript
import { createConfig, defineService, definePlan, createAccount, createEngine } from '@plugmein/luc-sdk';

// Define your services
type MyServices = 'messages' | 'file_uploads' | 'ai_requests';

const config = createConfig<MyServices>({
  services: {
    messages: defineService('messages', 'Messages', 'message', 0.001, 'Chat messages'),
    file_uploads: defineService('file_uploads', 'File Uploads', 'file', 0.05, 'Uploaded files'),
    ai_requests: defineService('ai_requests', 'AI Requests', 'request', 0.01, 'AI API calls'),
  },
  plans: {
    free: definePlan('free', 'Free', 0, 0, {
      messages: 100,
      file_uploads: 10,
      ai_requests: 20,
    }),
    pro: definePlan('pro', 'Pro', 19, 0.15, { // 15% overage allowed
      messages: 10000,
      file_uploads: 500,
      ai_requests: 1000,
    }),
  },
  warningThreshold: 0.8,  // Warn at 80%
  criticalThreshold: 0.9, // Critical at 90%
});

// Create account and engine
const account = createAccount('user-456', 'pro', config);
const engine = createEngine(account, config);
```

## Core API

### Pre-flight Check

```typescript
// Check before executing
const result = engine.canExecute('api_calls', 100);

if (result.allowed) {
  // Safe to proceed
  if (result.reason === 'Within overage threshold') {
    // Will incur overage cost
    console.log(`Projected cost: $${result.projectedCost}`);
  }
} else {
  // Blocked
  console.log(result.reason);
  console.log(`Would exceed by: ${result.wouldExceedBy} units`);
}
```

### Debit (Post-execution)

```typescript
const result = engine.debit('api_calls', 100);

console.log(`New usage: ${result.newUsed}`);
console.log(`Quota %: ${result.quotaPercent}%`);
console.log(`Overage cost: $${result.overageCost}`);

if (result.warning) {
  // Show warning to user
  showNotification(result.warning);
}
```

### Credit (Rollback)

```typescript
// If action failed, credit back
const result = engine.credit('api_calls', 100);
console.log(`Credited: ${result.amountCredited}`);
```

### Quote (Estimate)

```typescript
// Get estimate without actually debiting
const quote = engine.quote('api_calls', 5000);

console.log(`Would exceed: ${quote.wouldExceed}`);
console.log(`Projected overage: ${quote.projectedOverage}`);
console.log(`Projected cost: $${quote.projectedCost}`);
console.log(`Allowed: ${quote.allowed}`);
```

### Batch Operations

```typescript
// Check multiple services at once
const batchCheck = engine.canExecuteBatch([
  { service: 'api_calls', amount: 100 },
  { service: 'storage_gb', amount: 0.5 },
]);

if (batchCheck.allAllowed) {
  // All operations can proceed
  engine.debitBatch([
    { service: 'api_calls', amount: 100 },
    { service: 'storage_gb', amount: 0.5 },
  ]);
}
```

## Events

Subscribe to usage events for notifications:

```typescript
// Warning at 80%
engine.on('quota_warning', (event) => {
  sendSlackNotification(`${event.service} at ${event.data?.percentUsed}%`);
});

// Critical at 90%
engine.on('quota_critical', (event) => {
  sendPagerDuty(event.message);
});

// Blocked (quota exceeded)
engine.on('quota_blocked', (event) => {
  logBlockedAction(event);
});

// Overage incurred
engine.on('overage_incurred', (event) => {
  updateBilling(event.data?.cost);
});

// Plan changed
engine.on('plan_changed', (event) => {
  sendWelcomeEmail(event.data?.newPlan);
});

// Billing cycle reset
engine.on('cycle_reset', (event) => {
  sendMonthlyReport();
});

// Subscribe to all events
engine.on('*', (event) => {
  analytics.track('luc_event', event);
});

// Unsubscribe
const unsub = engine.on('quota_warning', handler);
unsub(); // Stop listening
```

## Plan Management

```typescript
// Upgrade/downgrade plan
engine.updatePlan('enterprise');

// Reset billing cycle (e.g., monthly)
engine.resetBillingCycle();

// Get current plan info
const plan = engine.getPlan();
console.log(`Plan: ${plan.name}, Price: $${plan.monthlyPrice}/mo`);
```

## Import / Export

```typescript
import { exportToJSON, importFromJSON, summaryToCSV, accountsToCSV } from '@plugmein/luc-sdk';

// Export to JSON
const json = exportToJSON([engine.getAccount()], config);
fs.writeFileSync('backup.json', json);

// Import from JSON
const { accounts, config: importedConfig } = importFromJSON(json);

// Export summary to CSV
const csv = summaryToCSV(engine.getSummary());
fs.writeFileSync('usage-report.csv', csv);

// Export multiple accounts to CSV
const accountsCsv = accountsToCSV(accounts);
```

## Storage Adapters

### In-Memory (Default)

```typescript
import { createMemoryAdapter } from '@plugmein/luc-sdk';

const storage = createMemoryAdapter();
await storage.set(account);
const loaded = await storage.get('user-123');
```

### Browser LocalStorage

```typescript
import { createLocalStorageAdapter } from '@plugmein/luc-sdk';

const storage = createLocalStorageAdapter('myapp:luc:');
await storage.set(account);
```

### Custom Adapter (e.g., Firebase)

```typescript
import { LUCStorageAdapter, serializeAccount, deserializeAccount } from '@plugmein/luc-sdk';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

class FirestoreAdapter implements LUCStorageAdapter {
  constructor(private db: Firestore) {}

  async get(accountId: string) {
    const ref = doc(this.db, 'luc', accountId);
    const snap = await getDoc(ref);
    return snap.exists() ? deserializeAccount(snap.data()) : null;
  }

  async set(account: LUCAccountRecord) {
    const ref = doc(this.db, 'luc', account.id);
    await setDoc(ref, serializeAccount(account));
  }

  async delete(accountId: string) {
    await deleteDoc(doc(this.db, 'luc', accountId));
  }
}
```

## Usage Projections

```typescript
import { projectUsage, daysRemainingInCycle, getUsageTrend } from '@plugmein/luc-sdk';

// Days left in billing cycle
const daysLeft = daysRemainingInCycle(account);

// Project usage at end of cycle
const projection = projectUsage(account, 'api_calls');
if (projection.willExceed) {
  console.log(`Projected to exceed by ${projection.projectedOverage} units`);
}

// Get trend
const trend = getUsageTrend(account, 'api_calls');
console.log(`Usage trend: ${trend}`); // 'increasing' | 'decreasing' | 'stable'
```

## TypeScript Support

LUC is written in TypeScript and provides full type safety:

```typescript
import type {
  LUCConfig,
  LUCAccountRecord,
  LUCPlan,
  ServiceBucket,
  CanExecuteResult,
  DebitResult,
  LUCSummary,
  LUCEvent,
} from '@plugmein/luc-sdk';

// Type-safe service keys
type MyServices = 'service_a' | 'service_b';
const engine: LUCEngine<MyServices> = createEngine(account, config);

// TypeScript will catch invalid service names
engine.debit('service_c', 100); // Error: not assignable to 'service_a' | 'service_b'
```

## Hosted Version

For a fully managed experience with additional features:

**[luc.plugmein.cloud](https://luc.plugmein.cloud)**

- Web dashboard with real-time analytics
- ACHEEVY voice assistant integration
- Document import/export
- Brave Search integration (premium)
- Web scraping capabilities (premium)
- Team management
- Webhooks & integrations
- No infrastructure to manage

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md).

## Support

- **Documentation**: [docs.plugmein.cloud/luc](https://docs.plugmein.cloud/luc)
- **Issues**: [GitHub Issues](https://github.com/BoomerAng9/LUC-Locale-Universal-Calculator/issues)
- **Discord**: [PlugMeIn Community](https://discord.gg/plugmein)

---

Built with care by [PlugMeIn Cloud](https://plugmein.cloud)
