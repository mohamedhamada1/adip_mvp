import type { ProjectRecord, AoiId } from "../data/types";
import type { AssessmentResult } from "../assessment/scoringEngine";

/**
 * The structured explanation context the APP assembles (WORK-REQ-17) — from the selected project, current
 * AOI/map context, approved attributes, calculated GIS indicators (the assessment result), and configured
 * strategy. This is the ONLY information an answer (template or, later, a gated LLM) may use.
 */
export interface AiContext {
  aoi: AoiId;
  projectId?: string;
  projectName?: string;
  approvedAttributes: Record<string, string | number>;
  indicators?: { dimension: string; score: number | null; band: string }[];
  overallPriority?: string;
  strategy?: string;
}

/**
 * The approved public attribute allowlist for exhibition display / AI context. NOTE: the authoritative
 * allowlist is WORK-OQ-1 (OPEN) — this is the sanitized demo set. `sanitizeContext` enforces it so no
 * non-approved field can reach the LLM boundary (WORK-SEC-2/4).
 */
export const APPROVED_ATTRIBUTE_KEYS = [
  "sector",
  "status",
  "budgetAed",
  "populationServed",
  "strategicTheme",
  "liveabilityTheme",
] as const;

export function assembleContext(
  aoi: AoiId,
  project?: ProjectRecord,
  assessment?: AssessmentResult
): AiContext {
  const approvedAttributes: Record<string, string | number> = {};
  if (project) {
    for (const k of APPROVED_ATTRIBUTE_KEYS) {
      const v = (project as unknown as Record<string, unknown>)[k];
      if (typeof v === "string" || typeof v === "number") approvedAttributes[k] = v;
    }
  }
  return {
    aoi,
    projectId: project?.id,
    projectName: project?.nameEn,
    approvedAttributes,
    indicators: assessment?.dimensions.map((d) => ({ dimension: d.label, score: d.score, band: d.band })),
    overallPriority: assessment?.overall,
    strategy: project?.strategicTheme,
  };
}

/**
 * Defensive sanitizer: keep ONLY approved attribute keys. Any non-allowlisted field (e.g. a confidential
 * attribute) is dropped, so it can never reach the LLM adapter boundary (WORK-SEC-4).
 */
export function sanitizeContext(ctx: AiContext): AiContext {
  const clean: Record<string, string | number> = {};
  for (const k of APPROVED_ATTRIBUTE_KEYS) {
    if (k in ctx.approvedAttributes) clean[k] = ctx.approvedAttributes[k];
  }
  return { ...ctx, approvedAttributes: clean };
}
