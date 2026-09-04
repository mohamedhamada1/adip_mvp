# Exploration Output Contract (Epic-Ready)

**Exploration ID:** 2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m
**Topic:** ADPIC LIVEX 2026 — Capital Intelligence GeoAI MVP (exhibition-ready)
**Date:** 2026-09-04
**Status:** SYNTHESIS_COMPLETE

> Discovery input for `ai epic create` — NOT a final roadmap. Authoritative contract
> is `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md`. Owner supplied
> 9 UI screenshots (`screenshots/`) as visual direction; WORK.md wins on any conflict.

---

## 1. Epic Problem Statement

ADPIC needs an exhibition-ready "Capital Intelligence Twin" for LIVEX 2026 that tells
the decision-support story **Understand the place → Evaluate an investment → Simulate
its impact** in a curated 60–90 second presenter journey on a large exhibition
display, across approved Abu Dhabi AOIs, while preserving the boundary **GIS computes;
business rules score; AI explains** and never letting AI become an approval authority.
No such application exists yet; this epic builds it from zero as a standalone
React + Vite + TypeScript + ArcGIS Maps SDK app.

**Known facts:**
- Product, stack, AOI responsibilities, assessment presentation, simulation story,
  language scope, and AI strategy are owner-RESOLVED (WORK-DEC-1..12).
- Owner provided 9 screens as visual direction (Hero, Explore-3D, Project Details,
  Assessment, Simulation, Ask-AI, AOI Switcher, KPI Dashboard, Closing).
- Current posture is **CONDITIONAL GO for the technical/data spike**, not exhibition
  release (WORK-ROLL-9).
- Browser ArcGIS JS SDK cannot load `.slpk` directly (grounding §2) — local-first 3D
  needs a hosted I3S scene service or a client-side extruded-footprint floor.

**Inferred assumptions:**
- Esri 3D Buildings item `b8fec5af7dfe4866b1b8ac2d2800f282` covers both AOIs — UNVERIFIED,
  is the spike (WORK-INT-2, RISK-1).
- School-simulation spatial inputs will be either owner-supplied or replaced with
  precomputed deterministic equivalents (WORK-INT-7, DEP-6/7).

## 2. Target Architecture Direction

Reliability-First Deterministic Twin: everything on the scripted journey is
frozen/local (sanitized projects, geometries, precomputed service areas, precomputed
scores, local-first 3D). Live Esri services and live LLM are optional, feature-flagged,
post-spike enhancements behind adapters that degrade to the frozen/template path. A
one-way demo state machine drives the 60–90s journey. Khalifa City is the guaranteed
spine; Al Reem opening is progressive enhancement gated on its 3D spike.

**Recommended decisions:**
- Standalone Vite/React/TS + ArcGIS `SceneView`; Calcite selective + custom dark CSS.
- Pure-TS, config-driven deterministic scoring engine (weights NOT official methodology).
- Template registry as the guaranteed explanation path; LLM adapter behind a
  sanitized-context boundary (optional, later, gated).
- Enterprise 10.8.1 for offline data prep only; frozen sanitized snapshot at runtime.
- Overlays/panels/state transitions, not 9 independent routes.

**Open questions:** see §10 (8 EPIC_CREATE blockers + 3 build-commit blockers).

## 3. Core Invariants

1. **Authority boundary:** GIS computes; business rules score; AI explains. AI never
   approves/rejects/authorizes/decides (WORK-BR-1/2). No screen may present AI as approver.
2. **Deterministic core path:** the entire scripted demo runs with the network
   physically disconnected and with NO live LLM; every important transition has an
   immediate deterministic fallback state (WORK-AC-12, NFR-5/6, DEC-10).
3. **Traceability:** every presenter-visible score/indicator/explanation is traceable
   to approved frozen inputs + deterministic calculation (WORK-NFR-11, AC-6).
4. **Data provenance:** only validated frozen-snapshot values are displayed; no
   screenshot/mockup number (219/139/budgets/scores/dates) is hard-coded; demo/synthetic
   records are internally identifiable and never shown as verified real projects
   (WORK-AC-19, DATA-32, BR-12).
5. **Disclaimer:** the approved disclaimer wording is persistently visible on every
   scored screen unless comms/legal supplies a replacement (WORK-BR-15).
6. **Scope lock:** exactly 3 capabilities + cross-cutting Ask-AI; Khalifa mandatory;
   Al Reem conditional; Yas fallback-only; no V0.2 coupling (WORK-CON-1/4/5/6/19).

## 4. Source of Truth / Ownership

