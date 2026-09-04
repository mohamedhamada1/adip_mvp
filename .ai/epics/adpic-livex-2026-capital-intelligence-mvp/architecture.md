# Epic Architecture Contract: ADPIC LIVEX 2026 — Capital Intelligence GeoAI MVP

## Epic Metadata
- **Epic ID:** adpic-livex-2026-capital-intelligence-mvp
- **Title:** ADPIC LIVEX 2026 — Capital Intelligence GeoAI MVP
- **Source Exploration:** .ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m
- **Target Repo:** /Users/adres/Documents/GitHub/adip_mvp (greenfield — new standalone web frontend)
- **Date:** 2026-09-04
- **Status:** Draft
- **Owner/Author:** prog.mohamedhamada@gmail.com (via ai epic create)

---

## Epic Problem / Goal

ADPIC has no application that tells its capital-investment decision-support story at LIVEX 2026. The authoritative contract (`WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md`) requires an exhibition-ready "Capital Intelligence Twin" that walks a presenter through **Understand the place → Evaluate an investment → Simulate its impact** in a curated 60–90 second journey across approved Abu Dhabi Areas of Interest, on presenter-operated large-display/touchscreen hardware, without ever letting AI become an approval authority.

This epic builds that application from zero as a standalone React + Vite + TypeScript app on the ArcGIS Maps SDK for JavaScript (`SceneView`). It exposes exactly three capabilities — Explore, deterministic Investment Assessment, and a Liveability Impact Simulator — plus a cross-cutting "Ask ADPIC AI" explanation layer. The hard problem is not the UI; it is (a) guaranteeing the scripted journey survives network, 3D, and hardware failure, and (b) closing the human approval/ownership gates. The correct posture, matching the contract, is **CONDITIONAL GO for a technical/data spike first** (WORK-ROLL-9), not an unconditional exhibition-build commitment. Eight EPIC_CREATE ownership/approval questions remain open and are parked as blocking in this epic — surfacing and parking them is the expected outcome, not a failure (WORK-AC-20).

---

## Existing System Grounding

> Grounded on 2026-09-04 against the target repo, the authoritative work definition, the exploration outputs, and external ArcGIS SDK evidence captured in the exploration's grounding note.

### 1. Existing Capabilities Found
- None in application form — the target repo is greenfield. It contains only the authoritative work definition `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md`, the exploration under `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/`, and the owner's UI screenshot folder `ADPIC_LIVEX_UI_Screens/`. There is no `git` history, no `src/`, no build tooling, no ROADMAP, and no seeded stages.

### 2. Related Files / Contracts / Commands
- `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md` — the single authoritative product/business/data/security/AI/scope contract (WORK-* ids).
- `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/epic_output.md` — epic-ready synthesis (stage candidates, invariants, source-of-truth).
- `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/context.md` — resolved decisions, constraints, open questions, risks.
- `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/ui_surfaces.md` — per-screen mapping of the 9 owner screenshots to WORK ids with flags.
- `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/screenshots/` — 9 owner-supplied visual references (Hero, Explore-3D, Project Details, Assessment, Simulation, Ask-AI, AOI Switcher, KPI Dashboard, Closing).
- `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/claude.md` — feasibility grounding (the browser ArcGIS JS SDK cannot load `.slpk` directly).
- External reusable primitives: ArcGIS Maps SDK for JavaScript (`SceneView`, `SceneLayer`/`BuildingSceneLayer`, service-area REST) and Calcite components.

### 3. Partial Implementations or Overlapping Logic
- No source code exists, so no partial implementation overlaps. The only "overlap" risk is conceptual: the owner screenshots carry mockup numbers and an "AI-assisted recommendation" phrasing that partially overlaps with — and can be mistaken for — the deterministic assessment result. This is resolved under Conflict Detection, not by code.

### 4. Gaps (Strictly Missing)
- The entire application: app shell, dark cinematic `SceneView` scene, AOI switching, KPI strip, filters, project cards.
- The frozen sanitized event-dataset pipeline (offline prep, freeze, validation) and its runtime loader.
- The local-first 3D delivery mechanism (a hosted I3S scene service or a client-side extruded-footprint floor).
- The pure-TypeScript, config-driven deterministic scoring engine and its evidence model.
- The precomputed school-simulation service-area / before-after data and its simulator UI.
- The template explanation registry and the constrained "Ask ADPIC AI" layer.
- The one-way demo state machine, preload/cache layer, deterministic fallback, and backup video.

### 5. Reuse / Extend / Replace / Avoid Recommendations

| Item | Decision | Reason |
|------|----------|--------|
| ArcGIS Maps SDK for JS (`SceneView`, `SceneLayer`, service-area REST) | Reuse | Proven fit for 3D city visualization, cinematic camera work, and service-area computation (WORK-INT-1). |
| Calcite components + custom dark CSS | Reuse (selective) | Owner-permitted delivery default (WORK-CON-7); custom CSS carries the premium dark cinematic language (WORK-UX-1). |
| Owner-supplied 9 screenshots | Reuse (as visual direction only) | Layout/flow reference; numbers/scores are mockups and are not approved data (WORK-AC-19). |
| Esri 3D Buildings item `b8fec5af7dfe4866b1b8ac2d2800f282` | Extend after validation | Preferred 3D source, but coverage for both AOIs is unproven and is the spike (WORK-INT-2, RISK-1). |
| Direct browser `.slpk` load | Avoid | The browser ArcGIS JS SDK cannot load `.slpk` directly; local-first 3D needs an I3S service or extruded-footprint floor. |
| Modern Portal WebScene on Enterprise 10.8.1 | Avoid (as a runtime dependency) | Runtime must not depend on it (WORK-INT-5); Enterprise 10.8.1 is for offline prep only. |
| Google Photorealistic 3D | Avoid (as a core dependency) | Forbidden as a core/required dependency (WORK-INT-4, OOS-16). |
| Live LLM on the core path | Avoid (as a dependency) | Core demo must run without a live LLM; LLM is an optional gated adapter (WORK-CON-15, DEC-8). |

### 6. User Alert

**What already exists:**
Only inputs exist — the authoritative work definition, a completed multi-agent exploration with a resolved human decision, and 9 owner screenshots. No application, dataset pipeline, or tooling has been built.

**What is missing:**
Everything runnable: the standalone web app, the frozen-dataset pipeline, the local-first 3D delivery, the deterministic scoring engine, the precomputed simulation data, the template/Ask-AI layer, and the exhibition-hardening package. In addition, eight EPIC_CREATE ownership/approval facts are unresolved and cannot be invented by this epic.

