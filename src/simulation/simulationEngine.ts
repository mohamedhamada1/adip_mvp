import type { Zone } from "./populationZones";
import { POPULATION_ZONES } from "./populationZones";
import type { School } from "./scenario";
import { EXISTING_SCHOOLS, PROPOSED_SCHOOL, SERVICE_RADIUS } from "./scenario";

export interface SimMetrics {
  populationInServiceArea: number;
  coveragePct: number;
  averageAccessDistance: number;
  underservedPopulation: number;
  coveredZoneIds: string[];
}

export interface SimulationResult {
  before: SimMetrics;
  after: SimMetrics;
  liveabilityImpactScore: number;
  /** Zones covered after the proposed school but not before. */
  newlyCovered: { id: string; name: string }[];
  proposed: School;
  serviceRadius: number;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
const round1 = (n: number) => Math.round(n * 10) / 10;

function nearest(zone: Zone, schools: School[]): number {
  return schools.reduce((min, s) => Math.min(min, dist(zone, s)), Infinity);
}

function metrics(zones: Zone[], schools: School[], radius: number): SimMetrics {
  const totalPop = zones.reduce((s, z) => s + z.population, 0);
  const covered = zones.filter((z) => nearest(z, schools) <= radius);
  const populationInServiceArea = covered.reduce((s, z) => s + z.population, 0);
  const avg = zones.length ? zones.reduce((s, z) => s + nearest(z, schools), 0) / zones.length : 0;
  return {
    populationInServiceArea,
    coveragePct: totalPop ? round1((populationInServiceArea / totalPop) * 100) : 0,
    averageAccessDistance: round1(avg),
    underservedPopulation: totalPop - populationInServiceArea,
    coveredZoneIds: covered.map((z) => z.id),
  };
}

/**
 * PURE, DETERMINISTIC simulation (no random/clock/network): identical inputs → identical result.
 * Compares Current (existing schools) vs With-Proposed-School (existing + proposed). All displayed values
 * derive from this result — the UI never hard-codes figures.
 */
export function simulateSchool(
  zones: Zone[] = POPULATION_ZONES,
  existing: School[] = EXISTING_SCHOOLS,
  proposed: School = PROPOSED_SCHOOL,
  radius: number = SERVICE_RADIUS
): SimulationResult {
  const before = metrics(zones, existing, radius);
  const after = metrics(zones, [...existing, proposed], radius);

  const beforeSet = new Set(before.coveredZoneIds);
  const newlyCovered = zones
    .filter((z) => after.coveredZoneIds.includes(z.id) && !beforeSet.has(z.id))
    .map((z) => ({ id: z.id, name: z.name }));

  const coverageGain = after.coveragePct - before.coveragePct;
  const accessGainPct = before.averageAccessDistance
    ? ((before.averageAccessDistance - after.averageAccessDistance) / before.averageAccessDistance) * 100
    : 0;
  const liveabilityImpactScore = Math.max(0, Math.round(coverageGain * 0.7 + accessGainPct * 0.3));

  return { before, after, liveabilityImpactScore, newlyCovered, proposed, serviceRadius: radius };
}
