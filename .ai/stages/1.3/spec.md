<!-- template-version: spec_template/v1 -->
# Feature Spec: Stage 1.3 — Deterministic Assessment + Evidence

**Stage:** 1.3
**Status:** Draft
**Author:** Claude (owner session; canonical authoring step before ai epic prepare)
**Reviewer:** owner review gate + ai epic prepare certification
**Date:** 2026-09-04
**Epic:** adpic-livex-2026-capital-intelligence-mvp

---

## UI Surface Declaration (MANDATORY)
- **Touches UI?** YES
- **UI Delivery Mode:** direct_ui
- **Surfaces affected:** Exhibition (presenter large-display / touchscreen) — desktop-first, 1920×1080
- **UI Change Class:** A (NEW_SCREEN — the Assessment / Evaluate screen)

### Screen Inventory
| Screen | Surface | Action | Figma URL / Screenshot | Notes |
|--------|---------|--------|------------------------|-------|
| AI-Assisted Investment Assessment | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/04_AI_Assisted_Investment_Assessment.png` | Overall Low/Med/High + per-dimension evidence + disclaimer |
| Project Details → Evaluate entry | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/03_Project_Details.png` | Selecting a project in Explore opens Evaluate |

Visual references are UX-direction only; WORK.md authoritative. Screenshot scores/%s are mockup — NOT data.

### UI Impact Description
| Screen | Impact Level | Justification |
|--------|-------------|---------------|
| Assessment screen | create | New screen: overall priority + dimension table + evidence + disclaimer |
| Evaluate entry from Explore | create | New transition wiring a selected project into the assessment |

---

## Problem Statement
Build the **AI-Assisted Capital Investment Assessment** (story beat 2, "Evaluate an investment"): for a
selected proposed/planned project, a **pure-TypeScript, config-driven deterministic engine** produces an
exhibition-only **Low / Medium / High** priority from configured indicators and business rules, exposes the
**contributing evidence per dimension**, keeps the approved disclaimer persistently visible, and makes clear
the result is computed by **GIS indicators + business rules** — AI/template text only *explains*, never
approves. No live LLM. Assessment only; no Simulator or Ask-AI module here.

---

## Acceptance Criteria

> Anchored traceability: each `AC-n` covers ≥1 ROADMAP requirement (`RR-n` in ROADMAP.md § Stage 1.3).

#### AC-1 — A pure-TypeScript, config-driven scoring engine deterministically produces a Low/Medium/High overall priority from configured indicator inputs and business rules; the SAME inputs always yield the SAME result (reproducible) (WORK-REQ-11, WORK-BR-3, WORK-CON-9).
covers: RR-1

#### AC-2 — Each assessment result exposes the contributing per-dimension indicators/evidence (Strategic Alignment, Community Need, Spatial Service Gap, Duplication, Accessibility Benefit, Infrastructure Dependency, Delivery Complexity), not only the overall category (WORK-REQ-10, WORK-AC-6).
covers: RR-2

#### AC-3 — The approved WORK-BR-15 disclaimer wording ("Illustrative decision-support assessment for demonstration purposes; not an official project approval or investment decision.") is persistently visible on the assessment screen (WORK-BR-15, WORK-AC-7).
covers: RR-3

#### AC-4 — The overall result is attributed to deterministic GIS indicators + business rules; the UI visibly distinguishes calculated evidence from explanatory template text, and no screen presents AI as the approver/decider (WORK-BR-1, WORK-BR-2, WORK-SEC-7).
covers: RR-4

#### AC-5 — The configurable scoring weights are labeled exhibition-only / illustrative and NOT presented as an official ADPIC methodology unless separately validated (WORK-BR-9, WORK-BR-10).
covers: RR-5

#### AC-6 — A missing indicator input yields a defined, evidence-visible outcome (the dimension is marked "Insufficient data" with the reason) rather than an invented score, and the overall priority remains deterministic (WORK-NFR-11 traceability; derived edge-case requirement).
covers: RR-6

