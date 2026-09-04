import type { AoiId, ProjectRecord, ProjectStatus, Sector } from "./types";
import { SECTORS } from "./types";

/**
 * FROZEN SYNTHETIC EXHIBITION PORTFOLIO — provenance: SYNTHETIC_DEMO, isDemo: true.
 *
 * These are curated, geographically/functionally credible DEMONSTRATION records. They are
 * NOT an official ADPIC portfolio and must never be presented as verified real projects
 * (WORK-BR-12, WORK-DATA-32). Counts are deliberately a strong-but-modest showcase set
 * (~24 per AOI, well within WORK-AC-4's 20–40) — NOT the provisional 219/139 source counts.
 * All values live in data (never typed as KPI literals in JSX).
 */

// Deterministic pseudo-random so the frozen dataset is stable across builds.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STATUSES: ProjectStatus[] = ["Under Delivery", "Planned", "Completed", "Concept"];
const STRATEGIC = ["Liveable City", "Economic Vitality", "Sustainability", "Community Wellbeing"];
const LIVEABILITY = ["Access to Services", "Green & Public Realm", "Mobility & Connectivity", "Health & Education"];

// Rough bounding boxes (WGS84) for credible placement within each AOI.
const BBOX: Record<AoiId, { lon0: number; lon1: number; lat0: number; lat1: number; nameEn: string }> = {
  reem: { lon0: 54.396, lon1: 54.414, lat0: 24.492, lat1: 24.508, nameEn: "Al Reem Island" },
  khalifa: { lon0: 54.552, lon1: 54.598, lat0: 24.402, lat1: 24.432, nameEn: "Khalifa City" },
};

const SECTOR_NAME: Record<Sector, { en: string; ar: string }> = {
  Mobility: { en: "Mobility Corridor", ar: "ممر الحركة" },
  Education: { en: "Community School", ar: "مدرسة مجتمعية" },
  Health: { en: "Health Centre", ar: "مركز صحي" },
  "Public Realm": { en: "Public Realm Park", ar: "متنزه عام" },
  "Community Facilities": { en: "Community Facility", ar: "مرفق مجتمعي" },
  Utilities: { en: "Utilities Upgrade", ar: "تطوير المرافق" },
};

function buildAoi(aoi: AoiId, seed: number, count: number): ProjectRecord[] {
  const rnd = mulberry32(seed);
  const bb = BBOX[aoi];
  const out: ProjectRecord[] = [];
  for (let i = 0; i < count; i++) {
    const sector = SECTORS[Math.floor(rnd() * SECTORS.length)];
    const status = STATUSES[Math.floor(rnd() * STATUSES.length)];
    const nm = SECTOR_NAME[sector];
    const budgetAed = Math.round((20 + rnd() * 480)) * 1_000_000; // AED 20M–500M
    const populationServed = Math.round(1_000 + rnd() * 24_000);
    const progress = status === "Completed" ? 100 : status === "Concept" ? 0 : Math.round(rnd() * 90);
    const year = 2024 + Math.floor(rnd() * 4);
    out.push({
      id: `${aoi}-${String(i + 1).padStart(3, "0")}`,
      nameEn: `${bb.nameEn} ${nm.en} ${i + 1}`,
      nameAr: `${nm.ar} ${i + 1}`,
      aoi,
      sector,
      status,
      budgetAed,
      startDate: `${year}-0${1 + Math.floor(rnd() * 8)}-01`,
      endDate: `${year + 1 + Math.floor(rnd() * 3)}-12-31`,
      progress,
      strategicTheme: STRATEGIC[Math.floor(rnd() * STRATEGIC.length)],
      liveabilityTheme: LIVEABILITY[Math.floor(rnd() * LIVEABILITY.length)],
      populationServed,
      lon: bb.lon0 + rnd() * (bb.lon1 - bb.lon0),
      lat: bb.lat0 + rnd() * (bb.lat1 - bb.lat0),
      provenance: "SYNTHETIC_DEMO",
      isDemo: true,
    });
  }
  return out;
}

// Frozen at module load (stable seeds) — the runtime "event snapshot" for the MVP.
export const DEMO_PORTFOLIO: ProjectRecord[] = [
  ...buildAoi("reem", 0x5eed_1001, 24),
  ...buildAoi("khalifa", 0x5eed_2002, 26),
];

export function projectsForAoi(aoi: AoiId): ProjectRecord[] {
  return DEMO_PORTFOLIO.filter((p) => p.aoi === aoi);
}
