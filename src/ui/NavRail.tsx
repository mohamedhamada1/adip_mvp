/**
 * Left navigation rail — the unifying exhibition chrome from references 02/04/05/06/07/08. A nav SKIN over
 * the existing view state (no routing): each item selects a view or toggles the Ask-AI panel. ADPIC lockup
 * at top; active item highlighted. Rendered across the main states.
 */
import { useLang } from "../i18n/LangContext";

export type NavKey = "explore" | "dashboard" | "evaluate" | "simulate" | "ask";

const ITEMS: { key: NavKey; tk: "explore" | "projects" | "assessment" | "simulation" | "ask"; glyph: string }[] = [
  { key: "explore", tk: "explore", glyph: "◎" },
  { key: "dashboard", tk: "projects", glyph: "▦" },
  { key: "evaluate", tk: "assessment", glyph: "▤" },
  { key: "simulate", tk: "simulation", glyph: "◇" },
  { key: "ask", tk: "ask", glyph: "✦" },
];

export function NavRail({ active, askActive, onNav }: { active: NavKey; askActive: boolean; onNav: (k: NavKey) => void }) {
  const { t, dir } = useLang();
  const side = dir === "rtl" ? { right: 0 } : { left: 0 };
  const edge = dir === "rtl" ? { borderLeft: "1px solid var(--stroke)" } : { borderRight: "1px solid var(--stroke)" };
  return (
    <nav aria-label="Primary" style={{ position: "absolute", top: 0, bottom: 0, ...side, width: "84px", background: "var(--bg-1)", ...edge, display: "flex", flexDirection: "column", alignItems: "stretch", padding: "var(--space-3) 0", zIndex: 6 }}>
      <div style={{ textAlign: "center", color: "var(--text-0)", fontWeight: 800, letterSpacing: "0.08em", marginBottom: "var(--space-4)", fontSize: "13px" }}>{t.brand}</div>
      {ITEMS.map((it) => {
        const on = it.key === "ask" ? askActive : active === it.key;
        const accentEdge = dir === "rtl"
          ? { borderRight: on ? "3px solid var(--accent)" : "3px solid transparent" }
          : { borderLeft: on ? "3px solid var(--accent)" : "3px solid transparent" };
        return (
          <button key={it.key} type="button" onClick={() => onNav(it.key)} aria-current={on ? "page" : undefined}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "10px 4px", border: "none", ...accentEdge, background: on ? "var(--accent-soft)" : "transparent", color: on ? "var(--accent-2)" : "var(--text-2)", cursor: "pointer" }}>
            <span aria-hidden style={{ fontSize: "18px" }}>{it.glyph}</span>
            <span style={{ fontSize: "10px" }}>{t.nav[it.tk]}</span>
          </button>
        );
      })}
    </nav>
  );
}
