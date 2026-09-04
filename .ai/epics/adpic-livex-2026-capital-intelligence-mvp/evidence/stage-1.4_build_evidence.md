# Stage 1.4 — Build Evidence (Liveability Impact Simulator)

**Date:** 2026-09-04 · **Branch:** `feat/stage-1.4` · **Mode:** owner-authorized direct-build override.
**Status:** BUILD COMPLETE & VERIFIED — awaiting owner review gate. Stage 1.5 NOT started.

## Verification — ALL GREEN (first run)
- **Build:** `npm run build` → OK.
- **Tests:** `vitest run` → **34/34 passed** (10 files; +3 simulation, +1 simulator-UI; all prior stages still green — no regression).
- **Guards:** `.ai/stages/1.4/verify.sh all` → **PASS** (AC-1 build+engine-purity, AC-4 sequence, AC-5 hypothetical label, AC-6 no-mockup-JSX/no-hex/no-LLM, TESTS). `all` accumulates failures.

## Behavioural tests (each with a negative control)
- **AC-1 determinism** (`simulation.test.ts`): `simulateSchool()` twice deeply-equal; adding the proposed
  school increases population-in-service-area & coverage, reduces underserved & avg access distance;
  liveabilityImpactScore > 0; newlyCovered non-empty; proposed school kind=proposed, isDemo=true.
- **AC-4 sequence + AC-2/3/5** (`simulator.ui.test.tsx`): hypothetical label always shown; before Simulate the
  after KPI-deltas/explanation are ABSENT (negative control); after Simulate → Before + After maps, ≥5 KPI
  deltas, newly-covered sectors, and the explanation appear.

## Live evidence (vite preview, real browser)
Explore (Khalifa) → "Simulate liveability impact" → current state (after-KPIs hidden) → "Simulate the
proposed school" → Before/After maps + computed deltas: **+~19K** in service area, **+23%** coverage,
**−~19K** underserved, avg access **21 → 15.6**, **+24** Liveability Impact Score; newly-covered = Sectors
G, K, L; explanation shown. School labeled "Hypothetical school (demonstration — not an approved project)".
All values engine-computed (no mockup figures).

## Guardrail conformance
- **Deterministic precomputed** simulation (`src/simulation/*`, pure — no random/clock/network, verified).
- **Every before/after value from the engine** — no hard-coded JSX numeric literal in the Simulator (verify.sh AC-6).
- **Hypothetical/demo school** labeled everywhere; kind=proposed, isDemo=true; never an approved real project (WORK-BR-14, WORK-DATA-32).
- **Provenance:** population zones are DERIVED demonstration demand (not official ADPIC analysis; real SCAD/AD-SDI data is the swap target, WORK-OQ-5 OPEN).
- **No live LLM/routing;** dark tokens (no raw hex); wired reachable from Khalifa; SceneView preserved (overlay).

## Scope delivered vs deferred
- **Delivered (1.4):** simulation engine + frozen zones + hypothetical school scenario + before/after maps +
  KPI deltas + newly-covered + reveal sequence + explanation + hypothetical labeling + AppShell wiring.
- **Deferred (correctly absent):** Ask ADPIC AI (1.5), live routing/service-area, real population/facility
  data (DERIVED proxies now), exhibition hardening/backup video.

## Notes (non-blocking)
- Vite chunk-size warning (ArcGIS SDK) — code-splitting is a later (1.5) concern.
- Real service-area/population inputs (WORK-OQ-5, DEP-6/7) remain the swap target; DERIVED proxies now.
