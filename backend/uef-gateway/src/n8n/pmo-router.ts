/**
 * PMO Router — ACHEEVY Intent Classifier + Boomer_Ang Directive Builder
 *
 * Classifies user messages into PMO offices and builds directives
 * for Chicken_Hawk execution.
 *
 * Flow: User message → classify() → buildDirective() → PipelinePacket
 */

import { v4 as uuidv4 } from 'uuid';
import { PmoId, DirectorId } from '../pmo/types';
import {
  PmoClassification,
  PmoDirective,
  DirectiveStep,
  PipelinePacket,
  ExecutionLane,
} from './types';

// ── Keyword → PMO Office mapping ───────────────────────────

const PMO_KEYWORDS: Record<PmoId, string[]> = {
  'tech-office': [
    'deploy', 'build', 'code', 'api', 'docker', 'infrastructure', 'server',
    'database', 'backend', 'frontend', 'pipeline', 'ci/cd', 'devops',
    'debug', 'fix', 'test', 'refactor', 'architecture', 'vps', 'nginx',
    'kubernetes', 'container', 'microservice', 'git', 'webhook',
  ],
  'finance-office': [
    'budget', 'cost', 'price', 'billing', 'invoice', 'payment', 'stripe',
    'subscription', 'luc', 'quota', 'revenue', 'roi', 'profit', 'expense',
    'forecast', 'financial', 'accounting',
  ],
  'ops-office': [
    'monitor', 'health', 'uptime', 'performance', 'sla', 'incident',
    'alert', 'log', 'metric', 'scale', 'load', 'throughput', 'latency',
    'backup', 'restore', 'maintenance', 'optimize',
  ],
  'marketing-office': [
    'campaign', 'seo', 'content', 'social', 'brand', 'growth', 'user',
    'acquisition', 'funnel', 'conversion', 'engagement', 'audience',
    'analytics', 'advertising', 'promote', 'outreach',
  ],
  'design-office': [
    'design', 'ui', 'ux', 'visual', 'video', 'image', 'animation',
    'logo', 'brand', 'color', 'layout', 'wireframe', 'prototype',
    'figma', 'mockup', 'illustration', 'thumbnail',
  ],
  'publishing-office': [
    'publish', 'blog', 'article', 'documentation', 'readme', 'docs',
    'newsletter', 'release', 'changelog', 'announcement', 'editorial',
    'copywriting', 'post', 'distribution',
  ],
};

const DIRECTOR_MAP: Record<PmoId, DirectorId> = {
  'tech-office': 'Boomer_CTO',
  'finance-office': 'Boomer_CFO',
  'ops-office': 'Boomer_COO',
  'marketing-office': 'Boomer_CMO',
  'design-office': 'Boomer_CDO',
  'publishing-office': 'Boomer_CPO',
};

// ── Classifier ─────────────────────────────────────────────

export function classifyIntent(message: string): PmoClassification {
  const lower = message.toLowerCase();
  const words = lower.split(/\s+/);

  const scores: Record<PmoId, { score: number; keywords: string[] }> = {
    'tech-office': { score: 0, keywords: [] },
    'finance-office': { score: 0, keywords: [] },
    'ops-office': { score: 0, keywords: [] },
    'marketing-office': { score: 0, keywords: [] },
    'design-office': { score: 0, keywords: [] },
    'publishing-office': { score: 0, keywords: [] },
  };

  for (const [office, keywords] of Object.entries(PMO_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[office as PmoId].score += 1;
        scores[office as PmoId].keywords.push(kw);
      }
    }
  }

  // Find the highest-scoring office
  let bestOffice: PmoId = 'tech-office'; // default
  let bestScore = 0;
  for (const [office, data] of Object.entries(scores)) {
    if (data.score > bestScore) {
      bestScore = data.score;
      bestOffice = office as PmoId;
    }
  }

  // Confidence = matched keywords / total words (capped at 1)
  const confidence = Math.min(bestScore / Math.max(words.length, 1), 1);

  // Complexity scoring
  const complexity = scoreComplexity(message);

  // Execution lane
  const executionLane: ExecutionLane = containsActionVerbs(lower) ? 'deploy_it' : 'guide_me';

  return {
    pmoOffice: bestOffice,
    director: DIRECTOR_MAP[bestOffice],
    confidence,
    keywords: scores[bestOffice].keywords,
    executionLane,
    complexity,
  };
}

function scoreComplexity(message: string): number {
  let score = 0;
  const lower = message.toLowerCase();

  // Word count adds base complexity
  const wordCount = message.split(/\s+/).length;
  score += Math.min(wordCount * 1.5, 30);

  // Technical depth signals
  const techSignals = ['api', 'docker', 'database', 'deploy', 'architecture', 'pipeline', 'webhook', 'oauth', 'ssl', 'kubernetes'];
  for (const sig of techSignals) {
    if (lower.includes(sig)) score += 5;
  }

  // Multi-step signals
  const multiStep = ['and then', 'after that', 'next', 'first', 'second', 'finally', 'step'];
  for (const sig of multiStep) {
    if (lower.includes(sig)) score += 8;
  }

  // Integration signals (multiple systems)
  const integrations = ['n8n', 'stripe', 'github', 'vercel', 'gcp', 'aws', 'firebase', 'postgres', 'redis'];
  let integrationCount = 0;
  for (const sig of integrations) {
    if (lower.includes(sig)) integrationCount++;
  }
  score += integrationCount * 7;

  // Risk signals
  const riskSignals = ['production', 'deploy', 'migration', 'delete', 'security', 'credentials'];
  for (const sig of riskSignals) {
    if (lower.includes(sig)) score += 6;
  }

  return Math.min(Math.round(score), 100);
}

