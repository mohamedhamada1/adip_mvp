# Exploration Context

## Topic
WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL — Exhibition-ready
Capital Intelligence GeoAI MVP for ADPIC at LIVEX 2026.

Source of truth: `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md`
(work definition). Grounding mode: NON-SOFTWARE (no repo present yet — ground
against the work definition + external evidence, not source files).

## Goal
Deliver a compact, cinematic "Capital Intelligence Twin" that tells the
decision-support story **Understand the place → Evaluate an investment →
Simulate its impact** across approved Abu Dhabi Areas of Interest, in a curated
60–90 second presenter journey, WITHOUT making AI an approval authority.

Exactly three core capabilities (plus one cross-cutting explanation layer):
1. **Explore the Capital & Liveability Landscape** (3D scene)
2. **AI-Assisted Capital Investment Assessment** (Low/Medium/High, deterministic)
3. **Liveability Impact Simulator** (hypothetical school scenario, before/after)
4. **Ask ADPIC AI** — cross-cutting contextual explanation, NOT a 4th module.

## Why This Matters
LIVEX 2026 exhibition demo for ADPIC. Must present a future-facing decision-support
narrative for capital-investment planning to a live audience under exhibition
conditions, on presenter-operated large-display/touchscreen hardware, while
preserving institutional authority boundaries (AI never approves/decides).

## Invariant / Authority Boundary
**GIS computes. Business rules score. AI explains.** (WORK-BR-1, WORK-CON-3)
AI must never approve, reject, authorize, or make an official capital-investment
or prioritization decision (WORK-BR-2). All presenter-visible scores/indicators/
explanations must be traceable to approved structured inputs + deterministic
calculations (WORK-NFR-11).

## Constraints (from work definition)
- No implementation during exploration; human remains final gate.
- Tech: standalone **React + Vite + TypeScript** + **ArcGIS Maps SDK for JS**
  (`SceneView` as principal 3D surface); Calcite selectively + custom CSS (WORK-CON-7).
- Frozen, sanitized event dataset as runtime default; NOT dependent on live
  Enterprise 10.8.1 data (WORK-CON-8, WORK-CON-16, WORK-DEC-9).
- Core scripted demo MUST work with NO live LLM (deterministic templates first;
  WORK-CON-15, WORK-DEC-8, WORK-AC-12). Live LLM optional, later, gated.
- English UI + Arabic-ready architecture (no full bilingual expansion; WORK-DEC-4).
- AOIs: **Khalifa City mandatory** (Evaluate + Simulate); **Al Reem Island**
  preferred Explore/3D opening IF 3D spike passes; **Yas Island fallback only**
  (never a 3rd core AOI) (WORK-DEC-5).
- Assessment presentation: **Low/Medium/High, exhibition-only labeled rules** +
  mandatory disclaimer wording (WORK-DEC-3, WORK-BR-15).
- Simulation story: hypothetical **school** using approved real context (WORK-DEC-2).
- 20–40 curated showcase projects per AOI; retain full portfolio for KPI/query
  only where performance allows (WORK-DATA-3, WORK-AC-4).
- Portfolio counts (Khalifa ~219 / Reem ~139) are provisional until frozen
  event-snapshot validation — do NOT present as authoritative (WORK-DEC-7, WORK-AC-19).
- Desktop/exhibition primary target; mobile NOT a priority (WORK-NFR-9).
- Premium dark cinematic minimal visual language, not an enterprise GIS dashboard
  (WORK-UX-1).
- AOI switching without full app reload (WORK-AC-3, WORK-NFR-3).
- Esri 3D Buildings item `b8fec5af7dfe4866b1b8ac2d2800f282` must be validated for
  both AOIs before it becomes an exhibition dependency (WORK-INT-2); Google
  Photorealistic 3D must NOT be a core dependency (WORK-INT-4).

## Affected Repos
- n/a (non-software mode) — no repo exists yet. Target runtime is a NEW standalone
  React + Vite + TypeScript app.

## UI Mode
Direct UI (custom React + ArcGIS SDK), premium dark cinematic. Not SDUI.

## Success Criteria (Acceptance)
- Only the 3 MVP capabilities exposed; presenter completes Understand → Evaluate →
  Simulate in 60–90s (WORK-AC-1, WORK-NFR-1).
- Deterministic, reproducible, evidence-backed Low/Medium/High assessment with
  visible disclaimer (WORK-AC-5..7, WORK-BR-3).
- School simulator shows Current vs With-Proposed-Project spatial before/after +
  KPI change (WORK-AC-8, WORK-AC-9).
- AI/template grounded only in approved/sanitized context; states "not in demo
  dataset" when absent; never invents facts (WORK-AC-10, AC-11).
- Full demo operable WITHOUT a live LLM; deterministic fallback + backup video
  prepared and verified (WORK-AC-12, AC-16).
- No confidential/unapproved info in exhibition build (WORK-AC-13).
- Verified on actual event hardware before build commitment (WORK-AC-14).
- All EPIC_CREATE open questions resolved with provenance before final epic
  creation (WORK-AC-20).

## Key Open Questions Blocking EPIC_CREATE (unresolved factual/ownership inputs)
- WORK-OQ-1/2: exact public-attribute allowlist + named data approver (SECURITY).
- WORK-OQ-3/4: named methodology/claim approver + named final business owner (PRODUCT).
- WORK-OQ-5/6: per-dataset availability/approval + named GIS/data owner (PRODUCT).
- WORK-OQ-7/8: LLM prompt-info allowlist + named security/AI approver (SECURITY).
- WORK-OQ-9/10/11: technical-spike owner, hardware-validation owner, final hardware
  specs (TECH/OPERATIONS — blocking BEFORE EXHIBITION_BUILD_COMMIT).

## Current Start Posture
**CONDITIONAL GO for the technical/data spike** (WORK-ROLL-9) — NOT unconditional
exhibition release. Unresolved EPIC_CREATE questions must close before final epic
creation.

## Top Risks
- HIGH: Al Reem 3D quality insufficient for opening story (WORK-RISK-1).
- HIGH: unapproved/confidential attributes exposed publicly (WORK-RISK-2).
- HIGH: external Esri/network dependencies fail/degrade at event (WORK-RISK-3).
- HIGH: exhibition-only priority mistaken for official ADPIC methodology (WORK-RISK-4).
- MEDIUM: stale 219/139 counts; full-portfolio 3D overload; LLM unavailable;
  event hardware can't sustain 3D (WORK-RISK-5..8).
