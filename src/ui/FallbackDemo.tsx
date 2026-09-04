/**
 * Fixed deterministic FALLBACK demonstration + backup-video slot (WORK-AC-16, WORK-REQ-23).
 *
 * If anything goes wrong live, the presenter can run this fixed, deterministic script (no network, no LLM).
 * The backup VIDEO is an owner-supplied operational asset that must be prepared/verified before go-live
 * (WORK-ROLL-6) — the slot is here; the asset is flagged [REFERENCE NEEDED] rather than fabricated.
 */
const FALLBACK_SCRIPT = [
  "Understand — Explore the 3D capital landscape (Al Reem opening / Khalifa spine).",
  "Evaluate — Select a Khalifa project → deterministic Low/Medium/High assessment with evidence.",
  "Simulate — Run the hypothetical school → before/after coverage + KPI change.",
  "Close — Smarter investment · brighter communities · a more liveable Abu Dhabi.",
];

export function FallbackDemo({ onBack, backupVideoSrc }: { onBack: () => void; backupVideoSrc?: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", background: "var(--bg-0)", padding: "var(--space-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "var(--text-0)", margin: 0 }}>Deterministic fallback demonstration</h2>
        <button type="button" onClick={onBack} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>← Back</button>
      </div>
      <p style={{ color: "var(--text-1)" }}>Runs with no network and no live LLM — the guaranteed exhibition-recovery path.</p>
      <ol data-testid="fallback-script" style={{ color: "var(--text-1)", lineHeight: 1.7 }}>
        {FALLBACK_SCRIPT.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <div data-testid="backup-video-slot" style={{ marginTop: "var(--space-3)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-1)", padding: "var(--space-3)", color: "var(--text-2)" }}>
        {backupVideoSrc ? (
          <video src={backupVideoSrc} controls style={{ width: "100%", borderRadius: "var(--radius-1)" }} />
        ) : (
          <span>Backup video slot — owner-supplied operational asset, prepared &amp; verified before go-live. [REFERENCE NEEDED]</span>
        )}
      </div>
    </div>
  );
}
