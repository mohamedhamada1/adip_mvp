import type { ProjectRecord } from "../data/types";
import { formatAed, formatPeople } from "../data/kpis";
import { PROVENANCE_LABEL } from "../data/provenance";

/**
 * Concise selected-project info card (exhibition selection focus). Shows the available dataset fields for the
 * selected project and carries the Evaluate action for THAT project — so the presenter immediately sees
 * "this is the project, here is where it is, this is the investment I'm about to evaluate". Uses only
 * approved/available fields; provenance is shown so demo data is never mistaken for verified records.
 */
export function ProjectCard({ project, onEvaluate, onSimulate }: { project: ProjectRecord; onEvaluate: () => void; onSimulate?: () => void }) {
  const rows: { label: string; value: string }[] = [
    { label: "Sector", value: project.sector },
    { label: "Status", value: project.status },
    { label: "Est. CAPEX", value: formatAed(project.budgetAed) },
    { label: "Timeline", value: `${project.startDate.slice(0, 4)}–${project.endDate.slice(0, 4)}` },
    { label: "Population served", value: formatPeople(project.populationServed) },
    { label: "Progress", value: `${project.progress}%` },
  ];
  const statusColor = project.status === "Under Delivery" ? "var(--good)" : project.status === "Planned" ? "var(--accent-2)" : project.status === "Completed" ? "var(--text-1)" : "var(--warn)";
  return (
    <div data-testid="project-card" style={{ width: "min(360px, 92vw)", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", overflow: "hidden", boxShadow: "0 10px 40px var(--shadow)" }}>
      {/* image band (photography: owner-supplied asset — stylized placeholder, flagged) */}
      <div style={{ height: "96px", background: "linear-gradient(135deg, var(--bg-2), var(--accent-soft))", position: "relative", display: "flex", alignItems: "flex-end", padding: "var(--space-2)" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--bg-0)", background: statusColor, borderRadius: "999px", padding: "3px 10px" }}>{project.status}</span>
        <span style={{ position: "absolute", top: "6px", right: "8px", fontSize: "9px", color: "var(--text-2)" }}>photo: owner-supplied [REF]</span>
      </div>
      <div style={{ padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-2)" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.06em" }}>SELECTED PROJECT</div>
          <div style={{ color: "var(--text-0)", fontSize: "18px", fontWeight: 700, marginTop: "2px" }}>{project.nameEn}</div>
          <div style={{ color: "var(--text-2)", fontSize: "12px" }}>{project.sector} · {project.aoi === "khalifa" ? "Khalifa City" : "Al Reem Island"}, Abu Dhabi</div>
        </div>
        <span style={{ fontSize: "10px", color: "var(--warn)", border: "1px solid var(--warn)", borderRadius: "999px", padding: "2px 8px", whiteSpace: "nowrap" }}>
          {PROVENANCE_LABEL[project.provenance]}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "var(--text-0)", fontWeight: 600 }}>{r.value}</span>
            <span style={{ color: "var(--text-2)", fontSize: "11px" }}>{r.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
        <button type="button" onClick={onEvaluate} style={{ flex: 1, padding: "12px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 700, cursor: "pointer" }}>
          Evaluate this investment →
        </button>
        {onSimulate && (
          <button type="button" onClick={onSimulate} style={{ padding: "12px 14px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", fontWeight: 600, cursor: "pointer" }}>
            Simulate
          </button>
        )}
      </div>
      </div>{/* end padding wrapper */}
    </div>
  );
}
