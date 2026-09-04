# DECISION — Stage 1.3 direct-build override (owner-authorized)

**Date:** 2026-09-04
**Decided-By:** Project owner (requesting owner) — "Ok" (after recommendation)

## Context
Owner chose certification-first. Followed faithfully: 3 rounds of spec fixes resolved real, converging
Lens-A findings; the spec reached **Lens A PASS on merit**. But this environment's certifier CANNOT produce
a dispatchable "live" PASS: its semantic reviewer is an injected/hermetic actor (transport never "live";
CERTIFY_ALLOW_INJECTED_ACTOR records hermetic-actor) AND non-deterministic (Lens A flip-flopped PASS↔CONCERN
on byte-identical input). The engine "routes to human owner — no dispatch" regardless. This is the same
environmental limitation that forced the Stage 1.2 override. Owner authorized the direct-build override for
Stage 1.3 on my recommendation.

## Authorization scope
- Direct build of **Stage 1.3 (Deterministic Assessment + Evidence) ONLY**. NOT 1.4/1.5.
- Build from the certification-grade `.ai/stages/1.3/spec.md` + `plan.md`; honor all guardrails.
- Prove via executable behavioural tests + `verify.sh all` + live evidence; STOP at the owner review gate.

## Trail
Branch `feat/stage-1.3`; evidence under `.ai/epics/<id>/evidence/`.
