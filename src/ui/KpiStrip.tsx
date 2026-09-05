import type { Kpis } from "../data/kpis";
import { useLang } from "../i18n/LangContext";
import { fmtAedL, fmtPeopleL } from "../i18n/strings";

/**
 * KPI strip. Every value is COMPUTED from the frozen dataset (passed in) and rendered as a JS
 * expression — never a typed numeric literal (INV-no-mockup-numbers / AC-5). If the dataset is empty
 * the value falls back to "—".
 */
export function KpiStrip({ kpis }: { kpis: Kpis }) {
  const { t, lang } = useLang();
  const cells: { label: string; value: string }[] = [
    { label: t.kpi.totalProjects, value: kpis.totalProjects ? String(kpis.totalProjects) : "—" },
    { label: t.kpi.totalInvestment, value: kpis.totalProjects ? fmtAedL(kpis.totalInvestmentAed, lang) : "—" },
    { label: t.kpi.underDelivery, value: kpis.totalProjects ? String(kpis.underDelivery) : "—" },
    { label: t.kpi.planned, value: kpis.totalProjects ? String(kpis.planned) : "—" },
    { label: t.kpi.populationServed, value: kpis.totalProjects ? fmtPeopleL(kpis.populationServed, lang) : "—" },
  ];
  return (
    <div
      role="group"
      aria-label="Portfolio indicators"
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        padding: "var(--space-2) var(--space-3)",
        borderTop: "1px solid var(--stroke)",
        background: "linear-gradient(180deg, rgba(11,18,32,0.75), var(--bg-0))",
        backdropFilter: "blur(2px)",
      }}
    >
      {cells.map((c, i) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "2px var(--space-4)",
            borderLeft: i === 0 ? "none" : "1px solid var(--stroke)",
          }}
        >
          <span data-testid="kpi-value" style={{ fontSize: "var(--kpi-size)", fontWeight: 800, color: "var(--text-0)", lineHeight: 1.05 }}>
            {c.value}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-2)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
