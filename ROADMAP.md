# ROADMAP

> Created by `ai stage seed` — ROADMAP.md was absent.


### Stage 1.1 — Technical / Data Spike + Snapshot Freeze

**Status:** Planned
**Source:** epic (.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md)
**Date:** 2026-09-04
**Artifact Type:** spike + validated frozen dataset + config
**Execution Model:** hybrid
**Depends on:** None

#### Core Invariant
- No runtime dependency on a direct `.slpk` load or a live Portal WebScene; every snapshot value is validated before it is eligible for display.

#### Ownership
- Owns: a go/no-go on the Al Reem opening; the chosen 3D delivery mechanism; a frozen sanitized dataset; validated KPI counts; and a precompute plan for the school scenario.

#### Inputs → Outputs
- **Inputs:** WORK-INT-2 Esri 3D Buildings item, AOI/portfolio data, population/facility/network inputs, event hardware, and owner data approvals.
- **Outputs:** a go/no-go on the Al Reem opening; the chosen 3D delivery mechanism; a frozen sanitized dataset; validated KPI counts; and a precompute plan for the school scenario.

#### Transformation Order
1. WORK-INT-2 Esri 3D Buildings item, AOI/portfolio data, population/facility/network inputs, event hardware, and owner data approvals. → VALIDATE: No runtime dependency on a direct `.slpk` load or a live Portal WebScene; every snapshot value is validated before it is eligible for display.
2. a go/no-go on the Al Reem opening; the chosen 3D delivery mechanism; a frozen sanitized dataset; validated KPI counts; and a precompute plan for the school scenario. → VALIDATE: a documented spike result records the 3D mechanism, the Al Reem go/no-go, and a frozen validated snapshot whose displayed counts equal the snapshot (not 219/139).

#### Breaking Rules
- A breaking change is any violation of § Must Not: owner-RESOLVED decisions WORK-DEC-1..12 without owner re-approval.

#### Must Preserve
- the authority boundary and the sanitized-attribute allowlist as the spike's success conditions.

#### Must Not
- owner-RESOLVED decisions WORK-DEC-1..12 without owner re-approval.

#### Validation & Determinism
- No runtime dependency on a direct `.slpk` load or a live Portal WebScene; every snapshot value is validated before it is eligible for display.

#### Success Proof
- a documented spike result records the 3D mechanism, the Al Reem go/no-go, and a frozen validated snapshot whose displayed counts equal the snapshot (not 219/139).

#### Example
```
a documented spike result records the 3D mechanism, the Al Reem go/no-go, and a frozen validated snapshot whose displayed counts equal the snapshot (not 219/139).
```


#### Stage Contract Propagation (stage-propagation-matrix/v1)

