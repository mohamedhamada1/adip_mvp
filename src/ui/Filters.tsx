import type { Sector } from "../data/types";
import { SECTORS } from "../data/types";

/** Sector filter chips. Toggling a chip changes the visible marker set (AC-2, via App state). */
export function Filters({
  active,
  onToggle,
}: {
  active: Set<Sector>;
  onToggle: (s: Sector) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
      {SECTORS.map((s) => {
        const on = active.has(s);
        return (
          <button
            key={s}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(s)}
            style={{
              padding: "6px 12px",
              borderRadius: "var(--radius-1)",
              border: "1px solid var(--stroke)",
              background: on ? "var(--accent-soft)" : "var(--bg-2)",
              color: on ? "var(--accent-2)" : "var(--text-1)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
