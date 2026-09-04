import { useMemo, useState } from "react";
import { simulateSchool, type SimulationResult } from "../simulation/simulationEngine";
import { POPULATION_ZONES, type Zone } from "../simulation/populationZones";
import { EXISTING_SCHOOLS, HYPOTHETICAL_SCHOOL_LABEL, type School } from "../simulation/scenario";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { formatPeople } from "../data/kpis";

/**
 * Geographic before/after map for the Khalifa City scenario. The deterministic engine computes on a
 * normalized grid (numbers unchanged); this panel PROJECTS those grid positions into the REAL Khalifa AOI
 * extent (from AD-SDI boundary, provenance OFFICIAL/PUBLIC) and draws the boundary, existing facilities,
 * the proposed school, and service-area catchment coverage — so impact reads spatially on the actual
 * Khalifa map context rather than as abstract circles.
 */
const KH = AOI_BOUNDARIES.khalifa;
const LON0 = Math.min(...KH.ring.map((p) => p[0]));
const LON1 = Math.max(...KH.ring.map((p) => p[0]));
const LAT0 = Math.min(...KH.ring.map((p) => p[1]));
const LAT1 = Math.max(...KH.ring.map((p) => p[1]));
const VW = 100, VH = 100;
// grid(0..100) → real lon/lat within the Khalifa extent → SVG viewport (lat inverted for screen).
const gx2lon = (x: number) => LON0 + (x / 100) * (LON1 - LON0);
const gy2lat = (y: number) => LAT1 - (y / 100) * (LAT1 - LAT0);
const lon2sx = (lon: number) => ((lon - LON0) / (LON1 - LON0)) * VW;
const lat2sy = (lat: number) => ((LAT1 - lat) / (LAT1 - LAT0)) * VH;
const gx2sx = (x: number) => lon2sx(gx2lon(x));
const gy2sy = (y: number) => lat2sy(gy2lat(y));

function MapPanel({ result, showProposed }: { result: SimulationResult; showProposed: boolean }) {
  const covered = new Set((showProposed ? result.after : result.before).coveredZoneIds);
  const schools: School[] = showProposed ? [...EXISTING_SCHOOLS, result.proposed] : EXISTING_SCHOOLS;
  const rSvg = (result.serviceRadius / 100) * VW; // service radius in SVG units
  const boundaryPts = KH.ring.map((p) => `${lon2sx(p[0]).toFixed(1)},${lat2sy(p[1]).toFixed(1)}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={showProposed ? "With proposed school" : "Current state"}
      style={{ width: "100%", height: "300px", background: "var(--bg-2)", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)" }}>
      {/* Khalifa AOI extent (real geography) */}
      <polygon points={boundaryPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.6} />
      {/* service-area catchments */}
      {schools.map((s) => (
        <circle key={`sa-${s.id}`} cx={gx2sx(s.x)} cy={gy2sy(s.y)} r={rSvg}
          fill={s.kind === "proposed" ? "var(--accent-soft)" : "var(--accent-soft)"} stroke={s.kind === "proposed" ? "var(--accent-2)" : "var(--accent)"} strokeWidth={0.4} opacity={s.kind === "proposed" ? 0.95 : 0.5} />
      ))}
      {/* population zones — covered (green) vs underserved (amber) */}
      {POPULATION_ZONES.map((z: Zone) => (
        <circle key={z.id} cx={gx2sx(z.x)} cy={gy2sy(z.y)} r={Math.sqrt(z.population) / 30}
          fill={covered.has(z.id) ? "var(--good)" : "var(--warn)"} opacity={0.9} />
      ))}
      {/* facilities: existing (light squares) + proposed school (accent, larger) */}
      {schools.map((s) => (
        <g key={s.id}>
          <rect x={gx2sx(s.x) - (s.kind === "proposed" ? 2.4 : 1.6)} y={gy2sy(s.y) - (s.kind === "proposed" ? 2.4 : 1.6)}
            width={s.kind === "proposed" ? 4.8 : 3.2} height={s.kind === "proposed" ? 4.8 : 3.2} rx={0.7}
            fill={s.kind === "proposed" ? "var(--accent-2)" : "var(--text-0)"} stroke="var(--bg-0)" strokeWidth={0.5} />
        </g>
      ))}
      {/* map furniture: label + north arrow */}
      <text x={3} y={7} fill="var(--text-2)" fontSize={4}>Khalifa City · Abu Dhabi</text>
      <text x={94} y={8} fill="var(--text-2)" fontSize={5}>N↑</text>
    </svg>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span data-testid="sim-kpi" style={{ fontSize: "var(--kpi-size)", fontWeight: 700, color: "var(--text-0)" }}>{value}</span>
      <span style={{ fontSize: "12px", color: "var(--text-2)" }}>{label}</span>
    </div>
  );
}

/**
 * Liveability Impact Simulator. Deterministic precomputed Current vs With-Proposed-School for the
 * HYPOTHETICAL school. Sequence (AC-4): current → Simulate → intervention + changed coverage → KPI change →
 * explanation. All values come from the engine (no hard-coded figures); rendered on real Khalifa geography.
 */
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
          <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Current state on the Khalifa City map — coverage from existing schools; underserved sectors in amber.</div>
          <div style={{ maxWidth: "620px" }}><MapPanel result={result} showProposed={false} /></div>
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
            underserved sectors, adding population within the service area and reducing average access distance.
            Figures are computed from the deterministic simulation model (approved real context; the school is
            hypothetical, not an approved project).
          </div>
        </div>
      )}
    </div>
  );
}
