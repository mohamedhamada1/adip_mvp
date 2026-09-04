import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./ui/Hero";
import { KpiStrip } from "./ui/KpiStrip";
import { Filters } from "./ui/Filters";
import { AoiSwitcher } from "./ui/AoiSwitcher";
import { Attribution } from "./ui/Attribution";
import { Assessment } from "./ui/Assessment";
import { Simulator } from "./ui/Simulator";
import { SceneController } from "./scene/sceneController";
import type { SceneApi } from "./scene/sceneApi";
import { SPINE_AOI } from "./scene/aoi";
import { computeKpis } from "./data/kpis";
import { projectsForAoi } from "./data/portfolio.demo";
import { filterProjects, toggleSector } from "./data/filters";
import { scoreProject } from "./assessment/scoringEngine";
import type { AoiId, ProjectRecord, Sector } from "./data/types";

/**
 * The Explore + Evaluate shell. Takes the SceneApi as a REQUIRED prop so it renders in jsdom without
 * @arcgis/core (App.tsx passes the real arcgisSceneApi). The SceneView is created ONCE and preserved:
 * switching to the Evaluate view overlays the Assessment on top of the still-mounted scene (Back does not
 * destroy or recreate the view) — AC-3/AC-7.
 */
export function AppShell({ sceneApi }: { sceneApi: SceneApi }) {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState<"explore" | "evaluate" | "simulate">("explore");
  const [activeAoi, setActiveAoi] = useState<AoiId>(SPINE_AOI);
  const [activeSectors, setActiveSectors] = useState<Set<Sector>>(new Set());
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [degraded, setDegraded] = useState(false);

  const sceneDivRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SceneController | null>(null);

  useEffect(() => {
    if (!started || !sceneDivRef.current || controllerRef.current) return;
    const controller = new SceneController(sceneApi, { onDegrade: setDegraded });
    controllerRef.current = controller;
    controller.init(sceneDivRef.current, activeAoi);
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

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
  function selectProject(p: ProjectRecord) {
    setSelected(p);
    controllerRef.current?.focusProject(p);
  }

  const visible = useMemo(() => filterProjects(projectsForAoi(activeAoi), activeSectors), [activeAoi, activeSectors]);
  const kpis = useMemo(() => computeKpis(visible), [visible]);
  const assessment = useMemo(() => (selected ? scoreProject(selected) : null), [selected]);

  if (!started) return <Hero onStart={() => setStarted(true)} />;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 3D scene surface — mounted ONCE and preserved beneath the Evaluate overlay */}
      <div ref={sceneDivRef} style={{ position: "absolute", inset: 0, background: "var(--bg-0)" }} />

      {view === "explore" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", pointerEvents: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-2) var(--space-3)", pointerEvents: "auto" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <strong style={{ color: "var(--text-0)" }}>ADPIC</strong>
              <span style={{ color: "var(--text-2)", fontSize: "13px" }}>Capital Intelligence</span>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              {activeAoi === "khalifa" && (
                <button type="button" onClick={() => setView("simulate")} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                  Simulate liveability impact →
                </button>
              )}
              <AoiSwitcher active={activeAoi} onSwitch={switchAoi} />
            </div>
          </div>
          <div style={{ padding: "0 var(--space-3)", pointerEvents: "auto" }}>
            <Filters active={activeSectors} onToggle={onToggleSector} />
          </div>
          {degraded && (
            <div role="status" style={{ margin: "var(--space-2) var(--space-3)", padding: "8px 12px", border: "1px solid var(--warn)", borderRadius: "var(--radius-1)", color: "var(--warn)", fontSize: "13px", background: "var(--bg-1)", pointerEvents: "auto" }}>
              Live 3D unavailable — showing the deterministic offline scene.
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "var(--space-3)", pointerEvents: "auto" }}>
            <ProjectPanel projects={visible} selected={selected} onSelect={selectProject} onEvaluate={() => setView("evaluate")} />
          </div>
          <div style={{ pointerEvents: "auto" }}>
            <KpiStrip kpis={kpis} />
            <Attribution />
          </div>
        </div>
      )}

      {view === "evaluate" && assessment && (
        <Assessment result={assessment} onBack={() => setView("explore")} />
      )}

      {view === "simulate" && <Simulator onBack={() => setView("explore")} />}
    </div>
  );
}

function ProjectPanel({ projects, selected, onSelect, onEvaluate }: { projects: ProjectRecord[]; selected: ProjectRecord | null; onSelect: (p: ProjectRecord) => void; onEvaluate: () => void }) {
  return (
    <div style={{ maxWidth: "34ch", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-2)" }}>
      <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "6px" }}>Projects (select to focus)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {projects.slice(0, 6).map((p) => (
          <button key={p.id} type="button" onClick={() => onSelect(p)} style={{ textAlign: "left", background: selected?.id === p.id ? "var(--accent-soft)" : "transparent", border: "none", color: "var(--text-1)", cursor: "pointer", padding: "6px 8px", borderRadius: "var(--radius-1)", fontSize: "13px" }}>
            {p.nameEn} · {p.sector}
          </button>
        ))}
      </div>
      {selected && (
        <button type="button" onClick={onEvaluate} style={{ marginTop: "var(--space-2)", width: "100%", padding: "10px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 600, cursor: "pointer" }}>
          Evaluate this investment →
        </button>
      )}
    </div>
  );
}
