import type { AssessmentResult, DimensionResult, Band } from "../assessment/scoringEngine";
import { ASSESSMENT_DISCLAIMER, ATTRIBUTION_LABEL } from "../assessment/disclaimer";
import { WEIGHTS_LABEL } from "../assessment/weights.config";
import { buildExplanation } from "../assessment/explanation";

const BAND_COLOR: Record<Band, string> = { High: "var(--good)", Medium: "var(--warn)", Low: "var(--text-2)", "Insufficient data": "var(--warn)" };
const fmt = (n: number | null) => (n == null ? "—" : String(Math.round(n))); // present integers; never float artifacts

/** Premium evidence card (replaces the admin table row). Score bar + band chip + calculated evidence. */
function EvidenceCard({ d }: { d: DimensionResult }) {
  const color = BAND_COLOR[d.band];
  return (
    <div data-testid="dimension-row" style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
        <span style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 600 }}>
          {d.label}
          <span style={{ color: "var(--text-2)", fontSize: "11px", marginLeft: "6px" }}>{d.role === "penalty" ? "constraint" : "driver"}</span>
        </span>
        <span style={{ color, fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
          {d.inputsPresent ? <>{fmt(d.score)} · {d.band}</> : d.band}
        </span>
      </div>
      <div style={{ height: "10px", background: "var(--bg-2)", borderRadius: "999px", overflow: "hidden" }}>
        {d.inputsPresent && <div style={{ width: `${Math.round(d.score as number)}%`, height: "100%", background: color, boxShadow: `0 0 12px ${color}` }} />}
      </div>
      <div style={{ color: "var(--text-2)", fontSize: "11.5px", lineHeight: 1.4 }}>{d.evidence.join(" · ")}</div>
    </div>
  );
}

/**
 * AI-Assisted Investment Assessment — executive decision-support (owner concept 04). The overall
 * Low/Medium/High priority is the visual hero; a "Why this result?" summary surfaces the strongest
 * positive drivers and principal constraints; every dimension is a premium evidence card (GIS/business-rule
 * computation) with its calculated evidence; the explanation (AI/template) is clearly separated and never an
 * approval; the WORK-BR-15 disclaimer stays visible. AI explains, never approves.
 */