#### AC-7 — The assessment is REACHABLE from Explore: selecting a project and choosing Evaluate opens the Assessment for THAT project and renders its deterministic result — the engine and screen are actually WIRED into the app flow, not shipped unreachable (roadmap Success Proof "selecting a planned project yields a reproducible Low/Medium/High"; WORK-UX-5, WORK-REQ-9).
covers: RR-1

---

## In Scope
- Pure-TS deterministic scoring engine + config-driven illustrative weights (labeled non-official).
- Per-dimension indicator computation + evidence (derived deterministically from the frozen dataset;
  DERIVED provenance — real GIS indicators are the swap target).
- Assessment screen: overall Low/Med/High, dimension table (score + band + evidence), persistent disclaimer,
  clearly-separated explanation (deterministic template text, tagged as explanation, no live LLM).
- Evaluate entry from Explore (select project → open Assessment).
- Missing-input handling ("Insufficient data" outcome).

## Out of Scope
- Liveability Simulator (Stage 1.4), Ask ADPIC AI (Stage 1.5), live LLM, live routing, real internal
  methodology/data, real GIS indicator computation (deterministic derived proxies used for the MVP).
- Any AI approval/decision authority.

---

## Files to Create
| File Path | Purpose |
|-----------|---------|
| `src/assessment/dimensions.ts` | Dimension keys/labels + indicator input contracts |
| `src/assessment/weights.config.ts` | Illustrative, exhibition-only weights (labeled NOT official) |
| `src/assessment/scoringEngine.ts` | Pure deterministic engine: inputs+rules → dimension results + Low/Med/High |
| `src/assessment/indicators.ts` | Deterministic derivation of indicator inputs from a ProjectRecord (DERIVED) |
| `src/assessment/disclaimer.ts` | The exact approved WORK-BR-15 disclaimer string constant |
| `src/ui/Assessment.tsx` | Assessment screen (overall + dimension table + evidence + disclaimer + explanation) |
| `src/ui/PriorityBadge.tsx` | Low/Med/High badge (attributed to rules) |
| `src/AppShell.tsx` | Explore+Evaluate shell holding view/selection state; takes `sceneApi: SceneApi` as a REQUIRED prop (no @arcgis import) so the Explore→Evaluate wiring is testable in jsdom (AC-7) |
| `tests/scoring.test.ts`, `tests/assessment.ui.test.tsx`, `tests/appShell.test.tsx` | Behavioural tests incl. the Explore→Evaluate transition |

## Files to Modify
| File Path | Change Description |
|-----------|-------------------|
| `src/App.tsx` | Becomes a thin wrapper that passes the real `arcgisSceneApi` into `<AppShell>` (the Explore state moves into AppShell); this is the ONLY module importing `@arcgis/core`, keeping AppShell testable |

## Protected Files
- `WORK_ADPIC_LIVEX_2026_..._FINAL.md`; `.ai/epics/**`; `.ai/stages/1.3/spec.md`/`plan.md`.
- Stage 1.2 files remain; only App.tsx is extended (no regression to Explore).

---

## Core Invariants

### Risk Surface (project-declared, drives the tier)
- **Risk Surface:** none (exhibition demo; no money/booking/inventory/entitlement/capacity/cross-tenant/background-orchestration)
- **Derived Risk Tier:** _derived by the resolver_

### Invariant Declaration
```json
[
  {
    "id": "INV-deterministic-score",
    "class": "reproducibility",
    "actors": ["assessment-engine"],
    "authoritative_entity": "assessment-result",
    "statement": "the scoring engine is pure and config-driven; identical inputs+config always produce an identical Low/Medium/High and identical dimension scores (no randomness, no wall-clock, no network)",
    "obligation_refs": []
  },
  {
    "id": "INV-evidence-backed",
    "class": "traceability",
    "actors": ["assessment-engine"],
    "authoritative_entity": "dimension-result",
    "statement": "every dimension result with present inputs carries non-empty evidence; a dimension with a missing input is marked Insufficient-data with a reason and never receives an invented numeric score",
    "obligation_refs": []
  },
  {
    "id": "INV-ai-explains-not-approves",
    "class": "authority-boundary",
    "actors": ["assessment-ui"],
    "authoritative_entity": "assessment-result",
    "statement": "the overall priority is attributed to GIS indicators + business rules; explanatory text is tagged as explanation and separated from calculated evidence; no UI text presents AI as approving/rejecting/deciding the project",
    "obligation_refs": []
  },
  {
    "id": "INV-disclaimer-and-nonofficial-weights",
    "class": "communication-governance",
    "actors": ["assessment-ui"],
    "authoritative_entity": "assessment-screen",
    "statement": "the exact WORK-BR-15 disclaimer is persistently visible and the weights are labeled illustrative/exhibition-only, not official ADPIC methodology",
    "obligation_refs": []
  }
]
```

