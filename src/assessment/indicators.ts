import type { ProjectRecord } from "../data/types";
import { projectsForAoi } from "../data/portfolio.demo";
import { formatAed } from "../data/kpis";
import type { DimensionKey } from "./dimensions";

export interface Indicator {
  /** 0–100 indicator value. */
  value: number;
  /** Human-readable calculated evidence lines (the inputs that produced the value). */
  evidence: string[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

const STRATEGIC_SCORE: Record<string, number> = {
  "Liveable City": 90,
  "Community Wellbeing": 85,
  Sustainability: 80,
  "Economic Vitality": 75,
};

const HIGH_GAP_SECTORS = new Set(["Education", "Health", "Community Facilities"]);
const HIGH_ACCESS_SECTORS = new Set(["Mobility", "Public Realm", "Education"]);

/**
 * Derive the assessment indicator inputs for a project. DETERMINISTIC and pure (no random/clock/network):
 * the same project always yields the same indicators. Values are DERIVED proxies from the frozen dataset
 * (real GIS indicators are the swap target) — each carries calculated evidence.
 */
export function deriveIndicators(project: ProjectRecord): Record<DimensionKey, Indicator> {
  const pop = project.populationServed;
  const budget = project.budgetAed;
  const sameSectorInAoi = projectsForAoi(project.aoi).filter((p) => p.sector === project.sector).length;

  const communityNeed = clamp((pop / 25000) * 100);
  const strategicAlignment = STRATEGIC_SCORE[project.strategicTheme] ?? 70;
  const gapBase = HIGH_GAP_SECTORS.has(project.sector) ? 70 : 40;
  const spatialServiceGap = clamp(gapBase + (pop / 25000) * 25);
  const accessibilityBenefit = clamp((HIGH_ACCESS_SECTORS.has(project.sector) ? 75 : 50) + project.progress * 0.1);
  const duplication = clamp((sameSectorInAoi - 1) * 12); // more same-sector projects → more duplication
  const infrastructureDependency = clamp((budget / 500_000_000) * 100);
  const deliveryComplexity = clamp((budget / 500_000_000) * 60 + (100 - project.progress) * 0.4);

  return {
    communityNeed: { value: communityNeed, evidence: [`Population served ≈ ${pop.toLocaleString("en")}`] },
    strategicAlignment: { value: strategicAlignment, evidence: [`Strategic theme: ${project.strategicTheme}`] },
    spatialServiceGap: {
      value: spatialServiceGap,
      evidence: [`Sector: ${project.sector}`, `Underserved-demand proxy from population ≈ ${pop.toLocaleString("en")}`],
    },
    accessibilityBenefit: {
      value: accessibilityBenefit,
      evidence: [`Sector: ${project.sector}`, `Delivery progress ${project.progress}%`],
    },
    duplication: {
      value: duplication,
      evidence: [`${sameSectorInAoi} ${project.sector} project(s) within the AOI`],
    },
    infrastructureDependency: {
      value: infrastructureDependency,
      evidence: [`Estimated CAPEX ${formatAed(budget)}`],
    },
    deliveryComplexity: {
      value: deliveryComplexity,
      evidence: [`Estimated CAPEX ${formatAed(budget)}`, `Delivery progress ${project.progress}%`],
    },
  };
}