export function Assessment({ result, onBack, onSimulate }: { result: AssessmentResult; onBack: () => void; onSimulate?: () => void }) {
  const color = BAND_COLOR[result.overall];
  const present = result.dimensions.filter((d) => d.inputsPresent && d.score != null);
  const drivers = present.filter((d) => d.role === "contribution").sort((a, b) => (b.score as number) - (a.score as number)).slice(0, 2);
  const constraints = present.filter((d) => d.role === "penalty").sort((a, b) => (b.score as number) - (a.score as number)).slice(0, 2);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-0)", padding: "var(--space-3) var(--space-4)", overflow: "hidden" }}>
      {/* header + navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.08em" }}>AI-ASSISTED INVESTMENT ASSESSMENT</div>
          <h1 style={{ margin: "4px 0", color: "var(--text-0)", fontSize: "clamp(22px, 2.4vw, 34px)", fontWeight: 800 }}>Should this project be prioritised?</h1>
          <div style={{ color: "var(--text-1)", fontSize: "15px" }}>{result.projectName}</div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button type="button" onClick={onBack} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back to project</button>
          {onSimulate && <button type="button" onClick={onSimulate} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", cursor: "pointer", fontWeight: 600 }}>Simulate impact →</button>}
        </div>
      </div>

      {/* main grid: hero priority + why (left) · evidence cards (right) — fills the canvas */}
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(300px, 1fr) 1.7fr", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
        {/* LEFT column: hero + why + explanation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minHeight: 0 }}>
          {/* HERO priority */}
          <div style={{ background: "linear-gradient(160deg, var(--bg-2), var(--bg-1))", border: `2px solid ${color}`, borderRadius: "var(--radius-2)", padding: "var(--space-3) var(--space-4)", textAlign: "center", boxShadow: `0 0 48px ${color}22` }}>
            <div style={{ color: "var(--text-2)", fontSize: "12px", letterSpacing: "0.1em" }}>OVERALL PRIORITY</div>
            <div role="status" aria-label={`Overall priority: ${result.overall}`} style={{ color, fontSize: "clamp(44px, 6vw, 84px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "0.02em" }}>{result.overall}</div>
            {result.overallScore != null && (
              <div style={{ color: "var(--text-0)", fontSize: "20px", fontWeight: 700 }}>{result.overallScore}<span style={{ color: "var(--text-2)", fontSize: "13px" }}> / 100 priority score</span></div>
            )}
            <div data-testid="attribution" style={{ color: "var(--text-2)", fontSize: "11px", marginTop: "10px" }}>{ATTRIBUTION_LABEL}.</div>
            <div style={{ color: "var(--text-2)", fontSize: "10.5px", marginTop: "4px" }}>{WEIGHTS_LABEL}</div>
          </div>

          {/* WHY THIS RESULT */}
          <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
            <div style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>Why this result?</div>
            <div style={{ color: "var(--good)", fontSize: "11px", letterSpacing: "0.06em", marginBottom: "4px" }}>STRONGEST DRIVERS</div>
            {drivers.length ? drivers.map((d) => (
              <div key={d.key} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-1)", fontSize: "13px", padding: "3px 0" }}>
                <span>{d.label}</span><span style={{ color: "var(--good)", fontWeight: 700 }}>{fmt(d.score)}</span>
              </div>
            )) : <div style={{ color: "var(--text-2)", fontSize: "12px" }}>—</div>}
            <div style={{ color: "var(--warn)", fontSize: "11px", letterSpacing: "0.06em", margin: "10px 0 4px" }}>PRINCIPAL CONSTRAINTS</div>
            {constraints.length ? constraints.map((d) => (
              <div key={d.key} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-1)", fontSize: "13px", padding: "3px 0" }}>
                <span>{d.label}</span><span style={{ color: "var(--warn)", fontWeight: 700 }}>{fmt(d.score)}</span>
              </div>
            )) : <div style={{ color: "var(--text-2)", fontSize: "12px" }}>None material</div>}
          </div>

          {/* EXPLANATION (AI/template — separated from computed evidence, never an approval) */}
          <div data-testid="explanation" style={{ background: "var(--bg-1)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", flex: 1, minHeight: 0, overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "var(--accent-2)", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.04em" }}>NARRATIVE EXPLANATION · generated from the evidence (template, not an approval)</div>
            <p style={{ color: "var(--text-1)", margin: 0, lineHeight: 1.55, fontSize: "13.5px" }}>{buildExplanation(result)}</p>
            <div style={{ marginTop: "auto", paddingTop: "var(--space-3)", display: "flex", gap: "8px", alignItems: "center", color: "var(--text-2)", fontSize: "11px", borderTop: "1px solid var(--stroke)" }}>
              <span aria-hidden style={{ color: "var(--accent-2)" }}>◎</span>
              Assessed in geographic context · Khalifa City, Abu Dhabi · location from the validated dataset
            </div>
          </div>
        </div>

        {/* RIGHT column: evidence cards */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <div style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 700 }}>Assessment evidence</div>
            <div style={{ color: "var(--text-2)", fontSize: "11px" }}>Computed · GIS indicators + business rules</div>
          </div>
          <div data-testid="dimension-table" style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "minmax(0, 1fr)", gap: "var(--space-2)", overflow: "auto" }}>
            {result.dimensions.map((d) => <EvidenceCard key={d.key} d={d} />)}
          </div>
        </div>
      </div>

      {/* persistent disclaimer */}
      <div data-testid="disclaimer" style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "12px", fontStyle: "italic" }}>{ASSESSMENT_DISCLAIMER}</div>
    </div>
  );
}
