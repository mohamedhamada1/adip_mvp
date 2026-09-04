import type { Provenanced } from "../data/provenance";

/**
 * Frozen demo population/demand zones for the Khalifa City school scenario, on a normalized 0–100 grid.
 * Provenance: DERIVED/SYNTHETIC_DEMO — a deterministic demonstration demand model, NOT official ADPIC
 * population analysis (real SCAD/AD-SDI demand data is the swap target; WORK-OQ-5 OPEN). Frozen (stable).
 */
export interface Zone extends Provenanced {
  id: string;
  name: string;
  population: number;
  x: number;
  y: number;
}

export const POPULATION_ZONES: Zone[] = [
  { id: "z1", name: "Sector A", population: 8200, x: 18, y: 22, provenance: "DERIVED", attribution: "Derived demonstration demand model (not official ADPIC population analysis)" },
  { id: "z2", name: "Sector B", population: 6400, x: 34, y: 30, provenance: "DERIVED" },
  { id: "z3", name: "Sector C", population: 9100, x: 52, y: 24, provenance: "DERIVED" },
  { id: "z4", name: "Sector D", population: 5300, x: 70, y: 34, provenance: "DERIVED" },
  { id: "z5", name: "Sector E", population: 7600, x: 26, y: 52, provenance: "DERIVED" },
  { id: "z6", name: "Sector F", population: 8800, x: 48, y: 58, provenance: "DERIVED" },
  { id: "z7", name: "Sector G", population: 4700, x: 68, y: 60, provenance: "DERIVED" },
  { id: "z8", name: "Sector H", population: 6100, x: 82, y: 50, provenance: "DERIVED" },
  { id: "z9", name: "Sector J", population: 7300, x: 30, y: 78, provenance: "DERIVED" },
  { id: "z10", name: "Sector K", population: 9500, x: 54, y: 82, provenance: "DERIVED" },
  { id: "z11", name: "Sector L", population: 5200, x: 74, y: 78, provenance: "DERIVED" },
  { id: "z12", name: "Sector M", population: 6000, x: 88, y: 70, provenance: "DERIVED" },
];
