import { useState } from "react";
import type { AiContext } from "../ai/context";
import { suggestedQuestions, answerQuestion, type AiAnswer } from "../ai/templates";
import type { AllowlistedAction } from "../ai/actions";

/**
 * Ask ADPIC AI — a CROSS-CUTTING explanation OVERLAY (not a fourth module/route). It favors suggested
 * questions + allowlisted actions over open autonomous chat (WORK-REQ-16/18). Answers are deterministic
 * templates grounded in the assembled context; absent info is stated honestly. No live LLM.
 */
export function AskAdpicAi({ ctx, onAction, onClose }: { ctx: AiContext; onAction: (a: AllowlistedAction) => void; onClose: () => void }) {
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [asked, setAsked] = useState<string>("");
  const questions = suggestedQuestions(ctx);

  return (
    <div role="dialog" aria-label="Ask ADPIC AI" style={{ position: "absolute", right: "var(--space-3)", bottom: "var(--space-3)", width: "min(420px, 90vw)", maxHeight: "70vh", overflow: "auto", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-3)", boxShadow: "0 10px 40px var(--shadow)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ color: "var(--text-0)" }}>Ask ADPIC AI</strong>
        <button type="button" onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: "18px" }}>×</button>
      </div>
      <div style={{ color: "var(--text-2)", fontSize: "12px", margin: "4px 0 var(--space-2)" }}>
        Suggested questions — deterministic explanations grounded in the approved demo context (no live LLM).
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {questions.map((q) => (
          <button key={q.id} type="button" data-testid="suggested-q"
            onClick={() => { setAsked(q.text); setAnswer(answerQuestion(q.id, ctx)); }}
            style={{ textAlign: "left", padding: "8px 10px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", cursor: "pointer", fontSize: "13px" }}>
            {q.text}
          </button>
        ))}
      </div>
      {answer && (
        <div data-testid="ai-answer" style={{ marginTop: "var(--space-3)", padding: "var(--space-2)", border: "1px dashed var(--stroke)", borderRadius: "var(--radius-1)" }}>
          <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "4px" }}>{asked}</div>
          <p style={{ color: answer.sourced ? "var(--text-1)" : "var(--warn)", margin: 0, lineHeight: 1.5 }}>{answer.text}</p>
          {answer.action && (
            <button type="button" data-testid="ai-action" onClick={() => onAction(answer.action as AllowlistedAction)}
              style={{ marginTop: "var(--space-2)", padding: "8px 14px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
              {actionLabel(answer.action.kind)}
            </button>
          )}
          <div style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "11px" }}>
            AI explains the evidence; it does not approve or decide.
          </div>
        </div>
      )}
    </div>
  );
}

function actionLabel(kind: string): string {
  switch (kind) {
    case "focus-project": return "Focus the project";
    case "show-underserved": return "Show underserved area";
    case "open-assessment": return "Open the assessment";
    case "open-simulator": return "Open the simulator";
    default: return "Do it";
  }
}
