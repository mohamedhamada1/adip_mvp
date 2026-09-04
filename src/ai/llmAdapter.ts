import type { AiContext } from "./context";
import { sanitizeContext } from "./context";
import { answerQuestion, type AiAnswer } from "./templates";
import { isAllowlistedAction } from "./actions";

/**
 * The boundary contract for ANY explanation provider (WORK-INT-8, WORK-SEC-4). An adapter receives ONLY
 * sanitized structured context and returns an explanation + (optionally) an allowlisted action. A future,
 * separately-approved live LLM would implement this behind `explainViaAdapter` — it can never see
 * unsanitized data or trigger a non-allowlisted action. The default is templates-only (no network).
 */
export interface LlmAdapter {
  readonly kind: string;
  explain(sanitized: AiContext): AiAnswer;
}

/** Default adapter: deterministic templates, NO live LLM — the whole demo runs on this (WORK-DEC-8). */
export const NullLlmAdapter: LlmAdapter = {
  kind: "null-templates",
  explain(sanitized: AiContext): AiAnswer {
    return answerQuestion("why-priority", sanitized);
  },
};

/**
 * The ONLY sanctioned way to invoke an adapter: sanitize first, then validate the returned action against
 * the allowlist (a non-allowlisted action is dropped). Guarantees the adapter never receives non-approved
 * fields and never triggers open behavior — regardless of the adapter implementation.
 */
export function explainViaAdapter(adapter: LlmAdapter, ctx: AiContext): AiAnswer {
  const clean = sanitizeContext(ctx);
  const out = adapter.explain(clean);
  return { ...out, action: isAllowlistedAction(out.action) ? out.action : undefined };
}
