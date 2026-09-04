import type { DimensionKey } from "./dimensions";

/**
 * ILLUSTRATIVE, EXHIBITION-ONLY scoring weights (WORK-BR-9, WORK-BR-10).
 *
 * These are NOT an official ADPIC methodology. They mirror the source's example weights and are used
 * purely to demonstrate deterministic decision-support at the exhibition. They must be clearly labeled
 * as illustrative and are subject to separate validation before any official use (WORK-OQ-3 OPEN).
 */
export const WEIGHTS_LABEL =
  "Illustrative exhibition-only weights — not an official ADPIC methodology (subject to separate validation).";

/** Weight per dimension. Contribution weights raise priority; penalty weights lower it. */
export const WEIGHTS: Record<DimensionKey, number> = {
  communityNeed: 30,
  strategicAlignment: 25,
  spatialServiceGap: 25,
  accessibilityBenefit: 10,
  duplication: 5,
  infrastructureDependency: 2.5,
  deliveryComplexity: 2.5,
};

/** Deterministic Low/Medium/High thresholds on the 0–100 overall score (illustrative). */
export const THRESHOLDS = { medium: 45, high: 70 } as const;
