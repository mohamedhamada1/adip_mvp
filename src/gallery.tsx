// Evidence gallery — renders each presentational state in isolation (NO @arcgis/core) so it screenshots
// fast, using the real deterministic data/engines. Select a state via the URL hash (e.g. #assessment).
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./theme/tokens.css";
import { Hero } from "./ui/Hero";
import { ProjectCard } from "./ui/ProjectCard";
import { Assessment } from "./ui/Assessment";
import { Simulator } from "./ui/Simulator";
import { AskAdpicAi } from "./ui/AskAdpicAi";
import { Dashboard } from "./ui/Dashboard";
import { AoiSelect } from "./ui/AoiSelect";
import { Closing } from "./ui/Closing";
import { projectsForAoi } from "./data/portfolio.demo";
import { scoreProject } from "./assessment/scoringEngine";
import { assembleContext } from "./ai/context";

const project = projectsForAoi("khalifa")[0];
const result = scoreProject(project);
const ctx = assembleContext("khalifa", project, result);

function Frame({ children }: { children: React.ReactNode }) {
  return <div style={{ position: "absolute", inset: 0, background: "var(--bg-0)" }}>{children}</div>;
}

function Gallery() {
  const [hash] = useState(() => (typeof location !== "undefined" ? location.hash.slice(1) : "") || "hero");
  const noop = () => {};
  switch (hash) {
    case "card":
      return <Frame><div style={{ padding: "var(--space-4)" }}><ProjectCard project={project} onEvaluate={noop} onSimulate={noop} /></div></Frame>;
    case "assessment": return <Frame><Assessment result={result} onBack={noop} /></Frame>;
    case "simulator": return <Frame><Simulator onBack={noop} /></Frame>;
    case "askai": return <Frame><AskAdpicAi ctx={ctx} onAction={noop} onClose={noop} /></Frame>;
    case "dashboard": return <Frame><Dashboard aoi="khalifa" onBack={noop} /></Frame>;
    case "aoi": return <Frame><AoiSelect onSelect={noop} /></Frame>;
    case "closing": return <Frame><Closing onBack={noop} /></Frame>;
    case "hero":
    default: return <Frame><Hero onStart={noop} /></Frame>;
  }
}

createRoot(document.getElementById("root")!).render(<Gallery />);
