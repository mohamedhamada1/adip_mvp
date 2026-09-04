# Stage 1.5 — Build Evidence (Ask ADPIC AI + Hardening/Fallback + Exhibition Visual Hardening)

**Date:** 2026-09-04 · **Branch:** `feat/stage-1.5` · **Mode:** owner-authorized direct-build override.
**Status:** BUILD COMPLETE & VERIFIED — awaiting owner review gate. Final epic stage.

Includes the owner's mid-build **exhibition visual-hardening** requirements (Explore polish, strong
selection focus, Simulator on the real Khalifa map) — carried in as AC-8/9/10. All accepted deterministic
engines, numbers, provenance, disclaimers, and tests are preserved (visual/UX only).

## Verification — ALL GREEN
- **Build:** `npm run build` → OK.
- **Tests:** `vitest run` → **46/46 passed** (14 files; +ai, +askAi, +hardening, +projectCard; all prior stages green — no regression).
- **Guards:** `.ai/stages/1.5/verify.sh all` → **PASS** across AC-1..AC-10 + TESTS (accumulating gate).

## Ask ADPIC AI + hardening (RR-1..7)
- **AC-1** Ask-AI is a cross-cutting OVERLAY (not a route) with suggested questions + allowlisted actions.
- **AC-2** context assembled by the app (project + AOI + approved attrs + calculated indicators + strategy).
- **AC-3** deterministic templates; identical (q, ctx) → identical answer; NO live LLM (NullLlmAdapter default).
- **AC-4** absent info → "not included in the demo dataset" (never invented) — proven live + test.
- **AC-5** deterministic safe mode + `preloadFrozenData()`.
- **AC-6** fixed deterministic fallback demonstration + backup-video slot (video = owner-supplied, flagged).
- **AC-7** LLM-adapter boundary: `sanitizeContext` drops non-approved fields (spy adapter never sees them);
  non-allowlisted actions are stripped; default null (templates only).

## Exhibition visual hardening (AC-8/9/10 — owner requirement)
- **AC-8 selection focus:** selecting a project flies-to + strongly highlights its marker (size 28, bright,
  white outline, raised callout — distinct from others) and shows a **ProjectCard** with the dataset fields
  + provenance + **Evaluate** tied to the selection. Live: card + Evaluate + provenance confirmed.
- **AC-9 Explore polish:** dark ground surface + muted building fill with bright **edges** for cinematic
  contrast; card-style project selector (not a text list); stronger KPI hierarchy (panel + dividers +
  uppercase labels); no raw hex in components.
- **AC-10 Simulator on real Khalifa geography:** Before/After now project onto the real **AD-SDI Khalifa AOI
  extent** with real-positioned zones/facilities/proposed school + service-area catchments + newly-covered/
  underserved — not an abstract grid. The deterministic engine NUMBERS are unchanged (verified: simulation
  tests unchanged and green).

## Live evidence (vite preview :5180)
Selection → ProjectCard (fields + provenance + Evaluate) ✓; Ask-AI overlay with 6 suggested Qs ✓; absent-info
→ honest "not in demo dataset" ✓; Safe-mode + Fallback controls ✓. Simulator/scene-contrast verified via tests + verify.

## Preserved (owner constraint)
All Stage 1.2–1.4 deterministic engines, calculations, provenance tags, disclaimers, and tests are intact —
this stage added the Ask-AI/hardening layer and visual/UX presentation only; no methodology or numbers changed.

## Notes (non-blocking, carried)
- Backup-video asset + final 60–90s/hardware timing (WORK-OQ-10/11) are owner/operational — flagged, not fabricated.
- Real service-area/population + LLM prompt-info allowlist (WORK-OQ-5/7/8) remain swap targets; the sanitized boundary is built and gated.
- Full 3D-scene simulation overlay (vs the geographic map panel) is a possible further enhancement.
