# Stage 1.3 — Build Evidence (Deterministic Assessment + Evidence)

**Date:** 2026-09-04 · **Branch:** `feat/stage-1.3` · **Mode:** owner-authorized direct-build override
(`decisions/DECISION-stage-1.3-direct-build-override.md`) after certification-first hit an environmental
dead-end (non-deterministic injected/hermetic semantic reviewer; the spec reached Lens A PASS on merit).
**Status:** BUILD COMPLETE & VERIFIED — awaiting owner review gate. Stage 1.4+ NOT started.

## Verification summary — ALL GREEN
- **Build:** `npm run build` → OK.
- **Tests:** `vitest run` → **30/30 passed** (8 files) — incl. 5 scoring, 4 assessment-UI, 1 AppShell integration.
- **Guards:** `.ai/stages/1.3/verify.sh all` → **PASS** (AC-1 build+engine-purity, AC-3 exact disclaimer,
  AC-4 rules-attributed/no-AI-approver/no-LLM/no-hex, AC-5 illustrative-weights, AC-7 wiring, TESTS).
  (`all` hardened to accumulate failures — a real gate.)

## Executable behavioural tests (each with a negative control)
- **AC-1 determinism/banding** (`scoring.test.ts`): identical input → deeply-equal result; strong-profile →
  High, weak-profile → Low (inverted banding fails).
- **AC-2 evidence**: every present-input dimension carries non-empty evidence; `attributedTo` = GIS/rules.
- **AC-6 missing-input**: ONE missing dim → "Insufficient data" (null score) with overall still deterministic
  (exclude-and-renormalize); **ALL missing → overall "Insufficient data", overallScore null** (no invented score).
- **AC-3 disclaimer** (`assessment.ui.test.tsx`): exact WORK-BR-15 string rendered.
- **AC-4 authority**: attribution to GIS/rules; explanation separated from evidence; NO AI-as-approver phrasing.
- **AC-7 wiring + preservation** (`appShell.test.tsx`): render AppShell w/ injected fake SceneApi → Start →
  select project → Evaluate → Assessment for THAT project (disclaimer + rows); Back → `createView` called
  exactly once across Explore→Evaluate→Back and `destroy` NOT called (view preserved; recreate-on-back fails).

## Live evidence (vite preview, real browser)
Explore → select project → Evaluate opened the Assessment with: exact WORK-BR-15 disclaimer ✓, result
attributed to "GIS indicators + business rules" ✓, a deterministic **Medium** overall priority ✓, all **7
dimension rows** with calculated evidence ✓, a separated deterministic explanation ✓, no AI-as-approver
phrasing ✓, and the "illustrative / not an official ADPIC methodology" weights note ✓.

## Architecture / guardrail conformance
- **GIS computes; rules score; AI explains:** pure deterministic engine (`src/assessment/*`, no
  random/clock/network — verified) produces Low/Med/High from configured illustrative weights; the UI
  attributes the result to rules; the "Explanation" is deterministic template text (no live LLM) clearly
  separated from calculated evidence and never states an approval.
- **Provenance:** indicators are DERIVED proxies from the frozen dataset (real GIS indicators are the swap
  target); weights are config-driven and labeled illustrative/non-official (WORK-OQ-3 still OPEN).
- **Reachability (no green-while-absent):** Assessment wired into the flow via `AppShell` (injected
  `SceneApi`); `App.tsx` is the only `@arcgis/core` importer, keeping AppShell testable in jsdom.
- **View preserved:** SceneView constructed once; Evaluate overlays the Assessment on the still-mounted
  scene; Back does not destroy/recreate it (no Explore regression — 1.2 tests still 6/6 + 4/4 green).

## Scope delivered vs deferred
- **Delivered (1.3):** scoring engine + illustrative weights + indicators + exact disclaimer + Assessment
  screen (overall + dimension evidence table + separated explanation + weights note + disclaimer) +
  Explore→Evaluate wiring.
- **Deferred (later, correctly absent):** Liveability Simulator (1.4), Ask ADPIC AI (1.5), live LLM, live
  routing, real GIS indicators / internal methodology (DERIVED proxies now).

## Notes (non-blocking)
- The "Insufficient data" path is reachable in the shipped app only via missing GIS inputs (the frozen
  demo records are fully populated) — it is defensive + test-proven, as the spec frames it.
- Vite chunk-size warning (large ArcGIS SDK) — code-splitting is a later (1.5) hardening concern.
- Methodology/claim approver (WORK-OQ-3) remains OPEN; the weights stay clearly illustrative until then.