---

## Conflict Detection

| Conflict | Type | Decision | Reason |
|----------|------|----------|--------|
| Gemini (exploration reviewer) calls "Arabic-ready architecture" overengineering | Contradiction (source vs owner decision) | Keep Arabic-ready | Contradicts owner-RESOLVED WORK-DEC-4 / WORK-CON-11; string-and-layout hygiene from day one is cheap, retrofit is expensive. Repo/owner decision wins over reviewer opinion. |
| Gemini proposes its own watermark/disclaimer wording | Contradiction (source vs business rule) | Keep the approved WORK-BR-15 wording; adopt the persistent-visibility idea | WORK-BR-15 fixes the disclaimer text unless an authorized comms/legal owner supplies a replacement. |
| `stage_seed.md` lists "Repo Impact — mobile" | Contradiction (stale seed vs contract) | Resolve to standalone web frontend; mobile out of scope | WORK-NFR-9 / WORK-OOS-15 make mobile non-priority; the seed's repo-impact line is a template artifact, not a decision. |
| `stage_seed.md` combines Assessment + Simulation into one stage; `epic_output.md` splits them | Duplicate / divergent decomposition | Adopt the `epic_output.md` 5-stage split (Assessment and Simulator are separate stages) | Assessment (scoring engine) and Simulation (precomputed service areas) have different inputs, invariants, and risks; separating them keeps stages independently deliverable. |
| Owner screenshots show concrete numbers (219 / 139 / AED figures / dimension %) and an "AI-assisted recommendation: Proceed" line | Contradiction (mockup vs data/authority rules) | Bind every displayed value to the frozen snapshot; attribute the priority to deterministic rules, never to AI | WORK-AC-19 / WORK-DEC-7 forbid presenting mockup counts as authoritative; WORK-BR-1/BR-2 forbid AI appearing as the approver. Enforced by Core Invariants 1 and 4. |
| Exploration/seed narrate stage progress ("first stage is the spike") | Potential stale-status (seed vs repo) | No stage is claimed complete; all stages are pre-seed | The repo has no `state.json` and no ROADMAP; repo reality (nothing built) wins. Recorded in the Freshness Declaration. |

---

## Target Architecture

**Reliability-First Deterministic Twin.** Everything on the scripted 60–90s journey is frozen and local: sanitized project records, AOI and community geometries, precomputed service areas, precomputed Low/Medium/High scores, and a local-first 3D scene. A one-way demo state machine drives Understand → Evaluate → Simulate, so every presenter transition is instantaneous and has an immediate deterministic fallback state.

Live capabilities — live Esri routing/service-area REST and a live LLM — are **optional, feature-flagged, post-spike enhancements sitting behind adapters** that degrade to the frozen/template path when disabled, unapproved, or unreachable. No live capability is ever on the critical path.

Data flow shape:
- **Offline (tooling):** Enterprise 10.8.1 and approved sources feed a data-prep step that curates 20–40 showcase projects per AOI, sanitizes attributes to an approved allowlist, precomputes school service areas, and freezes a validated snapshot with validated KPI counts.
- **Runtime (browser):** the app loads the frozen snapshot + the chosen local-first 3D scene, computes nothing authoritative from the network, scores projects deterministically from config, explains via a template registry, and renders a dark cinematic `SceneView` with overlays/panels/state transitions rather than nine independent routes.

Khalifa City is the guaranteed spine (mandatory for Evaluate and Simulate). Al Reem Island is a progressive-enhancement opening, gated on its 3D spike; if the spike fails, the AOI switcher hides/disables it and the journey stays coherent, with Yas Island available only as a fallback replacement AOI (never a third core AOI).

---

## Platform Responsibilities

| Platform | Involved? | Responsibility |
|----------|-----------|----------------|
| Web Frontend | YES | The entire deliverable: standalone Vite/React/TS app, dark cinematic `SceneView`, three capabilities + cross-cutting Ask-AI, deterministic scoring, template explanations, demo state machine, fallback. |
| Backend | NO | Not involved — no application backend; the runtime consumes a frozen static/sanitized dataset and, optionally, approved Esri REST directly (WORK-CON-8, WORK-CON-16). |
| Mobile | NO | Not involved — desktop/exhibition-first; mobile is explicitly out of scope (WORK-NFR-9, WORK-OOS-15). |
| Admin | NO | Not involved — no admin panel in MVP scope; there is no runtime data editing (WORK-NFR-12). |
| Engine/Tooling | YES | Offline data prep on Enterprise 10.8.1, snapshot freeze/validation, service-area precomputation, and local 3D asset packaging (I3S scene service or extruded-footprint data). |
| SDUI | NO | Not involved — direct custom React UI, not server-driven UI (WORK-CON-7). |
| CI/CD | NO | Not required by the contract for the exhibition build; exhibition delivery is a hardened static build, not a pipeline deliverable. |

---

## Communication Contracts

| Boundary | Type | Description |
|----------|------|-------------|
| Frozen dataset → runtime | Artifact | A validated, sanitized snapshot (project records + geometries + precomputed scores + precomputed service areas + validated KPI counts) is the only source of runtime numbers. |
| App → scoring engine | Contract | The app passes approved structured inputs; the pure-TS engine returns a Low/Medium/High category plus per-dimension evidence. The engine owns the result; nothing else may. |
| App → template registry | Contract | The app assembles sanitized context (selected project, map context, approved attributes, calculated GIS indicators, configured strategy) and receives a template explanation string plus an allowlisted map action. |
| App → local-first 3D | Contract | The scene is served as an I3S scene service URL or rendered from local extruded-footprint geometry; no direct `.slpk` load and no modern Portal WebScene dependency. |
| App → live Esri adapter (optional) | API | Behind a feature flag; approved routing/service-area REST may enhance the frozen path but must degrade to precomputed results (WORK-INT-7). |
| App → live LLM adapter (optional) | API | Behind a feature flag and a sanitized-context boundary; accepts only approved structured context and returns an explanation + allowlisted action; never receives unrestricted datasets (WORK-INT-8, WORK-SEC-4). |
| Exhibition recovery | Handoff | A fixed deterministic demo path plus a backup video is the operator's recovery contract when live conditions degrade (WORK-AC-16, WORK-REQ-23). |

---

## Screen / UX Expectations

> UI is central. Delivery mode is `direct_ui` (React + Vite + TS + ArcGIS `SceneView` + selective Calcite + custom dark CSS). Owner supplied 9 screenshots as visual direction; WORK.md wins on any conflict, and screenshot numbers/scores are mockups, not approved data.

