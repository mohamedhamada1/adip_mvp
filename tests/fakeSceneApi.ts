import { vi } from "vitest";
import type { SceneApi, ViewHandle } from "../src/scene/sceneApi";

/** A fake SceneApi that records calls — lets us assert scene BEHAVIOUR without @arcgis/core. */
export function makeFakeSceneApi() {
  const view = {
    goToCamera: vi.fn().mockResolvedValue(undefined),
    goToPoint: vi.fn().mockResolvedValue(undefined),
    setBoundary: vi.fn(),
    setProjects: vi.fn(),
    emphasize: vi.fn(),
    destroy: vi.fn(),
  } satisfies ViewHandle;

  let capturedOnError: ((err: unknown) => void) | null = null;
  const createView = vi.fn((_container: HTMLElement, onLayerError: (err: unknown) => void): ViewHandle => {
    capturedOnError = onLayerError;
    return view;
  });

  const api: SceneApi = { createView };
  return {
    api,
    view,
    createView,
    /** Simulate the 3D buildings layer failing to load. */
    triggerLayerError: () => capturedOnError?.(new Error("layer load failed")),
  };
}
