<!-- template-version: spec_template/v1 -->
# Feature Spec: Stage 1.2 — 3D Shell + Explore + AOI Switch

**Stage:** 1.2
**Status:** Draft
**Author:** Claude (project owner session; authoring is a human step per ai-epic-prepare)
**Reviewer:** owner review gate
**Date:** 2026-09-04
**Epic:** adpic-livex-2026-capital-intelligence-mvp

---

## UI Surface Declaration (MANDATORY)
- **Touches UI?** YES
- **UI Delivery Mode:** direct_ui
- **Surfaces affected:** Exhibition (presenter large-display / touchscreen) — desktop-first, 1920×1080 baseline
- **UI Change Class:** A (NEW_SCREEN / MAJOR_UI — greenfield app, new Explore experience)

### Screen Inventory
| Screen | Surface | Action | Figma URL / Screenshot | Notes |
|--------|---------|--------|------------------------|-------|
| Hero / Landing | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/01_Hero_Landing.png` | Entry; "Start Experience" → Explore |
| Explore — 3D Map | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/02_Explore_3D_Map_Al_Reem.png` | Hero 3D surface; markers; KPI strip; filters |
| AOI / Area Switcher | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/07_Area_Switcher.png` | Khalifa ↔ Al Reem, no full reload; Al Reem degrade-able |
| KPI / Portfolio context | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/08_Dashboard_KPIs_Khalifa.png` | KPI strip bound to synthetic IS_DEMO portfolio |

Visual references are UX-direction only; WORK.md authoritative. Screenshot numbers are mockup — NOT data.

### UI Impact Description
| Screen | Impact Level | Justification |
|--------|-------------|---------------|
| Hero / Landing | create | New screen |
| Explore — 3D Map | create | New hero 3D experience |
| AOI Switcher | create | New control |
| KPI strip | create | New component bound to frozen synthetic data |

---

## Problem Statement
Build the standalone app shell and the **Explore** capability (story beat 1, "Understand the place"):
a premium dark cinematic ArcGIS `SceneView` with AOI context, curated project markers, a KPI strip, and
filters, plus AOI switching without a full reload. This is the foundation the later Assessment/Simulate/
Ask-AI stages build on. No Assessment, Simulate, or Ask-AI logic in this stage.

---

## Acceptance Criteria

> Anchored traceability: each `AC-n` covers ≥1 ROADMAP requirement (`RR-n` in ROADMAP.md § Stage 1.2).
> The full guardrail set (no mockup numbers, provenance tags, attribution, degrade, no-live-LLM) is carried
> in the AC text + Core Invariants + Success Proof.

#### AC-1 — Standalone Vite/React/TS app renders a dark cinematic ArcGIS SceneView with the tokenless Esri 3D Buildings layer (muted context) and project markers emphasized; no API key needed (WORK-CON-7, WORK-UX-1/2, WORK-INT-1).
covers: RR-1

#### AC-2 — The Explore state presents a compact KPI strip, dataset-appropriate filters, and selectable animated project markers with fly-to/emphasis (WORK-REQ-2/3/4/5).
covers: RR-2

#### AC-3 — AOI switching between Khalifa City and Al Reem Island occurs without a full app reload and preserves the Explore workflow (camera + layers swap on the mounted view) (WORK-AC-3, WORK-NFR-3, WORK-REQ-6).
covers: RR-3

#### AC-4 — The Al Reem opening degrades gracefully to a disabled/hidden switcher state leaving a coherent Khalifa-only experience; the scene also degrades without a page reload if the tokenless 3D service is unreachable (WORK-EX-4, WORK-DEC-5, WORK-NFR-5 connectivity-tolerance), and no live LLM is introduced on the core path (WORK-NFR-6, WORK-DEC-8).
covers: RR-4

#### AC-5 — Every displayed KPI/marker value derives from the frozen synthetic IS_DEMO snapshot; every dataset/field is provenance-tagged (OFFICIAL/PUBLIC, DERIVED, or SYNTHETIC/DEMO) with no hard-coded screenshot numbers (no literal 139/219/AED 85B), and required source attribution is visible from the first Explore render (WORK-AC-19, WORK-DEC-7; condition C3).
covers: RR-5