| Screen | Owner | Delivery Mode | Notes |
|--------|-------|---------------|-------|
| Hero / Landing | Web Frontend | web | Decorative photoreal skyline as landing background; AOI/context entry; "Start Experience" → Explore (WORK-UX-4, WORK-EX-1). |
| Explore 3D Map | Web Frontend | web | Dark `SceneView`, KPI strip, filters, animated project markers, fly-to; Al Reem opening degrades gracefully if the 3D spike fails (WORK-REQ-1/3/4/5, WORK-AC-3). |
| Project Details card | Web Frontend | web | Concise approved-attribute card; the school card carries explicit hypothetical/demo identification (WORK-REQ-2, WORK-BR-14). |
| Investment Assessment | Web Frontend | web | Low/Medium/High with per-dimension evidence and the persistent approved disclaimer; result attributed to deterministic rules, never to AI (WORK-REQ-9/10/11, WORK-BR-15). |
| Liveability Impact Simulation | Web Frontend | web | Current vs With-Proposed-School, service-area rings, KPI deltas, before/after (WORK-REQ-12/13/14/15). |
| Ask ADPIC AI | Web Frontend | web | Cross-cutting overlay; suggested-question chips + allowlisted actions; grounded disclaimer; runs on templates without a live LLM (WORK-REQ-16/17/18). |
| Area / AOI Switcher | Web Frontend | web | Khalifa + Al Reem only; a disabled/hidden state for Al Reem after a failed 3D spike; Yas absent from core (WORK-REQ-6, WORK-DEC-5). |
| KPI Dashboard | Web Frontend | web | Validated frozen-snapshot counts only; provisional 219/139 are never shown as authoritative (WORK-REQ-3, WORK-AC-19). |
| Closing | Web Frontend | web | Closing impact statement + ADPIC/LIVEX lockup (WORK-UX-7, WORK-EX-1). |

---

## Figma / Design Inputs

- **Figma URLs:** None provided.
- **Design system/kit references:** Owner-supplied 9 screenshots in `.ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m/screenshots/` (mirrored from `ADPIC_LIVEX_UI_Screens/`); selective Calcite.
- **Token expectations:** Premium dark cinematic language — dark navy background, restrained blue highlights, minimal chrome, large readable KPIs, left-rail nav; final colors/animation delegated under ADPIC brand (WORK-UX-10).
- **Component mapping:** Overlays / panels / state transitions preferred over nine independent routes; per-screen WORK-id mapping is recorded in the exploration's `ui_surfaces.md`.
- **Design uncertainty:** Cinematic fidelity is bounded by event hardware (validated in the spike, WORK-UX-10 delegates tuning); screenshot content values are non-authoritative.

---

## Source of Truth

- `WORK_ADPIC_LIVEX_2026_Capital_Intelligence_GeoAI_MVP_FINAL.md` is the single source of truth for product, business, data, security, AI, and scope; owner screenshots are visual direction only and never override it.
- The frozen sanitized event dataset is the single source of truth for all runtime numbers, geometries, KPI counts, and precomputed scores.
- The deterministic scoring engine plus its configuration is the single source of truth for every Low/Medium/High result; the template/AI layer owns explanation only and never the result.
- The approved WORK-BR-15 disclaimer wording is authoritative for assessment claims until an authorized communications/legal owner supplies replacement wording.
- The named human owners (unresolved — see Blocking Open Questions) own data, methodology/claim, security/AI, and final business approval; no other party may grant those approvals.

---

## Runtime vs Tooling Boundary

- **Runtime:** browser-only. Loads the frozen dataset and the local-first 3D scene; runs the deterministic scoring engine; renders template explanations; drives the scripted journey via the demo state machine; optionally calls gated live Esri/LLM adapters that always degrade to the frozen/template path.
- **Tooling/Generation:** offline, before the exhibition. Enterprise 10.8.1 data preparation, snapshot freeze and validation, service-area precomputation, curation of 20–40 showcase projects per AOI, and local 3D asset packaging (I3S scene service or extruded-footprint data).
- **Must not leak:** unsanitized or confidential attributes, a live Enterprise 10.8.1 runtime dependency, unvalidated portfolio counts, and any modern Portal WebScene dependency must never appear in the runtime build (WORK-SEC-1/9, WORK-CON-8, WORK-INT-5).

---

## Core Invariants

1. **Authority boundary:** GIS computes, business rules score, AI explains — the AI/template layer must never approve, reject, authorize, or decide a capital-investment or prioritization outcome, and no screen may present AI as the approver (WORK-BR-1/2).
2. **Deterministic offline core:** the entire scripted journey must run with the network physically disconnected and with no live LLM, and every important transition must have an immediate deterministic fallback state (WORK-AC-12, WORK-NFR-5/6, WORK-DEC-10).
3. **Traceability:** every presenter-visible score, indicator, and explanation must be reproducible from the same frozen inputs plus configuration and traceable to those inputs — identical inputs yield an identical result (WORK-NFR-11, WORK-BR-3, WORK-AC-6).
4. **Validated-data-only:** only validated frozen-snapshot values may be displayed; no screenshot or mockup number (219/139, budgets, scores, dates) may be hard-coded, and demo/synthetic records must be internally identifiable and never shown as verified real projects (WORK-AC-19, WORK-DATA-32, WORK-BR-12).
5. **Persistent disclaimer:** the approved WORK-BR-15 disclaimer wording must remain visible on every scored screen unless an authorized owner replaces it.
6. **Scope lock:** exactly three capabilities plus the cross-cutting Ask-AI; Khalifa mandatory; Al Reem conditional on its 3D spike; Yas fallback-only; no coupling to the separate Location and Boundary (V0.2) initiative (WORK-CON-1/4/5/6/19).

---

## Architecture Decisions

### Decision 1: Reliability-First Deterministic Twin (frozen/local core, live paths as gated enhancements)

- **Decision:** Make the entire scripted journey run from a frozen local dataset, precomputed service areas, precomputed scores, and a local-first 3D scene; place live Esri and live LLM behind feature-flagged adapters that always degrade to the frozen/template path.
- **Reason:** The dominant risk at an exhibition is network, external-service, and hardware failure during a live presentation; the core must survive with the network unplugged (WORK-NFR-5/8, WORK-DEC-10).
- **Source:** WORK-CON-8/15/16, WORK-DEC-9/10, WORK-AC-12; exploration recommended direction (Approach A).
- **Alternatives Rejected:**
  - Live-first architecture consuming Enterprise/Esri/LLM at runtime — rejected: any live dependency on the critical path can fail mid-demo and violates Core Invariant 2.
  - Static backup video only — rejected: it cannot deliver the interactive Understand → Evaluate → Simulate narrative the contract requires.
