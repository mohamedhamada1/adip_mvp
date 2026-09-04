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
  return {
    type: "point-3d",
    symbolLayers: [
      { type: "icon", size: highlight ? 20 : 12, resource: { primitive: "circle" }, material: { color: highlight ? MARKER_HI : MARKER } },
    ],
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
    const boundaryLayer = new GraphicsLayer();
    const markerLayer = new GraphicsLayer();

    const map = new Map({ basemap: null, ground: "world-elevation" });
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
