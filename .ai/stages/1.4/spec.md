<!-- template-version: spec_template/v1 -->
# Feature Spec: Stage 1.4 — Liveability Impact Simulator

**Stage:** 1.4 · **Status:** Draft · **Author:** Claude (owner session) · **Date:** 2026-09-04
**Epic:** adpic-livex-2026-capital-intelligence-mvp
**Build path:** owner-authorized direct-build override.

---

## UI Surface Declaration (MANDATORY)
- **Touches UI?** YES · **UI Delivery Mode:** direct_ui · **Surfaces affected:** Exhibition (large display)
- **UI Change Class:** A (NEW_SCREEN — the Liveability Impact Simulation screen)

### Screen Inventory
| Screen | Surface | Action | Reference | Notes |
|--------|---------|--------|-----------|-------|
| Liveability Impact Simulation | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/05_Liveability_Impact_Simulation.png` | Before/After + KPI deltas + hypothetical school |

### UI Impact Description
| Screen | Impact Level | Justification |
|--------|-------------|---------------|
| Simulator | create | New before/after simulation screen |

---

## Problem Statement
Build the **Liveability Impact Simulator** (story beat 3, "Simulate its impact") for the approved
**hypothetical school** scenario in Khalifa City: a **pure, deterministic, precomputed** engine compares
**Current** vs **With Proposed School** — service-area coverage, underserved population, average access
distance, and a Liveability Impact Score — and the UI reveals the change through the exhibition sequence
(current → Simulate → intervention → changed coverage → KPI change → explanation). The school is clearly
hypothetical/demo, never an approved real project. No live routing, no live LLM; every value comes from the
frozen simulation engine.

## Acceptance Criteria
> Each `AC-n` covers ≥1 ROADMAP requirement (`RR-n` in ROADMAP.md § Stage 1.4).

#### AC-1 — A pure, deterministic simulation compares Current vs With-Proposed-School for the hypothetical school scenario; identical inputs always yield identical before/after results (WORK-REQ-12, WORK-AC-8, WORK-DEC-2).
covers: RR-1

#### AC-2 — The before/after map shows current coverage, underserved areas, the proposed school location, the new service area, and the newly-covered communities (WORK-REQ-14, WORK-AC-9).
covers: RR-2

#### AC-3 — The simulator reports population within the service area, coverage, average access distance, underserved population, and a Liveability Impact Score, for Current and With-Proposed-School with the deltas (WORK-REQ-13).
covers: RR-3

#### AC-4 — The interaction follows the exhibition sequence: current state → Simulate → proposed intervention appears → changed coverage → KPI change → concise explanation (WORK-REQ-15).
covers: RR-4

#### AC-5 — The proposed school is labeled hypothetical/demo and never reads as an approved real capital project (WORK-BR-14, WORK-DATA-32).
covers: RR-5

#### AC-6 — Every before/after value is produced by the precomputed frozen simulation engine — no mockup figure is hard-coded as a UI literal (WORK-AC-19; Core Invariant 4 for simulation outputs).
covers: RR-6

## In Scope
- Pure deterministic simulation engine (coverage/underserved/access/impact from frozen population zones +
  existing schools + a proposed school); before/after map visualization; KPI delta strip; current→after
  reveal sequence; hypothetical-school labeling; wired reachable from the Khalifa flow.

## Out of Scope
- Ask ADPIC AI (1.5), live routing/service-area REST, live LLM, real internal population/facility data
  (DERIVED/precomputed proxies used now), non-school scenarios.

## Files to Create
| File | Purpose |
|------|---------|
| `src/simulation/scenario.ts` | Hypothetical school scenario (proposed location, service radius) — DEMO-labeled |
| `src/simulation/populationZones.ts` | Frozen demo population/demand zones (Khalifa) — provenance-tagged |
| `src/simulation/simulationEngine.ts` | Pure deterministic Current-vs-After engine + metrics |
| `src/ui/Simulator.tsx` | Before/after simulation screen (maps + KPI deltas + sequence + hypothetical label) |
| `tests/simulation.test.ts`, `tests/simulator.ui.test.tsx` | Behavioural tests |

## Files to Modify
| File | Change |
|------|--------|
| `src/AppShell.tsx` | Add a "Simulate" entry (Khalifa) opening the Simulator; Back preserves the mounted view |

## Protected Files
- WORK contract; `.ai/epics/**`; `.ai/stages/1.4/*`; existing 1.2/1.3 code (extended, not broken).

## Core Invariants
### Risk Surface: none · Derived Risk Tier: _derived_
```json
[
  {"id":"INV-sim-deterministic","class":"reproducibility","actors":["simulation-engine"],"authoritative_entity":"simulation-result","statement":"the simulation engine is pure and precomputed; identical inputs always yield identical before/after metrics (no randomness, wall-clock, or network)","obligation_refs":[]},
  {"id":"INV-sim-no-mockup","class":"data-provenance","actors":["simulator-ui"],"authoritative_entity":"before-after-value","statement":"every displayed before/after value comes from the simulation engine result; no numeric figure is hard-coded as a JSX literal in src/ui","obligation_refs":[]},
  {"id":"INV-hypothetical-school","class":"communication-governance","actors":["simulator-ui"],"authoritative_entity":"proposed-school","statement":"the proposed school is labeled hypothetical/demo and never presented as an approved real capital project","obligation_refs":[]}
]
```

## UX Requirements
### Affected Screens
| Screen | Action | Notes |
|--------|--------|-------|
| Simulator | Create | Before/After panels + KPI deltas + Simulate reveal + hypothetical label |
| AppShell | Modify | Khalifa "Simulate liveability impact" entry → Simulator; Back → Explore (view preserved) |
### Display Rules
| Element | Rule | Fallback |
|---------|------|----------|
| Before/After maps | render coverage from engine result | — |
| KPI deltas | computed from engine (before/after) | never a hard-coded literal |
| Proposed school | shown only after Simulate; labeled "Hypothetical (demo)" | hidden in Current state |

## Design System Alignment
Reuse `src/theme/tokens.css` (no raw hex in components — verify.sh AC-6/authority).

## Component Mapping / Stac / SDUI: N/A — direct_ui.

## Artifact Type: mobile_feature (closest enum; actual = web UI feature).
## Stage Boundary Classification: Internal implementation.
## Validation Gate Profile: admin_ui (closest web-UI); build + behavioural tests + guards.
## UI Delivery Mode: direct_ui
## Contract Boundary / Source of Truth / Seam Impact: N/A (single frontend, no seams/boundary).

## Architecture Notes
Deterministic precomputed simulation (WORK-INT-7): coverage is computed in pure TS from frozen population
zones + school points + a proposed school (service-radius catchment). Values are DERIVED (real service-area
routing is the swap target). Rendered as before/after map panels (SVG over a normalized grid — reliable,
no network) + a KPI delta strip. The reveal sequence is a small state machine (current → after). The school
is hypothetical/demo. Reachable from the Khalifa Explore/Assessment flow; Back preserves the mounted SceneView.

## Data Model Changes
`Zone { id, name, population, x, y, provenance }`; `School { id, x, y, kind: "existing"|"proposed", isDemo }`;
`SimMetrics { populationInServiceArea, coveragePct, avgAccessDistance, underserved }`;
`SimulationResult { before: SimMetrics, after: SimMetrics, liveabilityImpactScore, newlyCovered: string[], proposed: School }`.

## Public API / Dependencies: none new. No secrets, no live LLM.

## Security Checklist
| Check | Status | Notes |
|-------|--------|-------|
| No confidential data | ✅ | synthetic/derived demo zones only |
| Hypothetical not-real | ✅ | proposed school labeled hypothetical/demo (WORK-BR-14) |

## Verification Checklist (ALL mechanical via `.ai/stages/1.4/verify.sh`)
- [ ] `src/simulation/simulationEngine.ts` + `scenario.ts` + `populationZones.ts` exist; `src/simulation` is PURE (no random/clock/network) — verify.sh AC-1.
- [ ] Determinism + coverage-improves tests pass — verify.sh AC-1 (npm test).
- [ ] Before/after map + metrics + newly-covered rendered — tests (AC-2/AC-3).
- [ ] Simulate reveal sequence (current→after) — verify.sh AC-4 (wiring) + test.
- [ ] Hypothetical/demo school label present — verify.sh AC-5 grep + test.
- [ ] No hard-coded numeric JSX literal in `src/ui/Simulator.tsx` — verify.sh AC-6 structural guard; no raw hex; no live-LLM.

## Deterministic Signals
### Real Inputs
- ROADMAP § Stage 1.4 (RR-1..6); WORK-REQ-12/13/14/15, WORK-AC-8/9, WORK-DEC-2, WORK-BR-14, WORK-DATA-32.
- Stage 1.2/1.3 data + tokens + AppShell.
### Fixed Constraints
- Pure deterministic engine (no random/clock/network in src/simulation). No mockup literals. Hypothetical
  school labeled demo. No live LLM. Reuse dark tokens (no raw hex in components).
### Execution Semantics
- `simulateSchool(zones, existingSchools, proposed)` → before (existing only) and after (existing+proposed)
  coverage/underserved/access + liveabilityImpactScore + newlyCovered. Simulator renders Current, then on
  "Simulate" reveals the proposed school + after coverage + KPI deltas + explanation.
### Resolution Rules
- Same inputs → same result. A zone is covered if within the service radius of any school. Newly-covered =
  covered-after minus covered-before. If no zones, metrics are 0 (defined, not invented).

## Execution Model
- **Model:** app_package (epic `hybrid` = app code + this stage's verify.sh).

## Ambiguity Rule
- Real service-area data unavailable → deterministic precomputed proxy, tagged DERIVED; never presented as
  real. Simulator only (defer Ask-AI). Guardrail beats visual fidelity.

## Open Questions
1. Real population/service-area inputs (WORK-OQ-5, DEP-6/7) — DERIVED proxies now; real data is the swap target.

## Success Proof
- DC-1: `simulationEngine.ts` pure; determinism + coverage-improves tests pass. demonstrates: AC-1 · verify: bash .ai/stages/1.4/verify.sh AC-1
- DC-2: before/after map renders current coverage, underserved, proposed location, new service area, newly-covered. demonstrates: AC-2 · verify: bash .ai/stages/1.4/verify.sh AC-2
- DC-3: metrics (pop-in-service-area, coverage, avg access distance, underserved, Liveability Impact Score) shown before/after with deltas. demonstrates: AC-3 · verify: bash .ai/stages/1.4/verify.sh AC-3
- DC-4: current→Simulate→intervention→KPI-change→explanation sequence works (state machine). demonstrates: AC-4 · verify: bash .ai/stages/1.4/verify.sh AC-4
- DC-5: proposed school labeled hypothetical/demo, never approved-real. demonstrates: AC-5 · verify: bash .ai/stages/1.4/verify.sh AC-5
- DC-6: every before/after value computed by the engine; no hard-coded JSX numeric literal in Simulator. demonstrates: AC-6 · verify: bash .ai/stages/1.4/verify.sh AC-6
