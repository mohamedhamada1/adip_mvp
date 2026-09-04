// Provenance classification — MANDATORY on every dataset/field so a swap of demo data
// for approved internal ADPIC data is a data change, not a UI redesign (INV-provenance-tagged).
export type Provenance = "OFFICIAL_PUBLIC" | "DERIVED" | "SYNTHETIC_DEMO";

export interface Provenanced {
  /** How this record/dataset was sourced. */
  provenance: Provenance;
  /** Attribution string for OFFICIAL_PUBLIC / DERIVED-from-public sources (empty for pure synthetic). */
  attribution?: string;
}

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  OFFICIAL_PUBLIC: "Official / Public",
  DERIVED: "Derived",
  SYNTHETIC_DEMO: "Synthetic / Demo",
};

export function isDemoProvenance(p: Provenance): boolean {
  return p === "SYNTHETIC_DEMO";
}
