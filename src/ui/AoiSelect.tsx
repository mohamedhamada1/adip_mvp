import type { AoiId } from "../data/types";
import { availableAois } from "../scene/aoi";
import { useLang } from "../i18n/LangContext";
import { aoiName } from "../i18n/strings";

/**
 * "Select Area of Interest" (reference 07) — two large cards. Only enabled AOIs appear (a disabled Al Reem
 * simply doesn't show; Khalifa remains the spine). Photography is an owner-supplied asset (stylized gradient
 * placeholder now, flagged). Selecting an AOI enters Explore for it.
 */
const TINT: Record<AoiId, string> = {
  khalifa: "linear-gradient(135deg, var(--bg-2), var(--accent-soft))",
  reem: "linear-gradient(135deg, var(--accent-soft), var(--bg-2))",
};

export function AoiSelect({ onSelect }: { onSelect: (a: AoiId) => void }) {
  const { t, lang, dir } = useLang();
  const aois = availableAois();
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg-0)", padding: "var(--space-4)", overflow: "auto" }}>
      <h2 style={{ color: "var(--text-0)" }}>{t.aoiSelect.title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
        {aois.map((a) => (
          <button key={a.id} type="button" onClick={() => onSelect(a.id)}
            style={{ textAlign: "left", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", overflow: "hidden", background: "var(--bg-1)", cursor: "pointer", padding: 0 }}>
            <div style={{ height: "160px", background: TINT[a.id], display: "flex", alignItems: "flex-end", padding: "var(--space-3)" }}>
              <span style={{ color: "var(--text-2)", fontSize: "10px" }}>{t.aoiSelect.photo}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-3)" }}>
              <div>
                <div style={{ color: "var(--text-0)", fontSize: "20px", fontWeight: 700 }}>{aoiName(a.id, lang)}</div>
                <div style={{ color: "var(--text-2)", fontSize: "13px" }}>{t.aoiSelect.sub[a.id]}</div>
              </div>
              <span style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid var(--accent)", color: "var(--accent-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{dir === "rtl" ? "←" : "→"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
