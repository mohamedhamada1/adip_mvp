import type { ProjectRecord } from "../data/types";
import { DIMENSIONS, type DimensionKey } from "./dimensions";
import { WEIGHTS, THRESHOLDS } from "./weights.config";
import { deriveIndicators } from "./indicators";
import { type Lang, dimLabel } from "../i18n/strings";

export type Band = "Low" | "Medium" | "High" | "Insufficient data";

export interface DimensionResult {
  key: DimensionKey;
  label: string;
  role: "contribution" | "penalty";
  /** 0–100 score, or null when the input is missing. */
  score: number | null;
  band: Band;
  evidence: string[];
  inputsPresent: boolean;
}

export interface AssessmentResult {
  projectId: string;
  projectName: string;
  overall: Band;
  /** 0–100 overall score, or null when Insufficient data. */
  overallScore: number | null;
  dimensions: DimensionResult[];
  /** The result is attributed to rules, not AI. */
  attributedTo: "GIS indicators + business rules";
}

function bandForScore(score: number): Exclude<Band, "Insufficient data"> {
  if (score >= THRESHOLDS.high) return "High";
  if (score >= THRESHOLDS.medium) return "Medium";
  return "Low";
}

export interface ScoreOptions {
  /** Dimensions whose GIS input is unavailable — used to exercise the "Insufficient data" path. */
  missingDimensions?: Set<DimensionKey>;
  /** Language for the DISPLAY evidence strings only (default "en"). Scores/bands are unchanged. */
  lang?: Lang;
}

/**
 * PURE, DETERMINISTIC scoring: identical (project, options) → identical result. No randomness, wall-clock,
 * or network. Missing-dimension rule: an Insufficient-data dimension is EXCLUDED from the weighted overall
 * and the remaining weights are RENORMALIZED (contribution/penalty split preserved). If ALL dimensions are
 * missing, overall = "Insufficient data" with a null score (no invented number).
 */
export function scoreProject(project: ProjectRecord, options: ScoreOptions = {}): AssessmentResult {
  const missing = options.missingDimensions ?? new Set<DimensionKey>();
  const lang = options.lang ?? "en";
  const indicators = deriveIndicators(project, lang);

  const dimensions: DimensionResult[] = DIMENSIONS.map((d) => {
    if (missing.has(d.key)) {
      return {
        key: d.key,
        label: d.label,
        role: d.role,
        score: null,
        band: "Insufficient data",
        evidence: [lang === "ar"
          ? `مُدخل ${dimLabel(d.key, "ar")} غير متوفر في مجموعة البيانات التجريبية`
          : `Input for ${d.label} is not available in the demo dataset`],
        inputsPresent: false,
      };
    }
    const ind = indicators[d.key];
    return {
      key: d.key,
      label: d.label,
      role: d.role,
      score: ind.value,
      band: bandForScore(ind.value),
      evidence: ind.evidence,
      inputsPresent: true,
    };
  });

  // Overall: exclude missing dimensions; renormalize by present positive weight.
  const present = dimensions.filter((r) => r.inputsPresent);
  const presentPositiveWeight = present
    .filter((r) => r.role === "contribution")
    .reduce((s, r) => s + WEIGHTS[r.key], 0);

  if (present.length === 0 || presentPositiveWeight === 0) {
    return {
      projectId: project.id,
      projectName: project.nameEn,
      overall: "Insufficient data",
      overallScore: null,
      dimensions,
      attributedTo: "GIS indicators + business rules",
    };
  }

  let raw = 0;
  for (const r of present) {
    const contribution = (WEIGHTS[r.key] * (r.score as number)) / 100;
    raw += r.role === "contribution" ? contribution : -contribution;
  }
  const overallScore = Math.max(0, Math.min(100, Math.round((raw / presentPositiveWeight) * 100)));

  return {
    projectId: project.id,
    projectName: project.nameEn,
    overall: bandForScore(overallScore),
    overallScore,
    dimensions,
    attributedTo: "GIS indicators + business rules",
  };
}
