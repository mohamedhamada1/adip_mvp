import { useMemo } from "react";
import { projectsForAoi } from "../data/portfolio.demo";
import { computeKpis, formatAed, formatPeople } from "../data/kpis";
import { SECTORS, type AoiId, type ProjectStatus } from "../data/types";

const STATUSES: ProjectStatus[] = ["Completed", "Under Delivery", "Planned", "Concept"];
const DONUT_COLORS = ["var(--accent)", "var(--good)", "var(--accent-2)", "var(--warn)", "var(--text-1)", "var(--text-2)"];

/** KPI + charts dashboard for an AOI — Projects by Sector (donut) and Projects by Status (bar),
 *  all COMPUTED from the frozen synthetic portfolio (deterministic; no mockup figures). */
export function Dashboard({ aoi, onBack }: { aoi: AoiId; onBack: () => void }) {
  const projects = useMemo(() => projectsForAoi(aoi), [aoi]);
  const kpis = useMemo(() => computeKpis(projects), [projects]);
  const bySector = useMemo(() => SECTORS.map((s) => ({ s, n: projects.filter((p) => p.sector === s).length })).filter((x) => x.n > 0), [projects]);
  const byStatus = useMemo(() => STATUSES.map((s) => ({ s, n: projects.filter((p) => p.status === s).length })), [projects]);
  const total = projects.length || 1;
  const maxStatus = Math.max(1, ...byStatus.map((x) => x.n));
  const aoiName = aoi === "khalifa" ? "Khalifa City" : "Al Reem Island";

  // donut arcs
  let acc = 0;
  const arcs = bySector.map((d, i) => {
    const frac = d.n / total; const a0 = acc * 2 * Math.PI; acc += frac; const a1 = acc * 2 * Math.PI;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = 50 + 38 * Math.sin(a0), y0 = 50 - 38 * Math.cos(a0);
    const x1 = 50 + 38 * Math.sin(a1), y1 = 50 - 38 * Math.cos(a1);
    return { d, color: DONUT_COLORS[i % DONUT_COLORS.length], path: `M50,50 L${x0.toFixed(2)},${y0.toFixed(2)} A38,38 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`, pct: Math.round(frac * 100) };
  });

  const kpiCells = [
    { label: "Total Projects", value: String(kpis.totalProjects) },
    { label: "Total Investment", value: formatAed(kpis.totalInvestmentAed) },
    { label: "Under Delivery", value: String(kpis.underDelivery) },
    { label: "Planned", value: String(kpis.planned) },
    { label: "Population Served", value: formatPeople(kpis.populationServed) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: "var(--bg-0)", padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "var(--text-0)", margin: 0 }}>{aoiName} — Key Indicators</h2>
        <button type="button" onClick={onBack} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back</button>
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap" }}>
        {kpiCells.map((c) => (
          <div key={c.label} style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", padding: "var(--space-2) var(--space-3)", minWidth: "130px" }}>
            <div data-testid="dash-kpi" style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-0)" }}>{c.value}</div>
            <div style={{ fontSize: "11px", color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
          <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Projects by Sector</div>
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
            <svg viewBox="0 0 100 100" role="img" aria-label="Projects by sector" style={{ width: "140px", height: "140px" }}>
              {arcs.map((a) => <path key={a.d.s} d={a.path} fill={a.color} />)}
              <circle cx={50} cy={50} r={20} fill="var(--bg-1)" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {arcs.map((a) => (
                <span key={a.d.s} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-1)", fontSize: "12px" }}>
                  <span style={{ width: "10px", height: "10px", background: a.color, borderRadius: "2px" }} />{a.d.s}<span style={{ color: "var(--text-2)" }}>{a.pct}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
          <div style={{ color: "var(--text-1)", marginBottom: "var(--space-2)" }}>Projects by Status</div>
          <svg viewBox="0 0 200 120" role="img" aria-label="Projects by status" style={{ width: "100%", height: "160px" }}>
            {byStatus.map((d, i) => {
              const bw = 38, gap = 10, x = 10 + i * (bw + gap), h = (d.n / maxStatus) * 90;
              return (
                <g key={d.s}>
                  <rect x={x} y={100 - h} width={bw} height={h} rx={2} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  <text x={x + bw / 2} y={98 - h} textAnchor="middle" fill="var(--text-1)" fontSize={9}>{d.n}</text>
                  <text x={x + bw / 2} y={114} textAnchor="middle" fill="var(--text-2)" fontSize={6}>{d.s}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "11px" }}>
        Figures computed from the frozen synthetic demonstration portfolio (not official ADPIC records).
      </div>
    </div>
  );
}
