import type { ProjectRecord } from "../data/types";
import type { AssessmentResult, Band } from "../assessment/scoringEngine";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { GeoContextMap } from "./GeoContextMap";
import { useLang } from "../i18n/LangContext";
import { aoiName, projectName, sectorLabel, statusLabel, strategicLabel, liveabilityLabel, provenanceLabel, bandLabel, fmtAedL, fmtPeopleL, numL } from "../i18n/strings";

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
  const { t, lang, dir } = useLang();
  const city = aoiName(project.aoi, lang);
  const statusColor = project.status === "Under Delivery" ? "var(--good)" : project.status === "Planned" ? "var(--accent-2)" : project.status === "Completed" ? "var(--text-1)" : "var(--warn)";
  const brief = t.details.briefTemplate(
    sectorLabel(project.sector, lang), city,
    strategicLabel(project.strategicTheme, lang), liveabilityLabel(project.liveabilityTheme, lang),
    fmtAedL(project.budgetAed, lang), numL(project.populationServed)
  );

  return (
    <div data-testid="project-details" style={{ position: "absolute", inset: 0, display: "flex", background: "var(--bg-0)", overflow: "hidden" }}>
      {/* LEFT — real geographic surface with the selected project framed & highlighted */}
      <div style={{ position: "relative", flex: "1 1 62%", minWidth: 0 }}>
        <GeoContextMap project={project} frame={0.62} />
        <div style={{ position: "absolute", insetInlineStart: "var(--space-3)", top: "var(--space-3)", background: "rgba(7,12,22,0.55)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", padding: "8px 14px", backdropFilter: "blur(4px)" }}>
          <div style={{ color: "var(--accent-2)", fontSize: "11px", letterSpacing: "0.1em" }}>{t.details.selectedLocation}</div>
          <div style={{ color: "var(--text-0)", fontSize: "17px", fontWeight: 700 }}>{city}، {t.details.abudhabi}</div>
        </div>
        <div style={{ position: "absolute", insetInlineStart: "var(--space-3)", bottom: "var(--space-3)", display: "flex", gap: "var(--space-3)", color: "var(--text-1)", fontSize: "12px", background: "rgba(7,12,22,0.55)", padding: "6px 12px", borderRadius: "var(--radius-1)" }}>
          <span><span style={{ color: "var(--accent)" }}>●</span> {t.details.selectedProject}</span>
          <span><span style={{ color: "var(--text-2)" }}>●</span> {t.details.otherProjects}</span>
        </div>
      </div>

      {/* RIGHT — premium executive investment brief */}
      <aside style={{ flex: "0 0 min(460px, 42vw)", background: "linear-gradient(180deg, var(--bg-1), var(--bg-0))", borderInlineStart: "1px solid var(--stroke)", padding: "var(--space-4) var(--space-3)", overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-3)", boxShadow: "-20px 0 60px var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button type="button" onClick={onBack} style={{ padding: "8px 14px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer", fontSize: "13px" }}>{dir === "rtl" ? "→" : "←"} {t.nav.explore}</button>
          <span style={{ fontSize: "10px", color: "var(--warn)", border: "1px solid var(--warn)", borderRadius: "999px", padding: "3px 10px", whiteSpace: "nowrap" }}>{provenanceLabel(project.provenance, lang)}</span>
        </div>

        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.08em" }}>{t.details.brief}</div>
          <h1 style={{ margin: "6px 0", color: "var(--text-0)", fontSize: "clamp(24px, 2.4vw, 34px)", fontWeight: 800, lineHeight: 1.1 }}>{projectName(project, lang)}</h1>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--bg-0)", background: statusColor, borderRadius: "999px", padding: "3px 12px" }}>{statusLabel(project.status, lang)}</span>
            <span style={{ color: "var(--text-1)", fontSize: "13px" }}>{sectorLabel(project.sector, lang)} · {city}</span>
          </div>
        </div>

        <p style={{ color: "var(--text-1)", fontSize: "14px", lineHeight: 1.55, margin: 0 }}>{brief}</p>

        {assessment && (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", background: "var(--bg-2)", border: `1px solid ${BAND_COLOR[assessment.overall]}`, borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: BAND_COLOR[assessment.overall], fontSize: "30px", fontWeight: 800, lineHeight: 1 }}>{bandLabel(assessment.overall, lang)}</div>
              <div style={{ color: "var(--text-2)", fontSize: "10px", letterSpacing: "0.08em", marginTop: "4px" }}>{t.details.priority}</div>
            </div>
            <div style={{ borderInlineStart: "1px solid var(--stroke)", paddingInlineStart: "var(--space-3)" }}>
              <div style={{ color: "var(--text-0)", fontSize: "22px", fontWeight: 800 }}>{assessment.overallScore ?? "—"}{assessment.overallScore != null && <span style={{ fontSize: "12px", color: "var(--text-2)" }}> {t.details.ofScore}</span>}</div>
              <div style={{ color: "var(--text-2)", fontSize: "11px" }}>{t.details.computedBy}</div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
          <Stat label={t.details.estCapex} value={fmtAedL(project.budgetAed, lang)} />
          <Stat label={t.details.populationServed} value={fmtPeopleL(project.populationServed, lang)} />
          <Stat label={t.details.timeline} value={`${project.startDate.slice(0, 4)}–${project.endDate.slice(0, 4)}`} />
          <Stat label={t.details.deliveryProgress} value={`${project.progress}%`} />
          <Stat label={t.details.strategicTheme} value={strategicLabel(project.strategicTheme, lang)} />
          <Stat label={t.details.liveabilityFocus} value={liveabilityLabel(project.liveabilityTheme, lang)} />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <button type="button" onClick={onEvaluate} style={{ padding: "15px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 6px 24px var(--shadow)" }}>
            {t.details.evaluate}
          </button>
          {onSimulate && (
            <button type="button" onClick={onSimulate} style={{ padding: "13px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
              {t.details.simulate}
            </button>
          )}
        </div>
        <div style={{ color: "var(--text-2)", fontSize: "11px" }}>
          {t.details.locationNote}
        </div>
        <div style={{ color: "var(--text-2)", fontSize: "10px", opacity: 0.8 }}>{AOI_BOUNDARIES[project.aoi].attribution}</div>
      </aside>
    </div>
  );
}
