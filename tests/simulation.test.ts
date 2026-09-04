import { describe, it, expect } from "vitest";
import { simulateSchool } from "../src/simulation/simulationEngine";

describe("simulateSchool — AC-1 deterministic + AC-3 metrics", () => {
  it("is deterministic: identical inputs yield deeply-equal results", () => {
    expect(simulateSchool()).toEqual(simulateSchool());
  });

  it("adding the proposed school improves coverage and reports all metrics", () => {
    const r = simulateSchool();
    // NEGATIVE CONTROL: a school that covers new zones must increase population in the service area
    expect(r.after.populationInServiceArea).toBeGreaterThan(r.before.populationInServiceArea);
    expect(r.after.coveragePct).toBeGreaterThan(r.before.coveragePct);
    expect(r.after.underservedPopulation).toBeLessThan(r.before.underservedPopulation);
    expect(r.after.averageAccessDistance).toBeLessThanOrEqual(r.before.averageAccessDistance);
    for (const m of [r.before, r.after]) {
      expect(m.populationInServiceArea).toBeGreaterThanOrEqual(0);
      expect(m.coveragePct).toBeGreaterThanOrEqual(0);
      expect(typeof m.averageAccessDistance).toBe("number");
    }
    expect(r.liveabilityImpactScore).toBeGreaterThan(0);
  });

  it("AC-2: reports newly-covered communities from the proposed school", () => {
    const r = simulateSchool();
    expect(r.newlyCovered.length).toBeGreaterThan(0); // NEGATIVE CONTROL: no gain would mean an unhelpful sim
    expect(r.proposed.kind).toBe("proposed");
    expect(r.proposed.isDemo).toBe(true);
  });
});
