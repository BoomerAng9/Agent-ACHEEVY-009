/**
 * n8n Pipeline Types — Chain of Command
 *
 * Full type system for the AIMS PMO routing pipeline:
 * User → ACHEEVY → Boomer_Ang Director → Chicken_Hawk → Squad → Lil_Hawks → Receipt → ACHEEVY → User
 */

import { PmoId, DirectorId } from '../pmo/types';

// ── Intent Classification ───────────────────────────────────

export type ExecutionLane = 'deploy_it' | 'guide_me';

export interface PmoClassification {
  pmoOffice: PmoId;
  director: DirectorId;
  confidence: number;          // 0-1
  keywords: string[];          // matched keywords
  executionLane: ExecutionLane;
  complexity: number;          // 0-100
}

// ── Directive (Boomer_Ang Director output) ──────────────────

export interface PmoDirective {
  directiveId: string;
  director: DirectorId;
  pmoOffice: PmoId;
  mission: string;
  steps: DirectiveStep[];
  constraints: string[];
  requiredCapabilities: string[];
  estimatedLucCost: number;
}

export interface DirectiveStep {
  order: number;
  action: string;
  assignee: string;            // Lil_Hawk designation or Boomer_Ang ID
  requiredCapability: string;
  timeout: number;             // ms
}

// ── Shift (Chicken_Hawk execution unit) ────────────────────

export interface ShiftManifest {
  shiftId: string;
  directive: PmoDirective;
  squads: SquadAssignment[];
  waves: WaveDefinition[];
  status: 'spawned' | 'rolling' | 'verifying' | 'sealed' | 'failed';
  startedAt: string;
  completedAt?: string;
}

export interface SquadAssignment {
  squadId: string;
  wave: number;
  members: SquadMember[];
  capability: string;
}

export interface SquadMember {
  id: string;
  designation: string;         // Lil_Hawk designation
  role: string;
  comedyArchetype?: string;
}

export interface WaveDefinition {
  waveNumber: number;
  squads: string[];            // squadIds
  parallel: boolean;
  timeout: number;
}

// ── Verification & Receipt ─────────────────────────────────

export interface VerificationResult {
  gate: string;
  passed: boolean;
  evidence: string[];
  inspector: string;
}

export interface Receipt {
  receiptId: string;
  shiftId: string;
  directive: PmoDirective;
  verification: VerificationResult[];
  allPassed: boolean;
  sealedAt: string;
  sealedBy: string;            // Chicken_Hawk ID
  summary: string;
}

// ── Pipeline Packet (full journey) ─────────────────────────

export interface PipelinePacket {
  packetId: string;
  userId: string;
  originalMessage: string;
  classification: PmoClassification;
  directive?: PmoDirective;
  shift?: ShiftManifest;
  receipt?: Receipt;
  status: 'classified' | 'directed' | 'dispatched' | 'executing' | 'verifying' | 'sealed' | 'delivered' | 'failed';
  createdAt: string;
  updatedAt: string;
  chainOfCommand: string[];   // ordered list of who touched it
}

// ── n8n Webhook Payloads ───────────────────────────────────

export interface N8nWebhookPayload {
  packetId: string;
  userId: string;
  message: string;
  classification: PmoClassification;
}

export interface N8nWebhookResponse {
  packetId: string;
  status: string;
  receipt?: Receipt;
  summary: string;
}
