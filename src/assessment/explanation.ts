import type { AssessmentResult } from "./scoringEngine";

/**
 * Deterministic, pre-authored explanation template. It is derived ENTIRELY from the computed result — it
 * never invents facts or numbers absent from the result (WORK-AC-10/11), never states an approval, and
 * needs no live LLM (WORK-DEC-8, WORK-AC-12). Same result → same text.
 */
export function buildExplanation(result: AssessmentResult): string {
  if (result.overall === "Insufficient data") {
    return "The required indicator inputs for this project are not available in the demo dataset, so an overall priority cannot be computed. The information is not included in the demo dataset.";
  }

  const present = result.dimensions.filter((d) => d.inputsPresent && d.score != null);
  const contributions = present
    .filter((d) => d.role === "contribution")
    .sort((a, b) => (b.score as number) - (a.score as number));
  const penalties = present
    .filter((d) => d.role === "penalty")
    .sort((a, b) => (b.score as number) - (a.score as number));

  const topContrib = contributions.slice(0, 2).map((d) => d.label);
  const topPenalty = penalties[0];

  const parts: string[] = [];
  parts.push(`This project is assessed ${result.overall} priority based on the deterministic indicators above.`);
  if (topContrib.length) parts.push(`The strongest contributing dimensions are ${topContrib.join(" and ")}.`);
  if (topPenalty && (topPenalty.score as number) >= 40) parts.push(`${topPenalty.label} is the main constraint.`);
  const missing = result.dimensions.filter((d) => !d.inputsPresent).map((d) => d.label);
  if (missing.length) parts.push(`${missing.join(", ")} could not be evaluated (input not in the demo dataset).`);
  parts.push("This is a decision-support explanation, not an approval.");
  return parts.join(" ");
}
