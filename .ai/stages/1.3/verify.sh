#!/usr/bin/env bash
# Stage 1.3 — post-build verification (Deterministic Assessment + Evidence).
# Runs AFTER the builder implements src/assessment + Assessment UI. Each AC's done-criterion invokes this
# with its AC id. Pre-build, checks report NOT-YET-BUILT (non-zero) honestly.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2
AC="${1:-all}"
say(){ printf '  %s\n' "$*"; }

# Exact approved WORK-BR-15 disclaimer (distinctive substring).
DISCLAIMER="Illustrative decision-support assessment for demonstration purposes"

check_build(){ [ -f package.json ] || { say "AC-1: package.json missing (not yet built)"; return 1; }
  npm run build >/tmp/s13_build.log 2>&1 && say "AC-1: npm run build OK" || { say "AC-1: build FAILED (see /tmp/s13_build.log)"; return 1; }; }

check_engine(){ for f in src/assessment/scoringEngine.ts src/assessment/weights.config.ts src/assessment/indicators.ts; do
    [ -f "$f" ] || { say "AC-1: missing $f"; return 1; }; done
  # PURITY: a deterministic engine must not use randomness, wall-clock, or network.
  local imp; imp=$(grep -rnE 'Math\.random|Date\.now|new Date|[^a-zA-Z]fetch\(|XMLHttpRequest|WebSocket' src/assessment 2>/dev/null || true)
  [ -z "$imp" ] || { say "AC-1: non-deterministic construct in src/assessment (purity):"; printf '%s\n' "$imp" | head -4; return 1; }
  say "AC-1: engine + weights + indicators present; src/assessment is pure (no random/clock/network)"; }

run_tests(){ [ -f package.json ] || { say "$1: not yet built"; return 1; }
  npm test >/tmp/s13_test.log 2>&1 && { say "$1: npm test PASS ($(grep -oE '[0-9]+ passed' /tmp/s13_test.log | tail -1))"; return 0; } \
    || { say "$1: npm test FAILED (see /tmp/s13_test.log)"; return 1; }; }

check_disclaimer(){ grep -rqF "$DISCLAIMER" src/ 2>/dev/null \
  && say "AC-3: exact WORK-BR-15 disclaimer present" || { say "AC-3: approved disclaimer wording missing/altered"; return 1; }; }

check_authority(){
  # No AI-as-approver/decider phrasing in the UI.
  local bad; bad=$(grep -rniE 'AI[ -]?(approv|reject|authoriz|decid|recommend)|approved by AI|AI (decision|verdict|approval)' src/ui 2>/dev/null || true)
  [ -z "$bad" ] || { say "AC-4: AI-as-approver phrasing in src/ui (AI explains, never approves):"; printf '%s\n' "$bad" | head -4; return 1; }
  # Result attributed to GIS/rules (a marker must exist somewhere in the assessment code).
  grep -rqiE 'GIS indicators \+ business rules|attributedTo|business rules' src/assessment src/ui 2>/dev/null \
    || { say "AC-4: no rules-attribution marker (result must be attributed to GIS/rules)"; return 1; }
  # No live-LLM client and no Simulate/Ask-AI module (Assessment-only).
  local fb; fb=$(grep -rniE 'openai|anthropic|\bllm\b|chat[-_]?completion' src --include='*.ts' --include='*.tsx' 2>/dev/null || true)
  fb="$fb$(grep -rnE "from[[:space:]]+['\"][^'\"]*(simulat|ask[-_]?adpic|ask[-_]?ai)" src --include='*.ts' --include='*.tsx' 2>/dev/null || true)"
  [ -z "$fb" ] || { say "AC-4: live-LLM client or Simulate/Ask-AI module in src/:"; printf '%s\n' "$fb" | head -4; return 1; }
  # No raw hex in components.
  local hex; hex=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.tsx' 2>/dev/null || true)
  [ -z "$hex" ] || { say "AC-4: raw hex in component(s) — use tokens:"; printf '%s\n' "$hex" | head -4; return 1; }
  say "AC-4: rules-attributed, explanation separated, no AI-approver phrasing, no LLM/forbidden module, no raw hex"; }

check_weights_label(){ grep -rqiE 'illustrative' src/assessment/weights.config.ts 2>/dev/null \
  && grep -rqiE 'not[^.]{0,20}official|non-official|exhibition[- ]?only' src/assessment/weights.config.ts 2>/dev/null \
  && say "AC-5: weights labeled illustrative / not official ADPIC methodology" \
  || { say "AC-5: weights.config.ts missing the illustrative / not-official label"; return 1; }; }

# AC-7: the Assessment is actually WIRED into the app flow (not shippable unreachable). Structural check
# that AppShell imports Assessment and has an Evaluate/select handler; behaviour proven by the integration test.
check_wiring(){ [ -f src/AppShell.tsx ] || { say "AC-7: src/AppShell.tsx missing"; return 1; }
  grep -qE "import[^\n]*Assessment" src/AppShell.tsx 2>/dev/null || { say "AC-7: AppShell does not import Assessment (unwired)"; return 1; }
  grep -qiE 'evaluate|scoreProject|selected' src/AppShell.tsx 2>/dev/null || { say "AC-7: AppShell has no Evaluate/select wiring"; return 1; }
  say "AC-7: Assessment wired into AppShell (Explore→Evaluate)"; }

case "$AC" in
  AC-1) check_build && check_engine && run_tests "AC-1" ;;
  AC-2) run_tests "AC-2" ;;
  AC-3) check_disclaimer ;;
  AC-4) check_authority ;;
  AC-5) check_weights_label ;;
  AC-6) run_tests "AC-6" ;;
  AC-7) check_wiring && run_tests "AC-7" ;;
  all)  check_build; check_engine; check_disclaimer; check_authority; check_weights_label; check_wiring; run_tests "TESTS" ;;
  *) say "unknown AC '$AC'"; exit 2 ;;
esac
rc=$?
[ $rc -eq 0 ] && say "verify($AC): PASS" || say "verify($AC): NOT SATISFIED (pre-build or failing)"
exit $rc
