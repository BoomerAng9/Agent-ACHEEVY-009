/**
 * Model Context Protocol (MCP) Tool Definitions
 * These definitions describe the interfaces for internal tools exposed to Agents.
 */

export const mcpTools = [
  // ----------------------------------------------------------------------
  // ByteRover (Memory / Context)
  // ----------------------------------------------------------------------
  {
    name: 'byterover.retrieve_context',
    description: 'Retrieve project context and patterns based on a semantic query.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Semantic search query' },
        tags: { type: 'array', items: { type: 'string' } }
      },
      required: ['query']
    }
  },
  {
    name: 'byterover.store_context',
    description: 'Persist new patterns or project knowledge.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        metadata: { type: 'object' }
      },
      required: ['content']
    }
  },
  
  // ----------------------------------------------------------------------
  // VL-JEPA (Vision & Hallucination Check)
  // ----------------------------------------------------------------------
  {
    name: 'vljepa.embed',
    description: 'Generate semantic embedding for text or image.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        imageUrl: { type: 'string' }
      }
    }
  },
  {
    name: 'vljepa.verify_semantic_consistency',
    description: 'Compare intent against output to detect hallucinations.',
    inputSchema: {
      type: 'object',
      properties: {
        originalIntentEmbedding: { type: 'array', items: { type: 'number' } },
        outputContent: { type: 'string' }
      },
      required: ['originalIntentEmbedding', 'outputContent']
    }
  },

  // ----------------------------------------------------------------------
  // Execution Tools
  // ----------------------------------------------------------------------
  {
    name: 'python.run',
    description: 'Execute isolated Python script (constrained env).',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string' }
      },
      required: ['code']
    }
  },
  {
    name: 'n8n.trigger_workflow',
    description: 'Trigger an automation workflow in n8n.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        payload: { type: 'object' }
      },
      required: ['workflowId']
    }
  }
];