---

## In Scope
- Vite/React/TS scaffold; ArcGIS SDK integration; dark cinematic theme tokens.
- SceneView + Esri 3D Buildings layer; AOI boundary layer; project markers; fly-to/emphasis.
- KPI strip; filters; AOI switcher (no reload); Hero/Landing → Explore entry.
- Frozen synthetic `IS_DEMO` portfolio dataset (curated, credible, NOT 219/139) + provenance-tagged data
  model; AOI boundaries fetched/frozen from AD-SDI (dev).
- Attribution UI; deterministic degrade path for the 3D layer.

## Out of Scope
- AI-Assisted Assessment (Stage 1.3), Liveability Simulator (Stage 1.4), Ask ADPIC AI (Stage 1.5).
- Live LLM; live ArcGIS routing/service-area; production data; C1/C2 offline-bundle confirmations
  (before build-commit, not this stage).
- Mobile layouts (WORK-NFR-9); Arabic content (architecture stays RTL-ready, English content now).

---

## Files to Create
| File Path | Purpose |
|-----------|---------|
| `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` | Vite + React + TS scaffold |
| `src/main.tsx`, `src/App.tsx` | App entry + shell |
| `src/scene/SceneRoot.tsx` | ArcGIS SceneView init + Esri 3D Buildings layer + degrade path |
| `src/scene/aoi.ts` | AOI definitions (Khalifa, Al Reem) + camera positions + switch (no reload) |
| `src/data/portfolio.demo.ts` | Curated synthetic `IS_DEMO` portfolio (provenance-tagged) |
| `src/data/provenance.ts` | Provenance types (OFFICIAL/PUBLIC · DERIVED · SYNTHETIC/DEMO) |
| `src/data/aoiBoundaries.ts` | AD-SDI boundary loading/freeze (dev) with attribution + provenance |
| `src/ui/KpiStrip.tsx`, `src/ui/Filters.tsx`, `src/ui/AoiSwitcher.tsx`, `src/ui/Hero.tsx`, `src/ui/Attribution.tsx` | Explore UI components |
| `src/theme/tokens.css` | Dark cinematic design tokens (no raw hex in components) |
| `tests/` (unit) | Provenance/data + no-mockup-number guard tests |

## Files to Modify
| File Path | Change Description |
|-----------|-------------------|
| (none — greenfield) | N/A |

## Protected Files
- `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md` — authoritative contract, do not edit.
- `.ai/epics/**`, `.ai/stages/1.2/spec.md`, `.ai/stages/1.2/plan.md` — governance artifacts.

---

## Core Invariants

### Risk Surface (project-declared, drives the tier)
- **Risk Surface:** none (exhibition demo UI; no money/booking/inventory/entitlement/capacity/cross-tenant/
  background-orchestration)
- **Derived Risk Tier:** _derived by the resolver_

### Invariant Declaration
```json
[
  {
    "id": "INV-no-mockup-numbers",
    "class": "data-provenance",
    "actors": ["explore-ui"],
    "authoritative_entity": "frozen-demo-portfolio",
    "statement": "KPI/marker values render only from the authored IS_DEMO portfolio dataset; no screenshot mockup number (139/219/AED 85B/etc.) is hard-coded in source",
    "obligation_refs": []
  },
  {
    "id": "INV-provenance-tagged",
    "class": "data-provenance",
    "actors": ["explore-ui"],
    "authoritative_entity": "dataset-record",
    "statement": "every dataset/field carries a provenance tag OFFICIAL_PUBLIC|DERIVED|SYNTHETIC_DEMO so a real-data swap needs no UI redesign",
    "obligation_refs": []
  },
  {
    "id": "INV-attribution-present",
    "class": "licensing",
    "actors": ["explore-ui"],
    "authoritative_entity": "attribution-element",
    "statement": "required source attributions are visible on the Explore screen from first render (condition C3)",
    "obligation_refs": []
  },
  {
    "id": "INV-no-live-llm-core",
    "class": "reliability",
    "actors": ["explore-ui"],
    "authoritative_entity": "core-journey",
    "statement": "the Explore experience renders with no live LLM and degrades without a page reload if the tokenless 3D service is unreachable",
    "obligation_refs": []
  }
]
```

