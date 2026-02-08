/**
 * n8n Client — HTTP integration with n8n workflow engine
 *
 * Tries the VPS-hosted n8n webhook first. If unavailable, falls back
 * to local in-process pipeline execution (chain-of-command.ts).
 */

import { PipelinePacket, N8nWebhookResponse } from './types';
import { executePipelineLocally } from './chain-of-command';

const N8N_BASE_URL = process.env.N8N_URL || 'http://n8n:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';
const N8N_WEBHOOK_PATH = '/webhook/pmo-intake';

export class N8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || N8N_BASE_URL;
    this.apiKey = apiKey || N8N_API_KEY;
  }

  /**
   * Execute a PMO pipeline packet via n8n webhook.
   * Falls back to local execution if n8n is unavailable.
   */
  async executePipeline(packet: PipelinePacket): Promise<N8nWebhookResponse> {
    try {
      return await this.triggerWebhook(packet);
    } catch (error: any) {
      console.warn(`[n8n] Webhook unavailable (${error.message}), falling back to local pipeline`);
      return await executePipelineLocally(packet);
    }
  }

  /**
   * Trigger the PMO intake webhook on n8n
   */
  private async triggerWebhook(packet: PipelinePacket): Promise<N8nWebhookResponse> {
    const url = `${this.baseUrl}${N8N_WEBHOOK_PATH}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'X-N8N-API-KEY': this.apiKey } : {}),
        },
        body: JSON.stringify({
          packetId: packet.packetId,
          userId: packet.userId,
          message: packet.originalMessage,
          classification: packet.classification,
          directive: packet.directive,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n returned ${response.status}: ${response.statusText}`);
      }

      return await response.json() as N8nWebhookResponse;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Check n8n health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        signal: AbortSignal.timeout(5000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List active workflows
   */
  async listWorkflows(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
        headers: {
          ...(this.apiKey ? { 'X-N8N-API-KEY': this.apiKey } : {}),
        },
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      return [];
    } catch {
      return [];
    }
  }
}

// Singleton
let client: N8nClient | null = null;

export function getN8nClient(): N8nClient {
  if (!client) {
    client = new N8nClient();
  }
  return client;
}
