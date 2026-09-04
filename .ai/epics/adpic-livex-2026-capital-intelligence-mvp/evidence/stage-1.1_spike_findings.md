# Stage 1.1 — Technical / Data Spike + Snapshot Freeze — FINDINGS

**Date:** 2026-09-04 · **Spike owner:** Project owner (WORK-OQ-9)
**Status:** TECHNICAL FINDINGS ACCEPTED (PROVISIONAL) by owner 2026-09-04 — **Stage 1.1 REMAINS OPEN**,
pending the WORK-OQ-5 dataset inventory (see `stage-1.1_oq5_dataset_inventory.md`). This is **NOT** final
Stage 1.1 completion. Final PASS / PASS-WITH-CONDITIONS / FAIL is issued only after the dataset review.

## Owner-accepted boundaries (2026-09-04) — binding
- Al Reem Island: **provisional GO** for the cinematic Explore opening.
- Khalifa City: **guaranteed** Evaluate + Simulate spine.
- Yas Island: fallback only.
- Dev-machine 60 FPS = no immediate rendering red flag, **NOT** exhibition-performance acceptance.
- Final 3D/performance acceptance stays gated by **OQ-10/OQ-11** + testing **during fly-to/interaction**
  on actual/equivalent event hardware.
- Preserve deterministic/local-first architecture + **no-live-LLM** requirement.
- Preserve the `.slpk` finding: **do NOT assume browser-direct SLPK loading**.
- Esri clip/re-host/offline **licensing is an explicit UNRESOLVED dependency/question** — no licensing
  permission is assumed (tracked as DEP-ESRI-OFFLINE-LICENSE below and in the epic).
**Confidence tags:** `[confirmed]` empirical this session · `[estimated]` measured but not on event hardware · `[assumption]` reasoned, unverified · `[pending-data]` needs owner-supplied dataset/approval.

Method: anonymous Esri REST metadata calls (curl) + a live ArcGIS Maps SDK for JS 4.31
`SceneView` harness driven in a real Chromium at 1920×1080, pointed at the WORK-INT-2
item over Al Reem and Khalifa extents. Evidence files in this folder.

---

## 1. Khalifa & Al Reem 3D quality and coverage — `[confirmed]`
- WORK-INT-2 item `b8fec5af7dfe4866b1b8ac2d2800f282` = **"Esri 3D Buildings"**, a **public global
  Scene Service** (Overture/TomTom/Vantor, quarterly), `access: public`, global extent.
  (`stage-1.1_esri3d_item_metadata.json`)
- **Al Reem Island: strong coverage** — dense extruded massing incl. the waterfront high-rise
  towers. Visually the stronger, more cinematic AOI. (`stage-1.1_esri3d_al-reem.png`)
- **Khalifa City: present but low-rise** — villa compounds + low/mid-rise blocks, consistent with
  its residential character; less dramatic. (`stage-1.1_esri3d_khalifa-city.png`)
- **Quality class:** untextured **LOD1/LOD2 grey massing** (no façade textures). This SUITS the
  approved "dark scene, contextual buildings visually muted" aesthetic (WORK-UX-2) and is lighter
  to render/cache than photoreal. It is NOT photoreal, and Google Photorealistic 3D stays out of
  scope (WORK-INT-4/OOS-16) — consistent.
- **Caveat `[assumption]`:** exact building footprints/heights are Overture-derived, not an ADPIC
  authoritative cadastral source; fine as *context*, must not be presented as authoritative geometry.

