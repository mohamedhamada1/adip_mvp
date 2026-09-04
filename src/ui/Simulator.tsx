import { useEffect, useMemo, useRef, useState } from "react";
import { simulateSchool, type SimulationResult, type SimMetrics } from "../simulation/simulationEngine";
import { POPULATION_ZONES, type Zone } from "../simulation/populationZones";
import { EXISTING_SCHOOLS, HYPOTHETICAL_SCHOOL_LABEL, type School } from "../simulation/scenario";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";
import { formatPeople } from "../data/kpis";

type Phase = "current" | "proposed";

// --- projection: engine grid (0..100) → real Khalifa lon/lat → SVG viewport ---
const RING = KHALIFA_GEOGRAPHY.districtRing;
const LON0 = Math.min(...RING.map((p) => p[0])), LON1 = Math.max(...RING.map((p) => p[0]));
const LAT0 = Math.min(...RING.map((p) => p[1])), LAT1 = Math.max(...RING.map((p) => p[1]));
const W = 200, H = 112, PAD = 6;
const lon2sx = (lon: number) => PAD + ((lon - LON0) / (LON1 - LON0)) * (W - 2 * PAD);
const lat2sy = (lat: number) => PAD + ((LAT1 - lat) / (LAT1 - LAT0)) * (H - 2 * PAD);
const gx2sx = (x: number) => lon2sx(LON0 + (x / 100) * (LON1 - LON0));
const gy2sy = (y: number) => lat2sy(LAT1 - (y / 100) * (LAT1 - LAT0));
const ringPts = RING.map((p) => `${lon2sx(p[0]).toFixed(1)},${lat2sy(p[1]).toFixed(1)}`).join(" ");
const roadPaths = KHALIFA_GEOGRAPHY.majorRoads.map((pl) => pl.map((p) => `${lon2sx(p[0]).toFixed(1)},${lat2sy(p[1]).toFixed(1)}`).join(" "));

