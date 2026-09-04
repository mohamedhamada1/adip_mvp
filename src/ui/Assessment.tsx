import type { AssessmentResult } from "../assessment/scoringEngine";
import { PriorityBadge } from "./PriorityBadge";
import { ASSESSMENT_DISCLAIMER, ATTRIBUTION_LABEL } from "../assessment/disclaimer";
import { WEIGHTS_LABEL } from "../assessment/weights.config";
import { buildExplanation } from "../assessment/explanation";

/**
 * AI-Assisted Investment Assessment screen. Shows the overall Low/Med/High (attributed to GIS/rules), a
 * per-dimension evidence table, a clearly-SEPARATED explanation (deterministic template text — no live LLM,
 * never an approval), the illustrative-weights note, and the persistent WORK-BR-15 disclaimer.
 */
export function Assessment({ result, onBack }: { result: AssessmentResult; onBack: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: "var(--bg-0)", padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "var(--text-2)", fontSize: "13px" }}>AI-Assisted Investment Assessment</div>
          <h2 style={{ margin: "4px 0", color: "var(--text-0)" }}>Should this project be prioritised?</h2>
          <div style={{ color: "var(--text-1)" }}>{result.projectName}</div>
        </div>
        <button type="button" onClick={onBack} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>
          ← Back to Explore
        </button>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", margin: "var(--space-3) 0" }}>
        <div>
          <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "6px" }}>Overall Priority</div>
          <PriorityBadge band={result.overall} />
        </div>
        <div style={{ color: "var(--text-2)", fontSize: "12px", maxWidth: "34ch" }} data-testid="attribution">
          {ATTRIBUTION_LABEL}. {WEIGHTS_LABEL}
        </div>
      </div>

      {/* Calculated evidence table */}
      <div data-testid="dimension-table" style={{ border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 3fr", background: "var(--bg-2)", color: "var(--text-2)", fontSize: "12px", padding: "8px var(--space-2)" }}>
          <span>Assessment Dimension</span><span>Score</span><span>Calculated evidence</span>
        </div>
        {result.dimensions.map((d) => (
          <div key={d.key} data-testid="dimension-row" style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 3fr", padding: "8px var(--space-2)", borderTop: "1px solid var(--stroke)", alignItems: "center" }}>
            <span style={{ color: "var(--text-0)" }}>{d.label}{d.role === "penalty" ? " (penalty)" : ""}</span>
            <span style={{ color: d.inputsPresent ? "var(--text-1)" : "var(--warn)" }}>
              {d.inputsPresent ? <>{d.score}<span style={{ color: "var(--text-2)" }}> / {d.band}</span></> : d.band}
            </span>
            <span style={{ color: "var(--text-2)", fontSize: "13px" }}>{d.evidence.join(" · ")}</span>
          </div>
        ))}
      </div>

      {/* Explanation — deterministic template text, clearly separated from the calculated evidence above */}
      <div data-testid="explanation" style={{ marginTop: "var(--space-3)", padding: "var(--space-2)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-1)" }}>
        <div style={{ color: "var(--accent-2)", fontSize: "12px", marginBottom: "6px" }}>Explanation (generated from the evidence above — not an approval)</div>
        <p style={{ color: "var(--text-1)", margin: 0, lineHeight: 1.5 }}>{buildExplanation(result)}</p>
      </div>

      {/* Persistent approved disclaimer */}
      <div data-testid="disclaimer" style={{ marginTop: "var(--space-3)", color: "var(--text-2)", fontSize: "12px", fontStyle: "italic" }}>
        {ASSESSMENT_DISCLAIMER}
      </div>
    </div>
  );
}
