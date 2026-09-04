import type { AssessmentResult, DimensionResult, Band } from "../assessment/scoringEngine";
import { PriorityBadge } from "./PriorityBadge";
import { ASSESSMENT_DISCLAIMER, ATTRIBUTION_LABEL } from "../assessment/disclaimer";
import { WEIGHTS_LABEL } from "../assessment/weights.config";
import { buildExplanation } from "../assessment/explanation";

const BAND_COLOR: Record<Band, string> = { High: "var(--good)", Medium: "var(--warn)", Low: "var(--text-2)", "Insufficient data": "var(--warn)" };

function Row({ d }: { d: DimensionResult }) {
  return (
    <div data-testid="dimension-row" style={{ padding: "8px var(--space-2)", borderTop: "1px solid var(--stroke)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr", alignItems: "center", gap: "var(--space-2)" }}>
        <span style={{ color: "var(--text-0)", fontSize: "13px" }}>{d.label}{d.role === "penalty" ? " ⚠" : ""}</span>
        {/* score bar */}
        <div style={{ height: "8px", background: "var(--bg-2)", borderRadius: "999px", overflow: "hidden" }}>
          {d.inputsPresent && <div style={{ width: `${d.score}%`, height: "100%", background: BAND_COLOR[d.band] }} />}
        </div>
        <span style={{ color: BAND_COLOR[d.band], fontSize: "12px", fontWeight: 600, textAlign: "right" }}>
          {d.inputsPresent ? <>{d.score} · {d.band}</> : d.band}
        </span>
      </div>
      <div style={{ color: "var(--text-2)", fontSize: "11px", marginTop: "3px" }}>{d.evidence.join(" · ")}</div>
    </div>
  );
}

/**
 * AI-Assisted Investment Assessment (reference 04 composition): overall priority (attributed to GIS/rules)
 * on the left, a per-dimension score/evidence table with bars + colored result bands on the right, a
 * clearly-separated deterministic explanation, the illustrative-weights note, and the persistent WORK-BR-15
 * disclaimer. AI explains, never approves.
 */
export function Assessment({ result, onBack }: { result: AssessmentResult; onBack: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: "var(--bg-0)", padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--text-2)", fontSize: "13px" }}>AI-Assisted Investment Assessment</div>
          <h2 style={{ margin: "4px 0", color: "var(--text-0)" }}>Should this project be prioritised?</h2>
          <div style={{ color: "var(--text-1)" }}>{result.projectName}</div>
        </div>
        <button type="button" onClick={onBack} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back to Explore</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(200px, 1fr) 2.2fr", gap: "var(--space-3)", marginTop: "var(--space-3)", alignItems: "start" }}>
        {/* left: overall priority */}
        <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", textAlign: "center" }}>
          <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "var(--space-2)" }}>Overall Priority</div>
          <PriorityBadge band={result.overall} />
          <div data-testid="attribution" style={{ color: "var(--text-2)", fontSize: "11px", marginTop: "var(--space-2)" }}>{ATTRIBUTION_LABEL}.</div>
          <div style={{ color: "var(--text-2)", fontSize: "11px", marginTop: "6px" }}>{WEIGHTS_LABEL}</div>
        </div>
        {/* right: dimensions */}
        <div data-testid="dimension-table" style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr", background: "var(--bg-2)", color: "var(--text-2)", fontSize: "11px", padding: "8px var(--space-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>Dimension</span><span>Score</span><span style={{ textAlign: "right" }}>Result</span>
          </div>
          {result.dimensions.map((d) => <Row key={d.key} d={d} />)}
        </div>
      </div>

      <div data-testid="explanation" style={{ marginTop: "var(--space-3)", padding: "var(--space-2)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-1)" }}>
        <div style={{ color: "var(--accent-2)", fontSize: "12px", marginBottom: "6px" }}>Explanation (generated from the evidence above — not an approval)</div>
        <p style={{ color: "var(--text-1)", margin: 0, lineHeight: 1.5 }}>{buildExplanation(result)}</p>
      </div>
      <div data-testid="disclaimer" style={{ marginTop: "var(--space-3)", color: "var(--text-2)", fontSize: "12px", fontStyle: "italic" }}>{ASSESSMENT_DISCLAIMER}</div>
    </div>
  );
}
