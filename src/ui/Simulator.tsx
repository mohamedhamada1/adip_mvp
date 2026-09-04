import { useMemo, useState } from "react";
import { simulateSchool, type SimulationResult } from "../simulation/simulationEngine";
import { POPULATION_ZONES, type Zone } from "../simulation/populationZones";
import { EXISTING_SCHOOLS, HYPOTHETICAL_SCHOOL_LABEL, type School } from "../simulation/scenario";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";
import { formatPeople } from "../data/kpis";

/**
 * Before/After liveability map on the REAL Khalifa City geography (AD-SDI district polygon + major roads,
 * OFFICIAL_PUBLIC). The deterministic engine computes on a normalized grid (numbers unchanged); this panel
 * only PROJECTS those grid positions into the real district extent so impact reads on recognizable urban
 * context — district outline, road skeleton, facilities, proposed school, service-area catchments, and
 * covered / underserved / newly-covered communities.
 */
const RING = KHALIFA_GEOGRAPHY.districtRing;
const LON0 = Math.min(...RING.map((p) => p[0])), LON1 = Math.max(...RING.map((p) => p[0]));
const LAT0 = Math.min(...RING.map((p) => p[1])), LAT1 = Math.max(...RING.map((p) => p[1]));
const VW = 100, VH = 100, PAD = 4;
const lon2sx = (lon: number) => PAD + ((lon - LON0) / (LON1 - LON0)) * (VW - 2 * PAD);
const lat2sy = (lat: number) => PAD + ((LAT1 - lat) / (LAT1 - LAT0)) * (VH - 2 * PAD);
// engine grid (0..100) → real lon/lat within the district extent → SVG (render-only mapping).
const gx2sx = (x: number) => lon2sx(LON0 + (x / 100) * (LON1 - LON0));
const gy2sy = (y: number) => lat2sy(LAT1 - (y / 100) * (LAT1 - LAT0));
const ringPts = RING.map((p) => `${lon2sx(p[0]).toFixed(1)},${lat2sy(p[1]).toFixed(1)}`).join(" ");
const roadPaths = KHALIFA_GEOGRAPHY.majorRoads.map((pl) =>
  pl.map((p) => `${lon2sx(p[0]).toFixed(1)},${lat2sy(p[1]).toFixed(1)}`).join(" ")
);

function MapPanel({ result, showProposed }: { result: SimulationResult; showProposed: boolean }) {
  const covered = new Set((showProposed ? result.after : result.before).coveredZoneIds);
  const newly = new Set(result.newlyCovered.map((z) => z.id));
  const schools: School[] = showProposed ? [...EXISTING_SCHOOLS, result.proposed] : EXISTING_SCHOOLS;
  const rSvg = (result.serviceRadius / 100) * (VW - 2 * PAD);
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={showProposed ? "With proposed school" : "Current state"}
      style={{ width: "100%", height: "320px", background: "var(--bg-2)", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)" }}>
      <defs>
        <clipPath id={`kh-${showProposed ? "a" : "b"}`}><polygon points={ringPts} /></clipPath>
      </defs>
      {/* district land */}
      <polygon points={ringPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.7} />
      {/* real road skeleton (clipped to the district) */}
      <g clipPath={`url(#kh-${showProposed ? "a" : "b"})`} stroke="var(--stroke)" strokeWidth={0.3} fill="none" opacity={0.9}>
        {roadPaths.map((d, i) => <polyline key={i} points={d} />)}
      </g>
      {/* service-area catchments */}
      {schools.map((s) => (
        <circle key={`sa-${s.id}`} cx={gx2sx(s.x)} cy={gy2sy(s.y)} r={rSvg} fill="var(--accent-soft)"
          stroke={s.kind === "proposed" ? "var(--accent-2)" : "var(--accent)"} strokeWidth={0.4} opacity={s.kind === "proposed" ? 0.95 : 0.5} clipPath={`url(#kh-${showProposed ? "a" : "b"})`} />
      ))}
      {/* population communities: covered (green) / underserved (amber) / newly covered (bright ring) */}
      {POPULATION_ZONES.map((z: Zone) => {
        const isNew = showProposed && newly.has(z.id);
        return (
          <g key={z.id}>
            {isNew && <circle cx={gx2sx(z.x)} cy={gy2sy(z.y)} r={Math.sqrt(z.population) / 26 + 1.4} fill="none" stroke="var(--accent-2)" strokeWidth={0.8} />}
            <circle cx={gx2sx(z.x)} cy={gy2sy(z.y)} r={Math.sqrt(z.population) / 30}
              fill={covered.has(z.id) ? "var(--good)" : "var(--warn)"} opacity={0.92} />
          </g>
        );
      })}
      {/* facilities: existing (light) + proposed school (accent, larger) */}
      {schools.map((s) => (
        <rect key={s.id} x={gx2sx(s.x) - (s.kind === "proposed" ? 2.4 : 1.5)} y={gy2sy(s.y) - (s.kind === "proposed" ? 2.4 : 1.5)}
          width={s.kind === "proposed" ? 4.8 : 3} height={s.kind === "proposed" ? 4.8 : 3} rx={0.6}
          fill={s.kind === "proposed" ? "var(--accent-2)" : "var(--text-0)"} stroke="var(--bg-0)" strokeWidth={0.5} />
      ))}
      <text x={4} y={7} fill="var(--text-1)" fontSize={3.6}>Khalifa City · Abu Dhabi</text>
      <text x={94} y={8} fill="var(--text-2)" fontSize={4.5}>N↑</text>
    </svg>
  );
}

