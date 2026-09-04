import { useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "./ui/Hero";
import { KpiStrip } from "./ui/KpiStrip";
import { Filters } from "./ui/Filters";
import { AoiSwitcher } from "./ui/AoiSwitcher";
import { Attribution } from "./ui/Attribution";
import { Assessment } from "./ui/Assessment";
import { Simulator } from "./ui/Simulator";
import { AskAdpicAi } from "./ui/AskAdpicAi";
import { FallbackDemo } from "./ui/FallbackDemo";
import { ProjectDetails } from "./ui/ProjectDetails";
import { GeoContextMap, shortProjectName } from "./ui/GeoContextMap";
import { Dashboard } from "./ui/Dashboard";
import { Closing } from "./ui/Closing";
import { AoiSelect } from "./ui/AoiSelect";
import { NavRail, type NavKey } from "./ui/NavRail";
import { SceneController } from "./scene/sceneController";
import type { SceneApi } from "./scene/sceneApi";
import { SPINE_AOI } from "./scene/aoi";
import { computeKpis } from "./data/kpis";
import { projectsForAoi } from "./data/portfolio.demo";
import { filterProjects, toggleSector } from "./data/filters";
import { scoreProject } from "./assessment/scoringEngine";
import { assembleContext } from "./ai/context";
import type { AllowlistedAction } from "./ai/actions";
import { preloadFrozenData, isSafeMode, setSafeMode } from "./hardening/safeMode";
import type { AoiId, ProjectRecord, Sector } from "./data/types";

/**
 * The Explore + Evaluate shell. Takes the SceneApi as a REQUIRED prop so it renders in jsdom without
 * @arcgis/core (App.tsx passes the real arcgisSceneApi). The SceneView is created ONCE and preserved:
 * switching to the Evaluate view overlays the Assessment on top of the still-mounted scene (Back does not
 * destroy or recreate the view) — AC-3/AC-7.
 */
export function AppShell({ sceneApi }: { sceneApi: SceneApi }) {
  const [started, setStarted] = useState(false);
  const [view, setView] = useState<"explore" | "details" | "evaluate" | "simulate" | "fallback" | "dashboard" | "aoi" | "closing">("explore");
  const [activeAoi, setActiveAoi] = useState<AoiId>(SPINE_AOI);
  const [activeSectors, setActiveSectors] = useState<Set<Sector>>(new Set());
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [degraded, setDegraded] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [safe, setSafe] = useState(isSafeMode());

  // Exhibition hardening: warm the frozen in-bundle data once, so the scripted journey has no first-use latency.
  useEffect(() => { preloadFrozenData(); }, []);

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
    // fly the live 3D scene to the validated location + emphasize the marker (exhibition machine);
    // the deterministic locator below makes the position obvious everywhere. Stays in Explore until "View Details".
    controllerRef.current?.focusProject(p);
  }

  const visible = useMemo(() => filterProjects(projectsForAoi(activeAoi), activeSectors), [activeAoi, activeSectors]);
  const kpis = useMemo(() => computeKpis(visible), [visible]);
  const assessment = useMemo(() => (selected ? scoreProject(selected) : null), [selected]);
  const aiContext = useMemo(() => assembleContext(activeAoi, selected ?? undefined, assessment ?? undefined), [activeAoi, selected, assessment]);

  function onAiAction(a: AllowlistedAction) {
    switch (a.kind) {
      case "focus-project": if (selected) controllerRef.current?.focusProject(selected); break;
      case "open-assessment": if (selected) setView("evaluate"); break;
      case "open-simulator": setView("simulate"); break;
      case "show-underserved": setView("simulate"); break;
    }
    setAskOpen(false);
  }
  function toggleSafe() { const n = !safe; setSafe(n); setSafeMode(n); }

  // Full-bleed states have no rail (Hero handled separately); the rest carry the unifying nav rail.
  const fullBleed = view === "fallback" || view === "closing" || view === "aoi";
  const railKey: NavKey = view === "dashboard" ? "dashboard" : view === "evaluate" ? "evaluate" : view === "simulate" ? "simulate" : "explore";
  const showDetails = () => { if (selected) setView("details"); };
  function onNav(k: NavKey) {
    if (k === "ask") { setAskOpen((v) => !v); return; }
    if (k === "evaluate") { setView(selected ? "evaluate" : "explore"); return; }
    setView(k as typeof view);
  }

  if (!started) return <Hero onStart={() => setStarted(true)} />;

  const panelOpen = askOpen && !fullBleed;
  const railShown = !fullBleed;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Unifying left nav rail (nav skin over view state; references 02/04/05/06/08) */}
      {railShown && <NavRail active={railKey} askActive={panelOpen} onNav={onNav} />}
      {/* Content sits right of the rail and reflows left of the Ask-AI panel so it never obscures evidence */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: railShown ? 84 : 0, right: panelOpen ? "min(400px, 92vw)" : 0, transition: "right 0.18s ease" }}>
      {/* 3D scene surface — mounted ONCE and preserved beneath overlays */}
      <div ref={sceneDivRef} style={{ position: "absolute", inset: 0, background: "var(--bg-0)" }} />
      {/* Ask-AI toggle — cross-cutting, stays within the (reflowing) content, left of the panel */}
      {view !== "fallback" && (
        <button type="button" onClick={() => setAskOpen((v) => !v)} aria-label="Ask ADPIC AI"
          style={{ position: "absolute", right: "var(--space-3)", top: "var(--space-4)", zIndex: 5, padding: "10px 16px", borderRadius: "999px", border: "1px solid var(--stroke)", background: panelOpen ? "var(--accent)" : "var(--bg-2)", color: panelOpen ? "var(--text-0)" : "var(--accent-2)", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
          Ask ADPIC AI
        </button>
      )}

      {view === "explore" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", pointerEvents: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--space-2) var(--space-3)", pointerEvents: "auto" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "baseline" }}>
              <strong style={{ color: "var(--text-0)", fontSize: "20px", letterSpacing: "0.06em" }}>ADPIC</strong>
              <span style={{ color: "var(--accent-2)", fontSize: "15px", fontWeight: 600 }}>Capital Intelligence</span>
              <span style={{ color: "var(--text-2)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>People · Places · Possibilities</span>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <button type="button" onClick={() => setView("aoi")} style={{ padding: "8px 12px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-2)", cursor: "pointer", fontSize: "13px" }}>Areas</button>
              <button type="button" onClick={() => setView("closing")} style={{ padding: "8px 12px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-2)", cursor: "pointer", fontSize: "13px" }}>Closing</button>
              <span title="English UI · Arabic-ready architecture (content English for MVP)" style={{ border: "1px solid var(--stroke)", borderRadius: "var(--radius-1)", overflow: "hidden", fontSize: "12px" }}>
                <span style={{ padding: "6px 8px", background: "var(--accent-soft)", color: "var(--text-0)" }}>EN</span>
                <span style={{ padding: "6px 8px", color: "var(--text-2)" }}>عربي</span>
              </span>
              {activeAoi === "khalifa" && (
                <button type="button" onClick={() => setView("simulate")} style={{ padding: "8px 16px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--accent-2)", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>
                  Simulate liveability impact →
                </button>
              )}
              <button type="button" onClick={toggleSafe} aria-pressed={safe} title="Deterministic offline/fallback mode" style={{ padding: "8px 12px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: safe ? "var(--accent-soft)" : "var(--bg-2)", color: safe ? "var(--good)" : "var(--text-2)", cursor: "pointer", fontSize: "13px" }}>
                {safe ? "● Safe mode" : "○ Safe mode"}
              </button>
              <button type="button" onClick={() => setView("fallback")} style={{ padding: "8px 12px", borderRadius: "var(--radius-1)", border: "1px solid var(--stroke)", background: "var(--bg-2)", color: "var(--text-2)", cursor: "pointer", fontSize: "13px" }}>
                Fallback
              </button>
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
            <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-end", flexWrap: "wrap" }}>
              <ProjectPanel projects={visible} selected={selected} onSelect={selectProject} />
              {selected && <SelectedLocator project={selected} onViewDetails={showDetails} />}
            </div>
          </div>
          <div style={{ pointerEvents: "auto" }}>
            <KpiStrip kpis={kpis} />
            <Attribution />
          </div>
        </div>
      )}

      {view === "details" && selected && (
        <ProjectDetails
          project={selected}
          assessment={assessment}
          onBack={() => setView("explore")}
          onEvaluate={() => setView("evaluate")}
          onSimulate={activeAoi === "khalifa" ? () => setView("simulate") : undefined}
        />
      )}

      {view === "evaluate" && assessment && (
        <Assessment result={assessment} onBack={() => setView("details")} onSimulate={activeAoi === "khalifa" ? () => setView("simulate") : undefined} />
      )}

      {view === "simulate" && <Simulator onBack={() => setView("explore")} />}

      {view === "fallback" && <FallbackDemo onBack={() => setView("explore")} />}
      {view === "dashboard" && <Dashboard aoi={activeAoi} onBack={() => setView("explore")} />}
      {view === "aoi" && <AoiSelect onSelect={(a) => { switchAoi(a); setView("explore"); }} />}
      {view === "closing" && <Closing onBack={() => setView("explore")} />}
      </div>{/* end reflow content container */}

      {/* Ask ADPIC AI — cross-cutting right-docked panel (content reflows beside it; never overlaps evidence) */}
      {panelOpen && (
        <AskAdpicAi ctx={aiContext} onAction={onAiAction} onClose={() => setAskOpen(false)} />
      )}
    </div>
  );
}

/** Explore selection locator — a deterministic real-geography mini-map that makes the selected project's
 *  position instantly obvious (marker + short label + subdued peers), plus the selected fields and the
 *  View Details CTA. Renders reliably (no WebGL) alongside the live 3D scene. */
function SelectedLocator({ project, onViewDetails }: { project: ProjectRecord; onViewDetails: () => void }) {
  return (
    <div style={{ width: "min(360px, 92vw)", background: "var(--bg-1)", border: "1px solid var(--accent)", borderRadius: "var(--radius-2)", overflow: "hidden", boxShadow: "0 12px 44px var(--shadow)" }}>
      <div style={{ height: "184px", position: "relative", borderBottom: "1px solid var(--stroke)" }}>
        <GeoContextMap project={project} frame={0.9} compact />
        <span style={{ position: "absolute", left: "8px", top: "8px", color: "var(--accent-2)", fontSize: "10px", letterSpacing: "0.1em", background: "rgba(7,12,22,0.6)", padding: "2px 8px", borderRadius: "999px" }}>SELECTED LOCATION</span>
      </div>
      <div style={{ padding: "var(--space-2) var(--space-3)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--space-2)" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: "var(--text-0)", fontSize: "15px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortProjectName(project)}</div>
          <div style={{ color: "var(--text-2)", fontSize: "12px" }}>{project.sector} · {project.status}</div>
        </div>
        <button type="button" onClick={onViewDetails} style={{ whiteSpace: "nowrap", padding: "10px 14px", borderRadius: "var(--radius-1)", border: "none", background: "var(--accent)", color: "var(--text-0)", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>View Details →</button>
      </div>
    </div>
  );
}

function ProjectPanel({ projects, selected, onSelect }: { projects: ProjectRecord[]; selected: ProjectRecord | null; onSelect: (p: ProjectRecord) => void }) {
  return (
    <div style={{ maxWidth: "30ch", background: "var(--bg-1)", border: "1px solid var(--stroke)", borderRadius: "var(--radius-2)", padding: "var(--space-2)" }}>
      <div style={{ color: "var(--text-2)", fontSize: "12px", marginBottom: "6px" }}>Projects — select to focus</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "220px", overflow: "auto" }}>
        {projects.slice(0, 8).map((p) => {
          const on = selected?.id === p.id;
          return (
            <button key={p.id} type="button" onClick={() => onSelect(p)} aria-pressed={on}
              style={{ textAlign: "left", display: "flex", justifyContent: "space-between", gap: "8px", background: on ? "var(--accent-soft)" : "transparent", border: on ? "1px solid var(--accent)" : "1px solid transparent", color: on ? "var(--text-0)" : "var(--text-1)", cursor: "pointer", padding: "8px 10px", borderRadius: "var(--radius-1)", fontSize: "13px" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nameEn}</span>
              <span style={{ color: "var(--text-2)", fontSize: "11px", whiteSpace: "nowrap" }}>{p.sector}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
