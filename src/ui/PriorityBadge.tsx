import type { Band } from "../assessment/scoringEngine";

const COLOR: Record<Band, string> = {
  High: "var(--good)",
  Medium: "var(--warn)",
  Low: "var(--text-2)",
  "Insufficient data": "var(--text-2)",
};

/** Overall priority badge. Renders the deterministic band (attributed to rules), never an approval. */
export function PriorityBadge({ band }: { band: Band }) {
  return (
    <div
      role="status"
      aria-label={`Overall priority: ${band}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 22px",
        borderRadius: "var(--radius-2)",
        border: `2px solid ${COLOR[band]}`,
        color: COLOR[band],
        fontSize: "var(--kpi-size)",
        fontWeight: 800,
        letterSpacing: "0.04em",
        background: "var(--bg-1)",
      }}
    >
      {band}
    </div>
  );
}
