import type { AssessmentResult, DimensionResult, Band } from "../assessment/scoringEngine";
import { buildExplanation } from "../assessment/explanation";
import { useLang } from "../i18n/LangContext";
import { dimLabel, bandLabel, aoiName, type Lang } from "../i18n/strings";

const BAND_COLOR: Record<Band, string> = { High: "var(--good)", Medium: "var(--warn)", Low: "var(--text-2)", "Insufficient data": "var(--warn)" };
const fmt = (n: number | null) => (n == null ? "—" : String(Math.round(n))); // integers; never float artifacts

function dimColor(d: DimensionResult): string {
  if (!d.inputsPresent) return "var(--warn)";
  if (d.role === "contribution") return BAND_COLOR[d.band];
  return d.band === "High" ? "var(--danger)" : d.band === "Medium" ? "var(--warn)" : "var(--good)";
}
function riskWord(d: DimensionResult, t: ReturnType<typeof useLang>["t"]): string {
  return d.band === "High" ? t.assess.highRisk : d.band === "Medium" ? t.assess.moderateRisk : t.assess.lowRisk;
}
function dimResult(d: DimensionResult, lang: Lang, t: ReturnType<typeof useLang>["t"]): string {
  if (!d.inputsPresent) return bandLabel(d.band, lang);
  if (d.role === "contribution") return `${fmt(d.score)} · ${bandLabel(d.band, lang)}`;
  return `${fmt(d.score)} · ${riskWord(d, t)}`;
}

