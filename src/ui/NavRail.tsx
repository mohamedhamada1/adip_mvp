/**
 * Left navigation rail — the unifying exhibition chrome from references 02/04/05/06/07/08. A nav SKIN over
 * the existing view state (no routing): each item selects a view or toggles the Ask-AI panel. ADPIC lockup
 * at top; active item highlighted. Rendered across the main states.
 */
export type NavKey = "explore" | "dashboard" | "evaluate" | "simulate" | "ask";

const ITEMS: { key: NavKey; label: string; glyph: string }[] = [
  { key: "explore", label: "Explore", glyph: "◎" },
  { key: "dashboard", label: "Projects", glyph: "▦" },
  { key: "evaluate", label: "Assessment", glyph: "▤" },
  { key: "simulate", label: "Simulation", glyph: "◇" },
  { key: "ask", label: "Ask AI", glyph: "✦" },
];

export function NavRail({ active, askActive, onNav }: { active: NavKey; askActive: boolean; onNav: (k: NavKey) => void }) {
  return (
    <nav aria-label="Primary" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "84px", background: "var(--bg-1)", borderRight: "1px solid var(--stroke)", display: "flex", flexDirection: "column", alignItems: "stretch", padding: "var(--space-3) 0", zIndex: 6 }}>
      <div style={{ textAlign: "center", color: "var(--text-0)", fontWeight: 800, letterSpacing: "0.08em", marginBottom: "var(--space-4)", fontSize: "13px" }}>ADPIC</div>
      {ITEMS.map((it) => {
        const on = it.key === "ask" ? askActive : active === it.key;
        return (
          <button key={it.key} type="button" onClick={() => onNav(it.key)} aria-current={on ? "page" : undefined}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "10px 4px", border: "none", borderLeft: on ? "3px solid var(--accent)" : "3px solid transparent", background: on ? "var(--accent-soft)" : "transparent", color: on ? "var(--accent-2)" : "var(--text-2)", cursor: "pointer" }}>
            <span aria-hidden style={{ fontSize: "18px" }}>{it.glyph}</span>
            <span style={{ fontSize: "10px" }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
