<!-- template-version: plan_template/v1 -->
# Implementation Plan: Stage 1.2 — 3D Shell + Explore + AOI Switch

**Stage:** 1.2
**Spec:** `.ai/stages/1.2/spec.md`
**Status:** Draft
**Author:** Claude (owner session)
**Date:** 2026-09-04

---

## Overview
Scaffold a standalone Vite + React + TS app, integrate the ArcGIS Maps SDK `SceneView` with the tokenless
Esri 3D Buildings layer (verified in Stage 1.1), and build the Explore experience: Hero → 3D scene with
AOI boundary, curated synthetic `IS_DEMO` project markers, KPI strip, filters, and a no-reload AOI switcher
— in the premium dark cinematic language, with provenance tags, attribution, and a deterministic 3D-degrade
path. Explore only; no Assessment/Simulate/Ask-AI/LLM.

> Checklist Preservation Rule: every spec Verification Checklist item maps to ≥1 step below.

## Pre-Implementation Checklist
- [ ] Node/npm available; `@arcgis/core` installable.
- [ ] Stage 1.1 evidence (tokenless Esri service, AD-SDI Districts) available for URLs/provenance.
- [ ] No protected files in scope.

## Implementation Steps

### Step 1: Scaffold Vite + React + TS
**Files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
**Action:** Create. **What:** minimal Vite React-TS app; add `@arcgis/core`; app shell mounts once.
**Why:** foundation (AC-1). **Notes:** `npm run build` must type-check.

### Step 2: Design tokens (dark cinematic)
**File:** `src/theme/tokens.css` **Action:** Create. **What:** navy bg, blue highlight, spacing/radius/type
tokens; components reference tokens only (no raw hex). **Why:** AC-10, design-system alignment.

### Step 3: Provenance + demo data model
**Files:** `src/data/provenance.ts`, `src/data/portfolio.demo.ts`
**Action:** Create. **What:** provenance tag union (`OFFICIAL_PUBLIC|DERIVED|SYNTHETIC_DEMO`); `ProjectRecord`
(WORK-DATA-aligned incl. `IS_DEMO`); ~20–40 curated synthetic projects per AOI with credible geometry, each
tagged SYNTHETIC/DEMO + `IS_DEMO:true`. **Why:** AC-4/5/8, INV-no-mockup-numbers, INV-provenance-tagged.
**Notes:** NO literal 139/219/AED 85B anywhere; KPIs are computed aggregates.

### Step 4: AOI definitions + boundaries
**Files:** `src/scene/aoi.ts`, `src/data/aoiBoundaries.ts`
**Action:** Create. **What:** Khalifa/Al Reem camera positions; load AD-SDI Districts polygons (OFFICIAL/
PUBLIC, attributed) — fetched/frozen to local JSON for dev; provenance-tagged. **Why:** AC-3/7.

### Step 5: SceneRoot (SceneView + 3D buildings + degrade)
**File:** `src/scene/SceneRoot.tsx`
**Action:** Create. **What:** instantiate `SceneView` (dark ground, muted massing), add tokenless Esri 3D
Buildings SceneLayer + AOI boundary + demo markers; on layer load failure → degrade path (own-built extruded
footprints from boundary/building data or reduced labeled state) WITHOUT reload. **Why:** AC-2/5/11,
INV-no-live-llm-core. **Notes:** camera/layers swap on the existing view for AOI switch.

### Step 6: Explore UI components
**Files:** `src/ui/Hero.tsx`, `src/ui/KpiStrip.tsx`, `src/ui/Filters.tsx`, `src/ui/AoiSwitcher.tsx`, `src/ui/Attribution.tsx`
**Action:** Create. **What:** Hero → Explore transition; KPI strip (computed from demo portfolio); filters
(Mobility/Education/Health/Public Realm/Community/Utilities) toggling markers; AOI switcher (no reload; Al
Reem disable-able); attribution element always visible. **Why:** AC-3/4/6/9/10, INV-attribution-present.

### Step 7: Wire App + interactions
**File:** `src/App.tsx` **Action:** Modify. **What:** compose Hero/Explore; marker select → fly-to/emphasize;
filter state; AOI switch. **Why:** AC-5/6.

### Step 8: Tests + guards
**Files:** `tests/provenance.test.ts`, `tests/no-mockup-numbers.test.ts` (or a grep guard script)
**Action:** Create. **What:** assert every demo record has provenance + `IS_DEMO`; assert no mockup-number
literals in `src/`. **Why:** spec Tests + Safety checklist.

## Platform Setup Steps
N/A — pure web (no native/CocoaPods/Gradle). No env vars/keys required for the core scene.

## UX Verification
- [ ] All Screen Inventory screens implemented (Hero, Explore, AOI switch, KPI).
- [ ] Display rules + fallbacks (KPI "—", 3D degrade, Al Reem disable) handled.
- [ ] AOI switch does not remount app root.
- [ ] Attribution visible from first Explore render.
- [ ] Loading/empty states for the scene.

