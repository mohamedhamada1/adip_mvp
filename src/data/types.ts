import type { Provenance } from "./provenance";

export type AoiId = "khalifa" | "reem";

export type Sector =
  | "Mobility"
  | "Education"
  | "Health"
  | "Public Realm"
  | "Community Facilities"
  | "Utilities";

export const SECTORS: Sector[] = [
  "Mobility",
  "Education",
  "Health",
  "Public Realm",
  "Community Facilities",
  "Utilities",
];

export type ProjectStatus = "Under Delivery" | "Planned" | "Completed" | "Concept";

/** WORK-DATA-aligned project record. Every record carries provenance + IS_DEMO. */
export interface ProjectRecord {
  id: string;
  nameEn: string;
  nameAr: string;
  aoi: AoiId;
  sector: Sector;
  status: ProjectStatus;
  /** Capital investment in AED (numeric — used to compute KPIs, never typed into JSX). */
  budgetAed: number;
  startDate: string;
  endDate: string;
  progress: number;
  strategicTheme: string;
  liveabilityTheme: string;
  populationServed: number;
  lon: number;
  lat: number;
  provenance: Provenance;
  /** Internal demo flag — these are representative synthetic records, never verified real projects. */
  isDemo: boolean;
}
