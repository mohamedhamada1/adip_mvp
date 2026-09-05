import { useLang } from "../i18n/LangContext";
import { LangToggle } from "./LangToggle";

/**
 * Hero / Landing (reference 01). Cinematic dark composition: ADPIC logo + working EN/عربي toggle top bar,
 * big title + tagline + Start CTA, LIVEX lockup. No photo asset (stylized skyline silhouette; real
 * photography is an owner-supplied asset, flagged). EN/عربي now switches the whole app to Arabic (RTL).
 */
function Skyline() {
  const bars = [10, 18, 14, 26, 16, 34, 22, 44, 24, 30, 18, 38, 14, 28, 12, 20];
  let x = 0;
  return (
    <svg viewBox="0 0 320 70" preserveAspectRatio="none" role="img" aria-label="Abu Dhabi skyline" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "45%", opacity: 0.45 }}>
      {bars.map((h, i) => { const w = 320 / bars.length; const el = <rect key={i} x={x} y={70 - h} width={w - 2} height={h} fill="var(--bg-2)" />; x += w; return el; })}
    </svg>
  );
}

export function Hero({ onStart }: { onStart: () => void }) {
  const { t, dir } = useLang();
  const startSide = dir === "rtl" ? { left: "var(--space-4)" } : { right: "var(--space-4)" };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(130% 90% at 72% 8%, var(--bg-2), var(--bg-0) 62%)" }}>
      <Skyline />
      {/* top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3) var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <strong style={{ color: "var(--text-0)", letterSpacing: "0.12em" }}>{t.brand}</strong>
          <span style={{ color: "var(--text-2)", fontSize: "12px" }}>{t.product}</span>
        </div>
        <LangToggle />
      </div>
      {/* main */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--space-4)" }}>
        <div style={{ maxWidth: "42ch", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "var(--title-size)", margin: 0, color: "var(--text-0)", fontWeight: 800, lineHeight: 1.05 }}>{t.product}</h1>
          <div style={{ color: "var(--text-1)", fontSize: "18px", letterSpacing: "0.14em", marginTop: "var(--space-2)" }}>{t.tagline}</div>
          <p style={{ color: "var(--text-1)", fontSize: "18px", lineHeight: 1.5, marginTop: "var(--space-3)" }}>
            {t.hero.understand}<br />{t.hero.evaluate}<br />{t.hero.simulate}
          </p>
          <button type="button" onClick={onStart} style={{ marginTop: "var(--space-3)", padding: "12px 26px", borderRadius: "999px", border: "none", background: "var(--accent)", color: "var(--text-0)", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}>
            {t.hero.start}
          </button>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "var(--space-3)", ...startSide, color: "var(--text-2)", fontSize: "13px", letterSpacing: "0.08em" }}>{t.hero.livex}</div>
    </div>
  );
}