## Test Plan
| Test File | Test Cases | Behavior Verified |
|-----------|-----------|-------------------|
| `tests/provenance.test.ts` | all records tagged; IS_DEMO true | INV-provenance-tagged, AC-8 |
| `tests/no-mockup-numbers.test.ts` | grep src for 139/219/AED 85B → 0 | INV-no-mockup-numbers, AC-4 |

## Verification Commands
```bash
npm install
npm run build          # type-check + bundle
npm test               # unit tests (vitest)
grep -rnE 'AED[ ]*85[ ]*B|\b85B\b' src/     # expect 0 matches (specific mockup token; deterministic)
# KPI/count values must be computed in src/ui — not typed literals (reviewed manually + by TEST-5)
```

## P0/P1 Validation Plan
| Validation | Command | Expected mode | Expected evidence |
|------------|---------|---------------|-------------------|
| P0 conformance | `ai check` | warn | conformance verdict |
| Build | `npm run build` | must pass | build output |
| No-mockup guard | grep above | must be 0 | grep output |
| P1 source-of-truth | N/A | — | single new frontend, no shared SoT |
| P1 seams | N/A | — | no seams |

## Rollback Plan
```bash
git checkout -- src/ ; rm -rf node_modules dist
```
Greenfield — abandoning removes `src/` scaffold; no data/schema to revert.

## Notes for Claude (implementor)
- Guardrails are non-negotiable: no mockup numbers, provenance tags + `IS_DEMO`, attribution from screen one,
  tokenless Esri 3D + own-built degrade, deterministic/no-live-LLM, dark cinematic tokens, WORK.md > screenshots.
- Explore ONLY. Do not add Assessment/Simulate/Ask-AI.
- Screenshots are UX direction, not data. Al Reem opening must be cleanly disable-able.

---

## Plan Tasks

> Anchored plan tasks (T-n) — each satisfies ≥1 AC.

- T-1: Scaffold Vite/React/TS + `@arcgis/core`; `src/scene/SceneRoot.tsx` instantiates `SceneView` with the tokenless Esri 3D Buildings SceneLayer (muted context) + emphasized project markers; dark cinematic tokens.
  satisfies: AC-1
- T-2: Build `KpiStrip`, `Filters`, and marker select→fly-to/emphasis interactions.
  satisfies: AC-2
- T-3: Build `AoiSwitcher` that swaps camera/layers on the mounted `SceneView` (no app remount, no reload).
  satisfies: AC-3
- T-4: Add an Al Reem enable flag + graceful disable/hide path and a 3D-service degrade path (no reload); ensure no live-LLM code.
  satisfies: AC-4
- T-5: Author the frozen synthetic `IS_DEMO` portfolio + `provenance.ts` model; compute KPIs from it; add `Attribution` component; add a no-mockup-number guard.
  satisfies: AC-5

## Test plan

> Anchored tests (TEST-n) — each proves ≥1 AC and declares a negative control (fails_when:).

- TEST-1: Component/render test asserts `SceneRoot` mounts a `SceneView` and adds the Esri 3D Buildings `SceneLayer`.
  proves: AC-1
  fails_when: SceneRoot renders without a SceneLayer (3D layer omitted).
- TEST-2: Interaction test asserts a sector filter toggles visible markers and selecting a marker triggers a fly-to/emphasis call.
  proves: AC-2
  fails_when: filter change leaves the marker set unchanged, or select does not call goTo.
- TEST-3: AOI-switch test asserts the **`SceneView` instance is preserved** across a Khalifa↔Al Reem switch — the SceneView is constructed exactly once and the switch only updates its camera/layers (the app root is not remounted and the document does not reload).
  proves: AC-3
  fails_when: switching AOI constructs a new SceneView (or remounts the root / reloads the document) instead of updating the existing view.
- TEST-4: Degrade test asserts disabling Al Reem yields a coherent Khalifa-only state and a simulated 3D-layer load failure swaps to the degrade path without reload.
  proves: AC-4
  fails_when: disabling Al Reem crashes/blanks the app, or a layer failure forces a reload.
- TEST-5: Data guard asserts **every dataset record across ALL sources in `src/data/**`** (synthetic portfolio AND AD-SDI-derived boundaries) carries a provenance tag (synthetic records also `IS_DEMO`), that KPI/count values in `src/ui/` are computed (no typed mockup literals) and no "AED 85B" token appears, and that an `Attribution` element renders.
  proves: AC-5
  fails_when: any dataset record lacks a provenance tag, a synthetic record lacks `IS_DEMO`, a KPI/count is a typed mockup literal in `src/ui/` (or "AED 85B" appears), or no attribution renders.