- **Consequences / Tradeoff:** Front-loads an offline data-prep and precompute pipeline and a strict runtime/tooling boundary; live enhancements become additive and gated rather than assumed.

### Decision 2: Pure-TypeScript, config-driven deterministic scoring engine; template registry as the guaranteed explanation path

- **Decision:** Compute Low/Medium/High from a pure-TS, config-driven engine that emits per-dimension evidence, and make a template registry the guaranteed explanation path, with any live LLM as an optional adapter behind a sanitized-context boundary.
- **Reason:** The result must be deterministic, reproducible, and attributable to rules (not AI), and the demo must explain itself without a live LLM (WORK-BR-3, WORK-NFR-11, WORK-CON-9/15).
- **Source:** WORK-BR-1/2/3/9/10, WORK-DEC-8, WORK-REQ-11/20.
- **Alternatives Rejected:**
  - LLM-generated scores or narrative-as-result — rejected: makes AI the decider, violating WORK-BR-1/2 and the authority boundary.
  - Presenting the source illustrative weights as official methodology — rejected: weights are examples only and are not official until separately validated (WORK-BR-9/10).
- **Consequences / Tradeoff:** Requires authored templates and a config schema for weights/thresholds; explanation richness on the guaranteed path is bounded by the template set until an approved LLM environment exists.

### Decision 3: Local-first 3D via I3S scene service or extruded-footprint floor (no direct `.slpk`, no Portal WebScene runtime dependency)

- **Decision:** Deliver the 3D scene from a hosted I3S scene service URL or, as the deterministic floor, from local extruded building-footprint geometry on a cached basemap; validate the Esri 3D Buildings item for both AOIs in the spike before it becomes an exhibition dependency.
- **Reason:** The browser ArcGIS JS SDK cannot load `.slpk` directly, and the runtime must not depend on a modern Portal WebScene on Enterprise 10.8.1 (WORK-INT-2/5).
- **Source:** WORK-INT-1/2/3/4/5/6; exploration grounding note (Claude feasibility).
- **Alternatives Rejected:**
  - Ship an `.slpk` and open it in the browser — rejected: not supported by the SDK.
  - Google Photorealistic 3D as a core dependency — rejected: forbidden (WORK-INT-4, WORK-OOS-16).
- **Consequences / Tradeoff:** The 3D delivery mechanism is a spike output, not an assumption; the extruded-footprint floor guarantees a scene even with the venue network unplugged, at lower visual fidelity than a full I3S scene.

---

## Stage Breakdown & Dependency Graph

### Stages

#### Stage 1.1 — Technical / Data Spike + Snapshot Freeze
- **Stage ID:** 1.1
- **Title:** Technical / Data Spike + Snapshot Freeze
- **Artifact Type:** spike + validated frozen dataset + config
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (new standalone web frontend) + offline data-prep tooling
- **Estimated Effort:** L — spike, 3D validation, hardware profiling, and the frozen-data pipeline dominate the epic's effort.
- **Depends On:** None
- **Core Invariant:** No runtime dependency on a direct `.slpk` load or a live Portal WebScene; every snapshot value is validated before it is eligible for display.
- **Inputs:** WORK-INT-2 Esri 3D Buildings item, AOI/portfolio data, population/facility/network inputs, event hardware, and owner data approvals.
- **Outputs:** a go/no-go on the Al Reem opening; the chosen 3D delivery mechanism; a frozen sanitized dataset; validated KPI counts; and a precompute plan for the school scenario.
- **Must Preserve:** the authority boundary and the sanitized-attribute allowlist as the spike's success conditions.
- **Must Not Change:** owner-RESOLVED decisions WORK-DEC-1..12 without owner re-approval.
- **Test / Certification:** the chosen 3D mechanism renders both AOIs acceptably on representative hardware; the frozen snapshot re-validates counts against source; a network-disconnected smoke test of the scene passes.
- **Rollback Strategy:** if Al Reem 3D fails, fall back to Khalifa as the opening spine and (if required) Yas as a replacement AOI; if the I3S service path fails, fall back to the extruded-footprint floor.
- **Success Proof:** a documented spike result records the 3D mechanism, the Al Reem go/no-go, and a frozen validated snapshot whose displayed counts equal the snapshot (not 219/139).

##### Requirements
- RR-1: The Esri 3D Buildings item coverage/quality for Al Reem Island and Khalifa City is validated before it is treated as an exhibition dependency — source: WORK-INT-2.
- RR-2: A local-first 3D delivery mechanism (I3S scene service or extruded-footprint floor) renders both AOIs with the venue network disconnected — source: DERIVED — Core Invariant 2 requires an offline-provable scene; the browser SDK cannot load `.slpk`.
- RR-3: A frozen, sanitized event snapshot exists with validated KPI counts, and displayed counts equal the snapshot rather than the provisional 219/139 — source: WORK-DATA-1/2, WORK-AC-19, WORK-DEC-7.
- RR-4: The school-scenario spatial inputs are either approved-and-available or replaced with precomputed deterministic equivalents, decided at the spike — source: WORK-DEP-6/7, WORK-INT-7.
- RR-5: Critical presenter interactions are profiled on representative hardware to set later performance thresholds — source: WORK-NFR-2, WORK-DEC-11.

##### Business Context
- **Why does this stage exist?** It converts the epic's highest-risk assumptions (3D coverage, network independence, hardware, data availability) into validated facts before any build commitment.
- **Business problem solved:** It prevents committing an exhibition build on unproven 3D/data/hardware assumptions.
- **Why is it important now?** The contract's start posture is CONDITIONAL GO for exactly this spike (WORK-ROLL-9).
- **What happens if we do not do it?** A live-demo failure at LIVEX from unvalidated 3D, network, or data assumptions.

##### Revenue Impact
- **Classification (choose one):** Required before first pilot
- **Why this classification:** No credible exhibition demo can proceed until the spike proves feasibility and freezes the data.

##### Readiness Impact
- **Current readiness:** Pilot 0% · Production 0% · Scale 0%
- **Expected after completion:** Pilot 25% · Production 10% · Scale 5%
- **Dimensions improved:** Operations, Analytics (data validation), Customer experience (reliability foundation).

