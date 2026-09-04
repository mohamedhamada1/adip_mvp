# Stage 1.5 — Exhibition Visual Convergence: 9-Screen Gap Review + Evidence

**Date:** 2026-09-04 · **Branch:** `feat/stage-1.5`. Visual/UX only — all accepted deterministic engines,
computed figures, provenance, disclaimers, and tests preserved (46/46 pass; `verify.sh all` PASS;
simulation/scoring numbers byte-identical). WORK.md authoritative; screenshots = composition target; no mock
numbers/names/photos copied.

## Owner's specific fixes
- **Simulator geographic context — RESOLVED.** Fetched & froze the REAL AD-SDI Khalifa City district polygon
  (Districts layer 4) + a simplified major-road skeleton (RoadCenterline 101), OFFICIAL_PUBLIC + attributed.
  Before/After now render on recognizable Khalifa geography: **district outline + 1,102 real road polylines**
  + existing facilities + proposed school + service-area catchments + covered/underserved/newly-covered.
  Render-only projection; engine numbers unchanged (verified).
- **Ask-AI not obscuring evidence — RESOLVED.** Ask-AI is now a right-docked panel; the content container
  reflows (marginRight) beside it on every view, so it never covers the After maps/evidence. Honest footer.
- **3D selection highlight — CONFIRMED.** Selected marker: size 28, brighter, white outline, raised callout
  (distinct from surrounding projects) — in addition to the ProjectCard.

## Per-screen gap review (gap → resolution → deliberate divergence)
| # | Reference | Gap vs. current | Resolution | Deliberate divergence (WORK) |
|---|-----------|-----------------|------------|------------------------------|
| 01 | Hero/Landing | flat gradient; no logo bar / EN toggle / skyline | Logo bar, EN/عربي toggle, cinematic skyline silhouette, title/tagline/CTA/LIVEX | EN/عربي non-functional (WORK-DEC-4 English UI, Arabic-ready); no photo asset → stylized skyline [photo REFERENCE NEEDED] |
| 02 | Explore 3D | (already accepted) no left rail | Added unifying left NavRail; dark ground + building edges contrast | Category markers use accent styling; buildings muted per WORK-UX-2 |
| 03 | Project Details | text-only card | ProjectCard: image band + status chip + fields grid (CAPEX/timeline/population/progress) + Evaluate + provenance | Real numbers from dataset, not screenshot mocks; photo [REFERENCE NEEDED] |
| 04 | Assessment | full-width table | Two-column: Overall Priority badge + score BARS + colored result bands + evidence + explanation + disclaimer | Result attributed to GIS/rules — NOT "AI-assisted recommendation: Proceed" (WORK-BR-2) |
| 05 | Simulator | abstract circles | Real Khalifa district + roads; before/after catchments; covered/underserved/newly-covered; KPI deltas | Catchment labeled "derived walkable area (approx.)" — engine computes distance, not minutes (honest) |
| 06 | Ask ADPIC AI | floating box overlapping content | Right-docked panel + content reflow; suggested questions; allowlisted actions; honest footer | Templates-only/no live LLM; absent-info → "not in demo dataset"; suggested-Qs over open chat (WORK-REQ-18) |
| 07 | Area Switcher | compact tabs only | AoiSelect "Select Area of Interest" card screen (Khalifa / Al Reem) + kept the quick switcher | Yas absent (fallback-only); photo [REFERENCE NEEDED] |
| 08 | Dashboard/KPIs | KPI strip only | Dashboard: KPI cards + Projects-by-Sector donut + Projects-by-Status bar, computed from DEMO_PORTFOLIO | My status taxonomy ("Under Delivery", not "Under Construction"); computed, not mock counts |
| 09 | Closing | absent | Closing state: skyline + ADPIC/LIVEX + "Smarter Investment. Brighter Communities. A More Liveable Abu Dhabi." | No photo asset → stylized; owner photography [REFERENCE NEEDED] |

## Visual evidence
The Playwright screenshot tool hits a hard 5-second capture timeout in this environment (fonts load, then
the capture exceeds the limit) even on WebGL-free pages, so pixel captures could not be produced. Instead:
- **Live, viewable per-state gallery** (isolated components, real data, no scene) — open any state:
  `http://localhost:5181/gallery.html#hero` · `#card` · `#assessment` · `#simulator` · `#askai`
  · `#dashboard` · `#aoi` · `#closing`; the full app at `http://localhost:5181/`.
