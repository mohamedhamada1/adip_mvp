import { describe, it, expect, vi } from "vitest";
import { SceneController } from "../src/scene/sceneController";
import { makeFakeSceneApi } from "./fakeSceneApi";
import { projectsForAoi } from "../src/data/portfolio.demo";

function container() {
  return document.createElement("div");
}

describe("SceneController — AC-3 (SceneView built once, swap on mounted view, no reload)", () => {
  it("constructs the view EXACTLY ONCE across init + multiple AOI switches", () => {
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api);
    c.init(container(), "khalifa");
    c.goToAoi("reem");
    c.goToAoi("khalifa");
    c.goToAoi("reem");
    expect(f.createView).toHaveBeenCalledTimes(1); // NEGATIVE CONTROL: a per-switch new view would be >1
    expect(c.viewCreateCount).toBe(1);
  });

  it("a second init() is a no-op (never a second view)", () => {
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api);
    c.init(container(), "khalifa");
    c.init(container(), "reem");
    expect(f.createView).toHaveBeenCalledTimes(1);
  });

  it("goToAoi updates the SAME view's camera + layers (no new view)", () => {
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api);
    c.init(container(), "khalifa");
    c.goToAoi("reem");
    expect(f.view.goToCamera).toHaveBeenCalled();
    expect(f.view.setBoundary).toHaveBeenCalled();
    expect(f.view.setProjects).toHaveBeenCalled();
    expect(f.createView).toHaveBeenCalledTimes(1); // AC-3: swap on the mounted view, no new view
    // (the "no location.reload" half is enforced deterministically by verify.sh AC-3's static grep.)
  });
});

describe("SceneController — AC-2 (filter changes the visible marker set; select flies to project)", () => {
  it("setSectorFilter narrows the visible set and pushes it to the view", () => {
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api);
    c.init(container(), "khalifa");
    const all = c.setSectorFilter(new Set());
    const edu = c.setSectorFilter(new Set(["Education"]));
    expect(edu.length).toBeLessThan(all.length); // filter actually changes the marker set
    expect(edu.every((p) => p.sector === "Education")).toBe(true);
    expect(f.view.setProjects).toHaveBeenLastCalledWith(edu);
  });

  it("focusProject flies the mounted view to the project and emphasizes it", () => {
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api);
    c.init(container(), "khalifa");
    const p = projectsForAoi("khalifa")[0];
    c.focusProject(p);
    expect(f.view.goToPoint).toHaveBeenCalledWith(p.lon, p.lat);
    expect(f.view.emphasize).toHaveBeenCalledWith(p.id);
  });
});

describe("SceneController — AC-4 (degrade without reload)", () => {
  it("enters degraded state on a 3D-layer error and fires onDegrade (no throw, no reload)", () => {
    const onDegrade = vi.fn();
    const f = makeFakeSceneApi();
    const c = new SceneController(f.api, { onDegrade });
    c.init(container(), "khalifa");
    expect(c.degraded).toBe(false); // NEGATIVE CONTROL: not degraded before the failure
    f.triggerLayerError();
    expect(c.degraded).toBe(true);
    expect(onDegrade).toHaveBeenCalledWith(true);
    // no reload: the controller never references location.* (enforced by verify.sh AC-3 static grep).
  });
});
