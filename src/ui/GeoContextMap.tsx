import type { ProjectRecord } from "../data/types";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";
import { projectsForAoi } from "../data/portfolio.demo";
import { useLang } from "../i18n/LangContext";
import { shortName } from "../i18n/strings";

/**
 * Shared DETERMINISTIC geographic surface for the selection experience. Renders the REAL AD-SDI district
 * boundary + (Khalifa) major-road network, the AOI's portfolio projects as SUBDUED markers, and the
 * SELECTED project as a prominent, camera-framed marker with a short label — all at the project's frozen
 * validated lon/lat (never invented). This is the on-screen map/fallback surface used when the live 3D
 * SceneView cannot be relied upon to paint (tokenless WebGL basemap); the SceneView remains the swap target.
 */

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const MW = 200, MH = 150, MPAD = 8;

export function GeoContextMap({ project, frame = 1, compact = false }: { project: ProjectRecord; frame?: number; compact?: boolean }) {
  const { lang } = useLang();
  const b = AOI_BOUNDARIES[project.aoi];
  const lon0 = Math.min(...b.ring.map((p) => p[0])), lon1 = Math.max(...b.ring.map((p) => p[0]));
  const lat0 = Math.min(...b.ring.map((p) => p[1])), lat1 = Math.max(...b.ring.map((p) => p[1]));
  const sx = (lon: number) => MPAD + ((lon - lon0) / (lon1 - lon0 || 1)) * (MW - 2 * MPAD);
  const sy = (lat: number) => MPAD + ((lat1 - lat) / (lat1 - lat0 || 1)) * (MH - 2 * MPAD);
  const ringPts = b.ring.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
  const roads = project.aoi === "khalifa"
    ? KHALIFA_GEOGRAPHY.majorRoads.map((pl) => pl.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" "))
    : [];
  const peers = projectsForAoi(project.aoi).filter((p) => p.id !== project.id);
  const px = sx(project.lon), py = sy(project.lat);

  // camera framing — window the viewBox around the selected marker (flyTo/goTo analogue), clamped in bounds
  const vw = MW * frame, vh = MH * frame;
  const vx = clamp(px - vw / 2, 0, MW - vw), vy = clamp(py - vh / 2, 0, MH - vh);
  const k = frame; // marker/label scale so prominence is consistent at any zoom
  const label = shortName(project, lang);
  // place the label above the marker, nudged inside the framed window
  const labelW = Math.min(52 * k, label.length * 2.1 * k + 8 * k);
  const lx = clamp(px, vx + labelW / 2 + 2, vx + vw - labelW / 2 - 2);
  const ly = py - 7 * k < vy + 8 * k ? py + 9 * k : py - 7 * k;

  return (
    <svg viewBox={`${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`} role="img"
      aria-label={`Location of ${project.nameEn} in ${b.nameEn}`}
      style={{ width: "100%", height: "100%", display: "block", background: "radial-gradient(120% 120% at 50% 20%, var(--bg-2), var(--bg-0))" }}>
      <defs>
        <clipPath id={`geo-clip-${compact ? "c" : "f"}`}><polygon points={ringPts} /></clipPath>
        <radialGradient id={`geo-focus-${compact ? "c" : "f"}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </radialGradient>
        <filter id={`geo-glow-${compact ? "c" : "f"}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={0.9 * k} result="bl" /><feMerge><feMergeNode in="bl" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <polygon points={ringPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.6 * k} />
      <g clipPath={`url(#geo-clip-${compact ? "c" : "f"})`}>
        <g stroke="var(--stroke)" strokeWidth={0.3 * k} fill="none" opacity={0.8}>{roads.map((d, i) => <polyline key={i} points={d} />)}</g>
        {/* other portfolio projects — visible but subordinate */}
        {peers.map((p) => <circle key={p.id} cx={sx(p.lon)} cy={sy(p.lat)} r={1.1 * k} fill="var(--text-2)" opacity={0.5} />)}
        <circle cx={px} cy={py} r={14 * k} fill={`url(#geo-focus-${compact ? "c" : "f"})`} />
      </g>
      {/* crosshair + prominent selected marker (unclipped so always fully visible) */}
      <line x1={px} y1={vy} x2={px} y2={vy + vh} stroke="var(--accent-2)" strokeWidth={0.22 * k} strokeDasharray={`${1.5 * k} ${1.5 * k}`} opacity={0.5} />
      <line x1={vx} y1={py} x2={vx + vw} y2={py} stroke="var(--accent-2)" strokeWidth={0.22 * k} strokeDasharray={`${1.5 * k} ${1.5 * k}`} opacity={0.5} />
      <g filter={`url(#geo-glow-${compact ? "c" : "f"})`}>
        <circle cx={px} cy={py} r={5.4 * k} fill="none" stroke="var(--accent-2)" strokeWidth={0.6 * k} opacity={0.9} />
        <circle cx={px} cy={py} r={3.2 * k} fill="var(--accent)" stroke="var(--text-0)" strokeWidth={0.8 * k} />
      </g>
      {/* short map label */}
      <g transform={`translate(${lx}, ${ly})`}>
        <rect x={-labelW / 2} y={-3.4 * k} width={labelW} height={6 * k} rx={1.2 * k} fill="rgba(7,12,22,0.9)" stroke="var(--accent-2)" strokeWidth={0.35 * k} />
        <text x={0} y={0.9 * k} textAnchor="middle" fill="var(--text-0)" fontSize={3 * k} fontWeight={700}>{label}</text>
      </g>
    </svg>
  );
}
