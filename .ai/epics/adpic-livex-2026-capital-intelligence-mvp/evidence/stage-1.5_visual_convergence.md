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