- **Source of truth:** `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 — this projection never overrides it.

- **Stage ID:** 1.1
- **Title:** Technical / Data Spike + Snapshot Freeze
- **Artifact Type:** spike + validated frozen dataset + config
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (new standalone web frontend) + offline data-prep tooling
- **Estimated Effort:** L — spike, 3D validation, hardware profiling, and the frozen-data pipeline dominate the epic's effort.
- **Depends On:** None
- **Core Invariant:** No runtime dependency on a direct `.slpk` load or a live Portal WebScene; every snapshot value is validated before it is eligible for display.
- **Outputs:** a go/no-go on the Al Reem opening; the chosen 3D delivery mechanism; a frozen sanitized dataset; validated KPI counts; and a precompute plan for the school scenario.

##### Requirements

- RR-1: The Esri 3D Buildings item coverage/quality for Al Reem Island and Khalifa City is validated before it is treated as an exhibition dependency — source: WORK-INT-2.
- RR-2: A local-first 3D delivery mechanism (I3S scene service or extruded-footprint floor) renders both AOIs with the venue network disconnected — source: DERIVED — Core Invariant 2 requires an offline-provable scene; the browser SDK cannot load `.slpk`.
- RR-3: A frozen, sanitized event snapshot exists with validated KPI counts, and displayed counts equal the snapshot rather than the provisional 219/139 — source: WORK-DATA-1/2, WORK-AC-19, WORK-DEC-7.
- RR-4: The school-scenario spatial inputs are either approved-and-available or replaced with precomputed deterministic equivalents, decided at the spike — source: WORK-DEP-6/7, WORK-INT-7.
- RR-5: Critical presenter interactions are profiled on representative hardware to set later performance thresholds — source: WORK-NFR-2, WORK-DEC-11.

##### Not Doing

- **Out of scope:** live Enterprise runtime dependency; unsanitized attributes; Google Photorealistic 3D as a core dependency.
- **Intentionally deferred:** final hardware thresholds (set after WORK-OQ-11 hardware specs are known).
- **Must not expand into:** a third core AOI (Yas remains fallback-only) or the V0.2 initiative.

##### Roadmap Position

- **Milestone:** Foundation & Spike.
- **Dependencies:** owner data approvals (WORK-OQ-5/6) and spike ownership (WORK-OQ-9).
- **Unblocked after this stage:** the 3D shell and Explore capability.
- **Future stages that depend on it:** 1.2, 1.3, 1.4, 1.5.

##### Governance References (canonical in the epic — referenced, not duplicated)

- **Business Context** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Business Context (referenced, not duplicated)
- **Revenue Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Revenue Impact (referenced, not duplicated)
- **Readiness Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Readiness Impact (referenced, not duplicated)
- **Multi-Vertical Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Multi-Vertical Impact (referenced, not duplicated)
- **Customer Value** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Customer Value (referenced, not duplicated)
- **Go-Live Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.1 → Go-Live Impact (referenced, not duplicated)


### Stage 1.2 — 3D Shell + Explore + AOI Switch

**Status:** Planned
**Source:** epic (.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md)
**Date:** 2026-09-04
**Artifact Type:** app shell + Explore capability
**Execution Model:** hybrid
**Depends on:** 1.1

#### Core Invariant
- AOI switching preserves the workflow without a full application reload, and the experience stays coherent with the Al Reem opening disabled.

#### Ownership
- Owns: an Explore state with a dark cinematic `SceneView`, KPI strip, filters, animated project markers, fly-to, and an AOI switcher.

#### Inputs → Outputs
- **Inputs:** the frozen dataset, the chosen 3D mechanism, and screenshots 01/02/07/08.
- **Outputs:** an Explore state with a dark cinematic `SceneView`, KPI strip, filters, animated project markers, fly-to, and an AOI switcher.

#### Transformation Order
1. the frozen dataset, the chosen 3D mechanism, and screenshots 01/02/07/08. → VALIDATE: AOI switching preserves the workflow without a full application reload, and the experience stays coherent with the Al Reem opening disabled.
2. an Explore state with a dark cinematic `SceneView`, KPI strip, filters, animated project markers, fly-to, and an AOI switcher. → VALIDATE: a presenter can open Explore, filter, select a project, and switch AOI without reload, with all KPIs sourced from the frozen snapshot.

#### Breaking Rules
- A breaking change is any violation of § Must Not: the frozen-dataset contract and the runtime/tooling boundary.

#### Must Preserve
- the premium dark cinematic language and validated-data-only KPI display.

#### Must Not
- the frozen-dataset contract and the runtime/tooling boundary.

#### Validation & Determinism
- AOI switching preserves the workflow without a full application reload, and the experience stays coherent with the Al Reem opening disabled.

#### Success Proof
- a presenter can open Explore, filter, select a project, and switch AOI without reload, with all KPIs sourced from the frozen snapshot.

#### Example
```
a presenter can open Explore, filter, select a project, and switch AOI without reload, with all KPIs sourced from the frozen snapshot.
```


#### Stage Contract Propagation (stage-propagation-matrix/v1)

- **Source of truth:** `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 — this projection never overrides it.

- **Stage ID:** 1.2
- **Title:** 3D Shell + Explore + AOI Switch
- **Artifact Type:** app shell + Explore capability
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** L — the standalone app skeleton, the cinematic scene, and AOI switching without reload.
- **Depends On:** 1.1
- **Core Invariant:** AOI switching preserves the workflow without a full application reload, and the experience stays coherent with the Al Reem opening disabled.
- **Outputs:** an Explore state with a dark cinematic `SceneView`, KPI strip, filters, animated project markers, fly-to, and an AOI switcher.

##### Requirements

