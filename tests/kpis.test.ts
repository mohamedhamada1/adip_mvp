import { describe, it, expect } from "vitest";
import { computeKpis, formatAed, formatPeople } from "../src/data/kpis";
import type { ProjectRecord } from "../src/data/types";

function rec(over: Partial<ProjectRecord>): ProjectRecord {
  return {
    id: "x", nameEn: "x", nameAr: "x", aoi: "khalifa", sector: "Education", status: "Planned",
    budgetAed: 0, startDate: "2025-01-01", endDate: "2027-12-31", progress: 0, strategicTheme: "t",
    liveabilityTheme: "l", populationServed: 0, lon: 54.5, lat: 24.4, provenance: "SYNTHETIC_DEMO", isDemo: true,
    ...over,
  };
}

describe("computeKpis — values are computed from data (AC-5)", () => {
  it("aggregates counts, investment and population", () => {
    const k = computeKpis([
      rec({ status: "Under Delivery", budgetAed: 100_000_000, populationServed: 1000 }),
      rec({ status: "Planned", budgetAed: 50_000_000, populationServed: 500 }),
      rec({ status: "Completed", budgetAed: 25_000_000, populationServed: 250 }),
    ]);
    expect(k.totalProjects).toBe(3);
    expect(k.totalInvestmentAed).toBe(175_000_000);
    expect(k.underDelivery).toBe(1);
    expect(k.planned).toBe(1);
    expect(k.populationServed).toBe(1750);
  });

  it("empty dataset yields zeroes (UI shows — not a literal)", () => {
    expect(computeKpis([]).totalProjects).toBe(0);
  });
});

describe("formatters (derived display strings)", () => {
  it("formats billions/millions", () => {
    expect(formatAed(85_000_000_000)).toBe("AED 85.0B");
    expect(formatAed(120_000_000)).toBe("AED 120M");
  });
  it("formats people compactly", () => {
    expect(formatPeople(250_000)).toBe("~250K");
  });
});
