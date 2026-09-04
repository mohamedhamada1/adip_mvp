import type { Kpis } from "../data/kpis";
import { formatAed, formatPeople } from "../data/kpis";

/**
 * KPI strip. Every value is COMPUTED from the frozen dataset (passed in) and rendered as a JS
 * expression — never a typed numeric literal (INV-no-mockup-numbers / AC-5). If the dataset is empty
 * the value falls back to "—".
 */
export function KpiStrip({ kpis }: { kpis: Kpis }) {
  const cells: { label: string; value: string }[] = [
    { label: "Total Projects", value: kpis.totalProjects ? String(kpis.totalProjects) : "—" },
    { label: "Total Investment", value: kpis.totalProjects ? formatAed(kpis.totalInvestmentAed) : "—" },
    { label: "Under Delivery", value: kpis.totalProjects ? String(kpis.underDelivery) : "—" },
    { label: "Planned", value: kpis.totalProjects ? String(kpis.planned) : "—" },
    { label: "Population Served", value: kpis.totalProjects ? formatPeople(kpis.populationServed) : "—" },
  ];
  return (
    <div
      role="group"
      aria-label="Portfolio indicators"
      style={{
        display: "flex",
        gap: "var(--space-4)",
        padding: "var(--space-2) var(--space-3)",
        background: "linear-gradient(180deg, transparent, var(--bg-0))",
      }}
    >
      {cells.map((c) => (
        <div key={c.label} style={{ display: "flex", flexDirection: "column" }}>
          <span data-testid="kpi-value" style={{ fontSize: "var(--kpi-size)", fontWeight: 700, color: "var(--text-0)" }}>
            {c.value}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-2)", letterSpacing: "0.04em" }}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}
