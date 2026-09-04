import type { ProjectRecord } from "../data/types";
import type { AssessmentResult, Band } from "../assessment/scoringEngine";
import { formatAed, formatPeople } from "../data/kpis";
import { PROVENANCE_LABEL } from "../data/provenance";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { GeoContextMap } from "./GeoContextMap";

const BAND_COLOR: Record<Band, string> = { High: "var(--good)", Medium: "var(--warn)", Low: "var(--text-2)", "Insufficient data": "var(--warn)" };

/**
 * First-class PROJECT DETAILS — the bridge between "here is the place" (Explore) and "should we invest
 * here?" (Assessment). Left ~62% is the REAL geographic surface (GeoContextMap: AD-SDI district + roads +
 * the selected project framed/highlighted at its frozen validated lon/lat, peers subdued); right is the
 * premium executive INVESTMENT BRIEF. Selection is a single shared state, so the map, brief, assessment and
 * Ask-AI all reflect the SAME project with no stale geographic focus.
 */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", padding: "12px 14px" }}>
      <div style={{ color: "var(--text-0)", fontSize: "20px", fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: "var(--text-2)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

export function ProjectDetails({
  project, assessment, onBack, onEvaluate, onSimulate,
}: {
  project: ProjectRecord;
  assessment: AssessmentResult | null;
  onBack: () => void;
  onEvaluate: () => void;
  onSimulate?: () => void;
}) {
  const aoiName = project.aoi === "khalifa" ? "Khalifa City" : "Al Reem Island";
  const statusColor = project.status === "Under Delivery" ? "var(--good)" : project.status === "Planned" ? "var(--accent-2)" : project.status === "Completed" ? "var(--text-1)" : "var(--warn)";
  const brief = `${project.sector} investment in ${aoiName} advancing the ${project.strategicTheme} agenda, with a liveability focus on ${project.liveabilityTheme}. Estimated ${formatAed(project.budgetAed)} serving approximately ${project.populationServed.toLocaleString("en")} residents.`;

  return (
    <div data-testid="project-details" style={{ position: "absolute", inset: 0, display: "flex", background: "var(--bg-0)", overflow: "hidden" }}>
      {/* LEFT — real geographic surface with the selected project framed & highlighted */}
      <div style={{ position: "relative", flex: "1 1 62%", minWidth: 0 }}>
        <GeoContextMap project={project} frame={0.62} />
        <div style={{ position: "absolute", left: "var(--space-3)", top: "var(--space-3)", background: "rgba(7,12,22,0.55)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", padding: "8px 14px", backdropFilter: "blur(4px)" }}>
          <div style={{ color: "var(--accent-2)", fontSize: "11px", letterSpacing: "0.1em" }}>SELECTED LOCATION</div>
          <div style={{ color: "var(--text-0)", fontSize: "17px", fontWeight: 700 }}>{aoiName}, Abu Dhabi</div>
        </div>
        <div style={{ position: "absolute", left: "var(--space-3)", bottom: "var(--space-3)", display: "flex", gap: "var(--space-3)", color: "var(--text-1)", fontSize: "12px", background: "rgba(7,12,22,0.55)", padding: "6px 12px", borderRadius: "var(--radius-1)" }}>
          <span><span style={{ color: "var(--accent)" }}>●</span> Selected project</span>
          <span><span style={{ color: "var(--text-2)" }}>●</span> Other portfolio projects</span>
        </div>
      </div>

      {/* RIGHT — premium executive investment brief */}
      <aside style={{ flex: "0 0 min(460px, 42vw)", background: "linear-gradient(180deg, var(--bg-1), var(--bg-0))", borderLeft: "1px solid var(--stroke)", padding: "var(--space-4) var(--space-3)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-3)", boxShadow: "-20px 0 60px var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button type="button" onClick={onBack} style={{ padding: "8px 14px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer", fontSize: "13px" }}>← Explore</button>
          <span style={{ fontSize: "10px", color: "var(--warn)", border: "1px solid var(--warn)", borderRadius: "999px", padding: "3px 10px", whiteSpace: "nowrap" }}>{PROVENANCE_LABEL[project.provenance]}</span>
        </div>

        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.08em" }}>INVESTMENT BRIEF</div>
          <h1 style={{ margin: "6px 0", color: "var(--text-0)", fontSize: "clamp(24px, 2.4vw, 34px)", fontWeight: 800, lineHeight: 1.1 }}>{project.nameEn}</h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--bg-0)", background: statusColor, borderRadius: "999px", padding: "3px 12px" }}>{project.status}</span>
            <span style={{ color: "var(--text-1)", fontSize: "13px" }}>{project.sector} · {aoiName}</span>
          </div>
        </div>

        <p style={{ color: "var(--text-1)", fontSize: "14px", lineHeight: 1.55, margin: 0 }}>{brief}</p>

        {assessment && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--bg-2)", border: `1px solid ${BAND_COLOR[assessment.overall]}`, borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: BAND_COLOR[assessment.overall], fontSize: "30px", fontWeight: 800, lineHeight: 1 }}>{assessment.overall}</div>
              <div style={{ color: "var(--text-2)", fontSize: "10px", letterSpacing: "0.08em", marginTop: "4px" }}>PRIORITY</div>
            </div>
            <div style={{ borderLeft: "1px solid var(--stroke)", paddingLeft: "var(--space-3)" }}>
              <div style={{ color: "var(--text-0)", fontSize: "22px", fontWeight: 800 }}>{assessment.overallScore ?? "—"}{assessment.overallScore != null && <span style={{ fontSize: "12px", color: "var(--text-2)" }}> / 100</span>}</div>
              <div style={{ color: "var(--text-2)", fontSize: "11px" }}>Computed by GIS indicators + business rules</div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
          <Stat label="Est. CAPEX" value={formatAed(project.budgetAed)} />
          <Stat label="Population served" value={formatPeople(project.populationServed)} />
          <Stat label="Timeline" value={`${project.startDate.slice(0, 4)}–${project.endDate.slice(0, 4)}`} />
          <Stat label="Delivery progress" value={`${project.progress}%`} />
          <Stat label="Strategic theme" value={project.strategicTheme} />
          <Stat label="Liveability focus" value={project.liveabilityTheme} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <button type="button" onClick={onEvaluate} style={{ padding: "15px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 6px 24px var(--shadow)" }}>
            Evaluate this investment →
          </button>
          {onSimulate && (
            <button type="button" onClick={onSimulate} style={{ padding: "13px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              Simulate liveability impact →
            </button>
          )}
        </div>
        <div style={{ color: "var(--text-2)", fontSize: "11px" }}>
          Location from the frozen validated dataset. {PROVENANCE_LABEL[project.provenance]} — not an official ADPIC record.
        </div>
        <div style={{ color: "var(--text-2)", fontSize: "10px", opacity: 0.8 }}>{AOI_BOUNDARIES[project.aoi].attribution}</div>
      </aside>
    </div>
  );
}
