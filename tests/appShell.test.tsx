import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { AppShell } from "../src/AppShell";
import { makeFakeSceneApi } from "./fakeSceneApi";
import { projectsForAoi } from "../src/data/portfolio.demo";
import { ASSESSMENT_DISCLAIMER } from "../src/assessment/disclaimer";

describe("AppShell — AC-7 Explore→Evaluate wiring + view preservation", () => {
  it("selecting a project and evaluating opens the Assessment for THAT project; Back preserves the mounted view", () => {
    const f = makeFakeSceneApi();
    render(<AppShell sceneApi={f.api} />);

    // Hero → Explore
    fireEvent.click(screen.getByRole("button", { name: /Start Experience/i }));
    expect(f.createView).toHaveBeenCalledTimes(1); // view built once on entering Explore

    // select the first Khalifa project → Project Details bridge, then Evaluate
    const firstProject = projectsForAoi("khalifa")[0];
    fireEvent.click(screen.getByRole("button", { name: new RegExp(firstProject.nameEn.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }));
    expect(screen.getByTestId("project-details")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Evaluate this investment/i }));

    // Assessment is rendered for THAT project, with the disclaimer
    expect(screen.getByText(ASSESSMENT_DISCLAIMER)).toBeInTheDocument();
    const table = screen.getByTestId("dimension-table");
    expect(within(table).getAllByTestId("dimension-row").length).toBeGreaterThan(0);

    // Back → Project Details, then Explore; the SceneView was NOT recreated or destroyed (AC-3/AC-7)
    fireEvent.click(screen.getByRole("button", { name: /Back to project/i }));
    const details = screen.getByTestId("project-details");
    fireEvent.click(within(details).getByRole("button", { name: /Explore/i }));
    expect(f.createView).toHaveBeenCalledTimes(1); // NEGATIVE CONTROL: recreate-on-back would be >1
    expect(f.view.destroy).not.toHaveBeenCalled();
  });
});
