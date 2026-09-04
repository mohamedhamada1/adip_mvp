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

