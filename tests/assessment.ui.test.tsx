import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Assessment } from "../src/ui/Assessment";
import { scoreProject } from "../src/assessment/scoringEngine";
import { ASSESSMENT_DISCLAIMER } from "../src/assessment/disclaimer";
import { projectsForAoi } from "../src/data/portfolio.demo";

const result = scoreProject(projectsForAoi("khalifa")[0]);

describe("Assessment component — AC-3 disclaimer", () => {
  it("renders the EXACT approved WORK-BR-15 disclaimer", () => {
    render(<Assessment result={result} onBack={() => {}} />);
    expect(screen.getByTestId("disclaimer").textContent).toBe(ASSESSMENT_DISCLAIMER);
  });
});

describe("Assessment component — AC-4 rules-attributed, no AI-as-approver", () => {
  it("attributes the result to GIS/rules and separates explanation from evidence", () => {
    render(<Assessment result={result} onBack={() => {}} />);
    expect(screen.getByTestId("attribution").textContent).toMatch(/GIS indicators \+ business rules/);
    expect(screen.getByTestId("explanation")).toBeInTheDocument();
    expect(screen.getByTestId("dimension-table")).toBeInTheDocument();
  });
  it("contains NO AI-as-approver phrasing", () => {
    const { container } = render(<Assessment result={result} onBack={() => {}} />);
    const text = container.textContent || "";
    expect(text).not.toMatch(/AI[ -]?(approv|reject|authoriz|decid|recommend)/i); // NEGATIVE CONTROL
    expect(text).not.toMatch(/approved by AI|AI (decision|verdict|approval)/i);
  });
});

describe("Assessment component — AC-2 evidence rendered", () => {
  it("renders a dimension row per dimension with calculated evidence", () => {
    render(<Assessment result={result} onBack={() => {}} />);
    const rows = screen.getAllByTestId("dimension-row");
    expect(rows.length).toBe(result.dimensions.length);
    // at least one evidence string from the result appears in the table
    const anyEvidence = result.dimensions.find((d) => d.evidence.length)!.evidence[0];
    expect(screen.getByTestId("dimension-table").textContent).toContain(anyEvidence.split(" ")[0]);
  });
});
