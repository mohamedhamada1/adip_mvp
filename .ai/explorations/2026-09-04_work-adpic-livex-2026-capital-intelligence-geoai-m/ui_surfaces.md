# UI Surfaces — Detection + Visual Reference (Phase 5.5)

**UI surfaces DETECTED.** Visual references **NOW PROVIDED** by the owner
(9 screenshots in `screenshots/`, copied from `ADPIC_LIVEX_UI_Screens/`).
The Phase 7 ⚠️ missing-reference warning is **RESOLVED (option A)**.

**UI delivery mode:** `direct_ui` — React + Vite + TS + ArcGIS Maps SDK for JS
(`SceneView`) + selective Calcite + custom dark cinematic CSS. Not SDUI.
Not Next.js (WORK-CON-7).

**Authority order (per owner):** WORK.md > owner-resolved decisions > screenshots
(visual direction) > WORK-UX-10 delegated detailing. **If a screenshot conflicts
with WORK.md, WORK.md wins.** Screenshot numbers/names/scores are mockup content,
NOT approved data — use the frozen event dataset.

**Global design language (all screens):** dark navy background, restrained blue
highlights, minimal chrome, large readable KPIs, left-rail nav (Explore / Projects /
Assessment / Simulation / Ask AI), ADPIC logo (EN + Arabic lockup), EN/عربي toggle
(Arabic-ready, WORK-DEC-4 — MVP content is English), "Capital Intelligence —
People · Places · Possibilities". Prefer overlays/panels/state transitions over 9
independent routes.

## Per-screen mapping + flags

| # | Screen (file) | WORK IDs | Flags / unsupported elements |
|---|---------------|----------|------------------------------|
| 1 | Hero / Landing (`01`) | UX-4, EX-1, CON-2 | Photoreal skyline is a decorative hero image, not the live 3D scene — OK as landing bg. "Start Experience" → Explore. |
| 2 | Explore 3D Map — Al Reem (`02`) | REQ-1/3/4/5/6, UX-2/4, INT-1, AC-3 | ⚠️ KPI numbers (139 / AED 85B / 72 / 67 / ~250,000) are **mockup — do NOT hard-code** (AC-19, DEC-7). Al Reem opening must degrade gracefully if 3D spike fails (EX-4). |
| 3 | Project Details (`03`) | REQ-2, DATA-4..21 | ⚠️ Numbers (AED 120M / 2028 / ~5,000 / 85%) mockup. School card must carry **hypothetical/demo identification** — must NOT read as an approved real project (BR-14, BR-12, DATA-32, SEC-6). |
| 4 | AI-Assisted Investment Assessment (`04`) | REQ-9/10/11, BR-4, AC-5/6/7, BR-15 | ✓ Disclaimer wording is correct (BR-15). ⚠️ "AI-assisted recommendation: Proceed to detailed evaluation" risks reading as **AI approving** (BR-1/BR-2, SEC-7, owner rule). The HIGH priority is **deterministic GIS/rules**, AI only explains — attribute it that way. ⚠️ Dimension %s mockup. |
| 5 | Liveability Impact Simulation (`05`) | REQ-12/13/14/15, AC-8/9, DEC-2 | ✓ Strong Before/After + service-area rings + KPI deltas. ⚠️ Deltas (+18,000 / -35% / +42% / +12) mockup — from precomputed frozen sim, not screenshot. |
| 6 | Ask ADPIC AI (`06`) | REQ-16/17/18/19/20, AC-10/11, BR-2 | ✓ Suggested-question chip + grounded disclaimer + "not an official approval". ⚠️ "Ask a follow-up question" free input must stay **constrained** (suggested Qs + allowlisted actions), not imply open autonomous chat (REQ-18). Must run without live LLM (template path). |
| 7 | Area / AOI Switcher (`07`) | REQ-6, AC-3, DEC-5 | ✓ Khalifa + Al Reem only; Yas correctly absent (BR-13, OOS-17). Needs a state where Al Reem is disabled/hidden after a failed 3D spike. |
| 8 | Dashboard / KPIs — Khalifa (`08`) | REQ-3, DATA-3 | ⚠️ 219 / 1.42B / 128 / 91 / ~380,000 + all sector/status figures **mockup** — 219 is the flagged provisional count (RISK-5, DEC-7, AC-19). Use validated frozen snapshot only. |
| 9 | Closing (`09`) | UX-7, EX-1 | ✓ Closing impact statement + ADPIC/LIVEX lockup. |

## Reference status
- Figma URLs: none. **Screenshots: 9 provided (AVAILABLE).**
- Structured UX brief: owner design-direction message + WORK-UX-1..10.

## Cross-cutting design guardrails (carry into stage contracts)
1. No screenshot number/name/score/date is approved data — bind to frozen dataset.
2. Assessment priority is deterministic (GIS computes, rules score); AI explains
   only — never present AI as the approver/decider.
3. School is hypothetical using real context — label as demo/hypothetical.
4. Ask-AI is a cross-cutting layer, constrained (suggested Qs + allowlisted actions),
   guaranteed without a live LLM.
5. Every important transition needs an immediate deterministic fallback state.
6. Al Reem opening is conditional; the whole experience must be coherent with it off.
7. Components structured so Arabic/RTL needs no redesign (English content now).
8. Desktop/exhibition-first, 1920×1080 baseline until event hardware confirmed.
9. 3D delivery architecture proven in the technical spike; no direct browser `.slpk`.
