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
grep -rnE '\b(139|219)\b|AED[ ]?85B' src/   # expect 0 matches
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
