import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Filters } from "../src/ui/Filters";
import { KpiStrip } from "../src/ui/KpiStrip";
import { Attribution } from "../src/ui/Attribution";
import { computeKpis } from "../src/data/kpis";
import { projectsForAoi } from "../src/data/portfolio.demo";
import type { Sector } from "../src/data/types";

describe("Filters component (AC-2 interaction)", () => {
  it("toggling a chip calls onToggle and reflects aria-pressed", () => {
    const onToggle = vi.fn();
    const { rerender } = render(<Filters active={new Set()} onToggle={onToggle} />);
    const edu = screen.getByRole("button", { name: "Education" });
    expect(edu).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(edu);
    expect(onToggle).toHaveBeenCalledWith("Education");
    rerender(<Filters active={new Set<Sector>(["Education"])} onToggle={onToggle} />);
    expect(screen.getByRole("button", { name: "Education" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("KpiStrip component (AC-5 computed values, no literals)", () => {
  it("renders values computed from the dataset", () => {
    const kpis = computeKpis(projectsForAoi("khalifa"));
    render(<KpiStrip kpis={kpis} />);
    const values = screen.getAllByTestId("kpi-value").map((n) => n.textContent);
    expect(values[0]).toBe(String(kpis.totalProjects)); // matches computed count, not a mockup literal
    expect(values[0]).not.toBe("219");
  });

  it("empty dataset renders — placeholders, never a mockup literal", () => {
    render(<KpiStrip kpis={computeKpis([])} />);
    for (const n of screen.getAllByTestId("kpi-value")) expect(n.textContent).toBe("—");
  });
});

describe("Attribution component (AC-5 / condition C3)", () => {
  it("renders required source attributions", () => {
    render(<Attribution />);
    expect(screen.getByText(/AD-SDI/)).toBeInTheDocument();
    expect(screen.getByText(/synthetic demonstration data/i)).toBeInTheDocument();
  });
});
