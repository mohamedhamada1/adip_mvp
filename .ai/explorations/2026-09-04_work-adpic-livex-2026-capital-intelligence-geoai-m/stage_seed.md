# Stage Seed — Promoted from Exploration

**Source Exploration:** 2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m
**Decision:** EPIC: Build the ADPIC LIVEX 2026 Capital Intelligence GeoAI MVP as a multi-stage epic using the Reliability-First Deterministic Twin architecture (Vite/React/TS + ArcGIS JS). First stage is the technical/data spike; owner-supplied screenshots are the visual reference. WORK.md is authoritative.
**Promoted At:** 2026-09-04T10:57:03Z

---

## Objective
Proceed with **Approach A (Reliability-First Deterministic Twin)** as the foundation. This approach ensures the demo can function independently of live data and network dependencies, aligning with the project's constraints and risks. Integrate elements of Approach B only after the technical spike validates the feasibility of live enhancements. Ensure all open questions regarding data ownership and approvals are resolved before finalizing the epic creation.

## Non-Goals
1. **Data Ownership and Approval:** Who are the named data approvers and methodology/claim approvers required to close the open questions?
2. **Technical Spike Ownership:** Who will own the technical spike and hardware validation?
3. **Final Hardware Specifications:** What are the final hardware specs for the exhibition?

## Repo Impact
- mobile: [scope from context.md]

---

## Stage Decomposition
1. **Stage 1: Technical/Data Spike**
   - Validate 3D quality and coverage for Al Reem Island and Khalifa City.
   - Test network independence using local-first strategies for 3D assets.
   - Conduct hardware performance benchmarking.

2. **Stage 2: 3D Shell and Explore Module**
   - Develop the basic 3D scene with AOI switching capabilities.
   - Implement the deterministic dataset and scoring engine.

3. **Stage 3: Assessment and Simulation Modules**
   - Build the deterministic assessment module with precomputed scores.
   - Develop the school simulation with precomputed service areas.

4. **Stage 4: Explanation and AI Layer**
   - Implement the template-based explanation layer.
   - Ensure the "Ask ADPIC AI" feature is constrained and context-aware.

5. **Stage 5: Hardening and Validation**
   - Conduct thorough testing on exhibition hardware.
   - Ensure all disclaimers and data validation are in place.
   - Prepare backup video and deterministic fallback options.

By following this structured approach, the project can address the key risks and ensure a reliable and compelling exhibition demo.

---

## Risks
[No risks found in gemini.md — fill manually]

## Verification Checklist
[No success criteria found in context.md — fill manually]

---

> Feed these stages to `ai workstream init` or to ChatGPT for full spec generation.
