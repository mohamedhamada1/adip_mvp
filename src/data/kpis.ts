import type { ProjectRecord } from "./types";

export interface Kpis {
  totalProjects: number;
  totalInvestmentAed: number;
  underDelivery: number;
  planned: number;
  populationServed: number;
}

/**
 * Compute the KPI strip values from the frozen dataset. KPI values are ALWAYS computed
 * here from the data — never typed as literals in JSX (INV-no-mockup-numbers / AC-5).
 */
export function computeKpis(projects: ProjectRecord[]): Kpis {
  return projects.reduce<Kpis>(
    (acc, p) => {
      acc.totalProjects += 1;
      acc.totalInvestmentAed += p.budgetAed;
      if (p.status === "Under Delivery") acc.underDelivery += 1;
      if (p.status === "Planned") acc.planned += 1;
      acc.populationServed += p.populationServed;
      return acc;
    },
    { totalProjects: 0, totalInvestmentAed: 0, underDelivery: 0, planned: 0, populationServed: 0 }
  );
}

/** Format a large AED figure compactly (e.g. 85_000_000_000 → "AED 85.0B"). Derived from data. */
export function formatAed(aed: number): string {
  if (aed >= 1e9) return `AED ${(aed / 1e9).toFixed(1)}B`;
  if (aed >= 1e6) return `AED ${(aed / 1e6).toFixed(0)}M`;
  return `AED ${aed.toLocaleString("en")}`;
}

/** Format a population count compactly (approximate marker). */
export function formatPeople(n: number): string {
  if (n >= 1000) return `~${Math.round(n / 1000)}K`;
  return `${n}`;
}
