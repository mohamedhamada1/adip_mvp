<!-- template-version: plan_template/v1 -->
# Implementation Plan: Stage 1.3 — Deterministic Assessment + Evidence

**Stage:** 1.3
**Spec:** `.ai/stages/1.3/spec.md`
**Status:** Draft
**Author:** Claude (owner session)
**Date:** 2026-09-04

---

## Overview
Add a pure-TypeScript, config-driven deterministic scoring engine and an Assessment screen. For a selected
project, derive indicator inputs from the frozen dataset (DERIVED), score each dimension with evidence,
apply illustrative (non-official) weights, threshold into Low/Med/High attributed to rules, and render the
result with per-dimension evidence, a persistent WORK-BR-15 disclaimer, and a clearly-separated deterministic
explanation (no live LLM). Missing inputs yield "Insufficient data", never an invented score. Assessment only.

> Checklist Preservation Rule: every spec Verification Checklist item maps to ≥1 step below.

## Pre-Implementation Checklist
- [ ] Stage 1.2 merged (App shell, ProjectRecord, tokens) available on the branch base.
- [ ] No protected files in scope (App.tsx extended, not rewritten).

## Implementation Steps

### Step 1: Dimensions + illustrative weights config
**Files:** `src/assessment/dimensions.ts`, `src/assessment/weights.config.ts`
**Action:** Create. **What:** dimension keys/labels (Strategic Alignment, Community Need, Spatial Service
Gap, Duplication, Accessibility Benefit, Infrastructure Dependency, Delivery Complexity); weights config
carrying an explicit "illustrative exhibition-only — NOT official ADPIC methodology" label constant.
**Why:** AC-2, AC-5.

### Step 2: Deterministic indicators + scoring engine
**Files:** `src/assessment/indicators.ts`, `src/assessment/scoringEngine.ts`
**Action:** Create. **What:** `deriveIndicators(project)` → deterministic inputs (DERIVED) with evidence;
`scoreProject(project, weights)` → per-dimension {score|null, band, evidence[], inputsPresent}, weighted
overall score, Low/Med/High threshold, `attributedTo: "GIS indicators + business rules"`. PURE: no
Math.random / Date / fetch. Missing input → band "Insufficient data" + reason (no invented score).
**Why:** AC-1, AC-2, AC-6, INV-deterministic-score, INV-evidence-backed.

### Step 3: Disclaimer constant
**File:** `src/assessment/disclaimer.ts` **Action:** Create. **What:** the EXACT WORK-BR-15 string.
**Why:** AC-3.

### Step 4: Assessment UI
**Files:** `src/ui/Assessment.tsx`, `src/ui/PriorityBadge.tsx`
**Action:** Create. **What:** overall PriorityBadge (attributed to rules), dimension table (score + band +
evidence), a clearly-tagged "Explanation" block (deterministic template text, separated from evidence),
persistent disclaimer, and the non-official-weights note. No AI-as-approver phrasing; tokens only (no hex).
**Why:** AC-2, AC-3, AC-4, AC-5, INV-ai-explains-not-approves, INV-disclaimer-and-nonofficial-weights.

### Step 5: Extract AppShell + wire Explore → Evaluate (testable)
**Files:** `src/AppShell.tsx` (create), `src/App.tsx` (modify)
**Action:** Create/Modify. **What:** move the Explore view/selection state into `AppShell`, which takes
`sceneApi: SceneApi` as a REQUIRED prop (no `@arcgis/core` import). Add an Evaluate view: selecting a
project offers "Evaluate", opening `Assessment` for THAT project (`scoreProject(selected, weights)`); Back
returns to Explore with the mounted SceneView preserved. `App.tsx` becomes a thin wrapper passing the real
`arcgisSceneApi` into `<AppShell>` — the only module importing `@arcgis/core`, so AppShell renders in jsdom.
**Why:** AC-7 (wiring is anchored + testable), and keeps AC-1..AC-6 reachable in the UI. No Explore regression.

### Step 6: Tests
**Files:** `tests/scoring.test.ts`, `tests/assessment.ui.test.tsx`
**Action:** Create. **What:** determinism, banding, evidence, missing-input; disclaimer render, no-AI-approval,
evidence rendering. **Why:** spec Tests + Success Proof.

## Platform Setup Steps
N/A — pure web, no native/keys.

## UX Verification
- [ ] Assessment renders overall + dimension table + evidence + disclaimer + separated explanation.
- [ ] Missing-input dimension shows "Insufficient data" + reason (not a number).
- [ ] No AI-as-approver wording; result attributed to rules.
- [ ] Explore unaffected (no regression); mounted SceneView preserved across Evaluate/Back.

