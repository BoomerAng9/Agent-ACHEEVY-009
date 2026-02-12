/**
 * Hangar Actor Registry — Actor definitions and initial placement
 */

import type { ActorState } from './stateMachine';
import { createActorState } from './stateMachine';

export const ACTOR_TYPES = {
  ACHEEVY: 'ACHEEVY',
  BOOMER_ANG: 'BOOMER_ANG',
  CHICKEN_HAWK: 'CHICKEN_HAWK',
  LIL_HAWK: 'LIL_HAWK',
} as const;

export type ActorType = (typeof ACTOR_TYPES)[keyof typeof ACTOR_TYPES];

export interface HangarActor {
  id: string;
  type: ActorType;
  displayName: string;
  color: string;
  emissiveColor: string;
  emissiveIntensity: number;
  position: [number, number, number];
  state: ActorState;
  metadata?: Record<string, unknown>;
}

// Color tokens from the directive
export const ACTOR_COLORS: Record<ActorType, { color: string; emissive: string }> = {
  ACHEEVY: { color: '#C6A74E', emissive: '#C6A74E' },
  BOOMER_ANG: { color: '#2BD4FF', emissive: '#2BD4FF' },
  CHICKEN_HAWK: { color: '#FFC94D', emissive: '#FFC94D' },
  LIL_HAWK: { color: '#FF6A2A', emissive: '#FF6A2A' },
};

/** Creates the default actor setup for the hangar */
export function createDefaultActors(): HangarActor[] {
  return [
    // ACHEEVY — elevated command platform, center-back
    {
      id: 'acheevy-prime',
      type: 'ACHEEVY',
      displayName: 'ACHEEVY',
      color: ACTOR_COLORS.ACHEEVY.color,
      emissiveColor: ACTOR_COLORS.ACHEEVY.emissive,
      emissiveIntensity: 0.8,
      position: [0, 3, -8],
      state: createActorState(),
    },
    // Boomer_Ang pods — side alcoves
    {
      id: 'boomer-ang-alpha',
      type: 'BOOMER_ANG',
      displayName: 'Boomer_CTO',
      color: ACTOR_COLORS.BOOMER_ANG.color,
      emissiveColor: ACTOR_COLORS.BOOMER_ANG.emissive,
      emissiveIntensity: 0.5,
      position: [-4, 1.5, -2],
      state: createActorState(),
    },
    {
      id: 'boomer-ang-beta',
      type: 'BOOMER_ANG',
      displayName: 'Boomer_Ops',
      color: ACTOR_COLORS.BOOMER_ANG.color,
      emissiveColor: ACTOR_COLORS.BOOMER_ANG.emissive,
      emissiveIntensity: 0.5,
      position: [4, 1.5, -2],
      state: createActorState(),
    },
    // Chicken_Hawk — central runway
    {
      id: 'chicken-hawk-prime',
      type: 'CHICKEN_HAWK',
      displayName: 'Chicken Hawk',
      color: ACTOR_COLORS.CHICKEN_HAWK.color,
      emissiveColor: ACTOR_COLORS.CHICKEN_HAWK.emissive,
      emissiveIntensity: 0.6,
      position: [0, 0.5, 2],
      state: createActorState(),
    },
    // Lil_Hawks — start docked at build stations
    {
      id: 'lil-hawk-0',
      type: 'LIL_HAWK',
      displayName: 'Lil Hawk 1',
      color: ACTOR_COLORS.LIL_HAWK.color,
      emissiveColor: ACTOR_COLORS.LIL_HAWK.emissive,
      emissiveIntensity: 0.7,
      position: [-5, 0.2, 6],
      state: createActorState(),
    },
    {
      id: 'lil-hawk-1',
      type: 'LIL_HAWK',
      displayName: 'Lil Hawk 2',
      color: ACTOR_COLORS.LIL_HAWK.color,
      emissiveColor: ACTOR_COLORS.LIL_HAWK.emissive,
      emissiveIntensity: 0.7,
      position: [0, 0.2, 7],
      state: createActorState(),
    },
    {
      id: 'lil-hawk-2',
      type: 'LIL_HAWK',
      displayName: 'Lil Hawk 3',
      color: ACTOR_COLORS.LIL_HAWK.color,
      emissiveColor: ACTOR_COLORS.LIL_HAWK.emissive,
      emissiveIntensity: 0.7,
      position: [5, 0.2, 6],
      state: createActorState(),
    },
  ];
}
