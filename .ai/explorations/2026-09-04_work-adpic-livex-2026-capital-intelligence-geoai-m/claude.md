# Claude Grounding — Feasibility (NON-SOFTWARE mode)

> No repo exists yet. Grounded against the work definition + external evidence
> (ArcGIS SDK docs, Esri community). Confidence is labeled: **[confirmed] /
> [estimated] / [assumption]**. Nothing here resolves the human-gated open
> questions — those are ownership/approval facts the application cannot invent.

## 1. Feasibility (against the work definition's constraints)

**Feasible as an exhibition MVP — with clear conditions.** The product is a
scoped, well-specified demo, not a platform, and the stack (React + Vite + TS +
ArcGIS Maps SDK for JS `SceneView`) is a proven fit for 3D city visualization,
deterministic overlays, and scripted camera work. The hardest parts are **not**
the UI — they are (a) guaranteeing the 60–90s journey survives network/3D/hardware
failure, and (b) closing the human approval/ownership gates. Both are anticipated
by the work definition itself, which sets the correct posture: **CONDITIONAL GO for
the technical/data spike, not exhibition release** (WORK-ROLL-9).

## 2. Key Evidence & Sources (with confidence)

- **[confirmed] The browser ArcGIS JS SDK does NOT load `.slpk` files directly.**
  `SceneLayer` renders an **I3S Scene Service**; an `.slpk` must first be published
  as a scene service (ArcGIS Online, ArcGIS Enterprise, or ArcGIS Pro), or its
  extracted I3S scene tiles served from a web server. Implication for "local-first
  3D" (Approach A / Gemini condition #1): the offline mitigation is **not** "ship an
  .slpk and open it" — it is one of: (i) host the I3S scene service on-prem / local
  ArcGIS server and consume it by REST URL (allowed by WORK-INT-6; must avoid
  depending on a modern Portal WebScene on Enterprise 10.8.1 per WORK-INT-5), or
  (ii) the **deterministic floor**: client-side **extruded building footprints**
  from local polygon+height geometry on a cached basemap — no scene service needed.
  The floor guarantees a 3D scene even with the venue network unplugged.
- **[confirmed] ArcGIS JS supports the cinematic primitives** the UX asks for:
  `SceneView` camera animation/fly-to, layer emphasis/decluttering, extruded and
  textured 3D buildings, and smooth transitions. "Cinematic" is achievable within
  the SDK; it is **not** game-engine post-processing (Gemini's paradox is fair —
  fidelity must be tuned to hardware, WORK-UX-10 delegates this).
- **[confirmed] Service-area / routing is available via ArcGIS REST**, but requires
  approved credentials + consumes credits (WORK-INT-9, DEP-8). The work definition
  already mandates a **precomputed/deterministic event equivalent** for the scripted
  fallback (WORK-INT-7) — so live routing is an enhancement, not a dependency.
- **[assumption — SPIKE, do not treat as proven] Esri 3D Buildings item
  `b8fec5af7dfe4866b1b8ac2d2800f282` adequately covers Al Reem Island and Khalifa
  City.** This is exactly WORK-INT-2 / WORK-RISK-1 and must be validated by the 3D
  spike. Coverage/quality was NOT web-confirmed and must not be assumed.
- **[confirmed] Enterprise 10.8.1 is safe for offline data prep** and direct
  feature/map REST access, but the runtime must not depend on a modern Portal
  WebScene there (WORK-INT-5/6) — consistent with the frozen-dataset default.

## 3. Hard Constraints & How They're Met

- **60–90s journey (AC-1, NFR-1):** met by a one-way **demo state machine** driving
  Understand → Evaluate → Simulate; precomputed data keeps transitions instant.
- **No live LLM on the core path (AC-12, DEC-8, CON-15):** met by a template
  registry as the guaranteed explanation path; LLM is an optional adapter behind a
  sanitized-context boundary (INT-8, SEC-4).
- **Connectivity tolerance / offline (NFR-5, DEC-10):** met only if 3D + service
  areas + scores are frozen/local (see §2 finding on the deterministic floor).
- **Deterministic, reproducible, traceable scoring (BR-3, NFR-11, AC-5/6):** met by
  a pure-TS, config-driven scoring engine emitting Low/Med/High + per-dimension
  evidence; weights configurable and NOT presented as official ADPIC methodology
  (BR-9/10).
- **20–40 curated projects/AOI + full portfolio for KPI only (AC-4, DATA-3):**
  standard curation; retain full records for queries, curate showcase set for 3D.
