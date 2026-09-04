import type { SceneApi, ViewHandle } from "./sceneApi";
import { AOIS } from "./aoi";
import type { AoiId, ProjectRecord, Sector } from "../data/types";
import { AOI_BOUNDARIES } from "../data/aoiBoundaries";
import { projectsForAoi } from "../data/portfolio.demo";
import { filterProjects } from "../data/filters";

export interface SceneControllerHooks {
  onDegrade?: (degraded: boolean) => void;
}

/**
 * Owns the single 3D view for the app's whole lifetime. The view is created EXACTLY ONCE (in init);
 * every AOI switch, filter change, and selection updates that SAME view — never re-instantiates it and
 * never reloads the document (AC-3). On a 3D-layer load failure it enters a degraded state WITHOUT a
 * reload (AC-4). All ArcGIS specifics live behind the injected SceneApi so this is unit-testable.
 */
export class SceneController {
  private view: ViewHandle | null = null;
  private activeAoi: AoiId = "khalifa";
  private activeSectors = new Set<Sector>();
  /** Test/inspection: how many times a view was constructed (must stay 1 after init). */
  viewCreateCount = 0;
  degraded = false;

  constructor(private api: SceneApi, private hooks: SceneControllerHooks = {}) {}

  /** Create the view once and render the initial AOI. Idempotent: a second call is a no-op. */
  init(container: HTMLDivElement, initialAoi: AoiId): void {
    if (this.view) return; // already initialised — never build a second view
    this.view = this.api.createView(container, (err) => this.handleLayerError(err));
    this.viewCreateCount += 1;
    this.goToAoi(initialAoi);
  }

  /** Switch AOI by updating the EXISTING view's camera + layers (no new view, no reload). */
  goToAoi(aoi: AoiId): void {
    this.activeAoi = aoi;
    if (!this.view) return;
    this.view.setBoundary(AOI_BOUNDARIES[aoi]);
    this.view.setProjects(this.visibleProjects());
    void this.view.goToCamera(AOIS[aoi].camera);
  }

  /** Apply a sector filter to the current AOI and return the now-visible projects (marker set). */
  setSectorFilter(active: Set<Sector>): ProjectRecord[] {
    this.activeSectors = new Set(active);
    const visible = this.visibleProjects();
    this.view?.setProjects(visible);
    return visible;
  }

  /** Select/focus a project: fly the existing view to it and emphasize it. */
  focusProject(project: ProjectRecord | null): void {
    if (!this.view) return;
    if (!project) {
      this.view.emphasize(null);
      return;
    }
    this.view.emphasize(project.id);
    void this.view.goToPoint(project.lon, project.lat);
  }

  visibleProjects(): ProjectRecord[] {
    return filterProjects(projectsForAoi(this.activeAoi), this.activeSectors);
  }

  getActiveAoi(): AoiId {
    return this.activeAoi;
  }

  destroy(): void {
    this.view?.destroy();
    this.view = null;
  }

  // Degrade WITHOUT reload — never touches location.*.
  private handleLayerError(_err: unknown): void {
    if (this.degraded) return;
    this.degraded = true;
    this.hooks.onDegrade?.(true);
  }
}
