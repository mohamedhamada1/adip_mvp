import { describe, it, expect } from "vitest";
import { scoreProject } from "../src/assessment/scoringEngine";
import { DIMENSIONS } from "../src/assessment/dimensions";
import type { DimensionKey } from "../src/assessment/dimensions";
import type { ProjectRecord } from "../src/data/types";

function rec(over: Partial<ProjectRecord>): ProjectRecord {
  return {
    id: "t-1", nameEn: "Test Project", nameAr: "x", aoi: "khalifa", sector: "Education", status: "Planned",
    budgetAed: 60_000_000, startDate: "2025-01-01", endDate: "2028-12-31", progress: 60,
    strategicTheme: "Liveable City", liveabilityTheme: "Access to Services", populationServed: 20000,
    lon: 54.57, lat: 24.41, provenance: "SYNTHETIC_DEMO", isDemo: true, ...over,
  };
}

const highProfile = rec({ populationServed: 24000, strategicTheme: "Liveable City", sector: "Education", budgetAed: 40_000_000, progress: 80 });
const lowProfile = rec({ populationServed: 500, strategicTheme: "Economic Vitality", sector: "Utilities", budgetAed: 500_000_000, progress: 5 });

describe("scoreProject — AC-1 determinism + banding", () => {
  it("is deterministic: identical input yields deeply-equal results", () => {
    expect(scoreProject(highProfile)).toEqual(scoreProject(highProfile));
  });
  it("bands a strong-profile project High and a weak-profile project Low", () => {
    expect(scoreProject(highProfile).overall).toBe("High");
    expect(scoreProject(lowProfile).overall).toBe("Low"); // NEGATIVE CONTROL: inverted banding would fail
  });
});

describe("scoreProject — AC-2 evidence", () => {
  it("every present-input dimension carries non-empty evidence", () => {
    const r = scoreProject(highProfile);
    expect(r.dimensions).toHaveLength(DIMENSIONS.length);
    for (const d of r.dimensions.filter((x) => x.inputsPresent)) {
      expect(d.evidence.length).toBeGreaterThan(0);
      expect(d.score).not.toBeNull();
    }
    expect(r.attributedTo).toBe("GIS indicators + business rules");
  });
});

describe("scoreProject — AC-6 missing inputs (exclude-and-renormalize)", () => {
  it("one missing dimension → Insufficient data (null score) but overall still deterministic Low/Med/High", () => {
    const r = scoreProject(highProfile, { missingDimensions: new Set<DimensionKey>(["communityNeed"]) });
    const cn = r.dimensions.find((d) => d.key === "communityNeed")!;
    expect(cn.band).toBe("Insufficient data");
    expect(cn.score).toBeNull();
    expect(cn.evidence.length).toBeGreaterThan(0);
    expect(["Low", "Medium", "High"]).toContain(r.overall); // NEGATIVE CONTROL: a missing input must not break the overall
    expect(r.overallScore).not.toBeNull();
  });

  it("ALL dimensions missing → overall Insufficient data with a null score (no invented number)", () => {
    const all = new Set<DimensionKey>(DIMENSIONS.map((d) => d.key));
    const r = scoreProject(highProfile, { missingDimensions: all });
    expect(r.overall).toBe("Insufficient data");
    expect(r.overallScore).toBeNull();
  });
});