function Legend() {
  const items = [
    { c: "var(--good)", t: "Covered community" },
    { c: "var(--warn)", t: "Underserved" },
    { c: "var(--accent-2)", t: "Newly covered / proposed" },
  ];
  return (
    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "12px" }}>
      {items.map((i) => (
        <span key={i.t} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: i.c, display: "inline-block" }} />{i.t}
        </span>
      ))}
      <span>· service catchment = derived walkable area (approx.)</span>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span data-testid="sim-kpi" style={{ fontSize: "var(--kpi-size)", fontWeight: 800, color: "var(--text-0)" }}>{value}</span>
      <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{label}</span>
    </div>
  );
}

export function Simulator({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<"current" | "after">("current");
  const result = useMemo(() => simulateSchool(), []);
  const popDelta = result.after.populationInServiceArea - result.before.populationInServiceArea;
  const covDelta = Math.round((result.after.coveragePct - result.before.coveragePct) * 10) / 10;
  const underservedDelta = result.before.underservedPopulation - result.after.underservedPopulation;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: "var(--bg-0)", padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "var(--text-2)", fontSize: "13px" }}>Liveability Impact Simulation — Khalifa City</div>
          <h2 style={{ margin: "4px 0", color: "var(--text-0)" }}>What changes if this school is delivered?</h2>
          <div data-testid="hypothetical-label" style={{ color: "var(--warn)", fontSize: "13px" }}>{HYPOTHETICAL_SCHOOL_LABEL}</div>
        </div>
        <button type="button" onClick={onBack} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back to Explore</button>
      </div>

      {phase === "current" && (
        <div style={{ marginTop: "var(--space-3)" }}>
          <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Current coverage on the Khalifa City road network — existing schools and their catchments; underserved communities in amber.</div>
          <div style={{ maxWidth: "640px" }}><MapPanel result={result} showProposed={false} /><Legend /></div>
          <button type="button" onClick={() => setPhase("after")} style={{ marginTop: "var(--space-3)", padding: "12px 24px", borderRadius: "999px", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 600, cursor: "pointer" }}>
            Simulate the proposed school →
          </button>
        </div>
      )}

      {phase === "after" && (
        <div style={{ marginTop: "var(--space-3)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div>
              <div style={{ color: "var(--text-2)", fontSize: "13px", marginBottom: "6px" }}>Before (Current State)</div>
              <MapPanel result={result} showProposed={false} />
            </div>
            <div>
              <div style={{ color: "var(--accent-2)", fontSize: "13px", marginBottom: "6px" }}>After (With Proposed School)</div>
              <MapPanel result={result} showProposed />
            </div>
          </div>
          <Legend />
          <div data-testid="kpi-deltas" style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
            <Kpi label="Added within service area" value={`+${formatPeople(popDelta)}`} />
            <Kpi label="Coverage change" value={`+${covDelta}%`} />
            <Kpi label="Underserved reduced" value={`-${formatPeople(underservedDelta)}`} />
            <Kpi label="Avg access distance" value={`${result.before.averageAccessDistance} → ${result.after.averageAccessDistance}`} />
            <Kpi label="Liveability Impact Score" value={`+${result.liveabilityImpactScore}`} />
          </div>
          <div data-testid="newly-covered" style={{ marginTop: "var(--space-3)", color: "var(--text-1)", fontSize: "13px" }}>
            Newly covered communities: {result.newlyCovered.map((z) => z.name).join(", ") || "—"}
          </div>
          <div data-testid="sim-explanation" style={{ marginTop: "var(--space-3)", padding: "var(--space-2)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-1)", color: "var(--text-1)", lineHeight: 1.5 }}>
            On the Khalifa City map, the hypothetical school extends walkable catchment into previously
            underserved communities, adding population within the service area and reducing average access
            distance. Figures are computed from the deterministic simulation model (approved real context; the
            school is hypothetical, not an approved project).
          </div>
        </div>
      )}
    </div>
  );
}
