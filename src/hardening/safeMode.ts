import { DEMO_PORTFOLIO } from "../data/portfolio.demo";
import { POPULATION_ZONES } from "../simulation/populationZones";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";

/**
 * Exhibition hardening (WORK-NFR-5/7/8, WORK-ROLL-6).
 *
 * `preloadFrozenData` warms the frozen, in-bundle datasets so the scripted journey has no first-use latency
 * and no runtime fetch for its core data. Deterministic — returns a stable summary.
 *
 * `presentationSafeMode` is the deterministic kill-switch: when on, the app runs the fully deterministic /
 * offline path (own-built 3D floor + templates, no external calls), so a connectivity interruption never
 * breaks the scripted demo. The core journey already tolerates interruption; safe mode makes it explicit.
 */
export interface FrozenDataSummary {
  projects: number;
  populationZones: number;
  aoiBoundaries: number;
}

export function preloadFrozenData(): FrozenDataSummary {
  return {
    projects: DEMO_PORTFOLIO.length,
    populationZones: POPULATION_ZONES.length,
    aoiBoundaries: Object.keys(AOI_BOUNDARIES).length,
  };
}

let safeMode = false;
export function isSafeMode(): boolean {
  return safeMode;
}
export function setSafeMode(on: boolean): void {
  safeMode = on;
}
