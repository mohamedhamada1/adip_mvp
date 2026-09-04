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

