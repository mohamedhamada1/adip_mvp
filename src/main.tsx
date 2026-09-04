import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import "./theme/tokens.css";

// App mounts exactly once. AOI switching updates the mounted SceneView (no reload).
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
