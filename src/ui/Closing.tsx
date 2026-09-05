import { useLang } from "../i18n/LangContext";

/**
 * Closing / end-state (reference 09). Cinematic dark skyline (stylized silhouette — no photo asset;
 * real photography is an owner-supplied asset, flagged) + ADPIC / LIVEX lockups + the closing statement.
 */
function Skyline() {
  const bars = [8, 16, 12, 22, 14, 28, 18, 34, 20, 26, 15, 30, 12, 24, 10];
  let x = 0;
  return (
    <svg viewBox="0 0 300 60" preserveAspectRatio="none" role="img" aria-label="Abu Dhabi skyline" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "38%", opacity: 0.5 }}>
      {bars.map((h, i) => { const w = 300 / bars.length; const el = <rect key={i} x={x} y={60 - h} width={w - 2} height={h} fill="var(--bg-2)" />; x += w; return el; })}
    </svg>
  );
}

export function Closing({ onBack }: { onBack: () => void }) {
  const { t } = useLang();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(120% 90% at 50% 20%, var(--bg-2), var(--bg-0) 70%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--space-4)" }}>
      <Skyline />
      <div style={{ position: "absolute", top: "var(--space-3)", insetInlineStart: "var(--space-3)", color: "var(--text-0)", fontWeight: 800, letterSpacing: "0.15em" }}>{t.brand}</div>
      <div style={{ position: "absolute", top: "var(--space-3)", insetInlineEnd: "var(--space-3)", color: "var(--text-1)", fontWeight: 700, letterSpacing: "0.12em" }}>LIVEX 2026</div>
      <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
        <h1 style={{ color: "var(--text-0)", fontSize: "var(--title-size)", fontWeight: 700, lineHeight: 1.25, margin: 0 }}>
          {t.closing.l1}<br />{t.closing.l2}<br />{t.closing.l3}
        </h1>
        <div style={{ color: "var(--text-1)", letterSpacing: "0.2em", marginTop: "var(--space-3)" }}>{t.tagline}</div>
        <button type="button" onClick={onBack} style={{ marginTop: "var(--space-4)", padding: "10px 22px", borderRadius: "999px", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-1)", cursor: "pointer" }}>{t.closing.back}</button>
      </div>
    </div>
  );
}
