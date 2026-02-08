/**
 * n8n Module — Barrel Export
 *
 * PMO routing pipeline with n8n workflow integration.
 */

export { classifyIntent, buildDirective, createPipelinePacket } from './pmo-router';
export { getN8nClient, N8nClient } from './client';
export { executePipelineLocally } from './chain-of-command';
export type {
  PmoClassification,
  PmoDirective,
  DirectiveStep,
  ShiftManifest,
  SquadAssignment,
  WaveDefinition,
  VerificationResult,
  Receipt,
  PipelinePacket,
  ExecutionLane,
  N8nWebhookPayload,
  N8nWebhookResponse,
} from './types';
