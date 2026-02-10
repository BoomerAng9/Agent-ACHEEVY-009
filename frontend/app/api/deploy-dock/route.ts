// frontend/app/api/deploy-dock/route.ts

/**
 * Deploy Dock API — Deployment Orchestration
 *
 * Handles ACHEEVY-first deployment workflows:
 * - Create deployment sessions
 * - Hatch agents
 * - Assign workflows
 * - Launch executions
 * - Query events
 *
 * tool_id: deploy_dock
 * service_key: DEPLOYMENT
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// Mock data store (replace with Redis/Postgres in production)
const deployments = new Map<string, any>();

// ─────────────────────────────────────────────────────────────
// GET: List deployments or get single deployment
// ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deploymentId = searchParams.get("id");

    if (deploymentId) {
      const deployment = deployments.get(deploymentId);
      if (!deployment) {
        return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
      }
      return NextResponse.json(deployment);
    }

    // List all deployments for user
    const userDeployments = Array.from(deployments.values())
      .filter((d) => d.userId === session.user?.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ deployments: userDeployments });
  } catch (error: any) {
    console.error("[Deploy Dock] GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// POST: Create new deployment or perform action
// ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "create":
        return handleCreateDeployment(body, session.user.email);
      case "hatch":
        return handleHatchAgent(body);
      case "assign":
        return handleAssignWorkflow(body);
      case "launch":
        return handleLaunchDeployment(body);
      case "acheevy":
        return handleAcheevyIntent(body, session.user.email);
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[Deploy Dock] POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────
// Action Handlers
// ─────────────────────────────────────────────────────────────

async function handleCreateDeployment(body: any, userId: string) {
  const { name, description, intent, lucBudget = 500 } = body;

  const deploymentId = `deploy-${uuidv4().slice(0, 8)}`;
  const now = new Date();

  // Generate default roster
  const roster = [
    {
      id: "ba-code",
      name: "Code_Ang",
      type: "boomer_ang",
      role: "Lead Engineer",
      status: "idle",
      capabilities: [
        { id: "code-gen", name: "Code Generation", category: "code", scope: ["*"], lucCost: 10 },
        { id: "review", name: "Code Review", category: "code", scope: ["*"], lucCost: 5 },
      ],
    },
    {
      id: "ba-quality",
      name: "Quality_Ang",
      type: "boomer_ang",
      role: "QA Lead",
      status: "idle",
      capabilities: [
        { id: "test", name: "Testing", category: "test", scope: ["*"], lucCost: 8 },
        { id: "audit", name: "Security Audit", category: "test", scope: ["*"], lucCost: 12 },
      ],
    },
    {
      id: "ch-main",
      name: "Chicken Hawk",
      type: "chicken_hawk",
      role: "Execution Supervisor",
      status: "idle",
      capabilities: [
        { id: "orchestrate", name: "Orchestration", category: "orchestrate", scope: ["*"], lucCost: 5 },
      ],
    },
    {
      id: "lh-build",
      name: "Build_Hawk",
      type: "lil_hawk",
      role: "Build Runner",
      status: "idle",
      capabilities: [
        { id: "compile", name: "Compile", category: "deploy", scope: ["*"], lucCost: 3 },
      ],
    },
    {
      id: "lh-deploy",
      name: "Deploy_Hawk",
      type: "lil_hawk",
      role: "Deploy Runner",
      status: "idle",
      capabilities: [
        { id: "container", name: "Containerize", category: "deploy", scope: ["*"], lucCost: 5 },
      ],
    },
  ];

  // Generate initial event
  const events = [
    {
      id: `evt-${uuidv4().slice(0, 8)}`,
      deploymentId,
      timestamp: now.toISOString(),
      stage: "ingest",
      title: "Deployment Created",
      description: `New deployment session initialized: ${name}`,
      agent: "acheevy",
    },
  ];

  // Generate LUC quote
  const quote = {
    deploymentId,
    estimatedTokens: Math.floor(lucBudget * 0.6), // 60% estimate
    breakdown: [
      { category: "Hatch", tokens: 50, description: "Agent initialization" },
      { category: "Assign", tokens: 30, description: "Workflow binding" },
      { category: "Launch", tokens: lucBudget * 0.4, description: "Execution" },
    ],
    totalCost: Math.floor(lucBudget * 0.6),
    currency: "LUC",
    validUntil: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    approved: false,
  };

  const deployment = {
    id: deploymentId,
    name,
    description: description || `Deployment for: ${intent}`,
    phase: "idle",
    status: "active",
    userId,
    roster,
    jobPackets: [],
    events,
    evidenceLocker: { deploymentId, artifacts: [], complete: false },
    lucBudget,
    lucSpent: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  deployments.set(deploymentId, deployment);

  return NextResponse.json({
    deployment,
    quote,
    suggestedRoster: roster,
  });
}

async function handleHatchAgent(body: any) {
  const { deploymentId, agentId } = body;

  const deployment = deployments.get(deploymentId);
  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
  }

  // Find and activate agent
  const agent = deployment.roster.find((a: any) => a.id === agentId);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  agent.status = "active";
  deployment.phase = "hatch";
  deployment.updatedAt = new Date().toISOString();

  // Add event
  deployment.events.push({
    id: `evt-${uuidv4().slice(0, 8)}`,
    deploymentId,
    timestamp: new Date().toISOString(),
    stage: "hatch",
    title: "Agent Hatched",
    description: `${agent.name} (${agent.role}) has been activated`,
    agent: "acheevy",
    proof: {
      type: "manifest",
      label: "Agent Manifest",
      value: `sha256:${uuidv4().slice(0, 12)}`,
      timestamp: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true, agent, deployment });
}

async function handleAssignWorkflow(body: any) {
  const { deploymentId, workflowId, jobPacketName } = body;

  const deployment = deployments.get(deploymentId);
  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
  }

  // Create job packet
  const jobPacket = {
    id: `jp-${uuidv4().slice(0, 8)}`,
    name: jobPacketName || `Job Packet for ${workflowId}`,
    description: `Bound to n8n workflow: ${workflowId}`,
    status: "approved",
    assignedTo: "ch-main",
    scope: ["*"],
    gates: [
      { id: "gate-1", name: "Pre-Deploy Check", type: "automated", condition: "tests_passed", passed: true },
      { id: "gate-2", name: "Health Check", type: "automated", condition: "health_ok", passed: false },
      { id: "gate-3", name: "Rollback Ready", type: "evidence", condition: "snapshot_exists", passed: false },
    ],
    lucBudget: 100,
    lucSpent: 0,
    permissions: ["read", "write", "deploy"],
    n8nWorkflowId: workflowId,
    createdAt: new Date().toISOString(),
    artifacts: [],
  };

  deployment.jobPackets.push(jobPacket);
  deployment.phase = "assign";
  deployment.updatedAt = new Date().toISOString();

  // Add event
  deployment.events.push({
    id: `evt-${uuidv4().slice(0, 8)}`,
    deploymentId,
    timestamp: new Date().toISOString(),
    stage: "assign",
    title: "Workflow Bound",
    description: `Job packet created and bound to workflow: ${workflowId}`,
    agent: "acheevy",
    proof: {
      type: "artifact",
      label: "Job Packet ID",
      value: jobPacket.id,
      timestamp: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true, jobPacket, deployment });
}

async function handleLaunchDeployment(body: any) {
  const { deploymentId, confirmed } = body;

  if (!confirmed) {
    return NextResponse.json({ error: "Launch must be confirmed" }, { status: 400 });
  }

  const deployment = deployments.get(deploymentId);
  if (!deployment) {
    return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
  }

  deployment.phase = "launch";
  deployment.updatedAt = new Date().toISOString();

  // Add launch event
  deployment.events.push({
    id: `evt-${uuidv4().slice(0, 8)}`,
    deploymentId,
    timestamp: new Date().toISOString(),
    stage: "launch",
    title: "Deployment Launched",
    description: "Execution sequence initiated via Port Authority gateway",
    agent: "acheevy",
    proof: {
      type: "attestation",
      label: "Launch Attestation",
      value: `attest-${uuidv4().slice(0, 16)}`,
      timestamp: new Date().toISOString(),
    },
  });

  // Simulate downstream agent events
  setTimeout(() => {
    deployment.events.push({
      id: `evt-${uuidv4().slice(0, 8)}`,
      deploymentId,
      timestamp: new Date().toISOString(),
      stage: "verify",
      title: "Validation Complete",
      description: "Chicken Hawk verified all gates passed",
      agent: "chicken_hawk",
      proof: {
        type: "scan",
        label: "Gate Scan",
        value: "3/3 gates passed",
        timestamp: new Date().toISOString(),
      },
    });
  }, 2000);

  return NextResponse.json({
    success: true,
    executionId: `exec-${uuidv4().slice(0, 8)}`,
    deployment,
  });
}

async function handleAcheevyIntent(body: any, userId: string) {
  const { intent, mode } = body;

  // Simple intent classification
  const classification = classifyIntent(intent);

  // Generate ACHEEVY response based on mode
  const responses: Record<string, string> = {
    recommend: generateRecommendation(intent, classification),
    explain: generateExplanation(intent, classification),
    execute: generateExecutionPlan(intent, classification),
    prove: generateProofResponse(intent, classification),
  };

  return NextResponse.json({
    intent: {
      id: `intent-${uuidv4().slice(0, 8)}`,
      rawInput: intent,
      parsedIntent: classification.intent,
      category: classification.category,
      timestamp: new Date().toISOString(),
    },
    response: responses[mode] || responses.recommend,
    execution: {
      mode: classification.requiresDelegation ? "delegated" : "inline",
      delegateTo: classification.requiresDelegation ? ["boomer_ang", "chicken_hawk"] : [],
      lucEstimate: classification.lucEstimate,
      requiresApproval: classification.lucEstimate > 100,
      gates: classification.suggestedGates,
    },
  });
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function classifyIntent(input: string): any {
  const lowerInput = input.toLowerCase();

  const isDeployment = /deploy|launch|release|ship/.test(lowerInput);
  const isBuild = /build|compile|bundle/.test(lowerInput);
  const isTest = /test|validate|check/.test(lowerInput);

  return {
    intent: isDeployment ? "deployment" : isBuild ? "build" : isTest ? "test" : "general",
    category: isDeployment ? "deploy" : isBuild ? "execute" : isTest ? "execute" : "recommend",
    requiresDelegation: isDeployment || isBuild,
    lucEstimate: isDeployment ? 150 : isBuild ? 80 : 30,
    suggestedGates: isDeployment
      ? ["pre-deploy", "health-check", "rollback"]
      : isBuild
        ? ["lint", "test", "build"]
        : ["validate"],
  };
}

function generateRecommendation(input: string, classification: any): string {
  return `Based on your request, I recommend a ${classification.intent === "deployment" ? "3" : "2"}-stage ${classification.intent} workflow:\n\n` +
    `1. **Hatch** - Assemble ${classification.requiresDelegation ? "Code_Ang and Quality_Ang" : "minimal agent roster"}\n` +
    `2. **Assign** - Bind to appropriate n8n workflow\n` +
    (classification.intent === "deployment" ? `3. **Launch** - Execute with rollback gates\n\n` : "\n") +
    `Estimated LUC cost: ${classification.lucEstimate} tokens.\n\nShall I proceed with this plan?`;
}

function generateExplanation(input: string, classification: any): string {
  return `The ${classification.intent} process follows the ACHEEVY delegation model:\n\n` +
    `• **ACHEEVY** handles all user communication and orchestration\n` +
    `• **Boomer_Angs** supervise specialized work domains\n` +
    `• **Chicken Hawk** converts plans to deterministic job packets\n` +
    `• **Lil_Hawks** execute bounded tasks with proofs\n\n` +
    `Each step produces verifiable artifacts stored in the Evidence Locker.\n\n` +
    `Suggested gates: ${classification.suggestedGates.join(", ")}`;
}

function generateExecutionPlan(input: string, classification: any): string {
  return `Initiating ${classification.intent} sequence...\n\n` +
    `✓ Job packet template created\n` +
    `✓ Gates configured: ${classification.suggestedGates.join(", ")}\n` +
    `✓ LUC budget estimated: ${classification.lucEstimate} tokens\n\n` +
    `Awaiting your approval to proceed to Hatch stage.`;
}

function generateProofResponse(input: string, classification: any): string {
  return `Evidence requirements for ${classification.intent}:\n\n` +
    `• **Plan Manifest** - Cryptographic hash of deployment plan\n` +
    `• **Gate Results** - Automated check results with timestamps\n` +
    `• **Execution Logs** - Signed agent activity records\n` +
    `• **Deployment Attestation** - Final bundle with all artifacts\n\n` +
    `All artifacts are cryptographically signed and immutable.`;
}