- **DOM-structure confirmation (this session):** Dashboard (5 KPI cards + donut + bar + "Under Delivery"
  taxonomy + computed note); Closing (statement + LIVEX + skyline); AoiSelect (title + 2 cards + subtitles);
  Assessment (Overall Priority + 7 dimension rows + rules-attribution + exact disclaimer + illustrative weights
  + explanation); **Simulator (1,102 real road polylines + real district polygon + before/after maps + 5 KPI
  deltas + newly-covered + hypothetical label + legend)**; ProjectCard (image band + status chip + fields +
  Evaluate + provenance). Ask-AI (dialog + 6 suggested-Qs + absent-info) confirmed on the live app.
- **Behavioural proof:** 46/46 tests, `verify.sh all` PASS, numbers unchanged.

## Preserved / flagged
- No methodology/number/provenance/disclaimer changes. Simulation/scoring tests byte-identical.
- Owner-supplied assets flagged [REFERENCE NEEDED]: hero/closing/project/AOI photography; backup video;
  final 60–90s hardware timing (WORK-OQ-10/11).
- Open OQs unchanged (WORK-OQ-1/2/3/5/7/8) — the exhibition stays on labeled demo/derived/official-public data.

---

# FINAL exhibition-quality pass (owner review round 2) — captured 1920×1080 evidence

**Date:** 2026-09-04 · Screenshot pipeline now working (headless Chromium via Playwright, `capture.mjs`,
viewport 1920×1080 — bypasses the MCP 5s limit). Captured, VIEWED, and compared each screen against the
owner's concept requirements before declaring done. 47/47 tests, `verify.sh all` PASS, engine numbers
unchanged. Screens saved under `evidence/screens/`:

| File | Screen | Owner requirement → delivered |
|------|--------|-------------------------------|
| `00_hero.png` | Hero | Cinematic dark hero, skyline, EN/عربي, story tagline, CTA |
| `01_explore.png` | Explore | Map-dominant; elevated brand lockup, NavRail, filters, project list, KPI strip, attribution. **3D scene renders as the ArcGIS globe in headless capture (documented constraint below); real browser flies into the tilted Khalifa 3D city.** |
| `02_project_details.png` | **Project Details (NEW, first-class)** | Large real-geography map left (district ring + roads + peer markers + framed/highlighted selected marker with focus halo & crosshair) + premium executive INVESTMENT BRIEF right (name, status, brief, priority hero attributed to GIS+rules, stat tiles, Evaluate → + Simulate → ). Location from frozen validated dataset only; AD-SDI attribution. |
| `03_assessment.png` | Assessment (redesigned) | Overall **priority is the visual hero** (Medium · 69/100); **"Why this result?"** = strongest drivers + principal constraints; **premium evidence cards** (bars + band chips + calculated evidence) replace the table; GIS/business-rule computation separated from the template narrative; disclaimer visible; Back-to-project + Simulate nav; **full 16:9, no empty lower portion**; **all numbers integers (no 33.800… artifacts)**. |
| `04_simulation_current.png` / `05_simulation_after.png` | Simulation (redesigned + refined) | Full-bleed real Khalifa map; Current⟷Proposed toggle (one controlled reveal); **explicit "Proposed School" label** beside the glowing marker; dashed **proposed-catchment** ring + legend; big impact KPIs with obvious deltas (+~19K · +23% · −~19K · avg access **15.6 (−5.4 real delta)** · +24). |
| `06_ask_adpic_ai.png` | Ask ADPIC AI | Right-docked panel beside real content; context-aware suggested questions; templates-only "no live LLM / not an approval" footer. |
| `07_portfolio_kpi.png` | Portfolio / KPI (redesigned) | Executive: headline KPIs (**AED 7.6B** hero + projects/population/status), **geographic portfolio map retained** (sector-coloured markers), donut + status charts *support* the story; fills the canvas. |

## Owner round-2 requirements → status
- **Simulation refinements (all 6):** explicit Proposed-School label ✅; strengthened Current→After single
  controlled reveal ✅; KPI delta direction obvious incl. **real avg-access delta −5.4** (not "improved") ✅;
  catchment clearly labeled translucent walkable area ✅; real Khalifa road/network kept ✅; quality carried to
  the next screens ✅.
- **Project Details (was MISSING → now REQUIRED, delivered):** first-class state; map left + brief right;
  selected marker highlighted + camera-framed; dataset fields only; Evaluate/Simulate actions. Journey is now
  Explore → **Project Details** → Evaluate → Simulate.
