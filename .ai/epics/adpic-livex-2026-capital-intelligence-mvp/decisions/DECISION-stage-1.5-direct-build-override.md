# DECISION — Stage 1.5 direct-build override (owner-authorized)

**Date:** 2026-09-04 · **Decided-By:** Project owner — "Stage 1.5" following my explicit recommendation to
use the direct-build override for 1.5 (certification-first is a proven dead-end in this environment; owner
authorized the override for 1.2/1.3/1.4). Owner given the explicit option to halt for certification instead.

Scope: direct build of **Stage 1.5 (Ask ADPIC AI + Hardening/Fallback) ONLY** (final stage). Build from a
certification-grade spec + anchored behavioural tests + mechanical verify.sh + live evidence; honor all
guardrails (template-first/no live-LLM core, sanitized LLM-adapter boundary, absent-info honesty, allowlisted
actions, deterministic fallback). Backup video + final hardware timing (WORK-OQ-10/11) are owner/operational
items flagged, not fabricated. STOP at the owner review gate.
