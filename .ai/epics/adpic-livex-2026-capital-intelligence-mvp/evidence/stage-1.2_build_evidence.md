# Stage 1.2 — Build Evidence (Explore / 3D Shell + AOI Switch)

**Date:** 2026-09-04 · **Branch:** `feat/stage-1.2` · **Mode:** owner-authorized direct-build override
(see `decisions/DECISION-stage-1.2-direct-build-override.md`). **Status:** BUILD COMPLETE & VERIFIED —
awaiting owner review gate. Stage 1.3+ NOT started.

The override was authorized specifically to "address the remaining reviewer concern through executable
behavioural tests and post-build verification evidence." This is that evidence.

## Verification summary — ALL GREEN
- **Build:** `npm run build` (tsc -b + vite build) → **OK** (`stage-1.2_build_verify.log`).
- **Tests:** `vitest run` → **20/20 passed** across 5 files (`stage-1.2_test_results.log`).
- **Mechanical guards:** `verify.sh all` → **PASS** on AC-1..AC-5 (build, SceneView+3D layer, no raw hex,
  KPI/filters/fly-to, SceneView-constructed-once + no location.reload, no-forbidden/no-LLM, all-datasets
  provenance + IS_DEMO + no hard-coded JSX KPI literal + attribution).

## Executable behavioural tests (the reviewer's Builder-Readiness concern — now met by RUNNING tests)
Each has a negative control:
- **AC-3 (SceneView built once / swap on mounted view):** `sceneController.test.ts` asserts
  `createView` is called **exactly once** across init + 3 AOI switches (a per-switch new view would be >1);
  second `init()` is a no-op; `goToAoi` calls the same view's `goToCamera/setBoundary/setProjects`.
- **AC-2 (filter changes marker set; select flies to):** `setSectorFilter(Education)` returns a strictly
  smaller, sector-pure set and pushes it to the view; `focusProject` calls `goToPoint(lon,lat)` + `emphasize(id)`.
  `filters.test.ts` + `ui.test.tsx` assert the pure logic and the component interaction (aria-pressed toggles).
- **AC-4 (degrade without reload):** simulating a 3D-layer error sets `degraded=true` and fires `onDegrade`
  (negative control: not degraded before the error); the controller never references `location.*`.
- **AC-5 (computed KPIs, provenance):** `kpis.test.ts` proves aggregation; `provenance.test.ts` proves
  **every** portfolio record is `SYNTHETIC_DEMO`+`IS_DEMO` and **every** boundary is `OFFICIAL_PUBLIC`+attribution,
  and that counts are a showcase set (≤40/AOI), explicitly not 219/139; `ui.test.tsx` proves KPI values equal
  the computed count (not a mockup literal) and empty→"—".

## Live evidence (vite preview, real browser, 1920×1080)
- Hero renders: "Capital Intelligence", story "Understand the place → …", "Start Experience", "LIVEX 2026 · Abu Dhabi".
- Explore (Khalifa): ArcGIS **SceneView canvas rendered**; KPIs **computed** = 26 / AED 7.6B / 4 / 9 / ~383K
  (NOT 219/139/AED 85B); all 6 sector filters; both AOI tabs; attribution (AD-SDI + synthetic-demo) visible.
- **AOI switch → Al Reem:** KPIs updated to Reem's data = 24 / AED 6.3B / 11 / 4 / ~282K, `activeTab=Al Reem`,
  and **`noReload: true`** (navigation timing unchanged) — AC-3 proven live end-to-end.
- (Screenshots hit the capture tool's 5s WebGL limit; DOM + tests are the evidence of record.)

## Guardrail conformance (owner boundaries)
- No mockup numbers (structural JSX guard + computed KPIs, proven live). Provenance tags + IS_DEMO on all
  datasets. Attribution from the first Explore render. Tokenless Esri 3D SceneLayer (no API key). Own-built
  degrade path without reload. No live LLM / Assessment / Simulate / Ask-AI code. Dark cinematic tokens
  (no raw hex in components). Al Reem cleanly disable-able (switcher hides it; Khalifa spine remains).
  Explore-only (no later-stage logic). WORK.md authoritative; screenshots = UX reference only.

## Scope delivered vs deferred
- **Delivered (Stage 1.2):** app shell, Hero→Explore, dark cinematic SceneView + tokenless 3D buildings +
  AOI boundary + project markers, KPI strip, sector filters, selectable markers with fly-to, AOI switch
  (no reload), degrade path, attribution, provenance model + frozen synthetic portfolio.
- **Deferred (later stages, correctly absent):** AI-Assisted Assessment (1.3), Liveability Simulator (1.4),
  Ask ADPIC AI (1.5), live routing, real internal data, full offline packaging + hardware profiling.

## Notes / follow-ups (non-blocking)
- Vite chunk-size warning: the ArcGIS SDK bundles large; code-splitting is a later hardening concern (1.5).
- Boundaries use simplified extents for dev (schema/provenance are the swap target for full AD-SDI polygons).
- Conditions C1/C2 (AD-SDI/SCAD offline-bundling) remain owner/legal items before exhibition-build commit.