---

## UX Requirements
### Affected Screens
| Screen | Surface | Action | Notes |
|--------|---------|--------|-------|
| Hero/Landing | Exhibition | Create | Start Experience → Explore |
| Explore 3D | Exhibition | Create | SceneView + markers + KPI + filters |
| AOI Switcher | Exhibition | Create | No-reload swap; Al Reem degrade-able |

### Display Rules
| Element | Rule | Fallback |
|---------|------|----------|
| KPI value | render from IS_DEMO portfolio aggregate | "—" if dataset missing (never a mockup literal) |
| 3D buildings | tokenless Esri SceneLayer | own-built extruded footprints / reduced state, no reload |
| Al Reem opening | show if enabled | hide/disable cleanly; app coherent (WORK-EX-4) |
| Attribution | always visible | always visible |

### CRUD Completeness
| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| Demo portfolio | N/A (frozen) | Yes | N/A | N/A | read-only frozen dataset |

### Post-Action Behavior
| Action | Success Behavior | Error Behavior |
|--------|-----------------|----------------|
| Select project | fly-to + emphasize marker | no-op if unselectable |
| Switch AOI | camera/layers swap, no reload | stay on current AOI, log |
| Start Experience | transition Hero → Explore | stay on Hero |

### Data Dependencies
| UI Element | Required Data | Source | Exists? |
|------------|--------------|--------|---------|
| KPI strip | portfolio aggregates | `src/data/portfolio.demo.ts` (SYNTHETIC/DEMO) | Built this stage |
| Markers | project points | same | Built this stage |
| AOI boundary | Khalifa/Reem polygons | AD-SDI Districts (OFFICIAL/PUBLIC, dev) | Verified Stage 1.1 |
| 3D buildings | Esri 3D Buildings SceneLayer | tokenless Esri service | Verified Stage 1.1 |

---

## Design System Alignment (MANDATORY for all UI stages)
| Token Category | Status | Action | Reference |
|---|---|---|---|
| Colors | Missing | Add | dark navy bg, blue highlight tokens in `src/theme/tokens.css` |
| Typography | Missing | Add | large-display readable scale |
| Spacing | Missing | Add | spacing scale tokens |
| Radius | Missing | Add | radius tokens |
| Component: KpiStrip/Filters/AoiSwitcher | Missing | Create | new React components |
> No raw hex/px in components — reference tokens.

## Component Mapping (Native UI Stages)
N/A — this is a web (React) app, not native Flutter; components are the new React components above and are
authored in this stage. (No Flutter component registry applies.)

## Stac Screen Mapping / Binding Strategy / Unmapped Components / SDUI Binding
N/A — direct_ui (not Stac/SDUI).

---

## Artifact Type
- **Artifact type:** mobile_feature — CLOSEST available enum for an app UI feature; ACTUAL surface is a
  **web (Vite/React) exhibition app** (no mobile). Treated as an application UI feature stage.

## Stage Boundary Classification
- **Classification:** Internal implementation (single new frontend app; no shared API/cross-repo/event boundary).

## Validation Gate Profile
- **Primary profile:** admin_ui — CLOSEST web-UI profile (no dedicated web profile); direct_ui web app.
- **Secondary profiles:** none
- **Required gates:** ui presence/quality checks; build succeeds; unit tests pass.
- **Required evidence:** build output; screenshot(s) of Explore + AOI switch; no-mockup-number grep; test counts.

## UI Delivery Mode
- **ui_delivery_mode:** direct_ui

## Contract Boundary Requirements
N/A — no external boundary.

