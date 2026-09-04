import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Simulator } from "../src/ui/Simulator";

describe("Simulator — AC-4 Current→Proposed reveal + AC-2/3/5 on real Khalifa geography", () => {
  it("starts on Current, and the Simulate toggle reveals the proposed school, deltas and newly-covered", () => {
    render(<Simulator onBack={() => {}} />);

    // hypothetical/demo label always visible (AC-5)
    expect(screen.getByTestId("hypothetical-label").textContent).toMatch(/hypothetical/i);
    // starts on the Current map
    expect(screen.getByRole("img", { name: /Current state/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("sim-kpi").length).toBeGreaterThanOrEqual(5);

    // reveal the proposed scenario
    fireEvent.click(screen.getByRole("button", { name: /Simulate the proposed school/i }));

    // map now shows the proposed scenario; KPI deltas + newly-covered + explanation present (AC-2/3/4)
    expect(screen.getByRole("img", { name: /With proposed school/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("sim-kpi").length).toBeGreaterThanOrEqual(5);
    expect(screen.getByTestId("newly-covered").textContent).toMatch(/Sector/);
    expect(screen.getByTestId("sim-explanation")).toBeInTheDocument();
  });

  it("provides a Current ⟷ Proposed toggle (controlled scenario switch)", () => {
    render(<Simulator onBack={() => {}} />);
    expect(screen.getByRole("tab", { name: /^Current$/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /With Proposed School/i })).toBeInTheDocument();
  });
});
