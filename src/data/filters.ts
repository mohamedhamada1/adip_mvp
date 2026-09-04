import type { ProjectRecord, Sector } from "./types";

/**
 * Pure filter: return the projects whose sector is in the active set.
 * An empty active set means "no sector filter" → all projects.
 * (Behavioural core of AC-2 "filters change the visible marker set" — unit-tested.)
 */
export function filterProjects(projects: ProjectRecord[], activeSectors: Set<Sector>): ProjectRecord[] {
  if (activeSectors.size === 0) return projects;
  return projects.filter((p) => activeSectors.has(p.sector));
}

/** Toggle a sector in an active-set, returning a NEW set (immutable). */
export function toggleSector(active: Set<Sector>, sector: Sector): Set<Sector> {
  const next = new Set(active);
  if (next.has(sector)) next.delete(sector);
  else next.add(sector);
  return next;
}