---

## UX Requirements
### Affected Screens
| Screen | Surface | Action | Notes |
|--------|---------|--------|-------|
| Assessment | Exhibition | Create | Overall badge + dimension table + evidence + disclaimer + explanation |
| Explore → Evaluate | Exhibition | Modify | Select project opens Assessment for it |

### Display Rules
| Element | Rule | Fallback |
|---------|------|----------|
| Overall priority | Low/Med/High from weighted deterministic score | never shown if no dimensions computable |
| Dimension row | score + band + evidence list | "Insufficient data" + reason if input missing |
| Explanation text | tagged "Explanation" and visually separated from evidence | template text only (no live LLM) |
| Disclaimer | persistent, exact WORK-BR-15 wording | always visible |
| Weights note | "Illustrative exhibition-only weights — not official ADPIC methodology" | always visible near dimensions |

### CRUD Completeness
| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| Assessment result | N/A (computed) | Yes | N/A | N/A | derived from frozen inputs + config |

### Post-Action Behavior
| Action | Success Behavior | Error Behavior |
|--------|-----------------|----------------|
| Select project → Evaluate | open Assessment for that project | stay on Explore |
| Back | return to Explore (mounted view preserved) | — |

### Data Dependencies
| UI Element | Required Data | Source | Exists? |
|------------|--------------|--------|---------|
| Dimension scores | indicator inputs | `indicators.ts` (DERIVED from ProjectRecord) | Built this stage |
| Overall priority | weighted score | `scoringEngine.ts` + `weights.config.ts` | Built this stage |
| Disclaimer | exact wording | `disclaimer.ts` | Built this stage |

---

## Design System Alignment (MANDATORY for all UI stages)
| Token Category | Status | Action | Reference |
|---|---|---|---|
| Colors | Exists | Reuse | `src/theme/tokens.css` (band colors from --good/--warn/--accent) |
| Typography | Exists | Reuse | tokens |
| Component: Assessment/PriorityBadge | Missing | Create | new React components |
> No raw hex in components (tokens only) — enforced by verify.sh AC-4.

## Component Mapping (Native UI Stages)
N/A — web React app; new components authored this stage (no Flutter registry).

## Stac Screen Mapping / Binding / Unmapped / SDUI
N/A — direct_ui.

---

## Artifact Type
- **Artifact type:** mobile_feature — CLOSEST enum for a web app UI feature (actual surface is the web
  exhibition app; no mobile).

## Stage Boundary Classification
- **Classification:** Internal implementation (single frontend; no shared API/cross-repo/event boundary).

## Validation Gate Profile
- **Primary profile:** admin_ui — closest web-UI profile (direct_ui web app).
- **Secondary profiles:** none
- **Required gates:** build succeeds; scoring + UI behavioural tests pass; disclaimer/no-AI-approval/weights guards.
- **Required evidence:** build output; test counts; verify.sh output; determinism proof.

## UI Delivery Mode
- **ui_delivery_mode:** direct_ui

## Contract Boundary Requirements
N/A — no external boundary.

## Source of Truth Impact
| Field | Value |
|-------|-------|
| Affected concepts | assessment scoring (new, owned by this app) |
| Owners | app frontend (deterministic engine) |
| New concepts required | dimension/indicator/weights config |
| Ownership conflicts | None |

## Seam Impact
N/A — no seam impact.

---

