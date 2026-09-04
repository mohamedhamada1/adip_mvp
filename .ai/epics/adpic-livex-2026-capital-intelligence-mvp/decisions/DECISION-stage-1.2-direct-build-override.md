# DECISION — Stage 1.2 direct-build override (owner-authorized)

**Date:** 2026-09-04
**Decided-By:** Project owner (requesting owner)
**Owner's words:** "Authorize the direct-build override for Stage 1.2. Proceed with the Stage 1.2 Explore / 3D
shell build and address the remaining reviewer concern through executable behavioural tests and post-build
verification evidence."

## Context
The canonical Owner/Supervisor dispatch requires a PASS certification. `ai epic prepare 1.2` cleared Layer-1
fully but returned **LOW_CONFIDENCE ×4** at Layer-2 (each round's findings were addressed; the reviewer
escalated to requiring executable behavioural tests, which for a greenfield UI stage can only exist once the
code exists). The engine forbids legacy/in-session builds for epic stages; the OWNER (whose governance this
is) has explicitly waived that for Stage 1.2 only.

## Authorization scope
- Direct build of **Stage 1.2 (Explore / 3D shell + AOI switch) ONLY**. NOT 1.3/1.4/1.5.
- Address the reviewer's remaining valid concern with **executable behavioural tests** + **post-build
  verification evidence** (not just static greps).
- Honor the full `.ai/stages/1.2/spec.md` + guardrails: no mockup numbers, provenance tags + IS_DEMO,
  attribution from screen one, tokenless Esri 3D + own-built degrade, no live LLM, Explore-only, dark cinematic.
- STOP at the owner review gate when the build + evidence are ready (same pattern as Stage 1.1).

## Trail
Build on branch `feat/stage-1.2`; evidence under `.ai/epics/<id>/evidence/`; `verify.sh all` + behavioural
tests run and captured before the review gate.