/** count-up tween toward a target (presentation only; deterministic end value). */
function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now(), a = from.current, b = target;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      setV(a + (b - a) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function BigMap({ result, phase }: { result: SimulationResult; phase: Phase }) {
  const proposed = phase === "proposed";
  const covered = new Set((proposed ? result.after : result.before).coveredZoneIds);
  const newly = new Set(result.newlyCovered.map((z) => z.id));
  const rSvg = (result.serviceRadius / 100) * (W - 2 * PAD);
  const schools: School[] = EXISTING_SCHOOLS;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={proposed ? "With proposed school" : "Current state"}
      style={{ width: "100%", height: "100%", display: "block", borderRadius: "var(--radius-2)", background: "radial-gradient(120% 120% at 50% 30%, var(--bg-2), var(--bg-1))" }}>
      <defs>
        <clipPath id="khclip"><polygon points={ringPts} /></clipPath>
        <radialGradient id="catch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </radialGradient>
        <radialGradient id="catchNew" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--good)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--good)" stopOpacity="0.03" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <polygon points={ringPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.5} />
      <g clipPath="url(#khclip)">
        <g stroke="var(--stroke)" strokeWidth={0.28} fill="none" opacity={0.85}>{roadPaths.map((d, i) => <polyline key={i} points={d} />)}</g>
        {/* existing catchments */}
        {schools.map((s) => <circle key={`c-${s.id}`} cx={gx2sx(s.x)} cy={gy2sy(s.y)} r={rSvg} fill="url(#catch)" />)}
        {/* proposed catchment — one controlled reveal; dashed ring reads clearly as "the new catchment" */}
        <circle cx={gx2sx(result.proposed.x)} cy={gy2sy(result.proposed.y)} r={proposed ? rSvg : 0} fill="url(#catchNew)" style={{ transition: "r 0.8s ease" }} />
        <circle cx={gx2sx(result.proposed.x)} cy={gy2sy(result.proposed.y)} r={proposed ? rSvg : 0} fill="none" stroke="var(--good)" strokeWidth={0.6} strokeDasharray="2.4 1.6" strokeOpacity={proposed ? 0.9 : 0} style={{ transition: "r 0.8s ease, stroke-opacity 0.8s" }} />
        {/* communities */}
        {POPULATION_ZONES.map((z: Zone) => {
          const isNew = proposed && newly.has(z.id);
          const r = Math.max(1.4, Math.sqrt(z.population) / 22);
          return (
            <g key={z.id}>
              {isNew && <circle cx={gx2sx(z.x)} cy={gy2sy(z.y)} r={r + 2} fill="none" stroke="var(--good)" strokeWidth={0.9} style={{ transition: "stroke 0.6s" }} />}
              <circle cx={gx2sx(z.x)} cy={gy2sy(z.y)} r={r} fill={covered.has(z.id) ? "var(--good)" : "var(--warn)"} style={{ transition: "fill 0.6s ease" }} />
            </g>
          );
        })}
        {/* existing schools */}
        {schools.map((s) => <rect key={s.id} x={gx2sx(s.x) - 1.6} y={gy2sy(s.y) - 1.6} width={3.2} height={3.2} rx={0.6} fill="var(--text-0)" stroke="var(--bg-0)" strokeWidth={0.5} />)}
        {/* proposed school marker — glows in (clipped to the district like the rest of the map) */}
        <g style={{ transition: "opacity 0.6s", opacity: proposed ? 1 : 0 }} filter="url(#glow)">
          <rect x={gx2sx(result.proposed.x) - 2.6} y={gy2sy(result.proposed.y) - 2.6} width={5.2} height={5.2} rx={0.9} fill="var(--accent-2)" stroke="var(--text-0)" strokeWidth={0.6} />
        </g>
      </g>
      {/* proposed-school label — OUTSIDE the district clip so the callout is never cut off */}
      <g style={{ transition: "opacity 0.6s", opacity: proposed ? 1 : 0 }} transform={`translate(${gx2sx(result.proposed.x) + 4}, ${gy2sy(result.proposed.y) - 3.2})`}>
        <rect x={0} y={0} width={44} height={6.8} rx={1.2} fill="rgba(7,12,22,0.92)" stroke="var(--accent-2)" strokeWidth={0.4} />
        <rect x={1.8} y={2.3} width={2.2} height={2.2} rx={0.4} fill="var(--accent-2)" />
        <text x={5.6} y={4.7} fill="var(--text-0)" fontSize={3.4} fontWeight={700}>Proposed School</text>
      </g>
      <text x={5} y={9} fill="var(--text-1)" fontSize={4}>Khalifa City · Abu Dhabi</text>
      <text x={W - 8} y={10} fill="var(--text-2)" fontSize={5}>N↑</text>
    </svg>
  );
}

function BigKpi({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span data-testid="sim-kpi" style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 800, color: "var(--text-0)", lineHeight: 1 }}>{value}</span>
        {delta && <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--good)" }}>{delta}</span>}
      </span>
      <span style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
    </div>
  );
}

