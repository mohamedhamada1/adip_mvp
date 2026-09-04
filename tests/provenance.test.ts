import { describe, it, expect } from "vitest";
import { DEMO_PORTFOLIO } from "../src/data/portfolio.demo";
import { AOI_BOUNDARIES } from "../src/data/aoiBoundaries";
import { PROVENANCE_LABEL } from "../src/data/provenance";

const VALID = new Set(Object.keys(PROVENANCE_LABEL));

describe("provenance tagging (AC-5 / INV-provenance-tagged) — ALL datasets", () => {
  it("every portfolio record carries a valid provenance and synthetic records are IS_DEMO", () => {
    expect(DEMO_PORTFOLIO.length).toBeGreaterThanOrEqual(40); // ~20-40 per AOI, 2 AOIs
    for (const p of DEMO_PORTFOLIO) {
      expect(VALID.has(p.provenance)).toBe(true);
      expect(p.provenance).toBe("SYNTHETIC_DEMO");
      expect(p.isDemo).toBe(true); // NEGATIVE CONTROL: an unlabelled real-looking record would fail
    }
  });

  it("every AOI boundary carries OFFICIAL_PUBLIC provenance + attribution (AD-SDI)", () => {
    for (const b of Object.values(AOI_BOUNDARIES)) {
      expect(b.provenance).toBe("OFFICIAL_PUBLIC");
      expect(b.attribution && b.attribution.length).toBeGreaterThan(0);
    }
  });

  it("curated counts are a showcase set, NOT the provisional 219/139 source counts", () => {
    const khalifa = DEMO_PORTFOLIO.filter((p) => p.aoi === "khalifa").length;
    const reem = DEMO_PORTFOLIO.filter((p) => p.aoi === "reem").length;
    expect(khalifa).toBeLessThanOrEqual(40);
    expect(reem).toBeLessThanOrEqual(40);
    expect(khalifa).not.toBe(219);
    expect(reem).not.toBe(139);
  });
});
