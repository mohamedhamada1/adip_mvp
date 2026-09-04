# DECISION — Stage 1.1 accepted (PASS WITH CONDITIONS); Stage 1.2 authorized

**Date:** 2026-09-04
**Decided-By:** Project owner (requesting owner)
**Owner's words:** "accept Stage 1.1 as PASS-WITH-CONDITIONS and authorize Stage 1.2"

## Decision
- **Stage 1.1 (Technical/Data Spike + Snapshot Freeze): ACCEPTED — PASS WITH CONDITIONS.**
  Evidence: `evidence/stage-1.1_spike_findings.md` (FINAL section) + `evidence/stage-1.1_oq5_dataset_inventory.md`.
- **Stage 1.2 (3D Shell + Explore + AOI Switch): AUTHORIZED to proceed.**

## Scope of this authorization
- **Stage 1.2 ONLY.** NOT Stage 1.3/1.4/1.5. NOT epic Owner-bind (no `--own`; no auto-progression).
- When Stage 1.2 work is complete, **STOP at the owner review gate** (same pattern as Stage 1.1).

## Owner data approval (2026-09-04, mid-turn)
Owner's words: "For the LIVEX MVP, I approve proceeding with the identified public/open datasets for
development and exhibition demonstration use. ADPIC is the organization presenting the MVP, and this is a
demonstration use rather than a commercial redistribution product. Preserve any required source
attribution in the experience. Where offline extraction/bundling rights for a third-party source are not
explicitly confirmed, do not record them as legally confirmed. Keep the provenance/license status accurate
and use the already identified fallback where necessary. This approval is sufficient from my side to
proceed with the MVP workflow."

**Effect:** APPROVED to proceed with AD-SDI / SCAD / OSM / Overture for development AND exhibition
**demonstration** use (ADPIC presenting; not commercial redistribution), with attribution. This clears the
path to build. Licensing accuracy is preserved, NOT overstated.

## Conditions — refined status
- **C1 — AD-SDI offline bundle:** AD-SDI offline extraction/bundling rights are **NOT explicitly confirmed**
  by ADDA/AD-SDI → **must NOT be recorded as legally confirmed.** AD-SDI is used for development and as the
  connected/demonstration source with attribution. For the **hard-offline guarantee**, use the confirmed
  fallback: **own-built extruded footprints + geometry from ODbL OSM/Overture** (offline-redistributable
  with attribution) and/or owner-supplied GIS — NOT an assumed AD-SDI offline bundle. Optional future
  upgrade: obtain written ADDA/AD-SDI confirmation to bundle AD-SDI offline.
- **C2 — SCAD license:** offline-bundling rights not explicitly confirmed → not recorded as confirmed.
  Use SCAD district population for development/demonstration with attribution; the community-grain demand
  model is DERIVED/labeled. If offline bundling is needed and unconfirmed, represent demand via the DERIVED
  model rather than shipping raw SCAD tables.
- **C3 — Data attribution:** UI MUST display required attributions (© OpenStreetMap contributors /
  Overture Maps Foundation / AD-SDI / SCAD) where their data ships — enforced from the first Explore screen.

## Binding boundaries reaffirmed (carry into Stage 1.2 build)
- Al Reem = cinematic Explore opening (final GO hardware-gated, OQ-10/11); Khalifa = Evaluate/Simulate
  spine; Yas = fallback only.
- Deterministic/local-first architecture; core journey works with NO live LLM.
- No browser-direct `.slpk`; connected default = tokenless Esri 3D SceneLayer; hard-offline = own-built
  extruded-footprint floor.
- **No mockup numbers** from the screenshots (139/219/AED 85B/etc.) in code — KPIs bind to the authored
  synthetic `IS_DEMO` portfolio (provenance: SYNTHETIC/DEMO). Provenance labels (OFFICIAL/PUBLIC · DERIVED ·
  SYNTHETIC/DEMO) surfaced so demo↔real swap needs no redesign.
- Screenshots are visual/UX reference only; WORK.md authoritative.

## Note on engine state
Stage 1.1 ran as a direct investigation (outside the autopilot artifact pipeline). This decision file is
the authoritative acceptance record. If the engine stage-lifecycle field cannot be set without autopilot
artifacts, that is a cosmetic divergence only — the human gate is satisfied here.