- `WORK.md` is the single source of truth for product/business/data/security/AI/scope.
- The frozen sanitized event dataset is the single source of truth for all runtime
  numbers, geometries, and scores.
- The deterministic scoring engine + config is the single source of truth for
  Low/Med/High results; AI/template layer owns explanation only, never the result.
- Named human owners (unresolved, §10) own data/methodology/security/final approval.

## 5. Runtime vs Tooling Boundary

- **Runtime:** load frozen dataset + local 3D; deterministic scoring; template
  explanations; scripted journey; optional gated live Esri/LLM adapters.
- **Tooling/Generation:** Enterprise 10.8.1 data prep, snapshot freeze/validation,
  service-area precomputation, local 3D asset packaging (I3S/scene service or
  extruded-footprint data), curation of 20–40 showcase projects/AOI.
- **Must not leak:** unsanitized/confidential attributes, live Enterprise dependency,
  or unvalidated counts into the runtime build (WORK-SEC-1/9, CON-8).

## 6. Platform Scope

| Platform | Involved? | Role |
|----------|-----------|------|
| Backend | NO | No app backend; frozen static/sanitized data + direct approved Esri REST only. |
| Mobile | NO | Desktop/exhibition-first; mobile explicitly out of scope (WORK-NFR-9, OOS-15). |
| Admin | NO | No admin panel in MVP scope. |
| Engine/Tooling | YES | Offline data-prep, snapshot freeze, precompute, 3D packaging. |
| SDUI | NO | Direct custom UI (WORK-CON-7). |
| CI/CD | NO (MVP) | Not required by the contract for the exhibition build. |

Primary "platform" is a **new standalone web frontend** (Vite/React/TS + ArcGIS JS).

## 7. Existing System Clues

**Existing capabilities:** none — greenfield; no repo exists yet.
**Gaps identified:** entire app, frozen dataset pipeline, 3D delivery, scoring engine,
template layer, demo state machine, hardening/fallback package.
**Reuse candidates:** ArcGIS Maps SDK primitives (SceneView, SceneLayer/BuildingSceneLayer,
service-area REST); Calcite components; owner screenshots as visual reference.

## 8. Stage Breakdown Candidate

### Stage 1 — Technical / Data Spike + Snapshot Freeze
- **Artifact Type:** spike + validated frozen dataset + config
- **Goal:** Prove 3D delivery (item coverage, local-first path), network independence,
  hardware performance; freeze/validate the sanitized event snapshot + counts.
- **Inputs:** WORK-INT-2 item, AOI data, event hardware, owner data approvals.
- **Outputs:** go/no-go on Al Reem opening; chosen 3D delivery mechanism; frozen
  sanitized dataset; validated KPI counts; precompute plan for the school scenario.
- **Core Invariant:** no runtime dependency on `.slpk` direct load or a live Portal
  WebScene; snapshot values validated before display.
- **Depends On:** None (first stage; gated by OQ-5/6/9 ownership).

### Stage 2 — 3D Shell + Explore + AOI Switch
- **Artifact Type:** app shell + Explore capability
- **Goal:** Standalone app, dark cinematic SceneView, KPI strip, filters, project
  markers, fly-to, AOI switch without full reload.
- **Inputs:** frozen dataset, chosen 3D mechanism, screenshots 01/02/07/08.
- **Outputs:** Explore state matching WORK-REQ-1/3/4/5/6, UX-1/2/4, AC-3.
- **Core Invariant:** AOI switch preserves workflow; Al Reem opening degrades gracefully.
- **Depends On:** Stage 1.

### Stage 3 — Deterministic Assessment + Evidence
- **Artifact Type:** scoring engine + Assessment UI
- **Goal:** Pure-TS config-driven Low/Med/High with per-dimension evidence and
  persistent disclaimer; AI presented as explainer, not approver.
- **Inputs:** frozen dataset, business-rule config, screenshot 03/04.
- **Outputs:** WORK-REQ-9/10/11, AC-5/6/7, BR-3/4/15.
- **Core Invariant:** reproducible from same inputs; result attributed to rules not AI.
- **Depends On:** Stage 2.

### Stage 4 — Liveability Impact Simulator (School, precomputed)
- **Artifact Type:** simulation capability
- **Goal:** Current vs With-Proposed-School before/after with service-area, underserved,
  accessibility, KPI deltas; hypothetical school labeled as demo.
- **Inputs:** precomputed service areas / population inputs (or deterministic equivalents),
  screenshot 05.
