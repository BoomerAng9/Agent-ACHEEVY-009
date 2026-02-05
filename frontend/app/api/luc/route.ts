/**
 * LUC API Routes
 *
 * REST endpoints for LUC Engine operations.
 * Used by both the UI calculator and Boomer_Ang orchestration.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  LUCEngine,
  createLUCAccount,
  createLUCEngine,
  serializeLUCAccount,
  deserializeLUCAccount,
  LUCServiceKey,
  LUCAccountRecord,
  SERVICE_BUCKETS,
  LUC_PLANS,
} from '@/lib/luc/luc-engine';

// ─────────────────────────────────────────────────────────────
// In-memory store (replace with Firestore in production)
// ─────────────────────────────────────────────────────────────

const accountStore = new Map<string, LUCAccountRecord>();

function getOrCreateAccount(userId: string): LUCAccountRecord {
  if (!accountStore.has(userId)) {
    accountStore.set(userId, createLUCAccount(userId, 'starter'));
  }
  return accountStore.get(userId)!;
}

function saveAccount(account: LUCAccountRecord): void {
  accountStore.set(account.userId, account);
}

// ─────────────────────────────────────────────────────────────
// GET /api/luc - Get LUC summary
// ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const account = getOrCreateAccount(userId);
    const engine = createLUCEngine(account);
    const summary = engine.getSummary();

    return NextResponse.json({
      success: true,
      summary,
      account: serializeLUCAccount(account),
    });
  } catch (error) {
    console.error('[LUC API] Error getting summary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get LUC summary' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/luc - LUC operations
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId = 'default-user', service, amount, planId } = body;

    const account = getOrCreateAccount(userId);
    const engine = createLUCEngine(account);

    switch (action) {
      // ─────────────────────────────────────────────────────
      // Quote: Estimate impact without debiting
      // ─────────────────────────────────────────────────────
      case 'quote': {
        if (!service || amount === undefined) {
          return NextResponse.json(
            { success: false, error: 'Missing service or amount' },
            { status: 400 }
          );
        }

        const quote = engine.quote(service as LUCServiceKey, amount);
        return NextResponse.json({ success: true, quote });
      }

      // ─────────────────────────────────────────────────────
      // Can Execute: Check if action is allowed
      // ─────────────────────────────────────────────────────
      case 'can-execute': {
        if (!service || amount === undefined) {
          return NextResponse.json(
            { success: false, error: 'Missing service or amount' },
            { status: 400 }
          );
        }

        const result = engine.canExecute(service as LUCServiceKey, amount);
        return NextResponse.json({ success: true, result });
      }

      // ─────────────────────────────────────────────────────
      // Debit: Record usage after successful action
      // ─────────────────────────────────────────────────────
      case 'debit': {
        if (!service || amount === undefined) {
          return NextResponse.json(
            { success: false, error: 'Missing service or amount' },
            { status: 400 }
          );
        }

        const result = engine.debit(service as LUCServiceKey, amount);
        saveAccount(engine.getAccount());

        return NextResponse.json({ success: true, result });
      }

      // ─────────────────────────────────────────────────────
      // Credit: Reverse usage (for rollbacks)
      // ─────────────────────────────────────────────────────
      case 'credit': {
        if (!service || amount === undefined) {
          return NextResponse.json(
            { success: false, error: 'Missing service or amount' },
            { status: 400 }
          );
        }

        const result = engine.credit(service as LUCServiceKey, amount);
        saveAccount(engine.getAccount());

        return NextResponse.json({ success: true, result });
      }

      // ─────────────────────────────────────────────────────
      // Update Plan
      // ─────────────────────────────────────────────────────
      case 'update-plan': {
        if (!planId) {
          return NextResponse.json(
            { success: false, error: 'Missing planId' },
            { status: 400 }
          );
        }

        engine.updatePlan(planId);
        saveAccount(engine.getAccount());

        return NextResponse.json({
          success: true,
          message: `Plan updated to ${planId}`,
          summary: engine.getSummary(),
        });
      }

      // ─────────────────────────────────────────────────────
      // Reset Billing Cycle
      // ─────────────────────────────────────────────────────
      case 'reset-cycle': {
        engine.resetBillingCycle();
        saveAccount(engine.getAccount());

        return NextResponse.json({
          success: true,
          message: 'Billing cycle reset',
          summary: engine.getSummary(),
        });
      }

      // ─────────────────────────────────────────────────────
      // Get Service Definitions
      // ─────────────────────────────────────────────────────
      case 'get-services': {
        return NextResponse.json({
          success: true,
          services: SERVICE_BUCKETS,
          plans: LUC_PLANS,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[LUC API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
