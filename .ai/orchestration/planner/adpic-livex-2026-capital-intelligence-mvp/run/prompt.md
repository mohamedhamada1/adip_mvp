# Canonical epic-create actor request

Semantic role: planner. Authorized capability: sanctioned-control-artifact-write.
Use that capability only to produce the epic artifacts required by this contract; do not implement product/runtime code or mutate lifecycle state.

# Epic Create — Claude-Led Epic Architecture Contract Generator

> 🧭 **Advisor tip:** epic architecture is decision-heavy — a good time for the human to enable the Claude Code Advisor (`/advisor`, e.g. Fable 5) for a strategic second opinion, then turn it off for mechanical work afterward. Guidance only (engine CLAUDE.md §0b); do not auto-toggle.

You are generating an Epic Architecture Contract from exploration findings or a user-provided topic.

**Input:** `$ARGUMENTS` — one of:
- `<epic-id> --from-file <path>` — generate from a seed/input file (notes, requirements, etc.)
- `<epic-id> --from-exploration <path>` — generate from an exploration output
- `<epic-id> --target-repo <path> --title "..."` — generate from scratch
- `<epic-id>` — generate interactively (ask for context)

**RULE: No implementation during epic create.** No code edits, no spec writing, no stage execution. This produces architecture, not code.

**RULE: Ground before proposing.** Before writing the epic, you MUST inspect the target repo to discover existing capabilities.

**RULE: Architecture-only output.** The epic must express work as architectural milestones ("prove X can Y"), not implementation tasks ("run X", "create file Y"). Commands may appear only in Communication Contracts (as capability references), never as execution steps. Use "Recommended Architectural Sequence" not "Recommended Next Action".

**RULE: Freshness verification.** After writing the epic, verify all stage status claims against actual repo state (`state.json`, `ROADMAP.md`). Fill the "Freshness Declaration" section with the verification date. If any claim is stale, fix it before validation.

**RULE: Authority hierarchy.** When sources conflict, this is the binding priority order:
1. **Current repo reality** (`state.json`, file existence, `ROADMAP.md`) — always wins
2. **Epic template contract** (`.ai/templates/epic_architecture_contract.md`) — defines required section names and structure
3. **Seed file / exploration notes** — informational input only; must NEVER override template section names or contradict repo state

If a seed file requests a section name that differs from the template (e.g., "Recommended Next Action" instead of "Recommended Architectural Sequence"), use the **template's name**. If exploration claims a stage is incomplete but `state.json` shows complete, trust `state.json`.

## Orchestration Sequence

### Phase 1: Parse Arguments

Parse `$ARGUMENTS` to determine:
- **Epic ID** (required) — slug like `auth-overhaul` or `payment-flow`
- **Source file** (optional) — `--from-file <path>` (seed file with notes/requirements)
- **Source exploration** (optional) — `--from-exploration <path-or-id>`
- **Target repo** (optional) — `--target-repo <path>` (defaults to current repo)
- **Title** (optional) — `--title "Human-readable title"`

Create the epic directory:
```bash
mkdir -p .ai/epics/$EPIC_ID
```

### Phase 2: Load Input Context

**If `--from-file` was provided:**

1. Read the seed/input file at the given path.
2. Extract goals, constraints, Figma links, known context, and any specific instructions.
3. Synthesize into working notes (do NOT dump verbatim into the epic).

**If `--from-exploration` was provided:**

1. Read the exploration's key files:
   - `synthesis.md` or the epic-ready output
   - `chatgpt.md`, `gemini.md`, `claude.md` (agent outputs)
   - `decision.md` (human decision)
   - `context.md` (original context)
   - `product_artifact.md` (if exists)
   - `ui_surfaces.md` (if exists)

2. Extract the exploration findings into working notes (do NOT dump them into the epic verbatim — synthesize).

**If neither was provided**, ask the user for:
- Problem statement
- Target architecture direction
- Platform scope
- Any known constraints

### Phase 3: Repo Grounding (MANDATORY)