export function Simulator({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<Phase>("current");
  const result = useMemo(() => simulateSchool(), []);
  const proposed = phase === "proposed";
  const m: SimMetrics = proposed ? result.after : result.before;
  // animated headline metrics
  const pop = useCountUp(m.populationInServiceArea);
  const cov = useCountUp(m.coveragePct);
  const under = useCountUp(m.underservedPopulation);
  const access = useCountUp(m.averageAccessDistance);
  const popDelta = result.after.populationInServiceArea - result.before.populationInServiceArea;
  const covDelta = Math.round((result.after.coveragePct - result.before.coveragePct) * 10) / 10;
  const underDelta = result.before.underservedPopulation - result.after.underservedPopulation;
  // real access-distance reduction from the deterministic model (not invented)
  const accessDelta = Math.round((result.before.averageAccessDistance - result.after.averageAccessDistance) * 10) / 10;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-0)", padding: "var(--space-3) var(--space-4)", overflow: "hidden" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "13px", letterSpacing: "0.08em" }}>LIVEABILITY IMPACT SIMULATION · KHALIFA CITY</div>
          <h1 style={{ margin: "4px 0", color: "var(--text-0)", fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800 }}>What changes if we build the school here?</h1>
          <div data-testid="hypothetical-label" style={{ color: "var(--warn)", fontSize: "13px" }}>{HYPOTHETICAL_SCHOOL_LABEL}</div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          {/* segmented Current ⟷ Proposed toggle (the controlled reveal) */}
          <div role="tablist" aria-label="Scenario" style={{ display: "flex", border: "1px solid var(--stroke)", borderRadius: "999px", overflow: "hidden" }}>
            <button role="tab" aria-selected={!proposed} onClick={() => setPhase("current")} style={{ padding: "10px 18px", border: "none", background: !proposed ? "var(--accent)" : "transparent", color: !proposed ? "var(--text-0)" : "var(--text-2)", cursor: "pointer", fontWeight: 700 }}>Current</button>
            <button role="tab" aria-selected={proposed} onClick={() => setPhase("proposed")} style={{ padding: "10px 18px", border: "none", background: proposed ? "var(--good)" : "transparent", color: proposed ? "var(--bg-0)" : "var(--text-2)", cursor: "pointer", fontWeight: 700 }}>With Proposed School</button>
          </div>
          <button type="button" onClick={onBack} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back</button>
        </div>
      </div>

      {/* hero map (dominant surface) */}
      <div style={{ flex: 1, minHeight: 0, marginTop: "var(--space-2)", position: "relative" }}>
        <BigMap result={result} phase={phase} />
        {/* legend overlay */}
        <div style={{ position: "absolute", left: "var(--space-2)", bottom: "var(--space-2)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap", color: "var(--text-1)", fontSize: "12px", background: "rgba(7,12,22,0.6)", padding: "8px 12px", borderRadius: "var(--radius-1)" }}>
          <span><span style={{ color: "var(--good)" }}>●</span> Covered community</span>
          <span><span style={{ color: "var(--warn)" }}>●</span> Underserved community</span>
          <span><span style={{ color: "var(--accent-2)" }}>◼</span> Proposed school</span>
          <span><span style={{ color: "var(--good)" }}>◌</span> Proposed catchment (translucent walkable area)</span>
        </div>
        <button type="button" onClick={() => setPhase(proposed ? "current" : "proposed")}
          style={{ position: "absolute", right: "var(--space-2)", bottom: "var(--space-2)", padding: "12px 24px", borderRadius: "999px", border: "none", background: proposed ? "var(--bg-2)" : "var(--good)", color: proposed ? "var(--text-1)" : "var(--bg-0)", fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 24px var(--shadow)" }}>
          {proposed ? "↺ Reset" : "Simulate the proposed school →"}
        </button>
      </div>

      {/* impact KPI band */}
      <div data-testid="kpi-deltas" style={{ display: "flex", gap: "clamp(16px, 3vw, 48px)", alignItems: "flex-end", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
        <BigKpi label="Population within service area" value={formatPeople(Math.round(pop))} delta={proposed ? `+${formatPeople(popDelta)}` : undefined} />
        <BigKpi label="Coverage" value={`${Math.round(cov)}%`} delta={proposed ? `+${covDelta}%` : undefined} />
        <BigKpi label="Underserved population" value={formatPeople(Math.round(under))} delta={proposed ? `−${formatPeople(underDelta)}` : undefined} />
        <BigKpi label="Avg access distance" value={`${(Math.round(access * 10) / 10).toFixed(1)}`} delta={proposed && accessDelta > 0 ? `−${accessDelta.toFixed(1)}` : undefined} />
        <BigKpi label="Liveability Impact Score" value={proposed ? `+${result.liveabilityImpactScore}` : "—"} />
      </div>
      <div data-testid="newly-covered" style={{ marginTop: "8px", color: "var(--text-1)", fontSize: "13px" }}>
        {proposed ? <>Newly covered communities: {result.newlyCovered.map((z) => z.name).join(", ") || "—"}</> : <>Amber communities are outside walkable catchment of an existing school.</>}
      </div>
      <div data-testid="sim-explanation" style={{ marginTop: "6px", color: "var(--text-2)", fontSize: "12px" }}>
        Figures computed from the deterministic simulation model on the real Khalifa City road network — approved real context; the school is hypothetical, not an approved project.
      </div>
    </div>
  );
}