function containsActionVerbs(text: string): boolean {
  const actionVerbs = ['deploy', 'build', 'create', 'implement', 'fix', 'update', 'run', 'execute', 'start', 'launch', 'install', 'configure', 'setup', 'migrate'];
  return actionVerbs.some(v => text.includes(v));
}

// ── Directive Builder ──────────────────────────────────────

export function buildDirective(classification: PmoClassification, message: string): PmoDirective {
  const directiveId = `DIR-${uuidv4().slice(0, 8).toUpperCase()}`;

  // Build steps based on the PMO office
  const steps = buildSteps(classification, message);

  // Extract capabilities needed
  const requiredCapabilities = extractCapabilities(classification);

  return {
    directiveId,
    director: classification.director,
    pmoOffice: classification.pmoOffice,
    mission: message,
    steps,
    constraints: getConstraints(classification),
    requiredCapabilities,
    estimatedLucCost: estimateLucCost(steps),
  };
}

function buildSteps(classification: PmoClassification, message: string): DirectiveStep[] {
  const stepTemplates: Record<PmoId, DirectiveStep[]> = {
    'tech-office': [
      { order: 1, action: 'Analyze requirements and check feasibility', assignee: 'Lil_Dispatch_Hawk', requiredCapability: 'task_decomposition', timeout: 30000 },
      { order: 2, action: 'Execute implementation', assignee: 'coder_ang', requiredCapability: 'code_generation', timeout: 120000 },
      { order: 3, action: 'Run verification and tests', assignee: 'quality_ang', requiredCapability: 'verification', timeout: 60000 },
    ],
    'finance-office': [
      { order: 1, action: 'Calculate cost estimates', assignee: 'data_ang', requiredCapability: 'data_processing', timeout: 30000 },
      { order: 2, action: 'Generate financial report', assignee: 'Lil_Dispatch_Hawk', requiredCapability: 'reporting', timeout: 60000 },
    ],
    'ops-office': [
      { order: 1, action: 'Check system health and metrics', assignee: 'orchestrator_ang', requiredCapability: 'monitoring', timeout: 30000 },
      { order: 2, action: 'Execute operational action', assignee: 'automation_ang', requiredCapability: 'workflow_creation', timeout: 60000 },
      { order: 3, action: 'Verify and seal results', assignee: 'quality_ang', requiredCapability: 'verification', timeout: 30000 },
    ],
    'marketing-office': [
      { order: 1, action: 'Research and analyze target audience', assignee: 'researcher_ang', requiredCapability: 'web_search', timeout: 60000 },
      { order: 2, action: 'Generate campaign content', assignee: 'marketer_ang', requiredCapability: 'content_generation', timeout: 60000 },
    ],
    'design-office': [
      { order: 1, action: 'Analyze design requirements', assignee: 'vision_ang', requiredCapability: 'image_analysis', timeout: 30000 },
      { order: 2, action: 'Create visual assets', assignee: 'vision_ang', requiredCapability: 'video_transcoding', timeout: 120000 },
    ],
    'publishing-office': [
      { order: 1, action: 'Draft content', assignee: 'marketer_ang', requiredCapability: 'content_generation', timeout: 60000 },
      { order: 2, action: 'Review and format for publication', assignee: 'quality_ang', requiredCapability: 'verification', timeout: 30000 },
    ],
  };

  return stepTemplates[classification.pmoOffice] || stepTemplates['tech-office'];
}

function extractCapabilities(classification: PmoClassification): string[] {
  const capMap: Record<PmoId, string[]> = {
    'tech-office': ['code_generation', 'code_execution', 'debugging', 'api_integration'],
    'finance-office': ['data_processing', 'reporting', 'cost_estimation'],
    'ops-office': ['monitoring', 'workflow_creation', 'scheduled_tasks'],
    'marketing-office': ['web_search', 'content_generation', 'seo_analysis'],
    'design-office': ['image_analysis', 'video_transcoding', 'ui_generation'],
    'publishing-office': ['content_generation', 'editorial', 'distribution'],
  };
  return capMap[classification.pmoOffice] || [];
}

function getConstraints(classification: PmoClassification): string[] {
  const base = ['Must pass ORACLE verification gate', 'LUC quota must be available'];
  if (classification.executionLane === 'deploy_it') {
    base.push('Requires human approval for production changes');
  }
  return base;
}

function estimateLucCost(steps: DirectiveStep[]): number {
  return steps.reduce((sum, step) => sum + (step.timeout > 60000 ? 3 : 1), 0);
}

// ── Pipeline Packet Factory ────────────────────────────────

export function createPipelinePacket(
  userId: string,
  message: string,
): PipelinePacket {
  const packetId = `PKT-${uuidv4().slice(0, 8).toUpperCase()}`;
  const classification = classifyIntent(message);
  const directive = buildDirective(classification, message);
  const now = new Date().toISOString();

  return {
    packetId,
    userId,
    originalMessage: message,
    classification,
    directive,
    status: 'directed',
    createdAt: now,
    updatedAt: now,
    chainOfCommand: ['ACHEEVY', classification.director, 'Chicken_Hawk'],
  };
}
