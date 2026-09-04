import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Simulator } from "../src/ui/Simulator";

describe("Simulator — AC-4 sequence + AC-5 hypothetical + AC-2/3 before/after", () => {
  it("follows current → Simulate → intervention/KPI change → explanation, and labels the school hypothetical", () => {
    render(<Simulator onBack={() => {}} />);

    // Hypothetical/demo label is always visible (AC-5)
    expect(screen.getByTestId("hypothetical-label").textContent).toMatch(/hypothetical/i);

    // Current state: the after KPI deltas / explanation are NOT shown yet (NEGATIVE CONTROL)
    expect(screen.queryByTestId("kpi-deltas")).toBeNull();
    expect(screen.queryByTestId("sim-explanation")).toBeNull();

    // Simulate → after state
    fireEvent.click(screen.getByRole("button", { name: /Simulate the proposed school/i }));

    // Before/After maps (AC-2), KPI deltas (AC-3), newly-covered, and the explanation (AC-4) now appear
    expect(screen.getByRole("img", { name: /Current state/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /With proposed school/i })).toBeInTheDocument();
    expect(screen.getByTestId("kpi-deltas")).toBeInTheDocument();
    expect(screen.getAllByTestId("sim-kpi").length).toBeGreaterThanOrEqual(5);
    expect(screen.getByTestId("newly-covered").textContent).toMatch(/Sector/);
    expect(screen.getByTestId("sim-explanation")).toBeInTheDocument();
  });
});