- **Counts (AC-19, DEC-7):** display only validated frozen-snapshot counts; treat
  219/139 as provisional.
- **English UI + Arabic-ready architecture (DEC-4, CON-11, NFR-10):** met by
  externalized strings + logical-direction-aware layout. **NOTE the conflict in §4.**
- **Disclaimer (BR-15):** the approved wording is fixed; make it persistently
  visible on every scored screen.

## 4. Risks / Blockers / Open Questions

**Two gatekeeper-vs-contract conflicts (surface to human; do NOT silently adopt):**
- Gemini calls "Arabic-ready architecture" overengineering. This **contradicts an
  owner-RESOLVED decision** (WORK-DEC-4, WORK-CON-11). Accepting it would require the
  human to override a recorded decision. Recommendation: **keep Arabic-ready**;
  it is cheap when done as string/layout hygiene from day one, expensive to retrofit.
- Gemini proposes its own watermark wording. WORK-BR-15 **fixes the approved
  disclaimer text** unless comms/legal supplies a replacement. Recommendation:
  **adopt the persistent-visibility idea, keep the approved wording.**

**Blocking open questions (human-supplied facts — unresolved here):**
- **EPIC_CREATE gate (must close before final epic creation, AC-20, ROLL-9):**
  WORK-OQ-1 (public-attribute allowlist), OQ-2 (named data approver), OQ-3 (named
  methodology/claim approver), OQ-4 (named final business owner), OQ-5 (per-dataset
  availability/approval), OQ-6 (named GIS/data owner), OQ-7 (LLM prompt-info
  allowlist), OQ-8 (named security/AI approver).
- **EXHIBITION_BUILD_COMMIT gate (may stay open during epic creation):** WORK-OQ-9
  (technical-spike owner), OQ-10 (hardware-validation owner), OQ-11 (final hardware
  specs).

**Technical blockers/spikes:** Reem 3D quality (RISK-1), external Esri/network
failure (RISK-3), full-portfolio 3D overload (RISK-6), hardware sustains 3D
(RISK-8). All are the substance of WORK-ROLL-1 (data/3D/technical spike).

**Data-dependency blocker:** the school simulation needs population/demand,
facility, and road/network/service-area inputs (DATA-26..29, DEP-6/7). If owners
can't supply them, the simulation must fall back to **precomputed deterministic
equivalents** — this must be decided at the spike, not late.

## 5. Cost / Effort Estimate

**[estimated]** A focused delivery of ~5 sequential slices matching WORK-ROLL-1..6:
(1) data/3D/technical spike + snapshot freeze, (2) 3D shell + Explore + AOI switch,
(3) deterministic assessment + evidence, (4) school simulator (precomputed), (5)
Ask-AI templates + hardening (preload/cache, fallback, hardware profiling, backup
video). Multi-week effort dominated by the **spike and the frozen-data pipeline**,
not the React UI. Live LLM and live routing are additive, gated, out of the
critical path. This maps cleanly to a multi-stage **Epic**.

## 6. Verification Concerns (what an independent check must re-verify)

- The full scripted journey runs **with the network physically disconnected**.
- Assessment output is **reproducible** from the same frozen inputs + config.
- The 3D scene renders acceptably **on the actual event hardware** (not a dev laptop).
- No unapproved/confidential attribute appears in the build (attribute allowlist
  enforced) — depends on OQ-1/OQ-2 closing first.
- Displayed counts equal the **validated frozen snapshot**, not 219/139.
- The approved disclaimer is present and persistent on every scored screen.
- Deterministic fallback + backup video exist and have been exercised.

## 7. Recommendation

**Support (Caution) — proceed as a multi-stage Epic whose first stage is the
technical/data spike, NOT a direct build commitment.** The product is feasible and
well-scoped; the risk is concentrated in the spike (3D/network/hardware) and in the
human approval gates. This matches the work definition's own CONDITIONAL-GO posture.
`ai epic create` is expected to surface the 8 EPIC_CREATE open questions as blocking
and PARK — that is correct behavior (AC-20, ROLL-9), not a failure.

Sources: [SceneLayer — ArcGIS Maps SDK for JS](https://developers.arcgis.com/javascript/latest/references/core/layers/SceneLayer/) · [A guide to SceneLayers](https://developers.arcgis.com/javascript/latest/working-with-scene-layers/) · [How to load .slpk file locally — Esri Community](https://community.esri.com/t5/net-maps-sdk-questions/how-to-load-slpk-file-locally/td-p/754582)
