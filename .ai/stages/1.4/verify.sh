#!/usr/bin/env bash
# Stage 1.4 — post-build verification (Liveability Impact Simulator).
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$ROOT" || exit 2
AC="${1:-all}"; say(){ printf '  %s\n' "$*"; }

check_build(){ [ -f package.json ] || { say "AC-1: package.json missing (not yet built)"; return 1; }
  npm run build >/tmp/s14_build.log 2>&1 && say "AC-1: npm run build OK" || { say "AC-1: build FAILED (see /tmp/s14_build.log)"; return 1; }; }
check_engine(){ for f in src/simulation/simulationEngine.ts src/simulation/scenario.ts src/simulation/populationZones.ts; do
    [ -f "$f" ] || { say "AC-1: missing $f"; return 1; }; done
  local imp; imp=$(grep -rnE 'Math\.random|Date\.now|new Date|[^a-zA-Z]fetch\(|XMLHttpRequest|WebSocket' src/simulation 2>/dev/null || true)
  [ -z "$imp" ] || { say "AC-1: non-deterministic construct in src/simulation (purity):"; printf '%s\n' "$imp" | head -4; return 1; }
  say "AC-1: engine present; src/simulation is pure (no random/clock/network)"; }
run_tests(){ [ -f package.json ] || { say "$1: not yet built"; return 1; }
  npm test >/tmp/s14_test.log 2>&1 && { say "$1: npm test PASS ($(grep -oE '[0-9]+ passed' /tmp/s14_test.log | tail -1))"; return 0; } \
    || { say "$1: npm test FAILED (see /tmp/s14_test.log)"; return 1; }; }
# AC-4: reveal sequence wiring — Simulator has a current/after state machine + a Simulate handler.
check_sequence(){ [ -f src/ui/Simulator.tsx ] || { say "AC-4: src/ui/Simulator.tsx missing"; return 1; }
  grep -qiE 'current|before' src/ui/Simulator.tsx && grep -qiE 'simulate|after' src/ui/Simulator.tsx \
    && say "AC-4: Simulator has current→Simulate→after sequence" || { say "AC-4: Simulator missing the reveal sequence"; return 1; }; }
# AC-5: hypothetical/demo school label.
check_hypothetical(){ grep -rqiE 'hypothetical|demo' src/simulation/scenario.ts 2>/dev/null \
  && grep -rqiE 'hypothetical|demo' src/ui/Simulator.tsx 2>/dev/null \
  && say "AC-5: proposed school labeled hypothetical/demo" || { say "AC-5: hypothetical/demo label missing (scenario/UI)"; return 1; }; }
# AC-6: no hard-coded numeric JSX literal in the Simulator; no raw hex; no live LLM.
check_no_mockup(){ [ -f src/ui/Simulator.tsx ] || { say "AC-6: Simulator.tsx missing"; return 1; }
  local jsx; jsx=$(grep -rnE '>[[:space:]]*[+-]?(AED[[:space:]]*)?[~]?[0-9][0-9.,]*[[:space:]]*[KMB%]?[[:space:]]*<|>[[:space:]]*[+-]?[0-9]{2,}[[:space:]]*<' src/ui/Simulator.tsx 2>/dev/null || true)
  [ -z "$jsx" ] || { say "AC-6: hard-coded numeric JSX literal in Simulator (values must come from the engine):"; printf '%s\n' "$jsx" | head -4; return 1; }
  local hex; hex=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' src/ui/Simulator.tsx 2>/dev/null || true)
  [ -z "$hex" ] || { say "AC-6: raw hex in Simulator — use tokens"; return 1; }
  local llm; llm=$(grep -rniE 'openai|anthropic|@ai-sdk|langchain|chat[-_]?completion' src/simulation src/ui/Simulator.tsx 2>/dev/null || true)
  [ -z "$llm" ] || { say "AC-6: live-LLM client reference in simulation/simulator"; return 1; }
  say "AC-6: no hard-coded JSX numeric literal, no raw hex, no live-LLM in the simulator"; }

rc=0
case "$AC" in
  AC-1) check_build && check_engine && run_tests "AC-1"; rc=$? ;;
  AC-2) run_tests "AC-2"; rc=$? ;;
  AC-3) run_tests "AC-3"; rc=$? ;;
  AC-4) check_sequence && run_tests "AC-4"; rc=$? ;;
  AC-5) check_hypothetical; rc=$? ;;
  AC-6) check_no_mockup; rc=$? ;;
  all)  check_build || rc=1; check_engine || rc=1; check_sequence || rc=1; check_hypothetical || rc=1; check_no_mockup || rc=1; run_tests "TESTS" || rc=1 ;;
  *) say "unknown AC '$AC'"; exit 2 ;;
esac
[ $rc -eq 0 ] && say "verify($AC): PASS" || say "verify($AC): NOT SATISFIED (pre-build or failing)"
exit $rc