- RR-1: The standalone Vite/React/TS app renders a dark cinematic `SceneView` with contextual buildings muted and projects emphasized — source: WORK-CON-7, WORK-UX-1/2.
- RR-2: A compact KPI strip, dataset-appropriate filters, and selectable animated project markers with fly-to are present — source: WORK-REQ-3/4/5, WORK-REQ-2.
- RR-3: AOI switching between Khalifa City and (conditionally) Al Reem Island occurs without a full reload and preserves the core workflow — source: WORK-REQ-6, WORK-AC-3, WORK-NFR-3.
- RR-4: The Al Reem opening degrades gracefully to a disabled/hidden switcher state when its 3D spike did not pass — source: WORK-EX-4, WORK-DEC-5.
- RR-5: Every displayed KPI value equals the frozen validated snapshot — source: WORK-AC-19, WORK-DEC-7.

##### Not Doing

- **Out of scope:** the assessment and simulation capabilities (later stages); mobile layouts.
- **Intentionally deferred:** live Esri basemap enhancements behind the feature flag.
- **Must not expand into:** nine independent routes; overlays/panels/state transitions are used instead.

##### Roadmap Position

- **Milestone:** Foundation & Spike.
- **Dependencies:** Stage 1.1 outputs (frozen data, 3D mechanism).
- **Unblocked after this stage:** the deterministic assessment and the simulator.
- **Future stages that depend on it:** 1.3, 1.4, 1.5.

##### Governance References (canonical in the epic — referenced, not duplicated)

- **Business Context** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Business Context (referenced, not duplicated)
- **Revenue Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Revenue Impact (referenced, not duplicated)
- **Readiness Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Readiness Impact (referenced, not duplicated)
- **Multi-Vertical Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Multi-Vertical Impact (referenced, not duplicated)
- **Customer Value** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Customer Value (referenced, not duplicated)
- **Go-Live Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.2 → Go-Live Impact (referenced, not duplicated)


### Stage 1.3 — Deterministic Assessment + Evidence

**Status:** Planned
**Source:** epic (.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md)
**Date:** 2026-09-04
**Artifact Type:** scoring engine + Assessment UI
**Execution Model:** hybrid
**Depends on:** 1.2

#### Core Invariant
- The assessment result is reproducible from the same frozen inputs plus configuration and is attributed to deterministic rules, never to AI.

#### Ownership
- Owns: a Low/Medium/High assessment with per-dimension evidence and the persistent approved disclaimer.

#### Inputs → Outputs
- **Inputs:** the frozen dataset, a business-rule/weight configuration, and screenshots 03/04.
- **Outputs:** a Low/Medium/High assessment with per-dimension evidence and the persistent approved disclaimer.

#### Transformation Order
1. the frozen dataset, a business-rule/weight configuration, and screenshots 03/04. → VALIDATE: The assessment result is reproducible from the same frozen inputs plus configuration and is attributed to deterministic rules, never to AI.
2. a Low/Medium/High assessment with per-dimension evidence and the persistent approved disclaimer. → VALIDATE: selecting a planned project yields a reproducible Low/Medium/High with visible per-dimension evidence and disclaimer, with no AI-as-approver phrasing.

#### Breaking Rules
- A breaking change is any violation of § Must Not: the scoring engine as the sole owner of the result; the template/AI layer must not produce the result.

#### Must Preserve
- the authority boundary and the WORK-BR-15 disclaimer wording.

#### Must Not
- the scoring engine as the sole owner of the result; the template/AI layer must not produce the result.

#### Validation & Determinism
- The assessment result is reproducible from the same frozen inputs plus configuration and is attributed to deterministic rules, never to AI.

#### Success Proof
- selecting a planned project yields a reproducible Low/Medium/High with visible per-dimension evidence and disclaimer, with no AI-as-approver phrasing.

#### Example
```
selecting a planned project yields a reproducible Low/Medium/High with visible per-dimension evidence and disclaimer, with no AI-as-approver phrasing.
```


#### Stage Contract Propagation (stage-propagation-matrix/v1)

