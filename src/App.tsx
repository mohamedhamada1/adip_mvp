import { AppShell } from "./AppShell";
import { arcgisSceneApi } from "./scene/arcgisSceneApi";

/**
 * Thin entry: injects the real @arcgis/core-backed SceneApi into the AppShell. This is the ONLY module
 * that imports @arcgis/core, which keeps AppShell (and the Explore→Evaluate wiring) renderable in jsdom
 * tests with an injected fake SceneApi.
 */
export default function App() {
  return <AppShell sceneApi={arcgisSceneApi} />;
}
