/**
 * Boomer_Ang Persona & Bench Level Types
 *
 * Aligned with the canonical BoomerAngDefinition from:
 *   - backend/house-of-ang/src/types.ts
 *   - infra/boomerangs/registry.json (source of truth)
 *
 * A Boomer_Ang IS a service: endpoint, capabilities, quotas, health_check.
 * Persona is ADDITIVE flavor — backstory, traits, communication style.
 * Persona ≠ authority. Bench level = authority.
 *
 * THREE bench levels only:
 *   INTERN         (0-30)   — Production muscle. Never strategy.
 *   INTERMEDIATE   (31-65)  — Skilled operator. Owns workflows, not vision.
 *   EXPERT         (66-100) — PMO-grade specialist. Owns outcomes.
 *
 * "Activity breeds Activity — shipped beats perfect."
 */

import type { PmoId, DirectorId } from './types';

// ---------------------------------------------------------------------------
// BoomerAngDefinition — mirrors backend/house-of-ang/src/types.ts
// Kept in-sync structurally. The canonical registry lives at
// infra/boomerangs/registry.json.
// ---------------------------------------------------------------------------

export interface BoomerAngDefinition {
  id: string;
  name: string;
  source_repo: string;
  description: string;
  capabilities: string[];
  required_quotas: Record<string, number>;
  endpoint: string;
  health_check: string;
  status: 'registered' | 'active' | 'degraded' | 'offline';
}

export interface BoomerAngRegistry {
  boomerangs: BoomerAngDefinition[];
  capability_index: Record<string, string[]>;
  version: string;
  last_updated: string;
}

// ---------------------------------------------------------------------------
// Bench Levels — THREE levels only, based on task complexity
//
// Authority is bench-level-bound. Persona is flavor, not power.
// ---------------------------------------------------------------------------

export type BenchLevel = 'INTERN' | 'INTERMEDIATE' | 'EXPERT';

// ---------------------------------------------------------------------------
// Acceptance Criteria & Quality Gates — per bench level
// ---------------------------------------------------------------------------

export interface QualityGate {
  metric: string;
  threshold: string;
  description: string;
}

export interface BenchAcceptanceCriteria {
  mustBeAbleTo: string[];
  mustNot: string[];
  qualityGates: QualityGate[];
}

export interface BenchConfig {
  bench: BenchLevel;
  label: string;
  complexityRange: [number, number];
  concurrency: [number, number]; // [min, max] concurrent tasks
  canMentor: boolean;
  canGuideInterns: boolean;
  canLeadSquad: boolean;
  canInterfaceAcheevy: boolean;
  description: string;
  jobScope: string;
  acceptanceCriteria: BenchAcceptanceCriteria;
}

