import type { AssessmentResult } from "./scoringEngine";
import { type Lang, bandLabel, dimLabel } from "../i18n/strings";

/**
 * Deterministic, pre-authored explanation template. It is derived ENTIRELY from the computed result — it
 * never invents facts or numbers absent from the result (WORK-AC-10/11), never states an approval, and
 * needs no live LLM (WORK-DEC-8, WORK-AC-12). Same result → same text. `lang` localizes the display only.
 */
export function buildExplanation(result: AssessmentResult, lang: Lang = "en"): string {
  const present = result.dimensions.filter((d) => d.inputsPresent && d.score != null);
  const contributions = present.filter((d) => d.role === "contribution").sort((a, b) => (b.score as number) - (a.score as number));
  const penalties = present.filter((d) => d.role === "penalty").sort((a, b) => (b.score as number) - (a.score as number));
  const topContrib = contributions.slice(0, 2);
  const topPenalty = penalties[0];
  const missing = result.dimensions.filter((d) => !d.inputsPresent);

  if (lang === "ar") {
    if (result.overall === "Insufficient data") {
      return "مُدخلات المؤشرات المطلوبة لهذا المشروع غير متوفرة في مجموعة البيانات التجريبية، لذا لا يمكن حساب أولوية إجمالية.";
    }
    const parts: string[] = [`يُقيَّم هذا المشروع بأولوية ${bandLabel(result.overall, "ar")} استناداً إلى المؤشرات الحتمية أعلاه.`];
    if (topContrib.length) parts.push(`أقوى العوامل الداعمة هي ${topContrib.map((d) => dimLabel(d.key, "ar")).join(" و")}.`);
    if (topPenalty && (topPenalty.score as number) >= 40) parts.push(`${dimLabel(topPenalty.key, "ar")} هو القيد الرئيسي.`);
    if (missing.length) parts.push(`تعذّر تقييم ${missing.map((d) => dimLabel(d.key, "ar")).join("، ")} (المُدخل غير متوفر في البيانات التجريبية).`);
    parts.push("هذا شرح لدعم القرار وليس موافقة.");
    return parts.join(" ");
  }

  if (result.overall === "Insufficient data") {
    return "The required indicator inputs for this project are not available in the demo dataset, so an overall priority cannot be computed. The information is not included in the demo dataset.";
  }
  const parts: string[] = [];
  parts.push(`This project is assessed ${result.overall} priority based on the deterministic indicators above.`);
  if (topContrib.length) parts.push(`The strongest contributing dimensions are ${topContrib.map((d) => d.label).join(" and ")}.`);
  if (topPenalty && (topPenalty.score as number) >= 40) parts.push(`${topPenalty.label} is the main constraint.`);
  if (missing.length) parts.push(`${missing.map((d) => d.label).join(", ")} could not be evaluated (input not in the demo dataset).`);
  parts.push("This is a decision-support explanation, not an approval.");
  return parts.join(" ");
}
