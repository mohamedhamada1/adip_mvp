import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite + React. @arcgis/core is loaded as an ESM dependency; the core scene needs
// no API key (tokenless Esri 3D Buildings service, verified in Stage 1.1).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // @arcgis/core is a heavy WebGL SDK; the scene controller is dependency-injected
    // so behavioural tests never import it. Exclude it from test transforms defensively.
    server: { deps: { inline: [] } },
  },
});