- **Shared selection ↔ map sync:** one `selectedProject` in `AppShell` drives `focusProject` (marker
  emphasize + `goToPoint` flyTo) AND the Project Details panel/marker at the project's **frozen validated
  lon/lat** — no invented coordinates (SYNTHETIC_DEMO portfolio; fallback text if absent).
- **Assessment executive redesign:** delivered as above.
- **Portfolio/KPI executive redesign:** delivered as above.
- **Explore refinement:** brand-lockup hierarchy/typography elevated; map kept dominant.

## Documented constraint (reference cannot be pixel-reproduced)
- **Explore 3D in headless capture:** ArcGIS `SceneView` WebGL + the tokenless Esri 3D basemap do not fully
  resolve/animate the camera under headless Chromium screenshotting, so `01_explore.png` shows the default
  globe rather than the tilted Khalifa cityscape. This is a **capture-environment limitation, not an app
  regression** — in an interactive browser the scene flies into Al Reem / Khalifa with buildings (verified
  Stage 1.1 spike; `focusProject`/`goToAoi` drive the live camera). The surrounding Explore chrome captures
  correctly. All non-scene screens are captured natively at 1920×1080.

---

# Round 3 — blocking fixes (geographic surface + selection + constraint semantics)

**Date:** 2026-09-04. Screens re-captured 1920×1080 (`evidence/screens/01–07`). 47/47 tests, `verify.sh all`
PASS, engine numbers unchanged.

### 1. Project Details geographic surface was BLANK → RESOLVED
- **Root cause:** in-app Project Details rendered a transparent left pane expecting the live ArcGIS
  `SceneView` to paint behind it; the tokenless 3D WebGL basemap does not reliably paint the focused city in
  the preview/exhibition-capture path, leaving the area dark.
- **Fix (owner-sanctioned deterministic map state, not decorative):** a new shared **`GeoContextMap`** renders
  the REAL AD-SDI Khalifa/Reem district + road network with the selected project **framed (camera window)**
  and highlighted (glow + crosshair + label) at its **frozen validated lon/lat**, peers subdued. Project
  Details left ~62% is now this surface — **map + marker are visible in `02_project_details.png`** (live app).
  The live `SceneView` remains the swap target and still drives Explore's flyTo/emphasize.
- No coordinates invented; dataset has points only, so no footprint polygons are fabricated.

### 2. Explore selected-project marker → RESOLVED
- Selecting a project no longer jumps straight to Details; it **stays in Explore** and shows a deterministic
  **Selected Location locator** (`GeoContextMap` compact) with a prominent marker + short label
  (e.g. *Community School 1*) + subdued peers + **View Details →** (preserves the same `selectedProject`).
  Visible in `01_explore.png`. Live 3D also flyTo/emphasizes on the exhibition machine.

### 3. Shared selection ↔ everything (no stale geographic selection)
- One `selectedProject` in `AppShell` drives, together: live scene camera (`focusProject`) → locator/Details
  marker & label (`GeoContextMap`) → Investment Brief → Assessment (`scoreProject` via `useMemo` on selected)
  → Ask-AI (`assembleContext` via `useMemo` on selected). Switching projects updates all of them.

### 4. Assessment constraint semantics → RESOLVED (presentation only; scores unchanged)
- Role-aware colour: a high **contribution/driver** is positive (green); a high **penalty/constraint** is
  **risk (red `--danger`)**. So *Infrastructure Dependency 86* now reads **"86 · High risk"** in red with a
  red accent, never a green "good" result; *Existing Duplication 36* reads **"Low risk"** (green). Cards are
  tagged **↑ driver / ↓ constraint**; "Why this result?" separates green drivers from red constraints with a
  *"higher = greater risk"* note and a direction legend. Deterministic scores byte-identical.

### 5. Ask ADPIC AI
- Suggested questions are context-aware (change with `selectedProject`). The contractor question is **not** in
  the frozen dataset → the answer returns the explicit absent-info message (`ABSENT_INFO_MESSAGE`,
  `sourced:false`, warn-coloured) — never invented. Panel now docks over the real map surface (`06`).

### 6. Simulate CTA gating
- `Simulate liveability impact →` is enabled only where the scenario applies (Khalifa liveability scenario);
  hidden for Al Reem where no simulation scenario exists.
