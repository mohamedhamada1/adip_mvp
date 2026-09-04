# DECISION — Resolve minimum gates to seed & start Stage 1.1

**Date:** 2026-09-04
**Resolved-By:** Project owner (requesting owner)
**Scope:** Unblocks seeding + starting **Stage 1.1 — Technical/Data Spike + Snapshot
Freeze** ONLY. Does NOT authorize any later build stage, publication, or data/security
approval.

## Resolutions (provenance recorded in WORK.md OQ-5/6/9)

- **WORK-OQ-5 (per-dataset availability):** For every required dataset (Khalifa City
  portfolio, Al Reem Island portfolio, AOI boundaries, population/demand, existing
  facilities, roads/network/service-area inputs, strategic-theme mapping) the status is
  **availability/approval TO BE VALIDATED by the Stage 1.1 spike**. Existence ≠
  production/exhibition approval. Stage 1.1 must inventory each dataset's actual status,
  source, suitability, gaps, and whether a frozen/sanitized event replacement is required.
- **WORK-OQ-6 (GIS/data owner):** Project owner is the **temporary project-side GIS/data
  owner** for coordinating the frozen event snapshot + Stage 1.1 validation. NOT a
  security/publication approval — WORK-OQ-1 (attribute allowlist) and WORK-OQ-2 (named
  data approver) remain SEPARATE and OPEN.
- **WORK-OQ-9 (technical-spike owner):** Project owner is the **project-side
  technical-spike owner** for Stage 1.1.

## Explicitly NOT resolved (remain OPEN — do not answer on the owner's behalf)

WORK-OQ-1, WORK-OQ-2, WORK-OQ-3, WORK-OQ-4, WORK-OQ-7, WORK-OQ-8 (EPIC_CREATE gate for
later stages), and WORK-OQ-10, WORK-OQ-11 (hardware ownership/specs — final event-hardware
acceptance).

## Stage 1.1 must prove or report (owner-specified scope)

1. Khalifa + Al Reem 3D quality and coverage.
2. Practical deterministic/local-first 3D delivery mechanism — do NOT assume browser-direct
   `.slpk` loading (confirmed unsupported; see exploration grounding).
3. Frozen/sanitized event dataset pipeline + validated portfolio-count strategy.
4. Availability + quality of school-simulation inputs.
5. Service-area/network calculation approach + deterministic/precomputed fallback.
6. Network-independent operation of the core 60–90 second journey.
7. External Esri dependencies, auth, CORS, API keys/credits — what can be removed from the
   critical path.
8. Initial 3D/rendering performance benchmark on available/equivalent hardware
   (final event-hardware acceptance remains WORK-OQ-10/11).
9. Deterministic kill-switch/fallback behavior without application reload.
10. Whether Al Reem is strong enough to remain the opening Explore experience; Khalifa
    remains the guaranteed Evaluate/Simulate spine.

## Reference status
LIVEX UI screenshots are preserved as **visual quality/reference direction**, NOT
authoritative product/data requirements. WORK.md remains authoritative.

## Progression rule
Do NOT auto-start later build stages after Stage 1.1. Stop at Stage 1.1's human/review
gate and present spike findings, evidence, risks, and recommended architecture before
proceeding.