## Source of Truth Impact
| Field | Value |
|-------|-------|
| Affected concepts | frozen demo portfolio (new, owned by this app) |
| Owners | app frontend |
| New concepts required | provenance tag on dataset records |
| Ownership conflicts | None |

## Seam Impact
N/A — no seam impact.

---

## Architecture Notes
Reliability-First Deterministic Twin foundation. SceneView is the hero. Connected default = tokenless Esri
3D Buildings SceneLayer (verified Stage 1.1). Own-built extruded-footprint floor is the offline degrade
target (built minimally here as the fallback path; full offline packaging is a later hardening concern).
Dark ground + muted grey massing = the cinematic look without a photoreal-basemap API key. AOI switch swaps
camera/layers on the mounted app (no reload). All numbers come from the frozen synthetic `IS_DEMO`
portfolio; AD-SDI boundaries are OFFICIAL/PUBLIC (dev use, attributed).

## Data Model Changes
New: `ProjectRecord` (WORK-DATA-4..22-aligned fields incl. `IS_DEMO`), each dataset/field provenance-tagged.

## Public API Changes
None. No backend.

## Dependencies
- `react`, `react-dom`, `vite`, `typescript`, `@arcgis/core` (ArcGIS Maps SDK for JS).
- No native/platform deps; no secrets/keys required for the core scene.

## Security Checklist
| Check | Status | Notes |
|-------|--------|-------|
| No secrets in code | ✅ | tokenless services; no keys committed |
| No confidential data | ✅ | synthetic IS_DEMO + public AD-SDI only (WORK-SEC-9) |
| Sensitive data not exposed | ✅ | no internal/unapproved attributes |

---

## Verification Checklist
### Mandatory (blocks stage completion if missing)
#### Required Artifacts
- [ ] `package.json` + `vite.config.ts` exist; `npm run build` succeeds.
- [ ] `src/scene/SceneRoot.tsx` exists and instantiates ArcGIS `SceneView` + Esri 3D Buildings SceneLayer.
- [ ] `src/ui/AoiSwitcher.tsx` exists; switching does not remount the app root.
- [ ] `src/data/provenance.ts` exports the provenance tag type; `src/data/portfolio.demo.ts` records carry `IS_DEMO` + provenance.
- [ ] `src/ui/Attribution.tsx` exists and is rendered on Explore.
#### Core Behavior
- [ ] SceneView renders 3D buildings for both AOIs with no API key.
- [ ] KPI strip values derive from the demo portfolio aggregate (not literals).
- [ ] Filters change visible markers; selecting a marker flies to / emphasizes it.
#### Safety / Invariants
- [ ] No mockup numbers in UI display code: `grep -rnE 'AED[ ]*85[ ]*B|\b85B\b' src/ → 0`, AND no KPI/count
  is a numeric literal in `src/ui/` (KPI values are computed from the dataset aggregate, not typed). The
  guard is scoped to display code (`src/ui/`) and the specific "AED 85B" token — it deliberately does NOT
  blanket-match bare `139`/`219`, which can be legitimate coordinates/ids/pixels (deterministic, no false positives).
- [ ] No live LLM / Assessment / Simulate / Ask-AI code in `src/`.
- [ ] No raw hex colors in components (tokens only).
#### Tests
- [ ] A unit test asserts **every dataset record across ALL sources** (`src/data/**` — synthetic portfolio
  AND AD-SDI-derived boundaries) carries a provenance tag; synthetic records also carry `IS_DEMO` (matching
  INV-provenance-tagged "every dataset/field").
- [ ] A guard asserts KPI/count values in `src/ui/` are computed (no typed mockup literals) and no "AED 85B" token appears.

### Optional / Quality
- [ ] Loading + empty states for the scene.
- [ ] Smooth fly-to easing.

---