##### Multi-Vertical Impact
- **Vertical-agnostic capability:** N/A — this is a single-purpose exhibition demo, not a multi-vertical platform.
- **Academy-specific considerations:** none — not applicable to this exhibition MVP.
- **Clinic-specific considerations:** none — not applicable.
- **Salon-specific considerations:** none — not applicable.
- **Home-maintenance considerations:** none — not applicable.
- **Pet-care considerations:** none — not applicable.
- **Platform-first preservation:** behavior stays config/data-driven via the frozen snapshot and scoring config, not hard-coded per AOI.

##### Not Doing
- **Out of scope:** live Enterprise runtime dependency; unsanitized attributes; Google Photorealistic 3D as a core dependency.
- **Intentionally deferred:** final hardware thresholds (set after WORK-OQ-11 hardware specs are known).
- **Must not expand into:** a third core AOI (Yas remains fallback-only) or the V0.2 initiative.

##### Customer Value
- **New capability unlocked:** a proven, offline-capable 3D + data foundation.
- **Who benefits:** Operator — a de-risked path to a reliable demo.

##### Go-Live Impact
- **Classification (choose one):** Pilot blocker

##### Roadmap Position
- **Milestone:** Foundation & Spike.
- **Dependencies:** owner data approvals (WORK-OQ-5/6) and spike ownership (WORK-OQ-9).
- **Unblocked after this stage:** the 3D shell and Explore capability.
- **Future stages that depend on it:** 1.2, 1.3, 1.4, 1.5.

#### Stage 1.2 — 3D Shell + Explore + AOI Switch
- **Stage ID:** 1.2
- **Title:** 3D Shell + Explore + AOI Switch
- **Artifact Type:** app shell + Explore capability
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** L — the standalone app skeleton, the cinematic scene, and AOI switching without reload.
- **Depends On:** 1.1
- **Core Invariant:** AOI switching preserves the workflow without a full application reload, and the experience stays coherent with the Al Reem opening disabled.
- **Inputs:** the frozen dataset, the chosen 3D mechanism, and screenshots 01/02/07/08.
- **Outputs:** an Explore state with a dark cinematic `SceneView`, KPI strip, filters, animated project markers, fly-to, and an AOI switcher.
- **Must Preserve:** the premium dark cinematic language and validated-data-only KPI display.
- **Must Not Change:** the frozen-dataset contract and the runtime/tooling boundary.
- **Test / Certification:** AOI switch occurs without reload and preserves workflow; KPI values equal the frozen snapshot; Al Reem-off state renders coherently.
- **Rollback Strategy:** revert to the Khalifa-only opening state if Al Reem rendering regresses.
- **Success Proof:** a presenter can open Explore, filter, select a project, and switch AOI without reload, with all KPIs sourced from the frozen snapshot.

##### Requirements
- RR-1: The standalone Vite/React/TS app renders a dark cinematic `SceneView` with contextual buildings muted and projects emphasized — source: WORK-CON-7, WORK-UX-1/2.
- RR-2: A compact KPI strip, dataset-appropriate filters, and selectable animated project markers with fly-to are present — source: WORK-REQ-3/4/5, WORK-REQ-2.
- RR-3: AOI switching between Khalifa City and (conditionally) Al Reem Island occurs without a full reload and preserves the core workflow — source: WORK-REQ-6, WORK-AC-3, WORK-NFR-3.
- RR-4: The Al Reem opening degrades gracefully to a disabled/hidden switcher state when its 3D spike did not pass — source: WORK-EX-4, WORK-DEC-5.
- RR-5: Every displayed KPI value equals the frozen validated snapshot — source: WORK-AC-19, WORK-DEC-7.

##### Business Context
- **Why does this stage exist?** It delivers the "Understand the place" opening of the narrative and the shell every later capability plugs into.
- **Business problem solved:** it establishes the cinematic Explore experience and AOI story that frames the demo.
- **Why is it important now?** Explore is the entry point of the 60–90s journey; nothing downstream can be shown without it.
- **What happens if we do not do it?** There is no application shell and no Explore capability to demonstrate.

##### Revenue Impact
- **Classification (choose one):** Required before first pilot
- **Why this classification:** the shell and Explore are prerequisites for any presentable demo.

##### Readiness Impact
- **Current readiness:** Pilot 25% · Production 10% · Scale 5%
- **Expected after completion:** Pilot 45% · Production 20% · Scale 10%
- **Dimensions improved:** Customer experience, Provider experience (presenter), Operations.

##### Multi-Vertical Impact
- **Vertical-agnostic capability:** N/A — single-purpose exhibition demo.
- **Academy-specific considerations:** none — not applicable.
- **Clinic-specific considerations:** none — not applicable.
- **Salon-specific considerations:** none — not applicable.
- **Home-maintenance considerations:** none — not applicable.
- **Pet-care considerations:** none — not applicable.
- **Platform-first preservation:** AOI behavior is data/config-driven from the frozen snapshot, not coded per AOI.

##### Not Doing
- **Out of scope:** the assessment and simulation capabilities (later stages); mobile layouts.
- **Intentionally deferred:** live Esri basemap enhancements behind the feature flag.
- **Must not expand into:** nine independent routes; overlays/panels/state transitions are used instead.

##### Customer Value
- **New capability unlocked:** the interactive 3D Explore story with AOI switching.
- **Who benefits:** Consumer (exhibition audience) and Provider (presenter).

##### Go-Live Impact
- **Classification (choose one):** Pilot blocker

##### Roadmap Position
- **Milestone:** Foundation & Spike.
- **Dependencies:** Stage 1.1 outputs (frozen data, 3D mechanism).
- **Unblocked after this stage:** the deterministic assessment and the simulator.
- **Future stages that depend on it:** 1.3, 1.4, 1.5.

#### Stage 1.3 — Deterministic Assessment + Evidence
- **Stage ID:** 1.3
- **Title:** Deterministic Assessment + Evidence
- **Artifact Type:** scoring engine + Assessment UI
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** M — a pure-TS config-driven engine plus the evidence UI.
- **Depends On:** 1.2
- **Core Invariant:** The assessment result is reproducible from the same frozen inputs plus configuration and is attributed to deterministic rules, never to AI.
- **Inputs:** the frozen dataset, a business-rule/weight configuration, and screenshots 03/04.
- **Outputs:** a Low/Medium/High assessment with per-dimension evidence and the persistent approved disclaimer.
- **Must Preserve:** the authority boundary and the WORK-BR-15 disclaimer wording.
- **Must Not Change:** the scoring engine as the sole owner of the result; the template/AI layer must not produce the result.
- **Test / Certification:** identical inputs produce an identical category across runs; each result exposes its contributing evidence; the disclaimer is present on the scored screen.
- **Rollback Strategy:** revert to evidence-only display (no overall category) if a weight configuration is not yet approved.
- **Success Proof:** selecting a planned project yields a reproducible Low/Medium/High with visible per-dimension evidence and disclaimer, with no AI-as-approver phrasing.