function EvidenceCard({ d, lang, t }: { d: DimensionResult; lang: Lang; t: ReturnType<typeof useLang>["t"] }) {
  const color = dimColor(d);
  const isConstraint = d.role === "penalty";
  return (
    <div data-testid="dimension-row" style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderInlineStart: `3px solid ${isConstraint ? "var(--danger)" : "var(--good)"}`, borderRadius: "var(--radius-2)", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
        <span style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 600 }}>
          {dimLabel(d.key, lang)}
          <span style={{ color: isConstraint ? "var(--danger)" : "var(--good)", fontSize: "10px", marginInlineStart: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{isConstraint ? `↓ ${t.assess.constraint}` : `↑ ${t.assess.driver}`}</span>
        </span>
        <span style={{ color, fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>{dimResult(d, lang, t)}</span>
      </div>
      <div style={{ height: "10px", background: "var(--bg-2)", borderRadius: "999px", overflow: "hidden" }}>
        {d.inputsPresent && <div style={{ width: `${Math.round(d.score as number)}%`, height: "100%", background: color, boxShadow: `0 0 12px ${color}` }} />}
      </div>
      <div style={{ color: "var(--text-2)", fontSize: "11.5px", lineHeight: 1.4 }}>{d.evidence.join(" · ")}</div>
    </div>
  );
}

/**
 * AI-Assisted Investment Assessment — executive decision-support (owner concept 04). Priority hero,
 * "Why this result?" (drivers vs. risk constraints), premium evidence cards, GIS/business-rule computation
 * separated from the template narrative, persistent WORK-BR-15 disclaimer. AI explains, never approves.
 */
export function Assessment({ result, onBack, onSimulate, displayName }: { result: AssessmentResult; onBack: () => void; onSimulate?: () => void; displayName?: string }) {
  const { t, lang } = useLang();
  const color = BAND_COLOR[result.overall];
  const present = result.dimensions.filter((d) => d.inputsPresent && d.score != null);
  const drivers = present.filter((d) => d.role === "contribution").sort((a, b) => (b.score as number) - (a.score as number)).slice(0, 2);
  const constraints = present.filter((d) => d.role === "penalty").sort((a, b) => (b.score as number) - (a.score as number)).slice(0, 2);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--bg-0)", padding: "var(--space-3) var(--space-4)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "var(--accent-2)", fontSize: "12px", letterSpacing: "0.08em" }}>{t.assess.eyebrow}</div>
          <h1 style={{ margin: "4px 0", color: "var(--text-0)", fontSize: "clamp(22px, 2.4vw, 34px)", fontWeight: 800 }}>{t.assess.question}</h1>
          <div style={{ color: "var(--text-1)", fontSize: "15px" }}>{displayName ?? result.projectName}</div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button type="button" onClick={onBack} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>{t.assess.back}</button>
          {onSimulate && <button type="button" onClick={onSimulate} style={{ padding: "10px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", cursor: "pointer", fontWeight: 600 }}>{t.assess.simulate}</button>}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(300px, 1fr) 1.7fr", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", minHeight: 0 }}>
          <div style={{ background: "linear-gradient(160deg, var(--bg-2), var(--bg-1))", border: `2px solid ${color}`, borderRadius: "var(--radius-2)", padding: "var(--space-3) var(--space-4)", textAlign: "center", boxShadow: `0 0 48px ${color}22` }}>
            <div style={{ color: "var(--text-2)", fontSize: "12px", letterSpacing: "0.1em" }}>{t.assess.overall}</div>
            <div role="status" aria-label={`Overall priority: ${result.overall}`} style={{ color, fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "0.02em" }}>{bandLabel(result.overall, lang)}</div>
            {result.overallScore != null && (
              <div style={{ color: "var(--text-0)", fontSize: "20px", fontWeight: 700 }}>{result.overallScore}<span style={{ color: "var(--text-2)", fontSize: "13px" }}> {t.assess.scoreOf}</span></div>
            )}
            <div data-testid="attribution" style={{ color: "var(--text-2)", fontSize: "11px", marginTop: "10px" }}>{t.assess.computed}</div>
            <div style={{ color: "var(--text-2)", fontSize: "10.5px", marginTop: "4px" }}>{t.weightsLabel}</div>
          </div>

          <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)" }}>
            <div style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>{t.assess.why}</div>
            <div style={{ color: "var(--good)", fontSize: "11px", letterSpacing: "0.06em", marginBottom: "4px" }}>{t.assess.drivers}</div>
            {drivers.length ? drivers.map((d) => (
              <div key={d.key} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-1)", fontSize: "13px", padding: "3px 0" }}>
                <span>{dimLabel(d.key, lang)}</span><span style={{ color: "var(--good)", fontWeight: 700 }}>{fmt(d.score)}</span>
              </div>
            )) : <div style={{ color: "var(--text-2)", fontSize: "12px" }}>—</div>}
            <div style={{ color: "var(--danger)", fontSize: "11px", letterSpacing: "0.06em", margin: "10px 0 4px" }}>{t.assess.constraints} <span style={{ color: "var(--text-2)", letterSpacing: 0 }}>{t.assess.higherRisk}</span></div>
            {constraints.length ? constraints.map((d) => (
              <div key={d.key} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-1)", fontSize: "13px", padding: "3px 0" }}>
                <span>{dimLabel(d.key, lang)}</span><span style={{ color: dimColor(d), fontWeight: 700 }}>{fmt(d.score)} · {riskWord(d, t)}</span>
              </div>
            )) : <div style={{ color: "var(--text-2)", fontSize: "12px" }}>{t.assess.none}</div>}
            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid var(--stroke)", display: "flex", gap: "14px", color: "var(--text-2)", fontSize: "10.5px" }}>
              <span><span style={{ color: "var(--good)" }}>↑</span> {t.assess.driverRaises}</span>
              <span><span style={{ color: "var(--danger)" }}>↓</span> {t.assess.constraintLowers}</span>
            </div>
          </div>

          <div data-testid="explanation" style={{ background: "var(--bg-1)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", flex: 1, minHeight: 0, overflow: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ color: "var(--accent-2)", fontSize: "11px", marginBottom: "6px", letterSpacing: "0.04em" }}>{t.assess.narrative}</div>
            <p style={{ color: "var(--text-1)", margin: 0, lineHeight: 1.55, fontSize: "13.5px" }}>{buildExplanation(result, lang)}</p>
            <div style={{ marginTop: "auto", paddingTop: "var(--space-3)", display: "flex", gap: "8px", alignItems: "center", color: "var(--text-2)", fontSize: "11px", borderTop: "1px solid var(--stroke)" }}>
              <span aria-hidden style={{ color: "var(--accent-2)" }}>◎</span>
              {t.assess.geoContext(aoiName("khalifa", lang))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <div style={{ color: "var(--text-0)", fontSize: "14px", fontWeight: 700 }}>{t.assess.evidence}</div>
            <div style={{ color: "var(--text-2)", fontSize: "11px" }}>{t.assess.computedTag}</div>
          </div>
          <div data-testid="dimension-table" style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "minmax(0, 1fr)", gap: "var(--space-2)", overflow: "auto" }}>
            {result.dimensions.map((d) => <EvidenceCard key={d.key} d={d} lang={lang} t={t} />)}
          </div>
        </div>
      </div>

      <div data-testid="disclaimer" style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "12px", fontStyle: "italic" }}>{t.assess.disclaimer}</div>
    </div>
  );
}
