# Stage 1.1 — WORK-OQ-5 Dataset Inventory (evaluation framework)

**Status:** ⏳ AWAITING DATA — no dataset has been provided yet. This is the evaluation
framework; each dataset is assessed on inspection of the ACTUAL artifact, not because it
is required. **Availability/approval is NOT assumed for any dataset not provided** (owner
instruction, 2026-09-04).

**Rule:** inspect what actually exists. Being "required" ≠ "available." Being "present" ≠
"production/exhibition-approved" (approval remains WORK-OQ-1/OQ-2, OPEN).

## Per-dataset record (fields required by owner)

For EACH of the 7 datasets, record on inspection:
1. **Source** (system/owner/file/service)
2. **Availability** (provided & inspected / referenced-not-provided / not available)
3. **Spatial/attribute structure** (geometry type, CRS, key attributes/fields)
4. **Completeness** (coverage of AOI, record counts, gaps)
5. **Suitability for the LIVEX story** (fit for Explore/Assess/Simulate)
6. **Public/exhibition approval status** (if known; else "unknown — pending OQ-1/2")
7. **Sanitization required** (which fields; name/budget/timeline sanitization per WORK-DEC-1)
8. **Missing fields/layers** (vs. WORK-DATA-4..31 model)
9. **Synthetic/demo replacement required?** (yes/no + why; must carry IS_DEMO, WORK-DATA-22/32)
10. **Freezable into the deterministic event snapshot?** (yes/no + conditions)

---

### D1 — Khalifa City portfolio  — ⏳ AWAITING DATA
1. Source: — · 2. Availability: NOT YET PROVIDED · 3. Structure: — · 4. Completeness: — ·
5. Suitability: — · 6. Approval: unknown (OQ-1/2 OPEN) · 7. Sanitization: — · 8. Missing: — ·
9. Synthetic replacement: — · 10. Freezable: —

### D2 — Al Reem Island portfolio  — ⏳ AWAITING DATA
1.–10. (same fields) — NOT YET PROVIDED.

### D3 — AOI boundaries  — ⏳ AWAITING DATA
1.–10. — NOT YET PROVIDED.

### D4 — Population / demand  — ⏳ AWAITING DATA
1.–10. — NOT YET PROVIDED. (Critical for the school simulation, WORK-DATA-26.)

### D5 — Existing facilities  — ⏳ AWAITING DATA
1.–10. — NOT YET PROVIDED. (Critical for the school simulation, WORK-DATA-27.)

### D6 — Roads / network / service-area inputs  — ⏳ AWAITING DATA
1.–10. — NOT YET PROVIDED. (Critical for service areas, WORK-DATA-28, DEP-7.)

### D7 — Strategic-theme mapping  — ⏳ AWAITING DATA
1.–10. — NOT YET PROVIDED. (Feeds Strategic Alignment scoring, WORK-BR-6.)

---

## School-simulation substitute determination (owner-required)
If analytical inputs (D4/D5/D6 esp.) are unavailable, determine **explicitly** whether Stage 1.1
can produce **deterministic/precomputed substitutes** for the school simulation:
- Substitutes are permitted ONLY if they are internally labeled demo/synthetic (IS_DEMO,
  WORK-DATA-22/32, WORK-BR-12/14, WORK-SEC-6) and are **never** represented as real ADPIC data.
- The hypothetical school itself is already demo by design (WORK-DEC-2, WORK-BR-14).
- Record: which inputs were substituted, the substitution method, and the misrepresentation guard.
- If a credible, non-misrepresenting substitute is NOT possible for a given input → that becomes a
  FAIL/CONDITION item for the final recommendation, not a silent gap.

## Snapshot-freeze feasibility (rolls up from D1–D7)
To be concluded after inspection: can a frozen, sanitized, count-validated event snapshot be produced
from what actually exists (+ labeled substitutes)? Yes / Yes-with-conditions / No.

> When datasets arrive: fill D1–D7, complete the substitute determination + snapshot feasibility, then
> issue the final Stage 1.1 recommendation (PASS / PASS WITH CONDITIONS / FAIL) in the findings report.