## Architecture Notes
GIS computes; business rules score; AI explains (WORK-BR-1). The engine is pure/deterministic (no
randomness, wall-clock, or network). Indicators are DERIVED deterministically from the frozen synthetic
dataset (real GIS indicators are the swap target; provenance DERIVED). Weights are config-driven and
**illustrative/exhibition-only** (WORK-BR-9/10). The UI shows the overall Low/Med/High attributed to
rules, a dimension table with per-dimension evidence, a clearly-separated "Explanation" (deterministic
template text — no live LLM), the persistent WORK-BR-15 disclaimer, and a non-official-methodology note.

## Data Model Changes
New: `DimensionResult { key, label, score|null, band, evidence[], inputsPresent }`, `AssessmentResult
{ projectId, overall: "Low"|"Medium"|"High"|"Insufficient data", overallScore: number|null, dimensions[],
attributedTo: "GIS indicators + business rules" }`. The `"Insufficient data"` overall (with `overallScore:
null`) is the defined all-dimensions-missing outcome per the Resolution Rules — the type MUST represent it.

## Public API Changes
None. No backend.

## Dependencies
None new (reuses Stage 1.2 stack). No secrets/keys. No live LLM.

## Security Checklist
| Check | Status | Notes |
|-------|--------|-------|
| No confidential data | ✅ | synthetic DERIVED indicators only |
| Sensitive data not exposed | ✅ | no internal/unapproved attributes; disclaimer visible |
| No AI approval authority | ✅ | result attributed to rules; AI explains only (RR-4) |

---

## Verification Checklist
### Mandatory (blocks stage completion if missing) — ALL mechanically checked by `.ai/stages/1.3/verify.sh`
#### Required Artifacts
- [ ] `src/assessment/scoringEngine.ts`, `weights.config.ts`, `indicators.ts`, `disclaimer.ts` exist.
- [ ] `src/ui/Assessment.tsx` exists and renders overall + dimension table + evidence + disclaimer.
#### Core Behavior (executable tests)
- [ ] Determinism: `scoreProject(p)` called twice on the same input returns deeply-equal results (`verify.sh` AC-1 runs `npm test`).
- [ ] Evidence: every present-input dimension has non-empty `evidence`; missing-input → band "Insufficient data" (`verify.sh` AC-2/AC-6 via tests).
#### Safety / Invariants (mechanical)
- [ ] Disclaimer: the exact WORK-BR-15 string is present in `src/` (`verify.sh` AC-3 grep).
- [ ] No AI-as-approver phrasing in `src/ui/` and the result carries a rules-attribution label (`verify.sh` AC-4).
- [ ] Weights config carries an "illustrative / not official" label (`verify.sh` AC-5 grep).
- [ ] No live LLM client / no Simulate/Ask-AI module in `src/` (`verify.sh` AC-4).
- [ ] No raw hex in components (`verify.sh` AC-4).
- [ ] Engine purity: no `Math.random`, `Date.now`/`new Date`, or `fetch` in `src/assessment/` (`verify.sh` AC-1).
#### Tests
- [ ] `tests/scoring.test.ts` (determinism, banding, evidence, one-missing + ALL-missing→"Insufficient data") +
  `tests/assessment.ui.test.tsx` (disclaimer, no-AI-approval, evidence rendering) +
  `tests/appShell.test.tsx` (TEST-7: Explore→Evaluate wiring renders the Assessment for the selected project).

### Optional / Quality
- [ ] Smooth reveal animation for the assessment; keyboard focus order.

---