Inspect the target repo to discover existing reality. This is NOT optional.

1. **Scan for related files:**
   - Use Grep/Glob to find files related to the epic's domain
   - Check scripts/, .ai/templates/, .claude/commands/
   - Check ROADMAP.md for related stages
   - Check .ai/contracts/, .ai/specs/ for related contracts
   - Check existing validators and commands

2. **Mandatory state.json cross-check (CRITICAL — MUST complete before Phase 4):**
   - For EVERY stage ID referenced in the seed, exploration, or ROADMAP: read `.ai/stages/{id}/state.json`
   - Extract `phase` and `status` fields from each state.json
   - If exploration/seed says "deferred" or "missing" but state.json says `status: complete` → trust state.json
   - If ROADMAP says "Complete" but state.json doesn't exist → flag as discrepancy
   - Record findings for the Freshness Declaration section
   - **Do NOT trust exploration/seed stage claims without verifying against state.json**
   - Build a stage status table:
     ```
     | Stage ID | Seed Claims | state.json | ROADMAP | Resolved Status | Conflict? |
     ```
   - Log every conflict under "Conflict Detection" in the epic output

3. **Identify existing capabilities:**
   - What already works?
   - What partially works?
   - What overlaps with the proposed epic?

4. **Detect conflicts (MANDATORY — log ALL under Conflict Detection):**
   - Naming conflicts with existing files/commands
   - Contract conflicts with existing sources of truth
   - Duplicate capabilities
   - Contradictions between existing code and proposed architecture
   - **Contradictions between seed/exploration claims and current repo state** (flag and resolve in favor of repo state)
   - **Stale exploration data** — if exploration references files, stages, or states that no longer match repo reality, log under "Conflict Detection" with resolution

5. **Form reuse/extend/replace/avoid recommendations** for each finding.

6. **Template section name enforcement (CRITICAL):**
   - The epic template defines canonical section names
   - If seed/exploration requests a different heading (e.g., "Recommended Next Action" instead of "Recommended Architectural Sequence"), use the TEMPLATE heading
   - If mismatch is detected, log it:
     ```
     WARN: Seed requested "Recommended Next Action" → using template canonical "Recommended Architectural Sequence"
     ```
   - This prevents the epic validator from failing on wrong section names

Report grounding summary to user:
```
Repo grounding complete:
- Existing capabilities: N found
- Conflicts detected: N
- Reuse candidates: N
```

### Phase 4: Generate Epic Architecture Contract

Load the template:
```bash
cat "$AI_ENGINE_ROOT/.ai/templates/epic_architecture_contract.md"
```

Generate the epic by filling every section of the template. Follow these rules:

**Seed-vs-template guard (CRITICAL):**
- The template defines the canonical section names. If the seed/exploration requests a section name that differs from the template, **use the template's name**.
- Example: seed says "Recommended Next Action" → template says "Recommended Architectural Sequence" → use "Recommended Architectural Sequence".
- If the seed requests sections not in the template, include them as subsections under the closest matching template section, or omit if they don't fit.
- If the seed/exploration claims a stage status that contradicts Phase 3 repo grounding, **use the repo-grounded status**.

