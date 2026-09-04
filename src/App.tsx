import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./ui/Hero";
import { KpiStrip } from "./ui/KpiStrip";
import { Filters } from "./ui/Filters";
import { AoiSwitcher } from "./ui/AoiSwitcher";
import { Attribution } from "./ui/Attribution";
import { SceneController } from "./scene/sceneController";
import { arcgisSceneApi } from "./scene/arcgisSceneApi";
import { SPINE_AOI } from "./scene/aoi";
import { computeKpis } from "./data/kpis";
import { projectsForAoi } from "./data/portfolio.demo";
import { filterProjects, toggleSector } from "./data/filters";
import type { AoiId, ProjectRecord, Sector } from "./data/types";

export default function App() {
  const [started, setStarted] = useState(false);
  const [activeAoi, setActiveAoi] = useState<AoiId>(SPINE_AOI);
  const [activeSectors, setActiveSectors] = useState<Set<Sector>>(new Set());
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [degraded, setDegraded] = useState(false);

  const sceneDivRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SceneController | null>(null);

  // Create the SceneController + view EXACTLY ONCE, when Explore first mounts. Never re-created.
  useEffect(() => {
    if (!started || !sceneDivRef.current || controllerRef.current) return;
    const controller = new SceneController(arcgisSceneApi, { onDegrade: setDegraded });
    controllerRef.current = controller;
    controller.init(sceneDivRef.current, activeAoi);
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // AOI switch → update the mounted view (no reload).
  function switchAoi(aoi: AoiId) {
    setActiveAoi(aoi);
    setSelected(null);
    controllerRef.current?.goToAoi(aoi);
    controllerRef.current?.setSectorFilter(activeSectors);
  }

  function onToggleSector(s: Sector) {
    const next = toggleSector(activeSectors, s);
    setActiveSectors(next);
    controllerRef.current?.setSectorFilter(next);
  }

  const visible = useMemo(
    () => filterProjects(projectsForAoi(activeAoi), activeSectors),
    [activeAoi, activeSectors]
  );
  const kpis = useMemo(() => computeKpis(visible), [visible]);

  if (!started) return <Hero onStart={() => setStarted(true)} />;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {/* 3D scene surface (the hero) */}
      <div ref={sceneDivRef} style={{ position: "absolute", inset: 0, background: "var(--bg-0)" }} />

      {/* Top controls overlay */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-2) var(--space-3)", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
          <strong style={{ color: "var(--text-0)" }}>ADPIC</strong>
          <span style={{ color: "var(--text-2)", fontSize: "13px" }}>Capital Intelligence</span>
        </div>
        <AoiSwitcher active={activeAoi} onSwitch={switchAoi} />
      </div>
      <div style={{ position: "relative", padding: "0 var(--space-3)" }}>
        <Filters active={activeSectors} onToggle={onToggleSector} />
      </div>

      {degraded && (
        <div role="status" style={{ position: "relative", margin: "var(--space-2) var(--space-3)", padding: "8px 12px", border: "1px solid var(--warn)", borderRadius: "var(--radius-1)", color: "var(--warn)", fontSize: "13px", background: "var(--bg-1)" }}>
          Live 3D unavailable — showing the deterministic offline scene. The scripted experience continues.
        </div>
      )}

      {/* Selected project chip (concise; full assessment is a later stage) */}
      <div style={{ position: "relative", flex: 1 }}>
        <div style={{ position: "absolute", left: "var(--space-3)", bottom: "var(--space-3)", maxWidth: "32ch" }}>
          <SelectedList projects={visible} selected={selected} onSelect={(p) => { setSelected(p); controllerRef.current?.focusProject(p); }} />
        </div>
      </div>

      {/* Bottom KPI strip + attribution */}
      <div style={{ position: "relative" }}>
        <KpiStrip kpis={kpis} />
        <Attribution />
      </div>
    </div>
  );
}

/** Compact selectable project list — selecting flies the mounted view to the project. */
function SelectedList({ projects, selected, onSelect }: { projects: ProjectRecord[]; selected: ProjectRecord | null; onSelect: (p: ProjectRecord) => void }) {
  const shown = projects.slice(0, 6);
  return (
    <div style={{ background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-2)" }}>
      <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "6px" }}>Projects (select to focus)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {shown.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            style={{ textAlign: "left", background: selected?.id === p.id ? "var(--accent-soft)" : "transparent", border: "none", color: "var(--text-1)", cursor: "pointer", padding: "6px 8px", borderRadius: "var(--radius-1)", fontSize: "13px" }}
          >
            {p.nameEn} · {p.sector}
          </button>
        ))}
      </div>
    </div>
  );
}