##### Requirements
- RR-1: A pure-TypeScript, config-driven engine produces Low/Medium/High deterministically from approved inputs and configured rules — source: WORK-REQ-11, WORK-BR-3, WORK-CON-9.
- RR-2: Each result exposes the contributing indicators/evidence, not only the category — source: WORK-REQ-10, WORK-AC-6.
- RR-3: The approved WORK-BR-15 disclaimer wording is persistently visible on the assessment screen — source: WORK-BR-15, WORK-AC-7.
- RR-4: The result is attributed to GIS/rules and no screen presents AI as the approver/decider — source: WORK-BR-1/2, WORK-SEC-7.
- RR-5: Configurable weights are not presented as official ADPIC methodology unless separately validated — source: WORK-BR-9/10.
- RR-6: Negative/edge cases (missing indicator inputs) yield a defined, evidence-visible outcome rather than an invented score — source: DERIVED — WORK-NFR-11 traceability implies every displayed result must be backed by present inputs.

##### Business Context
- **Why does this stage exist?** It delivers the "Evaluate an investment" capability, the core decision-support claim of the demo.
- **Business problem solved:** it shows evidence-backed prioritization without asserting official approval.
- **Why is it important now?** Evaluate is the narrative's decision moment on the Khalifa spine.
- **What happens if we do not do it?** The demo cannot demonstrate the assessment capability that defines the product.

##### Revenue Impact
- **Classification (choose one):** Required before first pilot
- **Why this classification:** the assessment is a core MVP capability, not an enhancement.

##### Readiness Impact
- **Current readiness:** Pilot 45% · Production 20% · Scale 10%
- **Expected after completion:** Pilot 65% · Production 35% · Scale 15%
- **Dimensions improved:** Analytics, Customer experience, Security (authority-boundary enforcement).

##### Multi-Vertical Impact
- **Vertical-agnostic capability:** N/A — single-purpose exhibition demo.
- **Academy-specific considerations:** none — not applicable.
- **Clinic-specific considerations:** none — not applicable.
- **Salon-specific considerations:** none — not applicable.
- **Home-maintenance considerations:** none — not applicable.
- **Pet-care considerations:** none — not applicable.
- **Platform-first preservation:** scoring weights/thresholds are config, not code, keeping the engine dataset-driven.

##### Not Doing
- **Out of scope:** production AI approval or autonomous investment decisions (WORK-OOS-3); numerical score as official methodology.
- **Intentionally deferred:** methodology validation and approver sign-off (WORK-OQ-3).
- **Must not expand into:** an AI-decided or AI-approved result.

##### Customer Value
- **New capability unlocked:** evidence-backed, deterministic Low/Medium/High prioritization.
- **Who benefits:** Consumer (audience) and Operator (institution) — credible, traceable decision support.

##### Go-Live Impact
- **Classification (choose one):** Pilot blocker

##### Roadmap Position
- **Milestone:** Decision Support.
- **Dependencies:** Stage 1.2 shell + frozen data; WORK-OQ-3 methodology approver for claim wording.
- **Unblocked after this stage:** the simulator and the Ask-AI explanation of assessment results.
- **Future stages that depend on it:** 1.4, 1.5.

#### Stage 1.4 — Liveability Impact Simulator (School, precomputed)
- **Stage ID:** 1.4
- **Title:** Liveability Impact Simulator (School, precomputed)
- **Artifact Type:** simulation capability
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** M — before/after simulation UI over precomputed service-area data.
- **Depends On:** 1.3
- **Core Invariant:** The hypothetical school is never presented as an approved real project, and all before/after values come from precomputed frozen simulation data.
- **Inputs:** precomputed service areas / population inputs (or deterministic equivalents from Stage 1.1) and screenshot 05.
- **Outputs:** a Current vs With-Proposed-School comparison with service-area, underserved, accessibility, and KPI deltas.
- **Must Preserve:** the demo/hypothetical identification of the school and validated-data-only display.
- **Must Not Change:** the precomputed-data contract for the fallback path.
- **Test / Certification:** the before/after story runs offline from precomputed data; the school card carries hypothetical/demo identification; deltas come from the frozen sim, not the screenshot.
- **Rollback Strategy:** fall back to precomputed deterministic equivalents if live routing/service-area is unavailable.
- **Success Proof:** the simulator shows Current → Simulate → proposed intervention → changed coverage → KPI change → concise explanation, entirely from precomputed data.

##### Requirements
- RR-1: The simulator compares Current and With-Proposed-Project for the approved hypothetical school scenario — source: WORK-REQ-12, WORK-AC-8, WORK-DEC-2.
- RR-2: The simulation map shows current coverage, underserved areas, proposed location, new service area, and newly covered communities where approved data supports them — source: WORK-REQ-14, WORK-AC-9.
- RR-3: The simulator reports population within service area, coverage, average access distance, underserved population, and a Liveability Impact Score where approved data supports them — source: WORK-REQ-13.
- RR-4: The interaction follows the exhibition sequence current → Simulate → intervention → changed coverage → KPI change → explanation — source: WORK-REQ-15.
- RR-5: The school is labeled hypothetical/demo and never reads as an approved real project — source: WORK-BR-14, WORK-DATA-32.
- RR-6: Every before/after value is sourced from precomputed frozen simulation data rather than any mockup figure — source: WORK-AC-19; DERIVED — Core Invariant 4 applied to simulation outputs.

##### Business Context
- **Why does this stage exist?** It delivers the "Simulate its impact" capability that closes the narrative.
- **Business problem solved:** it shows spatial before/after impact of a hypothetical intervention using approved context.
- **Why is it important now?** Simulate is the payoff of the 60–90s journey.
- **What happens if we do not do it?** The narrative cannot demonstrate impact simulation, the third core capability.

##### Revenue Impact
- **Classification (choose one):** Required before first pilot
- **Why this classification:** the simulator is a core MVP capability.

##### Readiness Impact
- **Current readiness:** Pilot 65% · Production 35% · Scale 15%
- **Expected after completion:** Pilot 80% · Production 45% · Scale 20%
- **Dimensions improved:** Analytics, Customer experience.

