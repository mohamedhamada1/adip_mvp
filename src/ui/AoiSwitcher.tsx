import type { AoiId } from "../data/types";
import { availableAois } from "../scene/aoi";
import { useLang } from "../i18n/LangContext";
import { aoiName } from "../i18n/strings";

/**
 * AOI switcher. Selecting an AOI calls onSwitch, which updates the mounted SceneView (no reload).
 * Only AOIs whose `enabled` flag is true are offered — so a disabled Al Reem simply doesn't appear
 * and Khalifa remains the spine, keeping the app coherent (AC-4 / WORK-EX-4).
 */
export function AoiSwitcher({ active, onSwitch }: { active: AoiId; onSwitch: (a: AoiId) => void }) {
  const { lang } = useLang();
  const aois = availableAois();
  return (
    <div role="tablist" aria-label="Area of Interest" style={{ display: "flex", gap: "var(--space-1)" }}>
      {aois.map((a) => {
        const on = a.id === active;
        return (
          <button
            key={a.id}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => onSwitch(a.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-1)",
              border: "1px solid var(--stroke)",
              background: on ? "var(--accent)" : "var(--bg-2)",
              color: on ? "var(--text-0)" : "var(--text-1)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {aoiName(a.id, lang)}
          </button>
        );
      })}
    </div>
  );
}
