import { describe, it, expect } from "vitest";
import { preloadFrozenData, isSafeMode, setSafeMode } from "../src/hardening/safeMode";

describe("hardening — AC-5 preload + safe mode", () => {
  it("preloadFrozenData warms the frozen datasets deterministically", () => {
    const a = preloadFrozenData();
    const b = preloadFrozenData();
    expect(a).toEqual(b); // deterministic
    expect(a.projects).toBeGreaterThan(0);
    expect(a.populationZones).toBeGreaterThan(0);
    expect(a.aoiBoundaries).toBe(2);
  });
  it("safe mode toggles the deterministic offline flag", () => {
    setSafeMode(false);
    expect(isSafeMode()).toBe(false); // NEGATIVE CONTROL
    setSafeMode(true);
    expect(isSafeMode()).toBe(true);
    setSafeMode(false);
  });
});