**Content rules:**
- **Epic Problem / Goal:** Concrete, actionable. Not "improve X".
- **Existing System Grounding:** Must include ALL findings from Phase 3. Every file/command found must appear.
- **Conflict Detection:** Every conflict from Phase 3 must have a resolution decision.
- **Target Architecture:** High-level, not file-by-file. Describe shape and flow.
- **Platform Responsibilities:** Every platform gets a row. "Not involved" must include reason.
- **Communication Contracts:** Define boundaries at the right level — not too specific, not too vague.
- **Screen / UX Expectations:** Say N/A with reason if no UI, or list screens with ownership.
- **Figma / Design Inputs:** Carry forward from exploration if available.
- **Source of Truth:** MUST include positive authority language ("X is the single source of truth for Y").
- **Runtime vs Tooling Boundary:** MUST clearly separate runtime from tooling.
- **Core Invariants:** Minimum 3. Must be enforceable. No vague words.
- **Architecture Decisions:** Minimum 2. Each must include decision, reason, alternatives rejected, consequences.
- **Stage Breakdown:** Each stage must include ALL 11 required fields.
- **Dependency Graph:** Text or Mermaid showing stage relationships.
- **Risks / Open Questions:** Separate blocking from non-blocking.
- **Must Preserve / Must Not Change:** Epic-level constraints.
- **Recommended Architectural Sequence:** Express next work as milestones ("prove X can Y"), NOT implementation tasks. NEVER use "Recommended Next Action" as a section name.
- **Freshness Declaration (MANDATORY):** Must include:
  - `Last verified against repo:` today's date
  - `Verification method:` `ai epic create` (or `ai epic refresh`)
  - `Stages verified via state.json:` list stage IDs checked and their actual status
  - `Latest completed stage:` highest stage ID with `status: complete`
  - `Stale exploration conflicts resolved:` list any seed/exploration claims that were overridden by repo state, or "None"
  - `Known stale sections:` "None" if all sections are fresh

**If source exploration exists:** Pull from exploration findings but add depth from repo grounding. **If exploration claims conflict with repo state, repo state wins — document the override in Freshness Declaration.**
**If no exploration:** Build from user input and repo grounding alone.

Write the epic to:
```
.ai/epics/$EPIC_ID/architecture.md
```

### Phase 4.5: Work-Contract Coverage (MANDATORY when `--from-file` is a WORK-*-tagged contract)

If the source file carries `WORK-<CLASS>-<n>` ids (the work-contract template
`$AI_ENGINE_ROOT/.ai/templates/work_contract.md`), you MUST **preserve the whole contract**, not
synthesize it away. The engine enforces this with a fail-closed gate (`ai-validate-work-coverage.sh`);
epic creation is rejected unless all of the following hold.

**RULE — do NOT dissolve identity.** Every material `WORK-*` item must reach a **type-correct** destination
and be recorded; every epic requirement/decision must cite where it came from.

1. **Extract** every `WORK-*` id + its class from the source (class = the prefix; e.g. `WORK-AC-*`
   acceptance, `WORK-OOS-*` out-of-scope, `WORK-BR-*` business-rule, `WORK-DEC-*` decision, …).
2. **Place each by type** (do NOT turn everything into a requirement):
   acceptance/functional/business-rule → a stage `##### Requirements` `- RR-n:` root; out-of-scope →
   `### Not Doing` / Must-Not-Change; constraint/must-preserve → Core Invariant / Must-Preserve;
   dependency → the stage dependency graph; decision → `### Decision N`; risk → Risks/Open Questions;
   UX → Screen/UX Expectations + the owning UI stage; data-model → an Architecture Decision + owning
   stage; rollout → readiness/go-live; non-functional → invariants + owning stage; example → Success
   Proof / test.
3. **Annotate provenance.** Every stage `- RR-n:` bullet ends with `— source: WORK-<CLASS>-<n>` (or
   `source: DERIVED — <rationale>`). Every `### Decision N` block contains a
   `- **Source:** WORK-<CLASS>-<n>` or `- **Source:** DERIVED — <rationale>` line.
   **Deriving MORE requirements/acceptance criteria is EXPECTED, not forbidden** — a good epic elaborates
   the acceptance criteria a business case requires but the work.md left implicit (e.g. splitting a
   merchant-level `WORK-AC-*` into per-branch validation, or adding the negative/edge cases a rule
   implies). Mark each such item `source: DERIVED — <business rationale>`. The gate PERMITS derived
   requirements; it fails only on **UN-sourced (silent) invention** — a requirement/decision with neither
   a `WORK-*` source nor an explicit `DERIVED` rationale. So: derive freely, but always attribute.