## Test Plan
| Test File | Test Cases | Behavior Verified |
|-----------|-----------|-------------------|
| `tests/scoring.test.ts` | determinism, banding, evidence, missing-input | AC-1/AC-2/AC-6 |
| `tests/assessment.ui.test.tsx` | disclaimer, no-AI-approval, evidence rendering | AC-3/AC-4 |

## Verification Commands
```bash
npm install
npm run build
npm test
bash .ai/stages/1.3/verify.sh all
```

## P0/P1 Validation Plan
| Validation | Command | Expected mode | Expected evidence |
|------------|---------|---------------|-------------------|
| P0 conformance | `ai check` | warn | conformance verdict |
| Build | `npm run build` | must pass | build output |
| Determinism/behaviour | `npm test` | must pass | test counts |
| Guards | `bash .ai/stages/1.3/verify.sh all` | PASS | verify output |
| P1 source-of-truth / seams | N/A | — | single frontend, no seams |

## Rollback Plan
```bash
git checkout -- src/assessment src/ui/Assessment.tsx src/ui/PriorityBadge.tsx src/App.tsx
```

## Plan Tasks

> Anchored plan tasks (T-n) — each satisfies ≥1 AC.

- T-1: Build the pure, config-driven `scoringEngine.ts` + `weights.config.ts` + `indicators.ts` producing deterministic Low/Med/High from inputs+rules (no random/clock/network).
  satisfies: AC-1
- T-2: Emit per-dimension evidence in every result and render the dimension table with evidence on the Assessment screen.
  satisfies: AC-2
- T-3: Add the exact WORK-BR-15 disclaimer constant and render it persistently on the Assessment screen.
  satisfies: AC-3
- T-4: Attribute the overall result to GIS/rules, separate explanation from evidence, and ensure no AI-as-approver phrasing (tokens only, no live LLM).
  satisfies: AC-4
- T-5: Label the weights config illustrative / not-official-ADPIC-methodology and surface that note near the dimensions.
  satisfies: AC-5
- T-6: Handle a missing indicator input as an "Insufficient data" dimension with a reason, keeping the overall priority deterministic via exclude-and-renormalize.
  satisfies: AC-6
- T-7: Extract `AppShell` (injected `SceneApi`) and wire Explore→Evaluate so selecting a project opens the Assessment for that project; `App.tsx` becomes the thin `@arcgis/core` wrapper.
  satisfies: AC-7

## Test plan

> Anchored tests (TEST-n) — each proves ≥1 AC and declares a negative control (fails_when:).

- TEST-1: Determinism/banding test calls `scoreProject` twice on the same input and asserts deeply-equal results, and asserts a high-profile input bands High while a low-profile input bands Low.
  proves: AC-1
  fails_when: two runs on identical input differ, or the engine references Math.random/Date/fetch (purity), or banding is inverted.
- TEST-2: Evidence test asserts every present-input dimension result has a non-empty `evidence` array and the Assessment renders those evidence items.
  proves: AC-2
  fails_when: a dimension returns a score with empty evidence, or the UI shows only the category with no evidence.
- TEST-3: Disclaimer test asserts the Assessment renders the EXACT WORK-BR-15 string.
  proves: AC-3
  fails_when: the disclaimer text is absent or altered.
- TEST-4: Authority test asserts the result exposes `attributedTo` = GIS/rules, the UI renders a rules-attribution label, explanation is tagged separately from evidence, and there is no "AI approves/recommends approval/decision" phrasing.
  proves: AC-4
  fails_when: the UI presents AI as approving/deciding, or explanation is indistinguishable from calculated evidence.
- TEST-5: Weights-label test asserts the weights config exposes the "illustrative / not official ADPIC methodology" label and the UI surfaces it.
  proves: AC-5
  fails_when: weights are presented without the non-official label.
- TEST-6: Missing-input test scores a project with a removed indicator and asserts the affected dimension band is "Insufficient data" with a reason and no numeric score, while the overall priority is still a deterministic Low/Med/High (exclude-and-renormalize).
  proves: AC-6
  fails_when: a missing input produces an invented numeric score or a non-deterministic/NaN overall.
- TEST-7: Integration test renders `AppShell` with an injected fake `SceneApi` (no @arcgis/core), selects a project, activates Evaluate, and asserts the Assessment renders for THAT project (its name + a Low/Med/High result + the disclaimer).
  proves: AC-7
  fails_when: selecting a project + Evaluate does not open the Assessment, or the Assessment is not wired into AppShell (Assessment shippable unreachable).

## Notes for Claude (implementor)
- Engine MUST be pure/deterministic (no random/clock/network in src/assessment). AI explains, never approves.
- Reuse Stage 1.2 tokens/data; extend App.tsx without breaking Explore.
- Disclaimer wording is EXACT (WORK-BR-15). Weights are illustrative/non-official. Assessment only.
