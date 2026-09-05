import { useLang } from "../i18n/LangContext";

/** EN / عربي language switch — flips the whole app between English (LTR) and Arabic (RTL). */
export function LangToggle() {
  const { lang, setLang } = useLang();
  const cell = (active: boolean): React.CSSProperties => ({
    padding: "6px 10px",
    background: active ? "var(--accent-soft)" : "transparent",
    color: active ? "var(--text-0)" : "var(--text-2)",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    border: "none",
    fontSize: "12px",
  });
  return (
    <div role="group" aria-label="Language" style={{ border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", overflow: "hidden", display: "inline-flex" }}>
      <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} style={cell(lang === "en")}>EN</button>
      <button type="button" onClick={() => setLang("ar")} aria-pressed={lang === "ar"} lang="ar" style={cell(lang === "ar")}>عربي</button>
    </div>
  );
}