- **Source of truth:** `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 — this projection never overrides it.

- **Stage ID:** 1.3
- **Title:** Deterministic Assessment + Evidence
- **Artifact Type:** scoring engine + Assessment UI
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** M — a pure-TS config-driven engine plus the evidence UI.
- **Depends On:** 1.2
- **Core Invariant:** The assessment result is reproducible from the same frozen inputs plus configuration and is attributed to deterministic rules, never to AI.
- **Outputs:** a Low/Medium/High assessment with per-dimension evidence and the persistent approved disclaimer.

##### Requirements

- RR-1: A pure-TypeScript, config-driven engine produces Low/Medium/High deterministically from approved inputs and configured rules — source: WORK-REQ-11, WORK-BR-3, WORK-CON-9.
- RR-2: Each result exposes the contributing indicators/evidence, not only the category — source: WORK-REQ-10, WORK-AC-6.
- RR-3: The approved WORK-BR-15 disclaimer wording is persistently visible on the assessment screen — source: WORK-BR-15, WORK-AC-7.
- RR-4: The result is attributed to GIS/rules and no screen presents AI as the approver/decider — source: WORK-BR-1/2, WORK-SEC-7.
- RR-5: Configurable weights are not presented as official ADPIC methodology unless separately validated — source: WORK-BR-9/10.
- RR-6: Negative/edge cases (missing indicator inputs) yield a defined, evidence-visible outcome rather than an invented score — source: DERIVED — WORK-NFR-11 traceability implies every displayed result must be backed by present inputs.

##### Not Doing

- **Out of scope:** production AI approval or autonomous investment decisions (WORK-OOS-3); numerical score as official methodology.
- **Intentionally deferred:** methodology validation and approver sign-off (WORK-OQ-3).
- **Must not expand into:** an AI-decided or AI-approved result.

##### Roadmap Position

- **Milestone:** Decision Support.
- **Dependencies:** Stage 1.2 shell + frozen data; WORK-OQ-3 methodology approver for claim wording.
- **Unblocked after this stage:** the simulator and the Ask-AI explanation of assessment results.
- **Future stages that depend on it:** 1.4, 1.5.

##### Governance References (canonical in the epic — referenced, not duplicated)

- **Business Context** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Business Context (referenced, not duplicated)
- **Revenue Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Revenue Impact (referenced, not duplicated)
- **Readiness Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Readiness Impact (referenced, not duplicated)
- **Multi-Vertical Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Multi-Vertical Impact (referenced, not duplicated)
- **Customer Value** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Customer Value (referenced, not duplicated)
- **Go-Live Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.3 → Go-Live Impact (referenced, not duplicated)


### Stage 1.4 — Liveability Impact Simulator (School, precomputed)

**Status:** Planned
**Source:** epic (.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md)
**Date:** 2026-09-04
**Artifact Type:** simulation capability
**Execution Model:** hybrid
**Depends on:** 1.3

#### Core Invariant
- The hypothetical school is never presented as an approved real project, and all before/after values come from precomputed frozen simulation data.

#### Ownership
- Owns: a Current vs With-Proposed-School comparison with service-area, underserved, accessibility, and KPI deltas.

#### Inputs → Outputs
- **Inputs:** precomputed service areas / population inputs (or deterministic equivalents from Stage 1.1) and screenshot 05.
- **Outputs:** a Current vs With-Proposed-School comparison with service-area, underserved, accessibility, and KPI deltas.

#### Transformation Order
1. precomputed service areas / population inputs (or deterministic equivalents from Stage 1.1) and screenshot 05. → VALIDATE: The hypothetical school is never presented as an approved real project, and all before/after values come from precomputed frozen simulation data.
2. a Current vs With-Proposed-School comparison with service-area, underserved, accessibility, and KPI deltas. → VALIDATE: the simulator shows Current → Simulate → proposed intervention → changed coverage → KPI change → concise explanation, entirely from precomputed data.

#### Breaking Rules
- A breaking change is any violation of § Must Not: the precomputed-data contract for the fallback path.

#### Must Preserve
- the demo/hypothetical identification of the school and validated-data-only display.

#### Must Not
- the precomputed-data contract for the fallback path.

#### Validation & Determinism
- The hypothetical school is never presented as an approved real project, and all before/after values come from precomputed frozen simulation data.

#### Success Proof
- the simulator shows Current → Simulate → proposed intervention → changed coverage → KPI change → concise explanation, entirely from precomputed data.

#### Example
```
the simulator shows Current → Simulate → proposed intervention → changed coverage → KPI change → concise explanation, entirely from precomputed data.
```


#### Stage Contract Propagation (stage-propagation-matrix/v1)

- **Source of truth:** `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 — this projection never overrides it.

