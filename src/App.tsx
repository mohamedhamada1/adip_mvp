import { AppShell } from "./AppShell";
import { arcgisSceneApi } from "./scene/arcgisSceneApi";
import { LangProvider } from "./i18n/LangContext";

/**
 * Thin entry: injects the real @arcgis/core-backed SceneApi into the AppShell. This is the ONLY module
 * that imports @arcgis/core, which keeps AppShell (and the Explore→Evaluate wiring) renderable in jsdom
 * tests with an injected fake SceneApi. Wrapped in LangProvider for the EN/عربي (LTR/RTL) experience.
 */
export default function App() {
  return (
    <LangProvider>
      <AppShell sceneApi={arcgisSceneApi} />
    </LangProvider>
  );
}
