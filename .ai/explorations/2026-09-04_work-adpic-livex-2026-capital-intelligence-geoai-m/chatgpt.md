# ChatGPT Exploration — Architect

> Generated in LEAN_MODE (no external architect API key). Authored by Claude in the
> Architect role: propose candidate build approaches and a recommended direction.
> EXPLORATION MODE — no implementation code, no specs.

## 1. Problem Framing

The **product** is largely decided by the work definition: three capabilities
(Explore / Assess / Simulate) + a cross-cutting Ask-AI layer, a fixed tech stack
(React + Vite + TS + ArcGIS Maps SDK), a fixed simulation story (hypothetical
school), a fixed assessment presentation (Low/Medium/High, exhibition-only,
disclaimered), and a fixed authority boundary (**GIS computes; rules score; AI
explains**). The **product direction is not the open question.**

The real architectural question is: **how do we build this so a 60–90 second
presenter journey is cinematic AND survivable under exhibition conditions**, given
that three of the top risks are HIGH and network/hardware/3D quality are all
unvalidated? Every meaningful engineering fork is a point on the axis of
**ambition (cinematic fidelity, live richness) vs. reliability (deterministic,
local, recoverable)**. The work definition itself leans hard toward reliability
(WORK-CON-8/15/16, WORK-NFR-5/6, WORK-DEC-9/10, WORK-AC-12/16, WORK-ROLL-7), and
declares the current posture **CONDITIONAL GO for the technical/data spike only**.

Secondary forks that must be resolved by architecture, not left implicit:
- **3D asset delivery:** live ArcGIS Online 3D Buildings item vs. local-first
  scene package (SLPK/TPKX) vs. hybrid-cached.
- **Compute delivery:** precomputed/baked service areas & scores in the frozen
  dataset vs. live ArcGIS routing/service-area REST at runtime.
- **Journey control:** free navigation vs. a one-way **demo state machine**.
- **AOI build order:** Reem-opening-first (risky) vs. Khalifa-spine-first with
  Reem as progressive enhancement gated on the 3D spike.

## 2. Candidate Approaches

### Approach A — Reliability-First Deterministic Twin (RECOMMENDED)
Everything the scripted journey touches is **frozen and local**: sanitized project
records, AOI/community geometries, **precomputed** service-area polygons for the
school scenario, **precomputed** deterministic assessment scores, and locally
packaged 3D context (SLPK / offline scene, or cached tiles). No external REST is on
the critical path. Live LLM and live Esri services are **optional overlays** behind
a boundary; a **demo state machine** drives Understand → Evaluate → Simulate.
Khalifa City is the guaranteed spine; Al Reem opening is progressive enhancement,
activated only if its 3D spike passes.
- **Pros:** Directly satisfies WORK-CON-8/15/16, NFR-5/6, AC-12/16; demo runs with
  the venue Wi-Fi unplugged; deterministic ⇒ reproducible & traceable (BR-3, NFR-11);
  lowest failure surface for a one-shot live event; matches WORK-ROLL sequencing.
- **Cons:** Less "live" wow; precompute pipeline must be built and validated;
  frozen scores can look static if the presenter improvises off-script.

### Approach B — Live Services with Cached Fallback (Hybrid)
Use live ArcGIS Online 3D Buildings + live routing/service-area REST for dynamism,
but wrap **every** external call in a preload-cache + deterministic precomputed
fallback that trips on error/timeout. A visible/hidden "kill switch" forces
deterministic mode without reload.
- **Pros:** More dynamic; can show genuine on-the-fly service-area recompute; keeps
  a fallback contract.
- **Cons:** Larger failure surface for a live event; every path must be built AND
  tested twice (live + fallback); more places for auth/CORS/credit/throttle failure
  (WORK-RISK-3, NFR-8); higher spike cost. Best treated as a **post-spike
  enhancement layered onto A**, not the foundation.

### Approach C — Maximum Fidelity / Game-Engine-Adjacent
Chase cinematic quality aggressively (heavy post-processing, photoreal Reem).
- **Pros:** Highest visual wow.
- **Cons:** Collides with WORK-INT-4 (Google Photorealistic 3D must not be a core
  dependency), unvalidated hardware (WORK-RISK-8), and ArcGIS JS's limited
  post-processing vs. a game engine. High risk, poor cost/benefit for a 90s demo.
  **Reject as foundation.**

## 3. Recommendation

**Approach A (Reliability-First Deterministic Twin) as the foundation, with
Approach B's live paths added only as post-spike, feature-flagged progressive
enhancements.** This is the only approach whose *worst case* still delivers the full
scripted journey — which is exactly the bar the work definition sets (AC-12, AC-16,
ROLL-7). It also aligns the build order with WORK-ROLL-1..6: spike → 3D shell +
Explore → deterministic assessment → school simulator → Ask-AI templates → harden.

## 4. Proposed Shape (architecture sketch, not a spec)

- **App:** standalone Vite + React + TS; ArcGIS `SceneView` as principal 3D surface;
  Calcite used selectively + custom dark cinematic CSS.
- **Modules:**
  1. *Scene shell* — SceneView + AOI switcher with **no full reload** (swap layers/
     camera, keep the app mounted; NFR-3, AC-3).
  2. *Frozen dataset* — sanitized projects (the WORK-DATA-4..22 fields incl. `IS_DEMO`),
     geometries, precomputed indicators, precomputed school service areas; validated
     event-snapshot KPI counts.
  3. *Deterministic scoring engine* — pure TS, **config-driven weights** (never
     presented as official ADPIC methodology; BR-9/10), emitting Low/Med/High + the
     contributing evidence per dimension.
  4. *Explanation layer* — template registry keyed by project/indicator; an optional
     LLM adapter behind a strict boundary that receives **only** approved sanitized
     structured context and returns explanation + allowlisted map action (INT-8, SEC-4).
  5. *Journey controller / demo state machine* — one-way scripted transitions;
     recovery/fallback path; drives the 60–90s timing.
  6. *Ask ADPIC AI* — constrained: suggested questions + allowlisted map actions,
     scoped to current context (not open chat; REQ-16/18/19).
- **Data pipeline:** Enterprise 10.8.1 used **offline for preparation only** → export
  frozen sanitized snapshot → validate & freeze counts → package local 3D assets.
- **Non-critical-path:** live Esri services and live LLM sit behind adapters that
  degrade to the frozen/template path.

## 5. Risks (architect view)

- Inherits all WORK-RISK-1..8 (Reem 3D quality, attribute exposure, Esri/network
  failure, methodology misread, stale counts, 3D overload, LLM unavailable, hardware).
- **Precompute pipeline is now on the critical path** — the frozen dataset must
  include validated service-area polygons and scores; if data owners can't supply the
  population/facility/network inputs (WORK-OQ-5/6, DEP-6/7), the school simulation
  must fall back to deterministic precomputed equivalents (INT-7).
- **Local 3D packaging** (SLPK/offline scene) is not explicitly required by the work
  def but is the concrete mitigation for the HIGH network risk — must be a spike output.
- **"AI" labeling honesty** — if the explanation is a template lookup, calling it
  "AI" to a LIVEX audience must be handled carefully to avoid a credibility gap.
- **Blocking open questions** (WORK-OQ-1..11) are ownership/approval facts the
  architecture cannot invent; they gate EPIC_CREATE and the exhibition-build commit.