##### Multi-Vertical Impact
- **Vertical-agnostic capability:** N/A — single-purpose exhibition demo.
- **Academy-specific considerations:** none — not applicable.
- **Clinic-specific considerations:** none — not applicable.
- **Salon-specific considerations:** none — not applicable.
- **Home-maintenance considerations:** none — not applicable.
- **Pet-care considerations:** none — not applicable.
- **Platform-first preservation:** the scenario is data-driven from precomputed frozen inputs, not hard-coded.

##### Not Doing
- **Out of scope:** emirate-wide scenario optimization (WORK-OOS-14); live routing as a dependency.
- **Intentionally deferred:** additional proposal types beyond the approved school scenario.
- **Must not expand into:** presenting the hypothetical school as a real approved project.

##### Customer Value
- **New capability unlocked:** spatial before/after liveability-impact simulation.
- **Who benefits:** Consumer (audience) — a tangible sense of intervention impact.

##### Go-Live Impact
- **Classification (choose one):** Pilot blocker

##### Roadmap Position
- **Milestone:** Decision Support.
- **Dependencies:** Stage 1.3 assessment context; precompute from Stage 1.1; WORK-DEP-6/7 data.
- **Unblocked after this stage:** the full scripted journey and hardening.
- **Future stages that depend on it:** 1.5.

#### Stage 1.5 — Ask ADPIC AI Templates + Hardening / Fallback
- **Stage ID:** 1.5
- **Title:** Ask ADPIC AI Templates + Hardening / Fallback
- **Artifact Type:** explanation layer + exhibition hardening
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** L — the constrained explanation layer plus the full exhibition-hardening package.
- **Depends On:** 1.2, 1.3, 1.4
- **Core Invariant:** The full journey runs offline with no live LLM, and every transition has a deterministic fallback.
- **Inputs:** all prior stages, screenshots 06/09, and the presenter script.
- **Outputs:** a constrained cross-cutting Ask-AI (suggested questions + allowlisted actions, template-first), a one-way demo state machine, a preload/cache layer, connectivity-interruption tests, hardware profiling, a deterministic fallback, and a backup video.
- **Must Preserve:** the authority boundary, the deterministic offline core, and validated-data-only display.
- **Must Not Change:** the guaranteed template path as the non-LLM explanation source.
- **Test / Certification:** the full journey completes in 60–90s with the network disconnected; connectivity-interruption tests pass; the fallback path and backup video are exercised.
- **Rollback Strategy:** disable the live-LLM adapter and run the template path; if live conditions degrade, switch to the fixed deterministic demo or the backup video.
- **Success Proof:** the entire scripted journey runs with the network physically disconnected and no live LLM, and every transition has a working deterministic fallback.

##### Requirements
- RR-1: Ask ADPIC AI is a cross-cutting explanation layer, not a fourth module, favoring suggested questions and allowlisted map actions over open autonomous chat — source: WORK-REQ-16/18, WORK-CON-1.
- RR-2: Explanation context is assembled by the app from selected project, map context, approved attributes, calculated GIS indicators, and configured strategy — source: WORK-REQ-17.
- RR-3: Deterministic pre-authored templates execute the entire scripted demo when a live LLM is unavailable or unapproved — source: WORK-REQ-20, WORK-AC-12, WORK-DEC-8.
- RR-4: When requested information is absent from the approved context, the output states it is not in the demo dataset rather than inventing it — source: WORK-AC-10/11, WORK-EX-2, WORK-SEC-3.
- RR-5: The full scripted journey tolerates connectivity interruption and completes within 60–90s on validated hardware, with preload/cache where appropriate — source: WORK-NFR-1/5/7/8, WORK-ROLL-6.
- RR-6: A fixed deterministic fallback demonstration and a backup video are prepared and verified before go-live — source: WORK-AC-16, WORK-REQ-23.
- RR-7: Any live LLM adapter receives only approved sanitized structured context and returns an explanation plus an allowlisted action — source: WORK-INT-8, WORK-SEC-4.

##### Business Context
- **Why does this stage exist?** It delivers the cross-cutting explanation layer and makes the whole demo survive exhibition conditions.
- **Business problem solved:** it guarantees a coherent, self-explaining journey that cannot fail on network or LLM availability.
- **Why is it important now?** Hardening and fallback are what make the demo safe to present live.
- **What happens if we do not do it?** A single network or service hiccup could break the live presentation.

##### Revenue Impact
- **Classification (choose one):** Required before first pilot
- **Why this classification:** offline resilience and a verified fallback are preconditions for presenting at the event.

##### Readiness Impact
- **Current readiness:** Pilot 80% · Production 45% · Scale 20%
- **Expected after completion:** Pilot 95% · Production 60% · Scale 25%
- **Dimensions improved:** Operations, Security, Customer experience, Provider experience.

##### Multi-Vertical Impact
- **Vertical-agnostic capability:** N/A — single-purpose exhibition demo.
- **Academy-specific considerations:** none — not applicable.
- **Clinic-specific considerations:** none — not applicable.
- **Salon-specific considerations:** none — not applicable.
- **Home-maintenance considerations:** none — not applicable.
- **Pet-care considerations:** none — not applicable.
- **Platform-first preservation:** templates and allowlisted actions are config/registry-driven, not hard-coded per screen.

##### Not Doing
- **Out of scope:** unrestricted autonomous chat; a live LLM as a core dependency; production AI approval (WORK-OOS-3).
- **Intentionally deferred:** a secured live LLM integration (gated on WORK-OQ-7/8 approvals).
- **Must not expand into:** an Ask-AI that decides or approves.

##### Customer Value
- **New capability unlocked:** grounded, constrained explanations plus a demo that cannot be broken by connectivity.
- **Who benefits:** Provider (presenter) and Operator — a safe, self-explaining live demo.

##### Go-Live Impact
- **Classification (choose one):** Launch blocker

##### Roadmap Position
- **Milestone:** Explanation & Exhibition Hardening.
- **Dependencies:** Stages 1.2–1.4; WORK-OQ-9/10/11 (spike/hardware ownership and specs) before exhibition-build commitment.
- **Unblocked after this stage:** exhibition-build commitment (subject to closing the build-commit blockers).
- **Future stages that depend on it:** none — this is the final MVP stage.

### Dependency Graph

```
1.1 (Spike + Snapshot Freeze) ──> 1.2 (3D Shell + Explore + AOI) ──> 1.3 (Assessment + Evidence) ──┐
                                                                 └──> 1.4 (Simulator) <── 1.3       │
                                                                            │                       │
                                                                            v                       │
                                                              1.5 (Ask-AI + Hardening) <────────────┘
                                   (1.5 also depends on 1.2)
```

