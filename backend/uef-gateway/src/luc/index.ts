/**
 * Locale Usage Calculator (LUC) Engine
 * Calculates costs for ACP requests.
 * Integrates with 3-6-9 billing task multipliers.
 */

import { LUCCostEstimate, LUCComponentEstimate, UCPQuote } from '../ucp';
import { type TaskType, TASK_MULTIPLIERS, meterTokens } from '../billing';

export class LUCEngine {

  static estimate(
    featureSpec: string,
    models: string[] = ['claude-sonnet-4.5', 'claude-opus-4.6'],
    taskType?: TaskType,
  ): UCPQuote {
    // Heuristic token estimate based on input complexity
    const complexityBase = Math.min(featureSpec.length * 0.5, 5000);

    // Apply task-type multiplier if provided
    const taskMult = taskType ? (TASK_MULTIPLIERS[taskType]?.multiplier ?? 1.0) : 1.0;

    const variants = models.map(model => {
      const isFast = model.includes('sonnet');
      const costPer1k = isFast ? 0.003 : 0.015;

      const componentEstimates: LUCComponentEstimate[] = [
        {
          componentName: 'Planning (AVVA NOON)',
          tokens: complexityBase * 0.2 * taskMult,
          usd: (complexityBase * 0.2 * taskMult / 1000) * costPer1k,
          model: model
        },
        {
          componentName: 'Execution (Chicken Hawk)',
          tokens: complexityBase * 2.0 * taskMult,
          usd: (complexityBase * 2.0 * taskMult / 1000) * costPer1k,
          model: model
        },
        {
          componentName: 'Verification (ORACLE)',
          tokens: complexityBase * 0.5 * taskMult,
          usd: (complexityBase * 0.5 * taskMult / 1000) * costPer1k,
          model: model
        }
      ];

      const totalTokens = componentEstimates.reduce((sum, c) => sum + c.tokens, 0);
      const totalUsd = componentEstimates.reduce((sum, c) => sum + c.usd, 0);

      const estimate: LUCCostEstimate = {
        totalTokens,
        totalUsd,
        breakdown: componentEstimates,
        byteRoverDiscountApplied: true,
        byteRoverSavingsUsd: totalUsd * 0.15
      };

      return {
        name: isFast ? 'Fast (Sonnet 4.5)' : 'Premium (Opus 4.6)',
        estimate
      };
    });

    return {
      quoteId: `qt-${Date.now()}`,
      validForSeconds: 3600,
      variants,
      ...(taskType ? { taskType, taskMultiplier: taskMult } : {}),
    };
  }

  /**
   * Meter actual token usage for billing — delegates to billing engine.
   */
  static meter(rawTokens: number, taskType: TaskType, tierId: string) {
    return meterTokens(rawTokens, taskType, tierId);
  }
}
