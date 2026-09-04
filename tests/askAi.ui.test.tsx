import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AskAdpicAi } from "../src/ui/AskAdpicAi";
import { assembleContext } from "../src/ai/context";
import { ABSENT_INFO_MESSAGE } from "../src/ai/templates";
import { projectsForAoi } from "../src/data/portfolio.demo";
import { scoreProject } from "../src/assessment/scoringEngine";

const project = projectsForAoi("khalifa")[0];
const ctx = assembleContext("khalifa", project, scoreProject(project));

describe("AskAdpicAi — AC-1 suggested questions + AC-4 absent-info + allowlisted action", () => {
  it("renders suggested-question chips and answers a grounded question with an allowlisted action", () => {
    const onAction = vi.fn();
    render(<AskAdpicAi ctx={ctx} onAction={onAction} onClose={() => {}} />);
    const chips = screen.getAllByTestId("suggested-q");
    expect(chips.length).toBeGreaterThanOrEqual(1);

    // grounded question → answer + action button
    fireEvent.click(screen.getByRole("button", { name: /Which area has the greatest service gap/i }));
    expect(screen.getByTestId("ai-answer")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("ai-action"));
    expect(onAction).toHaveBeenCalled();
    expect(["show-underserved", "open-assessment", "open-simulator", "focus-project"]).toContain(onAction.mock.calls[0][0].kind);
  });

  it("answers an absent-info question honestly (not invented)", () => {
    render(<AskAdpicAi ctx={ctx} onAction={() => {}} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /awarded contractor/i }));
    expect(screen.getByTestId("ai-answer").textContent).toContain(ABSENT_INFO_MESSAGE);
  });
});