---

## Risks / Open Questions

### Blocking Open Questions
> These EPIC_CREATE ownership/approval facts cannot be invented by this epic and are parked as blocking (WORK-AC-20, WORK-ROLL-9). Surfacing and parking them is the expected outcome.
- [ ] WORK-OQ-1: the exact public project-attribute allowlist (SECURITY_OWNER).
- [ ] WORK-OQ-2: the named data approver for the public exhibition dataset (SECURITY_OWNER).
- [ ] WORK-OQ-3: the named methodology/claim approver for the Low/Medium/High assessment and its disclaimer (PRODUCT_OWNER).
- [ ] WORK-OQ-4: the named final business owner/final approver (PRODUCT_OWNER).
- [ ] WORK-OQ-5: per-dataset availability/approval for each required event dataset (PRODUCT_OWNER).
- [ ] WORK-OQ-6: the named GIS/data owner for the frozen snapshot and validation (PRODUCT_OWNER).
- [ ] WORK-OQ-7: the information categories permitted for a future live LLM (SECURITY_OWNER).
- [ ] WORK-OQ-8: the named security/AI approver for the AI/data boundary (SECURITY_OWNER).

### Non-Blocking Risks
> These may remain open during epic creation but must close before EXHIBITION_BUILD_COMMIT, plus the technical risks the spike addresses.
- WORK-OQ-9: technical-spike owner — mitigation: named before build commitment (TECH_OWNER).
- WORK-OQ-10: hardware-validation owner — mitigation: named before build commitment (OPERATIONS_OWNER).
- WORK-OQ-11: final hardware specifications — mitigation: resolved and validated before thresholds are fixed.
- WORK-RISK-1 (HIGH): Al Reem 3D quality insufficient — mitigation: Khalifa spine + graceful degrade + Yas fallback, validated in Stage 1.1.
- WORK-RISK-2 (HIGH): unapproved/confidential attributes exposed — mitigation: frozen sanitized dataset + attribute allowlist + named data approval (depends on WORK-OQ-1/2).
- WORK-RISK-3 (HIGH): external Esri/network failure at the event — mitigation: local-first + precompute + deterministic fallback + backup video (Stage 1.5).
- WORK-RISK-4 (HIGH): exhibition-only priority mistaken for official methodology — mitigation: deterministic rules + persistent disclaimer + traceable evidence + no AI approval.
- WORK-RISK-5/6/8 (MEDIUM): stale 219/139 counts, full-portfolio 3D overload, hardware cannot sustain 3D — mitigation: validated-snapshot-only, curate 20–40 + decluttering, profile early.
- DEP-ESRI-OFFLINE-LICENSE (DERIVED — Stage 1.1 spike, 2026-09-04): whether Esri's hosted 3D Buildings layer may be extracted/clipped and re-hosted for offline use is UNRESOLVED (technical + licensing/ToS); no permission assumed — mitigation: own-built extruded-footprint offline floor (owner GIS / openly-licensed Overture) needs no Esri permission; clip/re-host is an owner/Esri follow-up only.

### Assumptions to Verify
- Esri 3D Buildings item coverage for both AOIs — verify via the Stage 1.1 3D spike (WORK-INT-2, RISK-1).
- School-simulation spatial input availability — verify at Stage 1.1; otherwise replace with precomputed deterministic equivalents (WORK-DEP-6/7).
- Cinematic fidelity versus event hardware — verify via the Stage 1.1 hardware benchmark (WORK-NFR-2/4, WORK-UX-10).

---

## Must Preserve / Must Not Change

> Epic-level constraints inherited by all stages.

**Must Preserve:**
- The authority boundary: GIS computes, business rules score, AI explains (WORK-BR-1/2/3).
- The approved WORK-BR-15 disclaimer wording on every scored screen.
- Exactly three capabilities plus the cross-cutting Ask-AI; Khalifa mandatory, Al Reem conditional, Yas fallback-only.
- English UI with Arabic-ready architecture (WORK-DEC-4, WORK-CON-11).
- The deterministic offline core and validated-data-only display.

**Must Not Change:**
- Owner-RESOLVED decisions WORK-DEC-1..12 without owner re-approval.
- The WORK-BR-15 disclaimer wording without an authorized replacement.
- The scope: no out-of-scope items (WORK-OOS-1..18) and no coupling to the Location and Boundary (V0.2) initiative.

---

## Recommended Architectural Sequence

> Milestones, each a proof or gate — not commands to execute.

| # | Milestone | Proves | Unblocks |
|---|-----------|--------|----------|
| 1 | Spike & Snapshot Proof | 3D delivery, network independence, and hardware can carry the journey; a validated frozen snapshot exists | The 3D shell and Explore capability |
| 2 | Explore Coherence Proof | a dark cinematic `SceneView` with AOI switching (Al Reem-off included) works from frozen data | The deterministic assessment |
| 3 | Deterministic Decision Proof | Low/Medium/High is reproducible, evidence-backed, and attributed to rules not AI | The simulator and Ask-AI over assessment results |
| 4 | Impact Simulation Proof | a precomputed before/after school story runs offline without misrepresenting the hypothetical | The full scripted journey |
| 5 | Exhibition Resilience Proof | the full 60–90s journey survives a disconnected network with no live LLM, with a verified fallback and backup video | Exhibition-build commitment (subject to build-commit blockers) |

---

## Freshness Declaration

- **Last verified against repo:** 2026-09-04
- **Verification method:** ai epic create
- **Stages verified via state.json:** none exist — the target repo is greenfield (no `git`, no ROADMAP, no epic or stage state), so no stage state.json was available to cross-check; all five stages (1.1–1.5) are pre-seed.
- **Latest completed stage:** None
- **Stale exploration conflicts resolved:** the `stage_seed.md` "Repo Impact — mobile" line (resolved to standalone web frontend, mobile out of scope); the `stage_seed.md` Assessment+Simulation combined split (resolved to the epic_output.md 5-stage split); Gemini's "Arabic-ready is overengineering" (overridden by owner-RESOLVED WORK-DEC-4); Gemini's replacement disclaimer wording (overridden by WORK-BR-15); screenshot mockup counts 219/139 (overridden by validated-snapshot-only, WORK-AC-19/DEC-7).
- **Known stale sections:** None

---

> **Validation:** Run `ai epic validate` on this file before seeding stages.
> **Next step:** seed stages from this epic once the eight blocking EPIC_CREATE open questions are resolved.
