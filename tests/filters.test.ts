import { describe, it, expect } from "vitest";
import { filterProjects, toggleSector } from "../src/data/filters";
import { projectsForAoi } from "../src/data/portfolio.demo";
import type { Sector } from "../src/data/types";

describe("filterProjects (AC-2 marker-set behaviour)", () => {
  const all = projectsForAoi("khalifa");

  it("empty active set → all projects", () => {
    expect(filterProjects(all, new Set()).length).toBe(all.length);
  });

  it("a sector filter narrows to that sector only", () => {
    const edu = filterProjects(all, new Set<Sector>(["Education"]));
    expect(edu.length).toBeGreaterThan(0);
    expect(edu.length).toBeLessThan(all.length); // NEGATIVE CONTROL: unchanged set = broken filter
    expect(edu.every((p) => p.sector === "Education")).toBe(true);
  });
});

describe("toggleSector (immutable)", () => {
  it("adds then removes a sector, returning new sets", () => {
    const a = new Set<Sector>();
    const b = toggleSector(a, "Health");
    expect(b.has("Health")).toBe(true);
    expect(a.has("Health")).toBe(false); // original untouched
    const c = toggleSector(b, "Health");
    expect(c.has("Health")).toBe(false);
  });
});