- **Outputs:** WORK-REQ-12/13/14/15, AC-8/9, DEC-2, BR-14.
- **Core Invariant:** hypothetical school never shown as an approved real project.
- **Depends On:** Stage 3 (data from Stage 1 precompute).

### Stage 5 — Ask ADPIC AI Templates + Hardening / Fallback
- **Artifact Type:** explanation layer + exhibition hardening
- **Goal:** Constrained cross-cutting Ask-AI (suggested Qs + allowlisted actions,
  template-first, no live-LLM dependency); demo state machine; preload/cache;
  connectivity-interruption tests; hardware profiling; deterministic fallback + backup video.
- **Inputs:** all prior stages, screenshots 06/09, presenter script.
- **Outputs:** WORK-REQ-16..20/23, AC-10/11/12/16, NFR-5..8, ROLL-6.
- **Core Invariant:** full journey runs offline, no live LLM; every transition has a
  deterministic fallback.
- **Depends On:** Stages 2–4.

## 9. Dependency Graph Candidate

```
Stage 1 (Spike + Snapshot) ──> Stage 2 (3D Shell + Explore) ──> Stage 3 (Assessment)
                                                            └──> Stage 4 (Simulator) ──> Stage 5 (Ask-AI + Hardening)
                                                                 Stage 3 ─────────────┘
```

## 10. Risks and Open Questions

### Blocking Open Questions (EPIC_CREATE — must resolve before final epic creation, WORK-AC-20)
- [ ] WORK-OQ-1: exact public-attribute allowlist (SECURITY_OWNER).
- [ ] WORK-OQ-2: named data approver (SECURITY_OWNER).
- [ ] WORK-OQ-3: named methodology/claim approver (PRODUCT_OWNER).
- [ ] WORK-OQ-4: named final business owner (PRODUCT_OWNER).
- [ ] WORK-OQ-5: per-dataset availability/approval (PRODUCT_OWNER).
- [ ] WORK-OQ-6: named GIS/data owner (PRODUCT_OWNER).
- [ ] WORK-OQ-7: LLM prompt-info allowlist (SECURITY_OWNER).
- [ ] WORK-OQ-8: named security/AI approver (SECURITY_OWNER).

### Blocking before EXHIBITION_BUILD_COMMIT (may stay open during epic creation)
- [ ] WORK-OQ-9: technical-spike owner. WORK-OQ-10: hardware-validation owner.
  WORK-OQ-11: final hardware specs.

### Non-Blocking Risks
- Reem 3D quality (RISK-1) → Khalifa spine + graceful degrade. External Esri/network
  failure (RISK-3) → local-first + precompute + fallback + backup video. Full-portfolio
  3D overload (RISK-6) → curate 20–40 + decluttering. Hardware (RISK-8) → profile early.

### Assumptions to Verify
- Item coverage for both AOIs (Stage 1 spike). School spatial inputs availability
  (Stage 1). Cinematic fidelity vs hardware (Stage 1 benchmark).

## 11. Must Preserve / Must Not Change

**Must Preserve:** the authority boundary; the approved disclaimer wording; the 3
capabilities + cross-cutting Ask-AI; Khalifa-mandatory / Reem-conditional / Yas-fallback;
English UI + Arabic-ready; deterministic offline core; validated-counts-only.
**Must Not Change:** owner-RESOLVED decisions WORK-DEC-1..12 without owner re-approval;
disclaimer wording without authorized replacement; scope (no OOS items, no V0.2 coupling).

## 12. Recommended Roadmap Stage Blocks

**Block 1: Foundation & Spike** — Stage 1 (Spike + Snapshot), Stage 2 (3D Shell + Explore)
**Block 2: Decision Support** — Stage 3 (Assessment), Stage 4 (Simulator)
**Block 3: Explanation & Exhibition Hardening** — Stage 5 (Ask-AI + Hardening/Fallback)

---

## Agent Attribution

| Agent | Contribution | Key Insight |
|-------|-------------|-------------|
| ChatGPT (Architect) | Reliability-First Deterministic Twin; 3 candidate approaches | Worst case must still deliver the full scripted journey; live paths are post-spike enhancements. |
| Gemini (Gatekeeper) | CONDITIONAL GO + 5 conditions | Network independence + a deterministic kill-switch are non-negotiable; hardware must be benchmarked. |
| Claude (Grounding) | Feasibility Support(Caution); external evidence | Browser ArcGIS JS cannot load `.slpk` directly — local-first 3D needs a hosted I3S service or extruded-footprint floor; risk is in the spike + human approval gates, not the UI. |

---

> **Next step:** `ai epic create <epic-id> --from-exploration <exploration_dir>`