export const BENCH_LEVELS: BenchConfig[] = [
  {
    bench: 'INTERN',
    label: 'Intern Boomer_Ang',
    complexityRange: [0, 30],
    concurrency: [1, 2],
    canMentor: false,
    canGuideInterns: false,
    canLeadSquad: false,
    canInterfaceAcheevy: false,
    description: 'Production muscle. Never strategy.',
    jobScope: 'High-volume generative and assembly work: slides, scripts, images, video gen, formatting, data cleanup.',
    acceptanceCriteria: {
      mustBeAbleTo: [
        'Produce artifacts from templates with minimal variance (decks, scripts, images, copy)',
        'Follow brand/style rules consistently (fonts, naming, tone)',
        'Generate multiple variants on request (A/B/C)',
        'Execute deterministic formatting tasks (convert, clean, structure)',
        'Ask for missing inputs via manager escalation pattern (no direct user contact)',
      ],
      mustNot: [
        'Make architectural decisions',
        'Change scope or requirements',
        'Create new standards or policies',
        'Initiate tool execution without approval path',
      ],
      qualityGates: [
        { metric: 'template_conformity', threshold: '≥ 95%', description: 'Output must match template structure' },
        { metric: 'hallucination_tolerance', threshold: 'near-zero', description: 'Must cite or mark unknown for factual claims' },
        { metric: 'revision_responsiveness', threshold: '1-2 iterations', description: 'Fixes applied within 1-2 revision cycles' },
      ],
    },
  },
  {
    bench: 'INTERMEDIATE',
    label: 'Intermediate Boomer_Ang',
    complexityRange: [31, 65],
    concurrency: [2, 4],
    canMentor: false,
    canGuideInterns: true,
    canLeadSquad: false,
    canInterfaceAcheevy: false,
    description: 'Skilled operator. Owns workflows, not vision.',
    jobScope: 'Structured execution, workflow ownership, tool chaining, coordination of Interns, non-destructive integrations.',
    acceptanceCriteria: {
      mustBeAbleTo: [
        'Convert user intent into a structured task packet (inputs/outputs/constraints)',
        'Run multi-step production flows (content → assets → packaging)',
        'Perform structured QA on Intern work (checklists, rubric scoring)',
        'Assemble low-risk integrations (webhooks, API calls, n8n wiring) without destructive actions',
        'Produce a manager-ready summary: what is done, what is blocked, what is next',
      ],
      mustNot: [
        'Redefine product architecture',
        'Approve high-risk tool actions (billing, data exfil, deployments)',
        'Override PMO standards',
      ],
      qualityGates: [
        { metric: 'task_packet_completeness', threshold: '≥ 90%', description: 'Requirements, constraints, and acceptance criteria present' },
        { metric: 'rework_rate', threshold: '≤ 20%', description: 'Rework needed on less than 20% of outputs' },
        { metric: 'output_verification', threshold: 'checklist pass', description: 'Checklist pass before escalation' },
      ],
    },
  },
  {
    bench: 'EXPERT',
    label: 'Expert Boomer_Ang',
    complexityRange: [66, 100],
    concurrency: [4, 6],
    canMentor: true,
    canGuideInterns: true,
    canLeadSquad: true,
    canInterfaceAcheevy: true,
    description: 'PMO-grade specialist. Owns outcomes.',
    jobScope: 'Architecture decisions, cost/quality arbitration, Squad leadership, mentoring, cross-PMO coordination, executive summaries.',
    acceptanceCriteria: {
      mustBeAbleTo: [
        'Define architecture-level approach and constraints (system, security, data)',
        'Perform risk classification and mitigation proposals',
        'Decide escalation thresholds and approve execution paths',
        'Mentor intermediate performance (process, quality, standards adherence)',
        'Resolve conflicts between outputs and enforce single source of truth',
        'Produce executive summaries for ACHEEVY: decision + rationale + risk + next asks',
      ],
      mustNot: [
        'Bypass governance requirements (KYB, budget constraints, audit traces)',
        'Allow unverified deliverables to pass as final',
      ],
      qualityGates: [
        { metric: 'decision_traceability', threshold: '100%', description: 'Every major decision has rationale documented' },
        { metric: 'compliance_adherence', threshold: '100%', description: 'All governance requirements met' },
        { metric: 'delivery_reliability', threshold: 'ship-ready', description: 'Consistent ship-ready artifacts' },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Persona — backstory, personality, communication style
//
// IMPORTANT: Persona = flavor, NOT authority.
// If an Expert persona is assigned at INTERN bench, the personality stays —
// the authority does not.
// ---------------------------------------------------------------------------

export type PersonalityTrait =
  | 'analytical'
  | 'creative'
  | 'disciplined'
  | 'empathetic'
  | 'relentless'
  | 'meticulous'
  | 'bold'
  | 'strategic'
  | 'resourceful'
  | 'patient'
  | 'charismatic'
  | 'stoic';

export type CommunicationStyle =
  | 'direct'
  | 'narrative'
  | 'technical'
  | 'motivational'
  | 'diplomatic'
  | 'witty';

export interface AngBackstory {
  origin: string;
  motivation: string;
  quirk: string;
  catchphrase: string;
  mentoredBy: string;
}

export interface AngPersona {
  displayName: string;
  codename: string;
  traits: PersonalityTrait[];
  communicationStyle: CommunicationStyle;
  backstory: AngBackstory;
  avatar: string;
}

// ---------------------------------------------------------------------------
// ForgedAngProfile — BoomerAngDefinition + persona + bench level (additive)
//
// This is the output of the AngForge. It wraps an existing (or newly created)
// BoomerAngDefinition with persona metadata and a complexity-derived bench level.
//
// Persona = flavor. Bench level = authority.
// ---------------------------------------------------------------------------

export interface ForgedAngProfile {
  /** The canonical service definition from the registry. */
  definition: BoomerAngDefinition;

  /** Additive persona metadata. Flavor, NOT authority. */
  persona: AngPersona;

  /** Bench level based on task complexity. THIS governs authority. */
  benchLevel: BenchLevel;
  benchConfig: BenchConfig;

  /** PMO assignment for this forge. */
  assignedPmo: PmoId;
  director: DirectorId;

  /** Forge metadata. */
  forgedAt: string;
  forgedBy: string;
  forgeReason: string;
  complexityScore: number;

  /** Whether this resolved to an existing registry entry or created a new one. */
  resolvedFromRegistry: boolean;
}

// ---------------------------------------------------------------------------
// Persona Catalog Template
// ---------------------------------------------------------------------------

export interface PersonaTemplate {
  pmoOffice: PmoId;
  personas: AngPersona[];
}

/** Maps a registry Boomer_Ang ID to its assigned persona. */
export interface RegistryPersonaBinding {
  boomerAngId: string;
  persona: AngPersona;
}

// ---------------------------------------------------------------------------
// PMO Job Mapping — per-PMO, per-bench job definitions
// ---------------------------------------------------------------------------

export interface BenchJobList {
  intern: string[];
  intermediate: string[];
  expert: string[];
}

export interface PmoJobMapping {
  pmoOffice: PmoId;
  officeName: string;
  jobs: BenchJobList;
}

// ---------------------------------------------------------------------------
// Bench-to-Work Rules (assignment guardrails)
//
// - Intern: may generate and assemble, but never decide.
// - Intermediate: may run defined workflows and QA others, but cannot
//   approve high-risk actions.
// - Expert: may decide, approve, veto, and mentor — accountable for outcomes.
// ---------------------------------------------------------------------------

export const BENCH_WORK_RULES: Record<BenchLevel, string> = {
  INTERN: 'May generate and assemble, but never decide.',
  INTERMEDIATE: 'May run defined workflows and QA others, but cannot approve high-risk actions.',
  EXPERT: 'May decide, approve, veto, and mentor — accountable for outcomes.',
};

// ---------------------------------------------------------------------------
// Forge Request / Result
// ---------------------------------------------------------------------------

export interface AngForgeRequest {
  message: string;
  pmoOffice: PmoId;
  director: DirectorId;
  complexityScore: number;
  requestedBy: string;
}

export interface AngForgeResult {
  profile: ForgedAngProfile;
  benchLabel: string;
  summary: string;
}