- **Stage ID:** 1.4
- **Title:** Liveability Impact Simulator (School, precomputed)
- **Artifact Type:** simulation capability
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** M — before/after simulation UI over precomputed service-area data.
- **Depends On:** 1.3
- **Core Invariant:** The hypothetical school is never presented as an approved real project, and all before/after values come from precomputed frozen simulation data.
- **Outputs:** a Current vs With-Proposed-School comparison with service-area, underserved, accessibility, and KPI deltas.

##### Requirements

- RR-1: The simulator compares Current and With-Proposed-Project for the approved hypothetical school scenario — source: WORK-REQ-12, WORK-AC-8, WORK-DEC-2.
- RR-2: The simulation map shows current coverage, underserved areas, proposed location, new service area, and newly covered communities where approved data supports them — source: WORK-REQ-14, WORK-AC-9.
- RR-3: The simulator reports population within service area, coverage, average access distance, underserved population, and a Liveability Impact Score where approved data supports them — source: WORK-REQ-13.
- RR-4: The interaction follows the exhibition sequence current → Simulate → intervention → changed coverage → KPI change → explanation — source: WORK-REQ-15.
- RR-5: The school is labeled hypothetical/demo and never reads as an approved real project — source: WORK-BR-14, WORK-DATA-32.
- RR-6: Every before/after value is sourced from precomputed frozen simulation data rather than any mockup figure — source: WORK-AC-19; DERIVED — Core Invariant 4 applied to simulation outputs.

##### Not Doing

- **Out of scope:** emirate-wide scenario optimization (WORK-OOS-14); live routing as a dependency.
- **Intentionally deferred:** additional proposal types beyond the approved school scenario.
- **Must not expand into:** presenting the hypothetical school as a real approved project.

##### Roadmap Position

- **Milestone:** Decision Support.
- **Dependencies:** Stage 1.3 assessment context; precompute from Stage 1.1; WORK-DEP-6/7 data.
- **Unblocked after this stage:** the full scripted journey and hardening.
- **Future stages that depend on it:** 1.5.

##### Governance References (canonical in the epic — referenced, not duplicated)

- **Business Context** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Business Context (referenced, not duplicated)
- **Revenue Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Revenue Impact (referenced, not duplicated)
- **Readiness Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Readiness Impact (referenced, not duplicated)
- **Multi-Vertical Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Multi-Vertical Impact (referenced, not duplicated)
- **Customer Value** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Customer Value (referenced, not duplicated)
- **Go-Live Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.4 → Go-Live Impact (referenced, not duplicated)


### Stage 1.5 — Ask ADPIC AI Templates + Hardening / Fallback

**Status:** Planned
**Source:** epic (.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md)
**Date:** 2026-09-04
**Artifact Type:** explanation layer + exhibition hardening
**Execution Model:** hybrid
**Depends on:** 1.2, 1.3, 1.4

#### Core Invariant
- The full journey runs offline with no live LLM, and every transition has a deterministic fallback.

#### Ownership
- Owns: a constrained cross-cutting Ask-AI (suggested questions + allowlisted actions, template-first), a one-way demo state machine, a preload/cache layer, connectivity-interruption tests, hardware profiling, a deterministic fallback, and a backup video.

#### Inputs → Outputs
- **Inputs:** all prior stages, screenshots 06/09, and the presenter script.
- **Outputs:** a constrained cross-cutting Ask-AI (suggested questions + allowlisted actions, template-first), a one-way demo state machine, a preload/cache layer, connectivity-interruption tests, hardware profiling, a deterministic fallback, and a backup video.

#### Transformation Order
1. all prior stages, screenshots 06/09, and the presenter script. → VALIDATE: The full journey runs offline with no live LLM, and every transition has a deterministic fallback.
2. a constrained cross-cutting Ask-AI (suggested questions + allowlisted actions, template-first), a one-way demo state machine, a preload/cache layer, connectivity-interruption tests, hardware profiling, a deterministic fallback, and a backup video. → VALIDATE: the entire scripted journey runs with the network physically disconnected and no live LLM, and every transition has a working deterministic fallback.

