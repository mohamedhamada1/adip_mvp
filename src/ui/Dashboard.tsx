import { useMemo } from "react";
import { projectsForAoi } from "../data/portfolio.demo";
import { computeKpis, formatAed, formatPeople } from "../data/kpis";
import { SECTORS, type AoiId, type ProjectStatus, type Sector } from "../data/types";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";

const STATUSES: ProjectStatus[] = ["Completed", "Under Delivery", "Planned", "Concept"];
const SECTOR_COLOR: Record<Sector, string> = {
  Mobility: "var(--accent)", Education: "var(--good)", Health: "var(--accent-2)",
  "Public Realm": "var(--warn)", "Community Facilities": "var(--text-1)", Utilities: "var(--text-2)",
};

// --- portfolio geography (AOI ring bbox → SVG); markers coloured by sector ---
const GW = 200, GH = 150, GPAD = 8;

function PortfolioMap({ aoi }: { aoi: AoiId }) {
  const b = AOI_BOUNDARIES[aoi];
  const lon0 = Math.min(...b.ring.map((p) => p[0])), lon1 = Math.max(...b.ring.map((p) => p[0]));
  const lat0 = Math.min(...b.ring.map((p) => p[1])), lat1 = Math.max(...b.ring.map((p) => p[1]));
  const sx = (lon: number) => GPAD + ((lon - lon0) / (lon1 - lon0 || 1)) * (GW - 2 * GPAD);
  const sy = (lat: number) => GPAD + ((lat1 - lat) / (lat1 - lat0 || 1)) * (GH - 2 * GPAD);
  const ringPts = b.ring.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
  const roads = aoi === "khalifa" ? KHALIFA_GEOGRAPHY.majorRoads.map((pl) => pl.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ")) : [];
  const projects = projectsForAoi(aoi);
  return (
    <svg viewBox={`0 0 ${GW} ${GH}`} role="img" aria-label={`${b.nameEn} portfolio map`} style={{ width: "100%", height: "100%", display: "block", background: "radial-gradient(120% 120% at 50% 20%, var(--bg-2), var(--bg-0))", borderRadius: "var(--radius-2)" }}>
      <defs><clipPath id="db-clip"><polygon points={ringPts} /></clipPath></defs>
      <polygon points={ringPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.6} />
      <g clipPath="url(#db-clip)">
        <g stroke="var(--stroke)" strokeWidth={0.3} fill="none" opacity={0.8}>{roads.map((d, i) => <polyline key={i} points={d} />)}</g>
        {projects.map((p) => <circle key={p.id} cx={sx(p.lon)} cy={sy(p.lat)} r={2} fill={SECTOR_COLOR[p.sector]} opacity={0.9} />)}
      </g>
      <text x={5} y={9} fill="var(--text-1)" fontSize={4.2}>{b.nameEn} · Abu Dhabi</text>
    </svg>
  );
}

/** Executive Portfolio Overview for an AOI — headline KPIs + geographic context + supporting charts.
 *  All figures COMPUTED from the frozen synthetic portfolio (deterministic; no mockup numbers). */
export function Dashboard({ aoi, onBack }: { aoi: AoiId; onBack: () => void }) {
  const projects = useMemo(() => projectsForAoi(aoi), [aoi]);
  const kpis = useMemo(() => computeKpis(projects), [projects]);
  const bySector = useMemo(() => SECTORS.map((s) => ({ s, n: projects.filter((p) => p.sector === s).length })).filter((x) => x.n > 0), [projects]);
  const byStatus = useMemo(() => STATUSES.map((s) => ({ s, n: projects.filter((p) => p.status === s).length })), [projects]);
  const total = projects.length || 1;
  const maxStatus = Math.max(1, ...byStatus.map((x) => x.n));
  const aoiName = aoi === "khalifa" ? "Khalifa City" : "Al Reem Island";

  let acc = 0;
  const arcs = bySector.map((d) => {
    const frac = d.n / total; const a0 = acc * 2 * Math.PI; acc += frac; const a1 = acc * 2 * Math.PI;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = 50 + 40 * Math.sin(a0), y0 = 50 - 40 * Math.cos(a0);
    const x1 = 50 + 40 * Math.sin(a1), y1 = 50 - 40 * Math.cos(a1);
    return { d, color: SECTOR_COLOR[d.s], path: `M50,50 L${x0.toFixed(2)},${y0.toFixed(2)} A40,40 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`, pct: Math.round(frac * 100) };
  });

  // headline KPIs — investment is the hero
  const hero = { label: "Total Investment", value: formatAed(kpis.totalInvestmentAed) };
  const kpiCells = [
    { label: "Total Projects", value: String(kpis.totalProjects) },
    { label: "Population Served", value: formatPeople(kpis.populationServed) },
    { label: "Under Delivery", value: String(kpis.underDelivery) },
    { label: "Planned", value: String(kpis.planned) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-0)", padding: "var(--space-3) var(--space-4)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.08em" }}>PORTFOLIO OVERVIEW</div>
          <h1 style={{ color: "var(--text-0)", margin: "4px 0", fontSize: "clamp(22px, 2.4vw, 34px)", fontWeight: 800 }}>{aoiName} — Capital Portfolio</h1>
        </div>
        <button type="button" onClick={onBack} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back</button>
      </div>

      {/* headline KPI band */}
      <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)", alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", background: "linear-gradient(160deg, var(--accent-soft), var(--bg-1))", border: "1px solid var(--accent)", borderRadius: "var(--radius-2)", padding: "var(--space-3) var(--space-4)" }}>
          <div data-testid="dash-kpi" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, color: "var(--text-0)", lineHeight: 1 }}>{hero.value}</div>
          <div style={{ fontSize: "12px", color: "var(--text-1)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "6px" }}>{hero.label}</div>
        </div>
        {kpiCells.map((c) => (
          <div key={c.label} style={{ flex: "1 1 150px", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div data-testid="dash-kpi" style={{ fontSize: "clamp(28px, 2.6vw, 40px)", fontWeight: 800, color: "var(--text-0)", lineHeight: 1 }}>{c.value}</div>
            <div style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "6px" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* geographic context (hero) + supporting charts */}
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
        <div style={{ position: "relative", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-2)", minHeight: 0 }}>
          <PortfolioMap aoi={aoi} />
          <div style={{ position: "absolute", left: "var(--space-3)", bottom: "var(--space-3)", display: "flex", gap: "10px", flexWrap: "wrap", background: "rgba(7,12,22,0.6)", padding: "6px 10px", borderRadius: "var(--radius-1)" }}>
            {bySector.map((d) => (
              <span key={d.s} style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-1)", fontSize: "11px" }}>
                <span style={{ width: "9px", height: "9px", background: SECTOR_COLOR[d.s], borderRadius: "2px" }} />{d.s}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minHeight: 0 }}>
          <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
            <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)", fontSize: "13px", fontWeight: 600 }}>Projects by Sector</div>
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
              <svg viewBox="0 0 100 100" role="img" aria-label="Projects by sector" style={{ width: "110px", height: "110px", flex: "0 0 auto" }}>
                {arcs.map((a) => <path key={a.d.s} d={a.path} fill={a.color} />)}
                <circle cx={50} cy={50} r={22} fill="var(--bg-1)" />
                <text x={50} y={48} textAnchor="middle" fill="var(--text-0)" fontSize={14} fontWeight={800}>{kpis.totalProjects}</text>
                <text x={50} y={58} textAnchor="middle" fill="var(--text-2)" fontSize={6}>projects</text>
              </svg>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {arcs.map((a) => (
                  <span key={a.d.s} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-1)", fontSize: "12px" }}>
                    <span style={{ width: "9px", height: "9px", background: a.color, borderRadius: "2px" }} />{a.d.s}<span style={{ color: "var(--text-2)" }}>{a.pct}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", flex: 1, minHeight: 0 }}>
            <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)", fontSize: "13px", fontWeight: 600 }}>Projects by Status</div>
            <svg viewBox="0 0 200 110" role="img" aria-label="Projects by status" style={{ width: "100%", height: "calc(100% - 28px)" }}>
              {byStatus.map((d, i) => {
                const bw = 38, gap = 12, x = 12 + i * (bw + gap), h = (d.n / maxStatus) * 78;
                const color = [SECTOR_COLOR.Education, SECTOR_COLOR.Mobility, SECTOR_COLOR.Health, SECTOR_COLOR.Utilities][i];
                return (
                  <g key={d.s}>
                    <rect x={x} y={92 - h} width={bw} height={h} rx={3} fill={color} />
                    <text x={x + bw / 2} y={90 - h} textAnchor="middle" fill="var(--text-0)" fontSize={9} fontWeight={700}>{d.n}</text>
                    <text x={x + bw / 2} y={104} textAnchor="middle" fill="var(--text-2)" fontSize={6}>{d.s}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "11px" }}>
        Figures computed from the frozen synthetic demonstration portfolio (Synthetic / Demo — not official ADPIC records).
      </div>
    </div>
  );
}
