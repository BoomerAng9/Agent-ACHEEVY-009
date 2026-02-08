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
