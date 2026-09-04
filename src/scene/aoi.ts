import type { AoiId } from "../data/types";

export interface AoiCamera {
  lon: number;
  lat: number;
  z: number;
  heading: number;
  tilt: number;
}

export interface AoiDef {
  id: AoiId;
  nameEn: string;
  subtitle: string;
  camera: AoiCamera;
  /**
   * Whether this AOI is offered as an opening/Explore option. Al Reem is the preferred cinematic
   * opening but is CONDITIONAL on its 3D validation (Stage 1.1 provisional GO, hardware-gated); if a
   * later hardware gate fails, set enabled:false and the switcher hides it — Khalifa stays the spine
   * and the app remains coherent (WORK-EX-4, WORK-DEC-5).
   */
  enabled: boolean;
}

/** Al Reem opening toggle — flip to false to disable the opening after a failed 3D/hardware gate. */
export const REEM_ENABLED = true;

export const AOIS: Record<AoiId, AoiDef> = {
  reem: {
    id: "reem",
    nameEn: "Al Reem Island",
    subtitle: "3D Visualization & Urban Intelligence",
    camera: { lon: 54.4045, lat: 24.499, z: 900, heading: 210, tilt: 68 },
    enabled: REEM_ENABLED,
  },
  khalifa: {
    id: "khalifa",
    nameEn: "Khalifa City",
    subtitle: "Planning & Liveability Assessment",
    camera: { lon: 54.578, lat: 24.419, z: 1200, heading: 200, tilt: 66 },
    enabled: true,
  },
};

/** The guaranteed spine — always available regardless of the Al Reem gate. */
export const SPINE_AOI: AoiId = "khalifa";

/** AOIs offered in the switcher (Al Reem only if enabled). */
export function availableAois(): AoiDef[] {
  return Object.values(AOIS).filter((a) => a.enabled);
}
