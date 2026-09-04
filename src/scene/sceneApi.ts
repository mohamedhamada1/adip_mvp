import type { AoiCamera } from "./aoi";
import type { ProjectRecord } from "../data/types";
import type { AoiBoundary } from "../data/aoiBoundaries";

/**
 * Abstraction over the 3D view so the SceneController is testable WITHOUT importing the heavy
 * @arcgis/core WebGL SDK. The real implementation (arcgisSceneApi) uses @arcgis/core; tests inject
 * a mock. This is what lets the "SceneView constructed exactly once" and "degrade without reload"
 * behaviours be asserted by executable unit tests (the reviewer's Builder-Readiness concern).
 */
export interface ViewHandle {
  goToCamera(cam: AoiCamera): Promise<void>;
  goToPoint(lon: number, lat: number): Promise<void>;
  setBoundary(boundary: AoiBoundary): void;
  setProjects(projects: ProjectRecord[]): void;
  /** Emphasize/highlight a project (selection). */
  emphasize(projectId: string | null): void;
  destroy(): void;
}

export interface SceneApi {
  /** Construct the 3D view ONCE, attached to the container. Adds the tokenless Esri 3D Buildings layer. */
  createView(container: HTMLDivElement, onLayerError: (err: unknown) => void): ViewHandle;
}
