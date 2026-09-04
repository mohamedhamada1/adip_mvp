import type { AoiId } from "./types";
import type { Provenanced } from "./provenance";

/**
 * AOI boundaries. Provenance: OFFICIAL_PUBLIC — Abu Dhabi Spatial Data Infrastructure (AD-SDI)
 * OpenData "Districts" layer (`NAMEENGLISH` = "KHALIFA CITY" / "AL REEM ISLAND"), verified live in
 * Stage 1.1. Under the Abu Dhabi / UAE open-data license (attribution required — see attribution field).
 *
 * For the MVP these are frozen simplified extents (development use, owner-approved 2026-09-04). The full
 * clipped polygons are fetched/frozen from AD-SDI during data prep; the schema and provenance here are the
 * swap target so replacing them with the full geometry needs no UI change.
 * NOTE: unconfirmed AD-SDI offline-bundling rights are NOT recorded as legally confirmed (condition C1).
 */
export interface AoiBoundary extends Provenanced {
  aoi: AoiId;
  nameEn: string;
  nameAr: string;
  /** Simplified extent [ [lon,lat] ... ] ring — swap target for the full AD-SDI polygon. */
  ring: [number, number][];
  center: [number, number];
}

const ADSDI_ATTRIBUTION =
  "Boundary © Abu Dhabi Spatial Data Infrastructure (AD-SDI), Abu Dhabi Open Data (attribution)";

export const AOI_BOUNDARIES: Record<AoiId, AoiBoundary> = {
  reem: {
    aoi: "reem",
    nameEn: "Al Reem Island",
    nameAr: "جزيرة الريم",
    provenance: "OFFICIAL_PUBLIC",
    attribution: ADSDI_ATTRIBUTION,
    center: [54.4045, 24.4995],
    ring: [
      [54.393, 24.49],
      [54.417, 24.49],
      [54.417, 24.51],
      [54.393, 24.51],
      [54.393, 24.49],
    ],
  },
  khalifa: {
    aoi: "khalifa",
    nameEn: "Khalifa City",
    nameAr: "مدينة خليفة",
    provenance: "OFFICIAL_PUBLIC",
    attribution: ADSDI_ATTRIBUTION,
    center: [54.575, 24.417],
    ring: [
      [54.55, 24.4],
      [54.6, 24.4],
      [54.6, 24.434],
      [54.55, 24.434],
      [54.55, 24.4],
    ],
  },
};
