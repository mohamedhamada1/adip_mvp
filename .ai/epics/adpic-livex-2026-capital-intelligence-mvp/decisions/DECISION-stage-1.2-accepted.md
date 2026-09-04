# DECISION — Stage 1.2 accepted (owner)

**Date:** 2026-09-04
**Decided-By:** Project owner (requesting owner)
**Owner's word:** "Accept"

## Decision
Stage 1.2 (Explore / 3D shell + AOI switch) is ACCEPTED. Built via the owner-authorized direct-build
override; verified by 20/20 executable vitest behavioural tests, `npm run build` OK, and `verify.sh all`
PASS, plus live-browser evidence (computed KPIs — not 219/139; AOI switch noReload=true; tokenless Esri 3D
scene rendered; attribution + provenance enforced). Evidence: `evidence/stage-1.2_build_evidence.md`.

## Integration
`feat/stage-1.2` merged to `main`. Stage 1.2 lifecycle → done.

## Scope / next
NOT authorizing Stage 1.3 (AI-Assisted Assessment) — it will start only on the owner's explicit go.
Conditions C1/C2 (AD-SDI/SCAD offline-bundling) remain owner/legal items before exhibition-build commit.
