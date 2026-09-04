<!-- template-version: spec_template/v1 -->
# Feature Spec: Stage 1.5 — Ask ADPIC AI + Hardening / Fallback

**Stage:** 1.5 · **Status:** Draft · **Author:** Claude (owner session) · **Date:** 2026-09-04
**Epic:** adpic-livex-2026-capital-intelligence-mvp · **Build path:** owner-authorized direct-build override.

---

## UI Surface Declaration (MANDATORY)
- **Touches UI?** YES · **UI Delivery Mode:** direct_ui · **Surfaces affected:** Exhibition (large display)
- **UI Change Class:** A (NEW cross-cutting overlay — Ask ADPIC AI)

### Screen Inventory
| Screen | Surface | Action | Reference | Notes |
|--------|---------|--------|-----------|-------|
| Ask ADPIC AI (overlay) | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/06_Ask_ADPIC_AI.png` | Cross-cutting explanation layer; suggested Qs + allowlisted actions |
| Fallback / closing | Exhibition | Create | `ADPIC_LIVEX_UI_Screens/09_Closing.png` | Deterministic fallback demonstration + backup-video slot |

### UI Impact Description
| Screen | Impact Level | Justification |
|--------|-------------|---------------|
| Ask ADPIC AI overlay | create | New cross-cutting explanation layer |
| Fallback demonstration | create | Deterministic recovery path + backup-video slot |

---

## Problem Statement
Close the MVP with **Ask ADPIC AI** — a **cross-cutting explanation layer** (not a fourth module) that favors
**suggested questions + allowlisted actions** over open chat, assembles its context from the app's own state,
and answers with **deterministic pre-authored templates** so the ENTIRE scripted demo runs with **no live
LLM**. When information is absent from the approved context, it says so rather than inventing. Plus
**exhibition hardening**: connectivity-interruption tolerance (deterministic safe mode), preload of frozen
data, a fixed deterministic fallback demonstration, a backup-video slot, and a sanitized live-LLM adapter
boundary for any future, separately-approved LLM.

## Acceptance Criteria
> Each `AC-n` covers ≥1 ROADMAP requirement (`RR-n` in ROADMAP.md § Stage 1.5).

#### AC-1 — Ask ADPIC AI is a cross-cutting explanation OVERLAY (not a fourth route/module) that offers suggested questions and allowlisted actions rather than open autonomous chat (WORK-REQ-16, WORK-REQ-18, WORK-CON-1).
covers: RR-1

#### AC-2 — The explanation context is assembled by the app from the selected project, current map/AOI context, approved attributes, calculated GIS indicators, and configured strategy (WORK-REQ-17).
covers: RR-2

#### AC-3 — Deterministic pre-authored templates answer the suggested questions and run the whole scripted demo with NO live LLM; identical (question, context) yields identical output (WORK-REQ-20, WORK-AC-12, WORK-DEC-8).
covers: RR-3

#### AC-4 — When requested information is absent from the assembled context, the output states it is not included in the demo dataset rather than inventing it (WORK-AC-10, WORK-AC-11, WORK-EX-2, WORK-SEC-3).
covers: RR-4

#### AC-5 — The scripted journey tolerates connectivity interruption (a deterministic safe mode / degrade path) and preloads the frozen data; final 60–90s/hardware timing is validated separately (WORK-OQ-10/11) (WORK-NFR-1/5/7/8, WORK-ROLL-6).
covers: RR-5

#### AC-6 — A fixed deterministic fallback demonstration is available and a backup-video slot exists (the actual backup video is an owner-supplied operational asset, flagged) (WORK-AC-16, WORK-REQ-23).
covers: RR-6

#### AC-7 — The live-LLM adapter boundary receives ONLY approved sanitized structured context and returns an explanation plus an allowlisted action; the default adapter is null (templates only) so no unsanitized/unrestricted data can reach an LLM (WORK-INT-8, WORK-SEC-4).
covers: RR-7

#### AC-8 — Exhibition selection focus: selecting a project flies to and clearly highlights its marker (larger, brighter, outlined, raised on a callout, distinct from surrounding projects) and shows a concise project info card of the available dataset fields (with provenance), carrying the Evaluate action for THAT selected project (owner exhibition-hardening requirement; WORK-UX-4/5, WORK-REQ-2).
covers: RR-5

#### AC-9 — Exhibition Explore visual hardening: a premium dark-cinematic scene (dark ground + muted building fill with bright edges for contrast), a non-text-heavy project selector, and a stronger KPI hierarchy; no raw hex in components (owner exhibition-hardening requirement; WORK-UX-1/2).
covers: RR-5

#### AC-10 — The Liveability Simulator renders Before/After on the ACTUAL Khalifa map geography (real AD-SDI AOI extent + real-positioned zones/facilities/proposed school + service-area catchment coverage + newly-covered/underserved), not an abstract grid — the deterministic engine numbers are unchanged (owner exhibition-hardening requirement; WORK-REQ-14, WORK-AC-9).
covers: RR-5

## In Scope
- Ask-AI overlay (suggested Qs + allowlisted actions + template answers + absent-info honesty); context
  assembler + sanitizer; deterministic template registry; null LLM adapter + sanitized adapter boundary;
  deterministic safe mode + preload; fixed fallback demonstration + backup-video slot.

## Out of Scope
- An actual live LLM call (templates-only core; any LLM is a later, separately-approved phase behind the boundary).
- Real hardware timing/validation (WORK-OQ-10/11), the actual backup-video asset (owner-supplied),
  real internal data.

## Files to Create
| File | Purpose |
|------|---------|
| `src/ai/actions.ts` | Allowlisted action enum + types |
| `src/ai/context.ts` | `assembleContext(...)` + `sanitizeContext(...)` (approved fields only) |
| `src/ai/templates.ts` | Suggested questions + deterministic template answers; absent-info → "not in demo dataset" |
| `src/ai/llmAdapter.ts` | `LlmAdapter` boundary (sanitized-context-in, explanation+allowlisted-action-out) + `NullLlmAdapter` |
| `src/hardening/safeMode.ts` | Deterministic presentation safe-mode + `preloadFrozenData()` |
| `src/ui/AskAdpicAi.tsx` | Cross-cutting overlay |
| `src/ui/FallbackDemo.tsx` | Fixed deterministic fallback demonstration + backup-video slot |
| `tests/ai.test.ts`, `tests/askAi.ui.test.tsx`, `tests/hardening.test.ts` | Behavioural tests |

## Files to Modify
| File | Change |
|------|--------|
| `src/AppShell.tsx` | Mount Ask-AI as a cross-cutting overlay (toggle available across views); add safe-mode + fallback entry |

## Protected Files
- WORK contract; `.ai/epics/**`; `.ai/stages/1.5/*`; existing 1.2–1.4 code (extended, not broken).

## Core Invariants
### Risk Surface: none · Derived Risk Tier: _derived_
```json
[
  {"id":"INV-templates-no-llm","class":"reliability","actors":["ask-ai"],"authoritative_entity":"scripted-demo","statement":"the entire scripted demo answers via deterministic pre-authored templates with no live LLM; identical (question, context) yields identical output","obligation_refs":[]},
  {"id":"INV-absent-info-honesty","class":"communication-governance","actors":["ask-ai"],"authoritative_entity":"answer","statement":"when a fact is absent from the assembled context, the answer states it is not included in the demo dataset and never invents a value","obligation_refs":[]},
  {"id":"INV-sanitized-llm-boundary","class":"security","actors":["llm-adapter"],"authoritative_entity":"llm-context","statement":"any LLM adapter receives only sanitized/approved structured context and returns an explanation plus an allowlisted action; the default adapter is null","obligation_refs":[]},
  {"id":"INV-allowlisted-actions","class":"authority-boundary","actors":["ask-ai"],"authoritative_entity":"action","statement":"AI/template answers may only trigger actions from a fixed allowlist (no open autonomous behavior); Ask-AI is an overlay, not a fourth module","obligation_refs":[]}
]
```

## UX Requirements
### Affected Screens
| Screen | Action | Notes |
|--------|--------|-------|
| Ask ADPIC AI | Create | Overlay: suggested-question chips, response, allowlisted-action buttons, absent-info message |
| AppShell | Modify | Cross-cutting Ask-AI toggle; safe-mode indicator; fallback demonstration entry |
### Display Rules
| Element | Rule | Fallback |
|---------|------|----------|
| Suggested questions | context-aware chips | always ≥1 |
| Answer | deterministic template text (tagged as explanation) | absent info → "not included in the demo dataset" |
| Actions | only from the allowlist | none |
| Safe mode | visible indicator when deterministic/offline | — |

## Design System Alignment
Reuse `src/theme/tokens.css` (no raw hex in components).

## Component Mapping / Stac / SDUI: N/A — direct_ui.
## Artifact Type: mobile_feature (closest; actual = web UI feature).
## Stage Boundary Classification: Internal implementation.
## Validation Gate Profile: admin_ui; build + behavioural tests + guards.
## UI Delivery Mode: direct_ui
## Contract Boundary / Source of Truth / Seam Impact: N/A.

## Architecture Notes
Ask-AI = a cross-cutting overlay reachable across Explore/Evaluate/Simulate (not a fourth route). A pure
context assembler gathers the selected project, AOI/map context, approved attributes, calculated GIS
indicators (reuse the Stage 1.3 assessment result), and configured strategy; `sanitizeContext` keeps only
approved fields. A deterministic template registry answers suggested questions purely from that context;
absent facts → "not included in the demo dataset". Answers may trigger only allowlisted actions
(focus-project, show-underserved, open-assessment, open-simulator). A `NullLlmAdapter` is the default so the
core demo needs no LLM; the `LlmAdapter` boundary (sanitized-in, explanation+allowlisted-action-out) is the
contract for any future separately-approved LLM. Hardening: a deterministic safe mode (forces the offline/
deterministic path), `preloadFrozenData()`, a fixed fallback demonstration sequence, and a backup-video slot
(the actual video is an owner-supplied asset — flagged [REFERENCE NEEDED]).

## Data Model Changes
`AiContext { projectName?, aoi, approvedAttributes: Record<string,string|number>, indicators?: {...}, strategy?: string }`;
`AiAnswer { text, action?: AllowlistedAction, sourced: boolean }`; `AllowlistedAction` (fixed enum).

## Public API / Dependencies: none new. No live LLM. No secrets.

## Security Checklist
| Check | Status | Notes |
|-------|--------|-------|
| No confidential data to AI | ✅ | `sanitizeContext` keeps approved fields only; default adapter null |
| No invented facts | ✅ | absent info → "not in demo dataset" (RR-4) |
| Allowlisted actions only | ✅ | fixed enum; no open autonomous behavior |

## Verification Checklist (ALL mechanical via `.ai/stages/1.5/verify.sh`)
- [ ] `src/ai/{context,templates,llmAdapter,actions}.ts` + `src/hardening/safeMode.ts` exist; no live-LLM client in `src/` — verify.sh AC-7.
- [ ] Determinism + no-LLM + absent-info tests pass — verify.sh AC-3/AC-4 (npm test).
- [ ] Context assembly + sanitize tests — verify.sh AC-2/AC-7.
- [ ] Ask-AI overlay wired into AppShell (not a route) + suggested Qs — verify.sh AC-1.
- [ ] Safe mode + preload present — verify.sh AC-5.
- [ ] Fallback demonstration + backup-video slot present — verify.sh AC-6.
- [ ] No hard-coded JSX numeric literal in `src/ui/AskAdpicAi.tsx`; no raw hex.

## Deterministic Signals
### Real Inputs
- ROADMAP § Stage 1.5 (RR-1..7); WORK-REQ-16/17/18/20/23, WORK-AC-10/11/12/16, WORK-DEC-8, WORK-INT-8, WORK-SEC-3/4, WORK-CON-1.
- Stage 1.2–1.4 code (ProjectRecord, assessment result, simulation), tokens, AppShell.
### Fixed Constraints
- Templates-only core (no live LLM); deterministic; absent-info honesty; allowlisted actions; sanitized
  LLM boundary; safe mode; no mockup literals; no raw hex.
### Execution Semantics
- `assembleContext(project, aoi, assessment?)` → structured context; `sanitizeContext(ctx)` → approved
  fields; `answer(question, ctx)` → deterministic `AiAnswer` (or absent-info message). Ask-AI overlay renders
  suggested Qs; selecting one shows the answer + any allowlisted action. `NullLlmAdapter.explain(ctx)` returns
  a template explanation. Safe mode forces deterministic/offline; `preloadFrozenData()` warms the frozen data.
### Resolution Rules
- Same (question, context) → same answer. A fact not in the sanitized context → "not included in the demo
  dataset". Any action not in the allowlist is rejected. The LLM adapter never receives unsanitized fields.

## Execution Model: app_package (epic `hybrid`).
## Ambiguity Rule: no live LLM in core (NullLlmAdapter); absent info stated honestly; overlay not a route; guardrail beats fidelity.
## Open Questions
1. Backup-video asset + final hardware timing (WORK-OQ-10/11) — owner/operational, flagged not fabricated.
2. LLM prompt-info allowlist + security/AI approver (WORK-OQ-7/8) — the sanitized boundary is built; a real LLM stays gated until approved.

## Success Proof
- DC-1: `AskAdpicAi` is an AppShell OVERLAY (not a route) with suggested-question chips + allowlisted actions. demonstrates: AC-1 · verify: bash .ai/stages/1.5/verify.sh AC-1
- DC-2: `assembleContext` builds the structured context from project + AOI + approved attrs + indicators + strategy (test). demonstrates: AC-2 · verify: bash .ai/stages/1.5/verify.sh AC-2
- DC-3: `answer(q, ctx)` is deterministic and runs with NO live LLM (NullLlmAdapter) — tests. demonstrates: AC-3 · verify: bash .ai/stages/1.5/verify.sh AC-3
- DC-4: an absent-info question yields "not included in the demo dataset" (test, negative control). demonstrates: AC-4 · verify: bash .ai/stages/1.5/verify.sh AC-4
- DC-5: deterministic safe mode + `preloadFrozenData()` exist and are exercised (test). demonstrates: AC-5 · verify: bash .ai/stages/1.5/verify.sh AC-5
- DC-6: a fixed fallback demonstration sequence + a backup-video slot exist (backup video flagged owner-supplied). demonstrates: AC-6 · verify: bash .ai/stages/1.5/verify.sh AC-6
- DC-7: `sanitizeContext` strips non-approved fields and the LlmAdapter boundary only ever receives sanitized context + returns an allowlisted action (test). demonstrates: AC-7 · verify: bash .ai/stages/1.5/verify.sh AC-7
- DC-8: `ProjectCard` shows the selected project's dataset fields + provenance + Evaluate; the scene adapter raises/outlines the selected marker (test + grep). demonstrates: AC-8 · verify: bash .ai/stages/1.5/verify.sh AC-8
- DC-9: the scene adapter applies dark ground + building edges for contrast; no raw hex in components. demonstrates: AC-9 · verify: bash .ai/stages/1.5/verify.sh AC-9
- DC-10: the Simulator projects onto the real Khalifa AOI extent (AD-SDI boundary + real-positioned features). demonstrates: AC-10 · verify: bash .ai/stages/1.5/verify.sh AC-10
