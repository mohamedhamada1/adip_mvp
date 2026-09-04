import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import type { SceneApi, ViewHandle } from "./sceneApi";
import type { AoiCamera } from "./aoi";
import type { ProjectRecord } from "../data/types";
import type { AoiBoundary } from "../data/aoiBoundaries";

// Tokenless, CORS-open Esri 3D Buildings scene service (verified anonymous in Stage 1.1).
const ESRI_3D_URL =
  "https://basemaps3d.arcgis.com/arcgis/rest/services/Esri3D_Buildings_v1/SceneServer";

// Marker colors as RGBA arrays (ArcGIS symbol format; the component hex ban is *.tsx only).
const MARKER = [61, 123, 255, 0.95];
const MARKER_HI = [124, 192, 255, 0.95];
const BOUNDARY = [61, 123, 255];

// ArcGIS symbol autocast — typed as `any` at this adapter boundary (well-known SDK typing friction
// between the Symbol classes and the SymbolProperties autocast union). Isolated to this file.
function markerSymbol(highlight: boolean): any {
  // The selected marker is markedly larger, brighter, outlined, and raised on a callout so it is
  // unmistakably distinct from surrounding projects (exhibition selection focus).
  return {
    type: "point-3d",
    symbolLayers: [
      {
        type: "icon",
        size: highlight ? 28 : 12,
        resource: { primitive: "circle" },
        material: { color: highlight ? MARKER_HI : MARKER },
        outline: highlight ? { color: [255, 255, 255, 0.95], size: 2 } : undefined,
      },
    ],
    verticalOffset: highlight ? { screenLength: 26, minWorldLength: 20 } : undefined,
    callout: highlight ? { type: "line", size: 1.5, color: [124, 192, 255, 0.9] } : undefined,
  };
}

function boundarySymbol(): any {
  return {
    type: "polygon-3d",
    symbolLayers: [
      { type: "line", size: 2, material: { color: [...BOUNDARY, 0.9] } },
      { type: "fill", material: { color: [...BOUNDARY, 0.06] } },
    ],
  };
}

/** Real @arcgis/core implementation of SceneApi. Constructs ONE SceneView per call. */
export const arcgisSceneApi: SceneApi = {
  createView(container: HTMLDivElement, onLayerError: (err: unknown) => void): ViewHandle {
    const buildings = new SceneLayer({ url: ESRI_3D_URL, popupEnabled: false });
    // Cinematic contrast (exhibition hardening): muted blue-grey building fill with bright edges so context
    // buildings read as crisp massing against the dark ground rather than flat pale blocks.
    buildings.renderer = {
      type: "simple",
      symbol: {
        type: "mesh-3d",
        symbolLayers: [
          { type: "fill", material: { color: [70, 90, 120, 1], colorMixMode: "replace" }, edges: { type: "solid", color: [150, 190, 255, 0.55], size: 0.7 } },
        ],
      },
    } as unknown as SceneLayer["renderer"];

    const boundaryLayer = new GraphicsLayer();
    const markerLayer = new GraphicsLayer();

    // Dark ground surface (no bright basemap) for the premium dark-cinematic look.
    const map = new Map({ basemap: null, ground: { surfaceColor: [8, 14, 26] } as unknown as __esri.GroundProperties });
    map.addMany([buildings, boundaryLayer, markerLayer]);

    const view = new SceneView({
      container,
      map,
      qualityProfile: "high",
      environment: {
        background: { type: "color", color: [8, 14, 26, 1] },
        starsEnabled: false,
        atmosphereEnabled: true,
      },
      ui: { components: [] },
    });

    // Degrade WITHOUT reload if the 3D buildings layer fails to load (network/service outage).
    buildings.load().catch((err) => onLayerError(err));

    function setProjects(projects: ProjectRecord[]) {
      markerLayer.removeAll();
      for (const p of projects) {
        markerLayer.add(
          new Graphic({
            geometry: new Point({ longitude: p.lon, latitude: p.lat }),
            attributes: { id: p.id, name: p.nameEn, sector: p.sector },
            symbol: markerSymbol(false),
          })
        );
      }
    }

    function setBoundary(b: AoiBoundary) {
      boundaryLayer.removeAll();
      boundaryLayer.add(
        new Graphic({ geometry: new Polygon({ rings: [b.ring] }), symbol: boundarySymbol() })
      );
    }

    return {
      goToCamera(cam: AoiCamera) {
        return view
          .goTo({ position: { longitude: cam.lon, latitude: cam.lat, z: cam.z }, heading: cam.heading, tilt: cam.tilt }, { animate: true, duration: 1800 })
          .then(() => undefined);
      },
      goToPoint(lon: number, lat: number) {
        return view.goTo({ position: { longitude: lon, latitude: lat, z: 500 }, tilt: 62 }, { animate: true, duration: 1200 }).then(() => undefined);
      },
      setBoundary,
      setProjects,
      emphasize(projectId: string | null) {
        markerLayer.graphics.forEach((g) => {
          const on = projectId != null && g.attributes?.id === projectId;
          g.symbol = markerSymbol(on);
        });
      },
      destroy() {
        view.destroy();
      },
    };
  },
};
