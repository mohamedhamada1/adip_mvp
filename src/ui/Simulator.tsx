import { useMemo, useState } from "react";
import { simulateSchool, type SimulationResult } from "../simulation/simulationEngine";
import { POPULATION_ZONES, type Zone } from "../simulation/populationZones";
import { EXISTING_SCHOOLS, HYPOTHETICAL_SCHOOL_LABEL, type School } from "../simulation/scenario";
import { formatPeople } from "../data/kpis";

type Phase = "current" | "after";

/** SVG before/after map: zones colored by coverage, schools as markers, service-area rings. */
function MapPanel({ result, showProposed }: { result: SimulationResult; showProposed: boolean }) {
  const covered = new Set((showProposed ? result.after : result.before).coveredZoneIds);
  const schools: School[] = showProposed ? [...EXISTING_SCHOOLS, result.proposed] : EXISTING_SCHOOLS;
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={showProposed ? "With proposed school" : "Current state"} style={{ width: "100%", height: "260px", background: "var(--bg-2)", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)" }}>
      {schools.map((s) => (
        <circle key={`sa-${s.id}`} cx={s.x} cy={s.y} r={result.serviceRadius} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={0.4} opacity={s.kind === "proposed" ? 0.9 : 0.5} />
      ))}
      {POPULATION_ZONES.map((z: Zone) => (
        <circle key={z.id} cx={z.x} cy={z.y} r={Math.sqrt(z.population) / 30} fill={covered.has(z.id) ? "var(--good)" : "var(--warn)"} opacity={0.85} />
      ))}
      {schools.map((s) => (
        <rect key={s.id} x={s.x - 1.6} y={s.y - 1.6} width={3.2} height={3.2} rx={0.6}
          fill={s.kind === "proposed" ? "var(--accent-2)" : "var(--text-0)"} stroke="var(--bg-0)" strokeWidth={0.4} />
      ))}
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
 * HYPOTHETICAL school scenario. Sequence (AC-4): current → Simulate → intervention + changed coverage →
 * KPI change → explanation. All values come from the engine result (no hard-coded figures).
 */
export function Simulator({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("current");
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
          <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Current state — coverage from existing schools. Underserved sectors are highlighted.</div>
          <div style={{ maxWidth: "560px" }}><MapPanel result={result} showProposed={false} /></div>
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
            The hypothetical school extends walkable catchment into previously underserved sectors, adding
            population within the service area and reducing average access distance. Figures are computed from
            the deterministic simulation model (approved real context; the school is hypothetical, not an approved project).
          </div>
        </div>
      )}
    </div>
  );
}
