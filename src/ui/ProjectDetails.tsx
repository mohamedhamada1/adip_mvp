import type { ProjectRecord } from "../data/types";
import type { AssessmentResult, Band } from "../assessment/scoringEngine";
import { formatAed, formatPeople } from "../data/kpis";
import { PROVENANCE_LABEL } from "../data/provenance";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { KHALIFA_GEOGRAPHY } from "../data/khalifaBoundaryRoads";
import { projectsForAoi } from "../data/portfolio.demo";

const BAND_COLOR: Record<Band, string> = { High: "var(--good)", Medium: "var(--warn)", Low: "var(--text-2)", "Insufficient data": "var(--warn)" };

/**
 * First-class PROJECT DETAILS — the bridge state between "here is the place" (Explore) and
 * "should we invest here?" (Assessment). Composition (owner concept): a large real-geography MAP on the
 * left with the selected project's marker highlighted + framed, and a premium executive INVESTMENT BRIEF
 * on the right. Only validated dataset fields are shown; the marker sits at the project's frozen lon/lat
 * (no invented coordinates). Actions carry the journey forward: Evaluate → Simulate.
 */

// --- geography projection for the context map (AOI ring bbox → SVG) ---
const MW = 200, MH = 150, MPAD = 8;
function projector(ring: [number, number][]) {
  const lon0 = Math.min(...ring.map((p) => p[0])), lon1 = Math.max(...ring.map((p) => p[0]));
  const lat0 = Math.min(...ring.map((p) => p[1])), lat1 = Math.max(...ring.map((p) => p[1]));
  const sx = (lon: number) => MPAD + ((lon - lon0) / (lon1 - lon0 || 1)) * (MW - 2 * MPAD);
  const sy = (lat: number) => MPAD + ((lat1 - lat) / (lat1 - lat0 || 1)) * (MH - 2 * MPAD);
  return { sx, sy };
}

function ContextMap({ project }: { project: ProjectRecord }) {
  const boundary = AOI_BOUNDARIES[project.aoi];
  const { sx, sy } = projector(boundary.ring);
  const ringPts = boundary.ring.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" ");
  const roads = project.aoi === "khalifa"
    ? KHALIFA_GEOGRAPHY.majorRoads.map((pl) => pl.map((p) => `${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join(" "))
    : [];
  const peers = projectsForAoi(project.aoi).filter((p) => p.id !== project.id);
  const px = sx(project.lon), py = sy(project.lat);
  return (
    <svg viewBox={`0 0 ${MW} ${MH}`} role="img" aria-label={`Location of ${project.nameEn} in ${boundary.nameEn}`}
      style={{ width: "100%", height: "100%", display: "block", background: "radial-gradient(120% 120% at 50% 20%, var(--bg-2), var(--bg-0))" }}>
      <defs>
        <clipPath id="pd-clip"><polygon points={ringPts} /></clipPath>
        <radialGradient id="pd-focus" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </radialGradient>
        <filter id="pd-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <polygon points={ringPts} fill="var(--bg-1)" stroke="var(--stroke)" strokeWidth={0.6} />
      <g clipPath="url(#pd-clip)">
        <g stroke="var(--stroke)" strokeWidth={0.3} fill="none" opacity={0.8}>{roads.map((d, i) => <polyline key={i} points={d} />)}</g>
        {/* peer projects (context, dimmed) */}
        {peers.map((p) => <circle key={p.id} cx={sx(p.lon)} cy={sy(p.lat)} r={1.3} fill="var(--text-2)" opacity={0.55} />)}
        {/* focus halo + crosshair on the selected project */}
        <circle cx={px} cy={py} r={16} fill="url(#pd-focus)" />
        <line x1={px} y1={MPAD} x2={px} y2={MH - MPAD} stroke="var(--accent-2)" strokeWidth={0.25} strokeDasharray="1.5 1.5" opacity={0.5} />
        <line x1={MPAD} y1={py} x2={MW - MPAD} y2={py} stroke="var(--accent-2)" strokeWidth={0.25} strokeDasharray="1.5 1.5" opacity={0.5} />
      </g>
      {/* selected marker + callout (drawn above clip so the label is never cut) */}
      <g filter="url(#pd-glow)">
        <circle cx={px} cy={py} r={3.4} fill="var(--accent)" stroke="var(--text-0)" strokeWidth={0.8} />
        <circle cx={px} cy={py} r={5.6} fill="none" stroke="var(--accent-2)" strokeWidth={0.6} opacity={0.9} />
      </g>
      <text x={MW - 8} y={10} fill="var(--text-2)" fontSize={5}>N↑</text>
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", padding: "12px 14px" }}>
      <div style={{ color: "var(--text-0)", fontSize: "20px", fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: "var(--text-2)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

export function ProjectDetails({
  project, assessment, onBack, onEvaluate, onSimulate, showMap = true,
}: {
  project: ProjectRecord;
  assessment: AssessmentResult | null;
  onBack: () => void;
  onEvaluate: () => void;
  onSimulate?: () => void;
  showMap?: boolean;
}) {
  const aoiName = project.aoi === "khalifa" ? "Khalifa City" : "Al Reem Island";
  const statusColor = project.status === "Under Delivery" ? "var(--good)" : project.status === "Planned" ? "var(--accent-2)" : project.status === "Completed" ? "var(--text-1)" : "var(--warn)";
  const brief = `${project.sector} investment in ${aoiName} advancing the ${project.strategicTheme} agenda, with a liveability focus on ${project.liveabilityTheme}. Estimated ${formatAed(project.budgetAed)} serving approximately ${project.populationServed.toLocaleString("en")} residents.`;

  return (
    <div data-testid="project-details" style={{ position: "absolute", inset: 0, display: "flex", background: "var(--bg-0)", overflow: "hidden" }}>
      {/* LEFT — large map/geography context with the selected project framed & highlighted */}
      <div style={{ position: "relative", flex: "1 1 58%", minWidth: 0 }}>
        {showMap
          ? <ContextMap project={project} />
          : <div style={{ position: "absolute", inset: 0 }} aria-hidden />}
        {/* place label overlay so the screen reads "here is the place" even over the live 3D scene */}
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

        {/* priority preview — attributed to rules, links into the full Assessment */}
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
