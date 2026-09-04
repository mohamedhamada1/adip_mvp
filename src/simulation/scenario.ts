/**
 * The approved HYPOTHETICAL school scenario (WORK-DEC-2, WORK-BR-14). The proposed school is a demonstration
 * intervention using approved real context — it is NOT an approved real capital project and must be labeled
 * hypothetical/demo wherever shown. Existing schools + the proposed school are on the same 0–100 grid as the
 * population zones. Service radius approximates a walkable catchment.
 */
export interface School {
  id: string;
  x: number;
  y: number;
  kind: "existing" | "proposed";
  isDemo: boolean;
  label: string;
}

/** Label reused in the UI to keep the intervention visibly hypothetical. */
export const HYPOTHETICAL_SCHOOL_LABEL = "Hypothetical school (demonstration — not an approved project)";

export const SERVICE_RADIUS = 24; // grid units ≈ walkable catchment

export const EXISTING_SCHOOLS: School[] = [
  { id: "s-e1", x: 24, y: 26, kind: "existing", isDemo: true, label: "Existing school" },
  { id: "s-e2", x: 60, y: 30, kind: "existing", isDemo: true, label: "Existing school" },
  { id: "s-e3", x: 40, y: 62, kind: "existing", isDemo: true, label: "Existing school" },
];

/** Placed in an underserved cluster (Sectors J/K/L) so the intervention demonstrably improves coverage. */
export const PROPOSED_SCHOOL: School = {
  id: "s-proposed",
  x: 58,
  y: 78,
  kind: "proposed",
  isDemo: true,
  label: HYPOTHETICAL_SCHOOL_LABEL,
};
