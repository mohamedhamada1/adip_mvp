import { useState } from "react";
import type { AiContext } from "../ai/context";
import { suggestedQuestions, answerQuestion, type AiAnswer } from "../ai/templates";
import type { AllowlistedAction } from "../ai/actions";
import { useLang } from "../i18n/LangContext";
import type { Lang } from "../i18n/strings";

/**
 * Ask ADPIC AI — a CROSS-CUTTING explanation OVERLAY (not a fourth module/route). It favors suggested
 * questions + allowlisted actions over open autonomous chat (WORK-REQ-16/18). Answers are deterministic
 * templates grounded in the assembled context; absent info is stated honestly. No live LLM.
 */
export function AskAdpicAi({ ctx, onAction, onClose }: { ctx: AiContext; onAction: (a: AllowlistedAction) => void; onClose: () => void }) {
  const { t, lang, dir } = useLang();
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [asked, setAsked] = useState<string>("");
  const questions = suggestedQuestions(ctx, lang);
  const side = dir === "rtl" ? { left: 0, borderRight: "1px solid var(--stroke)" } : { right: 0, borderLeft: "1px solid var(--stroke)" };

  return (
    <div role="dialog" aria-label="Ask ADPIC AI" style={{ position: "absolute", ...side, top: 0, bottom: 0, width: "min(400px, 92vw)", overflow: "auto", background: "var(--bg-1)", padding: "var(--space-3)", boxShadow: "-10px 0 40px var(--shadow)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ color: "var(--text-0)" }}>{t.ask.title}</strong>
        <button type="button" onClick={onClose} aria-label={t.ask.close} style={{ background: "transparent", border: "none", color: "var(--text-2)", cursor: "pointer", fontSize: "18px" }}>×</button>
      </div>
      <div style={{ color: "var(--text-2)", fontSize: "12px", margin: "4px 0 var(--space-2)" }}>
        {t.ask.subtitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {questions.map((q) => (
          <button key={q.id} type="button" data-testid="suggested-q"
            onClick={() => { setAsked(q.text); setAnswer(answerQuestion(q.id, ctx, lang)); }}
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
              {actionLabel(answer.action.kind, lang)}
            </button>
          )}
          <div style={{ marginTop: "var(--space-2)", color: "var(--text-2)", fontSize: "11px" }}>
            {lang === "ar" ? "الذكاء الاصطناعي يشرح الأدلة؛ ولا يوافق أو يقرر." : "AI explains the evidence; it does not approve or decide."}
          </div>
        </div>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ marginTop: "var(--space-3)", paddingTop: "var(--space-2)", borderTop: "1px solid var(--stroke)", color: "var(--text-2)", fontSize: "11px", lineHeight: 1.4 }}>
        {t.ask.footer}
      </div>
    </div>
  );
}

function actionLabel(kind: string, lang: Lang): string {
  if (lang === "ar") {
    switch (kind) {
      case "focus-project": return "التركيز على المشروع";
      case "show-underserved": return "عرض المنطقة ناقصة الخدمة";
      case "open-assessment": return "فتح التقييم";
      case "open-simulator": return "فتح المحاكي";
      default: return "تنفيذ";
    }
  }
  switch (kind) {
    case "focus-project": return "Focus the project";
    case "show-underserved": return "Show underserved area";
    case "open-assessment": return "Open the assessment";
    case "open-simulator": return "Open the simulator";
    default: return "Do it";
  }
}
