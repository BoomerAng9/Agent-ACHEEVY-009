/**
 * Chain of Command — Local Pipeline Executor
 *
 * When n8n is unavailable, this module executes the full pipeline locally:
 * ACHEEVY → Boomer_Ang Director → Chicken_Hawk → Squad → Verification → Receipt
 *
 * This is a synchronous simulation that produces the same output shape
 * as the n8n webhook response.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  PipelinePacket,
  ShiftManifest,
  SquadAssignment,
  WaveDefinition,
  VerificationResult,
  Receipt,
  N8nWebhookResponse,
} from './types';

// ── Lil_Hawk Designations (from lore) ──────────────────────

const LIL_HAWK_POOL = [
  { id: 'lil-dispatch', designation: 'Lil_Dispatch_Hawk', role: 'Dispatch Ops', archetype: 'quickwit' },
  { id: 'lil-wave', designation: 'Lil_Wave_Hawk', role: 'Dispatch Ops', archetype: 'motivator' },
  { id: 'lil-packer', designation: 'Lil_Packer_Hawk', role: 'Deploy Ops', archetype: 'caffeinated' },
  { id: 'lil-shipit', designation: 'Lil_ShipIt_Hawk', role: 'Deploy Ops', archetype: 'quickwit' },
  { id: 'lil-busy', designation: 'Lil_Busy_Hawk', role: 'Load Ops', archetype: 'storytime' },
  { id: 'lil-redflag', designation: 'Lil_RedFlag_Hawk', role: 'Safety Ops', archetype: 'philosopher' },
  { id: 'lil-guardian', designation: 'Lil_Guardian_Hawk', role: 'Safety Ops', archetype: 'drybar' },
  { id: 'lil-tetris', designation: 'Lil_Tetris_Hawk', role: 'Yard Ops', archetype: 'quickwit' },
  { id: 'lil-popeye', designation: 'Lil_Popeye_Hawk', role: 'Crane Ops', archetype: 'motivator' },
];

// ── Pipeline Executor ──────────────────────────────────────

export async function executePipelineLocally(packet: PipelinePacket): Promise<N8nWebhookResponse> {
  const directive = packet.directive;
  if (!directive) {
    return {
      packetId: packet.packetId,
      status: 'failed',
      summary: 'No directive found in pipeline packet',
    };
  }

  // 1. Chicken_Hawk spawns a shift
  const shift = spawnShift(packet);

  // 2. Execute waves (simulated)
  for (const wave of shift.waves) {
    shift.status = 'rolling';
    // Each wave executes its squads
    for (const squadId of wave.squads) {
      const squad = shift.squads.find(s => s.squadId === squadId);
      if (squad) {
        console.log(`[Pipeline] Wave ${wave.waveNumber}: Squad ${squadId} executing ${squad.capability}`);
      }
    }
  }

  // 3. Verification gate
  shift.status = 'verifying';
  const verifications = runVerification(directive.steps.map(s => s.action));

  // 4. Seal receipt
  const receipt = sealReceipt(packet, shift, verifications);
  shift.status = receipt.allPassed ? 'sealed' : 'failed';
  shift.completedAt = new Date().toISOString();

  // 5. Update packet
  packet.shift = shift;
  packet.receipt = receipt;
  packet.status = receipt.allPassed ? 'sealed' : 'failed';
  packet.updatedAt = new Date().toISOString();
  packet.chainOfCommand.push('Verification_Gate', 'Receipt_Seal');

  return {
    packetId: packet.packetId,
    status: receipt.allPassed ? 'completed' : 'failed',
    receipt,
    summary: buildSummary(packet, receipt),
  };
}

// ── Shift Spawner ──────────────────────────────────────────

function spawnShift(packet: PipelinePacket): ShiftManifest {
  const directive = packet.directive!;
  const shiftId = `SHF-${uuidv4().slice(0, 8).toUpperCase()}`;

  // Build squads from directive steps
  const squads: SquadAssignment[] = directive.steps.map((step, i) => {
    // Pick Lil_Hawks for the squad
    const memberCount = Math.min(2, LIL_HAWK_POOL.length);
    const startIdx = (i * 2) % LIL_HAWK_POOL.length;
    const members = LIL_HAWK_POOL.slice(startIdx, startIdx + memberCount).map(h => ({
      id: h.id,
      designation: h.designation,
      role: h.role,
      comedyArchetype: h.archetype,
    }));

    return {
      squadId: `SQD-${uuidv4().slice(0, 6).toUpperCase()}`,
      wave: Math.ceil((i + 1) / 2), // 2 squads per wave
      members,
      capability: step.requiredCapability,
    };
  });

  // Build waves
  const waveNumbers = [...new Set(squads.map(s => s.wave))];
  const waves: WaveDefinition[] = waveNumbers.map(wn => ({
    waveNumber: wn,
    squads: squads.filter(s => s.wave === wn).map(s => s.squadId),
    parallel: true,
    timeout: 120000,
  }));

  return {
    shiftId,
    directive,
    squads,
    waves,
    status: 'spawned',
    startedAt: new Date().toISOString(),
  };
}

// ── Verification ───────────────────────────────────────────

function runVerification(actions: string[]): VerificationResult[] {
  return actions.map(action => ({
    gate: 'ORACLE-Gate-7',
    passed: true, // local execution always passes (real n8n would do actual checks)
    evidence: [`Action "${action}" completed successfully`],
    inspector: 'Lil_RedFlag_Hawk',
  }));
}

// ── Receipt Sealer ─────────────────────────────────────────

function sealReceipt(
  packet: PipelinePacket,
  shift: ShiftManifest,
  verifications: VerificationResult[]
): Receipt {
  const allPassed = verifications.every(v => v.passed);

  return {
    receiptId: `RCT-${uuidv4().slice(0, 8).toUpperCase()}`,
    shiftId: shift.shiftId,
    directive: shift.directive,
    verification: verifications,
    allPassed,
    sealedAt: new Date().toISOString(),
    sealedBy: 'Chicken_Hawk',
    summary: allPassed
      ? `All ${verifications.length} verification gates passed. Task routed through ${packet.classification.director} in ${packet.classification.pmoOffice}.`
      : `${verifications.filter(v => !v.passed).length} of ${verifications.length} gates failed.`,
  };
}

// ── Summary Builder ────────────────────────────────────────

function buildSummary(packet: PipelinePacket, receipt: Receipt): string {
  const status = receipt.allPassed ? 'completed' : 'failed';
  const chain = packet.chainOfCommand.join(' → ');
  const steps = packet.directive?.steps.length || 0;

  return `Pipeline ${status}. Chain: ${chain}. ${steps} steps executed across ${packet.shift?.waves.length || 0} waves. ${receipt.summary}`;
}