## 2. Deterministic / local-first 3D delivery mechanism — `[confirmed]` (+ `[assumption]` for offline)
- Browser ArcGIS JS **cannot load `.slpk` directly** (confirmed in exploration grounding).
- **Runtime-viable now `[confirmed]`:** consume the I3S Scene Service by URL directly in `SceneLayer`
  — works with **no token** (see #7). This is the connected-path mechanism, de-risked.
- **Offline options — three, honestly ranked:**
  - **(i) Connected + aggressive caching `[confirmed]`:** the tokenless Esri service (above) with HTTP/
    tile caching + preload. Tolerates blips; not a hard-offline guarantee.
  - **(ii) OWN-BUILT offline floor `[confirmed feasible]` — recommended offline PRIMARY:** generate
    extruded building footprints from **owner GIS or openly-licensed Overture data** and serve them
    locally (own content, no third-party hosting/licensing question). This is the deterministic floor
    from the exploration grounding; it guarantees a 3D scene with the venue network unplugged.
  - **(iii) Clip-and-rehost Esri's layer `[OPEN QUESTION — do NOT assume]`:** Esri 3D Buildings is
    **Esri-hosted content we do NOT own**; there is no standard user extract/clip, and re-hosting clips
    raises a **licensing/ToS** question as much as a technical one. This is a Stage-1.1 follow-up to
    raise with the owner/Esri — NOT a recommendation and NOT a proven mitigation.
  - All viable options avoid Portal WebScene dependency (WORK-INT-5/6).

## 3. Frozen/sanitized event dataset pipeline & validated portfolio-count strategy — `[pending-data]`
- No portfolio dataset is available to the project side yet. Per WORK-OQ-5 resolution, each dataset's
  status is **to be validated**, not assumed approved.
- Recommended pipeline `[assumption]`: Enterprise 10.8.1 (offline prep only) → sanitize (attribute
  allowlist, pending WORK-OQ-1) → freeze snapshot → validate counts → curate 20–40 showcase/AOI.
- **Counts:** 219/139 remain provisional (WORK-DEC-7, AC-19); display only validated frozen values.
  The screenshots' numbers (139, 219, AED 85B, etc.) are mockup, not to be hard-coded.

## 4. School-simulation inputs availability & quality — `[pending-data]`
- Needs population/demand zones, existing facilities, roads/network or service-area inputs
  (WORK-DATA-26..29, DEP-6/7). **None supplied.** Must be inventoried + approved, or replaced with
  **precomputed deterministic equivalents** (WORK-INT-7) — decided here at the spike, not late.

## 5. Service-area / network calculation approach + fallback — `[confirmed]` (approach) / `[pending-data]` (inputs)
- ArcGIS routing/service-area REST exists but needs credentials + consumes credits (WORK-INT-9, DEP-8).
- **Recommendation:** precompute the school service-area polygons offline and **bake them into the
  frozen dataset**; live routing is an optional post-spike enhancement, never on the critical path.

## 6. Network-independent operation of the 60–90s journey — `[confirmed]` (path) / `[assumption]` (hard-offline)
- The single hard external dependency for the scripted journey is the 3D buildings service
  (`basemaps3d.arcgis.com`). Everything else (scores, templates, precomputed sim) is deterministic/local.
- **Hard-offline guarantee** comes from the **own-built extruded-footprint floor** (#2 option ii) +
  frozen data — own content, no third-party hosting/licensing question. With that, the journey runs
  with the venue network disconnected. Confirmed feasible; the floor must be built + verified before
  build-commit. (Clip-and-rehost of Esri's layer is an OPEN licensing question, not the plan — see #2.)

## 7. External Esri dependencies / auth / CORS / keys / credits — `[confirmed]`
- **Esri 3D Buildings service: no token required, `access-control-allow-origin: *`.** Service root,
  layer, and node/tile payloads all returned **HTTP 200 anonymously** with open CORS. Loaded cleanly
  in-browser with **no API key**; only console error was a benign `favicon.ico` 404.
- **`world-elevation` ground:** loaded with **no token**, no error.
- **The one API-key dependency: the dark Esri basemap** (basemap styles service). Deliberately omitted
  here. **Removable from the critical path** by using a dark ground color / self-hosted dark tiles —
  the muted-context aesthetic may not need a photoreal basemap at all.
- **Net:** the biggest feared dependency (3D buildings auth/CORS/credits) is **de-risked** for a
  connected runtime; offline still needs local tile hosting.

## 8. Initial 3D/rendering performance benchmark — `[estimated]`
- **60 FPS steady-state** at BOTH Al Reem and Khalifa, 1920×1080, `qualityProfile:"high"`, on this
  dev Mac (Chromium/WebGL2).
- **Caveats:** settled static scene (not measured mid-fly-to animation); dev Mac, not event hardware.
  Final acceptance remains WORK-OQ-10/11 (event-hardware validation) — NOT resolved here.

## 9. Deterministic kill-switch / fallback without reload — `[confirmed]` (pattern)
- The harness performed AOI + camera + data transitions (Reem↔Khalifa) with **no page reload**,
  proving the SPA model supports in-place state swaps. A `mode` flag (live↔deterministic) swapping
  data sources/explanations without reload is therefore straightforward; to be implemented + demoed
  in a later stage.

## 10. Al Reem opening recommendation — `[confirmed]` basis
- **GO (provisional) for Al Reem as the opening Explore experience.** It has dense, tall, cinematic
  coverage that reads well as muted massing on a dark ground, at 60 FPS on dev hardware.
- **Khalifa City remains the guaranteed Evaluate/Simulate spine** (coverage present, lower drama).
- **Yas stays fallback-only** (WORK-BR-13). Final GO is conditional on event-hardware validation
  (OQ-10/11) and the frozen-data/local-hosting build.

---

## Dataset request list (owner action to progress beyond Stage 1.1)
Needed, with per-item status/source/approval (WORK-OQ-5):
1. Khalifa City portfolio · 2. Al Reem Island portfolio · 3. AOI boundaries ·
4. Population/demand zones · 5. Existing facilities · 6. Roads/network or service-area inputs ·
7. Strategic-theme mapping.
Plus the still-OPEN gates: WORK-OQ-1 (attribute allowlist), OQ-2 (data approver), OQ-3 (methodology
approver), OQ-4 (final business owner), OQ-7/8 (LLM allowlist + security/AI approver), OQ-10/11
(hardware owner + specs).

## Open dependencies carried forward (Stage 1.1-derived)
- **DEP-ESRI-OFFLINE-LICENSE `[UNRESOLVED]`:** whether Esri 3D Buildings (Esri-hosted, not owned by us)
  may be extracted/clipped and re-hosted for offline/local use. Technical extractability AND
  licensing/ToS both unconfirmed. **No permission assumed.** Owner/Esri follow-up. Does not block the
  own-built extruded-footprint offline floor (option ii), which needs no Esri permission.
- **OQ-10 / OQ-11 `[OPEN]`:** event-hardware owner + specs → final 3D/performance acceptance
  (fly-to/interaction on actual hardware). Dev-machine result is preliminary only.
- **OQ-1/2 `[OPEN]`:** public-attribute allowlist + named data approver → gates what can be shown.
- **OQ-3/4 `[OPEN]`:** methodology/claim approver + final business owner.
- **OQ-7/8 `[OPEN]`:** LLM prompt-info allowlist + security/AI approver (only if a live LLM is ever added).

## Recommended architecture (carried into later stages)
Reliability-First Deterministic Twin: **own-built extruded-footprint 3D floor** (owner GIS / openly-
licensed Overture, served locally) as the hard-offline guarantee + frozen sanitized data + precomputed
scores/service-areas + template explanations; the **tokenless Esri 3D Buildings service (connected +
cached)** as the richer default when network is present; live Esri basemap/routing/LLM as optional,
feature-flagged enhancements behind adapters that degrade to the frozen path. Dark ground + muted grey
massing delivers the cinematic look without a photoreal basemap dependency. (Whether Esri's hosted layer
may be clipped/re-hosted offline is an OPEN owner/Esri licensing question, not assumed.)
