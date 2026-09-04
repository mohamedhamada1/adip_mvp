import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "../src/ui/ProjectCard";
import { projectsForAoi } from "../src/data/portfolio.demo";

const project = projectsForAoi("khalifa")[0];

describe("ProjectCard — AC-8 selection focus", () => {
  it("shows the selected project's dataset fields, provenance, and an Evaluate action tied to it", () => {
    const onEvaluate = vi.fn();
    render(<ProjectCard project={project} onEvaluate={onEvaluate} onSimulate={() => {}} />);
    const card = screen.getByTestId("project-card");
    expect(card.textContent).toContain(project.nameEn);
    expect(card.textContent).toContain(project.sector);
    expect(card.textContent).toMatch(/Synthetic|Demo/i); // provenance shown (demo data honesty)
    fireEvent.click(screen.getByRole("button", { name: /Evaluate this investment/i }));
    expect(onEvaluate).toHaveBeenCalledTimes(1); // Evaluate tied to the selected project
  });
});
