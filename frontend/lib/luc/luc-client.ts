// frontend/lib/luc/luc-client.ts
import { LucEstimate } from "./luc.stub";

export interface ACPResponse {
  reqId: string;
  status: string;
  message: string;
  quote: {
    quoteId: string;
    variants: {
      name: string;
      estimate: {
        totalUsd: number;
        totalTokens: number;
        breakdown: {
          componentName: string;
          usd: number;
          tokens: number;
        }[];
      };
    }[];
  };
}

export async function fetchRealLucQuote(message: string): Promise<LucEstimate> {
  try {
    const res = await fetch("/api/acp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, intent: "ESTIMATE_ONLY" }),
    });

    if (!res.ok) throw new Error("Gateway unreachable");

    const data: ACPResponse = await res.json();
    
    // Transform UEF format to Frontend format for now to minimize component changes
    const bestVariant = data.quote.variants[0];
    
    return {
      totalUsd: bestVariant.estimate.totalUsd,
      totalTokens: bestVariant.estimate.totalTokens,
      breakdown: bestVariant.estimate.breakdown.map(b => ({
        label: b.componentName,
        usd: b.usd,
        tokens: b.tokens
      })),
      modelOptions: data.quote.variants.map(v => ({
        name: v.name,
        description: "Estimated via UEF Gateway",
        costMultiplier: 1 // Backend calculation already includes multiplier
      }))
    };
  } catch (error) {
    console.error("LUC Fetch Error:", error);
    throw error;
  }
}