4. **Emit the coverage map** `.ai/epics/$EPIC_ID/evidence/work_coverage.json` per
   `$AI_ENGINE_ROOT/.ai/contracts/work_coverage.schema.json`:
   `{schemaVersion, kind:"work_coverage", work_file, work_file_sha256 (sha256 of the source),
     coverage:[{work_id, type, disposition, destination, rationale}]}`. **One entry per `WORK-*`
   (NO-DROP).** `disposition ∈ PRESERVED|TRANSFORMED|PARTIALLY_PROJECTED|DEFERRED|OUT_OF_SCOPE|DROPPED`;
   a present disposition needs a real `destination` naming the epic artifact (RR-n / Decision N that
   actually exists); DEFERRED/OUT_OF_SCOPE/DROPPED need a `rationale`. `type` must equal the class of its
   `work_id`.

If the source file has **no** `WORK-*` ids (untagged legacy), this phase is skipped (the gate grace-passes)
— but recommend the author adopt `work_contract.md` so their contract can be proven preserved.

### Phase 5: Validate

Run the epic validator:
```bash
bash "$AI_ENGINE_ROOT/scripts/ai-validate-epic.sh" ".ai/epics/$EPIC_ID/architecture.md"
```

For a `--from-file` epic, ALSO run the work-coverage gate (the same one `ai epic create` runs; fail-closed):
```bash
bash "$AI_ENGINE_ROOT/scripts/ai-validate-work-coverage.sh" ".ai/epics/$EPIC_ID/architecture.md" --work-file "<source>"
```

ALWAYS run the deterministic freshness/conflict gate (fail-closed — this enforces the "Freshness
verification" and "Conflict Detection" RULEs above against repo reality; a fresh epic MUST carry a
filled Freshness Declaration, no placeholder, and no stale `Stage X is done` claim vs `state.json`):
```bash
bash "$AI_ENGINE_ROOT/scripts/ai-validate-epic-freshness.sh" ".ai/epics/$EPIC_ID/architecture.md"
```
(This is strict by default: a newly-created epic missing/placeholdered freshness is a defect to fix,
not a warning. Use `--lenient` only when re-validating a legacy epic.)

If validation fails:
- Fix the issues in the epic file (add missing coverage entries, source annotations, or type-correct
  placements — never delete assertions or drop a WORK-* to make it pass)
- Re-run validation until it passes

### Phase 6: Present to User

```
## Epic Architecture Contract Created

**Epic:** $EPIC_ID
**Title:** $TITLE
**File:** .ai/epics/$EPIC_ID/architecture.md

### Repo Grounding Summary
- Existing capabilities found: N
- Conflicts resolved: N
- Reuse recommendations: N

### Validation
- Status: PASS/FAIL
- Score: N/100

### Stages Proposed
1. Stage X.1 — [Title]
2. Stage X.2 — [Title]
...

**Next steps:**
1. Review the epic: .ai/epics/$EPIC_ID/architecture.md
2. Validate: ai epic validate .ai/epics/$EPIC_ID/architecture.md
3. Seed stages: ai stage seed --from-epic .ai/epics/$EPIC_ID/architecture.md
4. Execute: ai auto <stage-id>
```

## Error Handling

- If target repo cannot be determined: ask the user.
- If exploration file not found: report error with path tried.
- If repo grounding finds fundamental blockers: flag them, ask user whether to continue.
- If validation fails after 2 fix attempts: present the epic as-is with validation output and let user decide.

## Token Efficiency

- Do NOT dump full exploration files inline. Reference paths.
- Grounding: use Grep/Glob/Read, max 3-5 files deep.
- Keep status updates to 1 line each between phases.
- The epic file itself is the detailed output — your conversation output should be a summary.


## Invocation arguments

Treat the following as the exact value of `$ARGUMENTS`:

```text
adpic-livex-2026-capital-intelligence-mvp --from-exploration .ai/explorations/2026-09-04_work-adpic-livex-2026-capital-intelligence-geoai-m --title $'ADPIC LIVEX 2026 �\200\224 Capital Intelligence GeoAI MVP' 
```