## Deterministic Signals
### Real Inputs
- `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3.
- `ROADMAP.md` § Stage 1.3 (RR-1..6).
- Stage 1.2 `src/data/portfolio.demo.ts` (ProjectRecord inputs), `src/data/provenance.ts`.
- WORK-BR-4/5/6/7/8/10 (dimensions + illustrative weights), WORK-BR-15 (disclaimer).

### Fixed Constraints
- Pure/deterministic engine: no randomness, wall-clock, or network in `src/assessment/`.
- Config-driven weights, labeled illustrative/non-official.
- Exact WORK-BR-15 disclaimer wording, persistent.
- AI explains, never approves; result attributed to rules. No live LLM. Assessment-only.
- Reuse dark cinematic tokens (no raw hex in components).

### Execution Semantics
- At runtime: `scoreProject(project, weights)` derives indicator inputs (`indicators.ts`), computes each
  dimension score + evidence, applies configured weights, thresholds into Low/Med/High, and returns
  `AssessmentResult`. Missing inputs → dimension "Insufficient data" (no invented score); overall computed
  deterministically from present dimensions. The Assessment component renders it with disclaimer + explanation.
- At build: `npm run build` type-checks + bundles; `npm test` runs the behavioural suite.

### Resolution Rules
- Same inputs + same config → same result (pure function). If a dimension input is absent → "Insufficient
  data" with reason (never a guessed number). **Missing-dimension rule (defined, deterministic):** an
  Insufficient-data dimension is EXCLUDED from the weighted overall and the remaining dimensions' weights are
  RENORMALIZED to sum to their original total (so the overall is still a defined Low/Med/High). If ALL
  dimensions are missing, the overall is "Insufficient data" (no invented score). Weights conflicts: config
  is the single source; labeled non-official.
- Explanation text is deterministic template text derived from the computed evidence — it never invents facts
  or numbers absent from the result (WORK-AC-10/11), and never states an approval.

---

## Execution Model
- **Model:** app_package
> Reconciliation: epic classifies stages as `hybrid`; at the spec taxonomy this stage is `app_package`
> (creates `src/` code) and ships its own `verify.sh` tooling — together the epic's `hybrid`.

## Ambiguity Rule
- If a real GIS indicator is unavailable, DERIVE it deterministically from the frozen dataset and tag it
  DERIVED — never invent a real number and never present it as official.
- Keep to Assessment only (defer Simulator/Ask-AI). If a guardrail conflicts with visual fidelity, the
  guardrail wins.

## Open Questions
1. Methodology/claim approver (WORK-OQ-3) remains OPEN — the exhibition-only weights stay clearly illustrative until then.
2. Exact dimension→indicator derivations for real data (swap target; DERIVED proxies used now).

## Reviewer Notes
[owner review gate + certification fill this.]

**Decision:** Draft — pending certification + owner review.
**Reason:** —

---

## Success Proof

> Done-criteria (DC-n) — each demonstrates ≥1 AC and is verified by `.ai/stages/1.3/verify.sh <AC>`.

- DC-1: `scoringEngine.ts` + `weights.config.ts` exist, engine is pure (no random/clock/network in src/assessment), and determinism tests pass.
  demonstrates: AC-1
  verify: bash .ai/stages/1.3/verify.sh AC-1
- DC-2: Each dimension result carries per-dimension evidence; the Assessment screen renders the dimension table with evidence.
  demonstrates: AC-2
  verify: bash .ai/stages/1.3/verify.sh AC-2
- DC-3: The exact WORK-BR-15 disclaimer string is present and rendered on the Assessment screen.
  demonstrates: AC-3
  verify: bash .ai/stages/1.3/verify.sh AC-3
- DC-4: The result is attributed to GIS/rules, explanation is separated from evidence, and no AI-as-approver phrasing appears; no raw hex / no live-LLM / no forbidden module.
  demonstrates: AC-4
  verify: bash .ai/stages/1.3/verify.sh AC-4
- DC-5: The weights config carries the illustrative / not-official-methodology label.
  demonstrates: AC-5
  verify: bash .ai/stages/1.3/verify.sh AC-5
- DC-6: A missing indicator input yields a defined "Insufficient data" outcome (with reason) and a still-deterministic overall priority via the exclude-and-renormalize rule (proven by tests).
  demonstrates: AC-6
  verify: bash .ai/stages/1.3/verify.sh AC-6
- DC-7: `AppShell.tsx` wires the Assessment into the app flow (imports Assessment + a select→Evaluate handler); an integration test renders AppShell with an injected fake SceneApi, selects a project, opens Evaluate (Assessment shows that project's deterministic result), then goes Back and asserts the mounted view is preserved (createView called exactly once across Explore→Evaluate→Back; destroy not called on Back).
  demonstrates: AC-7
  verify: bash .ai/stages/1.3/verify.sh AC-7