#### Breaking Rules
- A breaking change is any violation of § Must Not: the guaranteed template path as the non-LLM explanation source.

#### Must Preserve
- the authority boundary, the deterministic offline core, and validated-data-only display.

#### Must Not
- the guaranteed template path as the non-LLM explanation source.

#### Validation & Determinism
- The full journey runs offline with no live LLM, and every transition has a deterministic fallback.

#### Success Proof
- the entire scripted journey runs with the network physically disconnected and no live LLM, and every transition has a working deterministic fallback.

#### Example
```
the entire scripted journey runs with the network physically disconnected and no live LLM, and every transition has a working deterministic fallback.
```


#### Stage Contract Propagation (stage-propagation-matrix/v1)

- **Source of truth:** `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 — this projection never overrides it.

- **Stage ID:** 1.5
- **Title:** Ask ADPIC AI Templates + Hardening / Fallback
- **Artifact Type:** explanation layer + exhibition hardening
- **Execution Model:** hybrid
- **Affected Repos:** single-repo (web frontend)
- **Estimated Effort:** L — the constrained explanation layer plus the full exhibition-hardening package.
- **Depends On:** 1.2, 1.3, 1.4
- **Core Invariant:** The full journey runs offline with no live LLM, and every transition has a deterministic fallback.
- **Outputs:** a constrained cross-cutting Ask-AI (suggested questions + allowlisted actions, template-first), a one-way demo state machine, a preload/cache layer, connectivity-interruption tests, hardware profiling, a deterministic fallback, and a backup video.

##### Requirements

- RR-1: Ask ADPIC AI is a cross-cutting explanation layer, not a fourth module, favoring suggested questions and allowlisted map actions over open autonomous chat — source: WORK-REQ-16/18, WORK-CON-1.
- RR-2: Explanation context is assembled by the app from selected project, map context, approved attributes, calculated GIS indicators, and configured strategy — source: WORK-REQ-17.
- RR-3: Deterministic pre-authored templates execute the entire scripted demo when a live LLM is unavailable or unapproved — source: WORK-REQ-20, WORK-AC-12, WORK-DEC-8.
- RR-4: When requested information is absent from the approved context, the output states it is not in the demo dataset rather than inventing it — source: WORK-AC-10/11, WORK-EX-2, WORK-SEC-3.
- RR-5: The full scripted journey tolerates connectivity interruption and completes within 60–90s on validated hardware, with preload/cache where appropriate — source: WORK-NFR-1/5/7/8, WORK-ROLL-6.
- RR-6: A fixed deterministic fallback demonstration and a backup video are prepared and verified before go-live — source: WORK-AC-16, WORK-REQ-23.
- RR-7: Any live LLM adapter receives only approved sanitized structured context and returns an explanation plus an allowlisted action — source: WORK-INT-8, WORK-SEC-4.

##### Not Doing

- **Out of scope:** unrestricted autonomous chat; a live LLM as a core dependency; production AI approval (WORK-OOS-3).
- **Intentionally deferred:** a secured live LLM integration (gated on WORK-OQ-7/8 approvals).
- **Must not expand into:** an Ask-AI that decides or approves.

##### Roadmap Position

- **Milestone:** Explanation & Exhibition Hardening.
- **Dependencies:** Stages 1.2–1.4; WORK-OQ-9/10/11 (spike/hardware ownership and specs) before exhibition-build commitment.
- **Unblocked after this stage:** exhibition-build commitment (subject to closing the build-commit blockers).
- **Future stages that depend on it:** none — this is the final MVP stage.

##### Governance References (canonical in the epic — referenced, not duplicated)

- **Business Context** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Business Context (referenced, not duplicated)
- **Revenue Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Revenue Impact (referenced, not duplicated)
- **Readiness Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Readiness Impact (referenced, not duplicated)
- **Multi-Vertical Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Multi-Vertical Impact (referenced, not duplicated)
- **Customer Value** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Customer Value (referenced, not duplicated)
- **Go-Live Impact** — canonical in `.ai/epics/adpic-livex-2026-capital-intelligence-mvp/architecture.md` § Stage 1.5 → Go-Live Impact (referenced, not duplicated)

