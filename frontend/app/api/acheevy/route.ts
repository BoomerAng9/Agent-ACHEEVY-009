import { NextResponse } from 'next/server';

interface AcheevyRequest {
  userId: string;
  message: string;
  quickIntent?: string;
}

interface AcheevyResponse {
  reply: string;
  routedTo: string;
  taskId?: string;
  status: 'ok' | 'queued' | 'error';
}

// Simple keyword-based intent classification stub.
// Replace with real NLP routing when the UEF Gateway is wired up.
function classifyIntent(message: string): { routedTo: string; reply: string; status: 'ok' | 'queued' } {
  const lower = message.toLowerCase();

  if (lower.includes('bot') || lower.includes('automation') || lower.includes('workflow')) {
    return {
      routedTo: 'agent-zero',
      reply: 'I will route this to Agent Zero to build your automation. Describe the workflow steps you need, and I will coordinate the agents.',
      status: 'ok',
    };
  }

  if (lower.includes('research') || lower.includes('search') || lower.includes('find')) {
    return {
      routedTo: 'internal-llm',
      reply: 'Starting deep research on your query. I will compile findings from multiple sources and present a structured report.',
      status: 'ok',
    };
  }

  if (lower.includes('image') || lower.includes('video') || lower.includes('visual')) {
    return {
      routedTo: 'image-pipeline',
      reply: 'Routing to the media generation pipeline. Describe what you want to create and I will handle the rest.',
      status: 'ok',
    };
  }

  if (lower.includes('document') || lower.includes('office') || lower.includes('email') || lower.includes('write')) {
    return {
      routedTo: 'internal-llm',
      reply: 'I can help with that. Let me know the specifics — document type, tone, audience — and I will draft it for you.',
      status: 'ok',
    };
  }

  if (lower.includes('vertical') || lower.includes('stories') || lower.includes('analytics')) {
    return {
      routedTo: 'perform-stack',
      reply: 'Routing to the analytics pipeline. I will pull the relevant data sources and prepare your vertical story.',
      status: 'ok',
    };
  }

  if (lower.includes('clone') || lower.includes('make it mine') || lower.includes('replicate')) {
    return {
      routedTo: 'openclaw',
      reply: 'I will use OpenClaw to scaffold a clone of the target platform. Provide the URL or name of the platform you want to replicate.',
      status: 'ok',
    };
  }

  if (lower.includes('deploy') || lower.includes('docker') || lower.includes('container') || lower.includes('tool')) {
    return {
      routedTo: 'pending-deploy',
      reply: 'I have queued a deployment request. You will receive an email when the containerized tool is provisioned and ready to use.',
      status: 'queued',
    };
  }

  // Default: general conversation handled by internal LLM
  return {
    routedTo: 'internal-llm',
    reply: `Understood. I am analyzing your request: "${message}". Let me determine the best tools and approach for this task.`,
    status: 'ok',
  };
}

export async function POST(request: Request) {
  try {
    const body: AcheevyRequest = await request.json();
    const { message, quickIntent } = body;

    if (!message) {
      return NextResponse.json(
        { reply: 'Please provide a message.', routedTo: 'error', status: 'error' },
        { status: 400 }
      );
    }

    const result = classifyIntent(quickIntent || message);

    const response: AcheevyResponse = {
      reply: result.reply,
      routedTo: result.routedTo,
      taskId: result.status === 'queued' ? `task_${Date.now()}` : undefined,
      status: result.status,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { reply: 'An internal error occurred. Please try again.', routedTo: 'error', status: 'error' },
      { status: 500 }
    );
  }
}