## Deterministic Signals
### Real Inputs
- `ADPIC_LIVEX_UI_Screens/*.png` — visual/UX reference (not data).
- `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` — epic invariants.
- `.ai/epics/.../evidence/stage-1.1_oq5_dataset_inventory.md` — verified data sources + provenance.
- AD-SDI Districts REST (OFFICIAL/PUBLIC): `https://arcgis.sdi.abudhabi.ae/agspublish/rest/services/OpenData/ADSDI_OpenData/MapServer/4`.
- Esri 3D Buildings SceneServer (tokenless): `https://basemaps3d.arcgis.com/arcgis/rest/services/Esri3D_Buildings_v1/SceneServer`.

### Fixed Constraints
- Vite + React + TS + `@arcgis/core`; no other UI framework.
- No hard-coded screenshot numbers; every dataset/field provenance-tagged.
- Core scene requires NO API key and NO live LLM; AOI switch = no full reload.
- Dark cinematic tokens; desktop/1920×1080-first; RTL-ready structure (English content).

### Execution Semantics
- At runtime: app mounts once; `SceneRoot` creates the SceneView, adds the Esri 3D SceneLayer + AOI
  boundary + demo markers; `AoiSwitcher` calls a camera/layer swap on the existing view (no remount); on
  3D-layer load failure the scene swaps to the degrade path without reload; KPI strip computes aggregates
  from the demo portfolio at render.
- At build: `npm run build` type-checks and bundles.

### Resolution Rules
- If a value is available from OFFICIAL/PUBLIC data, prefer it and tag it OFFICIAL/PUBLIC; otherwise use a
  DERIVED (deterministic) or SYNTHETIC/DEMO value and tag it accordingly — never present demo as official.
- If the Esri 3D service is unreachable → degrade path (own-built footprints / reduced state), no reload.
- If a screenshot conflicts with WORK.md → WORK.md wins.

---

## Execution Model
- **Model:** app_package

## Ambiguity Rule
- If a required real dataset is unavailable, use a clearly-tagged SYNTHETIC/DEMO or DERIVED substitute —
  do NOT present it as official, and do NOT block.
- If acceptance criteria are ambiguous re: scope, keep to Explore only (defer Assessment/Simulate/Ask-AI).
- If a guardrail (no mockup numbers, attribution, provenance tag) conflicts with visual fidelity, the
  guardrail wins.

## Open Questions
1. Exact Khalifa City community/district polygon selection (AD-SDI has "KHALIFA CITY" district — pick during data prep).
2. Curated synthetic portfolio size per AOI (target strong/responsive MVP; ~20–40/AOI per WORK-AC-4).

## Reviewer Notes
[owner review gate fills this.]

**Decision:** Draft — pending owner authorization already given for Stage 1.2 (routine start).
**Reason:** —

---

## Success Proof

> Done-criteria (DC-n) — each demonstrates ≥1 AC and is verified by `.ai/stages/1.2/verify.sh <AC>`
> (post-build; pre-build it honestly reports NOT-YET-BUILT).

- DC-1: `npm run build` succeeds and `src/` contains a SceneView instantiating the tokenless Esri 3D Buildings SceneLayer with muted context and emphasized markers.
  demonstrates: AC-1
  verify: bash .ai/stages/1.2/verify.sh AC-1
- DC-2: `src/` renders a KPI strip, sector filters, and selectable markers with fly-to/emphasis.
  demonstrates: AC-2
  verify: bash .ai/stages/1.2/verify.sh AC-2
- DC-3: An AOI switcher swaps Khalifa/Al Reem by updating the camera/layers of the SAME persisted `SceneView` instance (SceneView constructed exactly once; not re-instantiated per switch), without remounting the app root.
  demonstrates: AC-3
  verify: bash .ai/stages/1.2/verify.sh AC-3
- DC-4: Disabling the Al Reem opening leaves a coherent Khalifa-only experience and the scene degrades without reload.
  demonstrates: AC-4
  verify: bash .ai/stages/1.2/verify.sh AC-4
- DC-5: All demo records carry provenance + IS_DEMO, no mockup-number literals appear in `src/`, and an attribution element is present.
  demonstrates: AC-5
  verify: bash .ai/stages/1.2/verify.sh AC-5
