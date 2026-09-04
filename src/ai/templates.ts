import type { AiContext } from "./context";
import type { AllowlistedAction } from "./actions";

export interface AiAnswer {
  text: string;
  action?: AllowlistedAction;
  /** true if grounded in the assembled context; false = "not in the demo dataset" (never invented). */
  sourced: boolean;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
}

export const ABSENT_INFO_MESSAGE =
  "That information is not included in the demo dataset, so it can't be shown.";

/** Context-aware suggested questions (WORK-REQ-18 favours these over open chat). Always ≥1. */
export function suggestedQuestions(ctx: AiContext): SuggestedQuestion[] {
  const qs: SuggestedQuestion[] = [];
  if (ctx.projectName && ctx.overallPriority) qs.push({ id: "why-priority", text: `Why is this project rated ${ctx.overallPriority}?` });
  qs.push({ id: "greatest-gap", text: "Which area has the greatest service gap?" });
  qs.push({ id: "what-if-school", text: "What changes if the proposed school is added?" });
  if (ctx.projectName) qs.push({ id: "accessibility-evidence", text: "What evidence contributed to the accessibility score?" });
  qs.push({ id: "show-underserved", text: "Show me the underserved area." });
  // An intentionally-unanswerable example to demonstrate absent-info honesty (WORK-EX-2).
  qs.push({ id: "contractor", text: "Who is the awarded contractor for this project?" });
  return qs;
}

function indicator(ctx: AiContext, label: string) {
  return ctx.indicators?.find((i) => i.dimension === label);
}

/**
 * DETERMINISTIC pre-authored answer. Grounded ONLY in the assembled context — never invents a fact or
 * number. Absent info → ABSENT_INFO_MESSAGE. Same (id, context) → same answer. No live LLM.
 */
export function answerQuestion(id: string, ctx: AiContext): AiAnswer {
  switch (id) {
    case "why-priority": {
      if (!ctx.overallPriority || !ctx.indicators) return { text: ABSENT_INFO_MESSAGE, sourced: false };
      const top = [...ctx.indicators]
        .filter((i) => i.score != null)
        .sort((a, b) => (b.score as number) - (a.score as number))
        .slice(0, 2)
        .map((i) => i.dimension);
      return {
        text: `This project is assessed ${ctx.overallPriority} priority. The strongest contributing dimensions are ${top.join(" and ")}. The result is computed by deterministic GIS indicators and business rules — this is a decision-support explanation, not an approval.`,
        action: ctx.projectId ? { kind: "open-assessment" } : undefined,
        sourced: true,
      };
    }
    case "greatest-gap": {
      const gap = indicator(ctx, "Spatial Service Gap");
      const base = gap && gap.score != null
        ? `The largest spatial service gap in this view scores ${gap.score} (${gap.band}). `
        : "";
      return { text: `${base}Underserved sectors are those outside walkable catchment of an existing facility.`, action: { kind: "show-underserved" }, sourced: true };
    }
    case "what-if-school":
      return { text: "Simulating the proposed school extends walkable catchment into underserved sectors, increasing population within the service area and reducing average access distance. Open the simulator to see the before/after.", action: { kind: "open-simulator" }, sourced: true };
    case "accessibility-evidence": {
      const acc = indicator(ctx, "Accessibility Benefit");
      if (!acc || acc.score == null) return { text: ABSENT_INFO_MESSAGE, sourced: false };
      return { text: `The Accessibility Benefit dimension scores ${acc.score} (${acc.band}), derived from sector type and delivery progress in the approved context.`, action: { kind: "open-assessment" }, sourced: true };
    }
    case "show-underserved":
      return { text: "Highlighting the underserved sectors on the map.", action: { kind: "show-underserved" }, sourced: true };
    default:
      // Anything not backed by the approved context (e.g. "contractor") → honest absent-info.
      return { text: ABSENT_INFO_MESSAGE, sourced: false };
  }
}
