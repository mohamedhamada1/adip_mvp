/**
 * Hero / Landing. Establishes the story ("Understand the place → Evaluate an investment → Simulate
 * its impact") and offers a single "Start Experience" entry into Explore. No numeric literals.
 */
export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 var(--space-4)",
        background:
          "radial-gradient(120% 80% at 70% 10%, var(--bg-2), var(--bg-0) 60%)",
      }}
    >
      <div style={{ maxWidth: "40ch" }}>
        <div style={{ color: "var(--text-2)", letterSpacing: "0.2em", fontSize: "13px" }}>ADPIC</div>
        <h1 style={{ fontSize: "var(--title-size)", margin: "var(--space-2) 0", color: "var(--text-0)", fontWeight: 700 }}>
          Capital Intelligence
        </h1>
        <div style={{ color: "var(--text-1)", fontSize: "18px", letterSpacing: "0.08em" }}>
          People · Places · Possibilities
        </div>
        <p style={{ color: "var(--text-1)", fontSize: "18px", lineHeight: 1.5, marginTop: "var(--space-3)" }}>
          Understand the place.<br />
          Evaluate an investment.<br />
          Simulate its impact.
        </p>
        <button
          type="button"
          onClick={onStart}
          style={{
            marginTop: "var(--space-3)",
            padding: "12px 24px",
            borderRadius: "999px",
            border: "none",
            background: "var(--accent)",
            color: "var(--text-0)",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Start Experience →
        </button>
      </div>
      <div style={{ position: "absolute", bottom: "var(--space-3)", right: "var(--space-4)", color: "var(--text-2)", fontSize: "13px" }}>
        LIVEX 2026 · Abu Dhabi
      </div>
    </div>
  );
}
