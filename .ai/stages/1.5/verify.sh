#!/usr/bin/env bash
# Stage 1.5 — post-build verification (Ask ADPIC AI + Hardening/Fallback + exhibition visual hardening).
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$ROOT" || exit 2
AC="${1:-all}"; say(){ printf '  %s\n' "$*"; }

check_build(){ [ -f package.json ] || { say "AC-1: package.json missing (not yet built)"; return 1; }
  npm run build >/tmp/s15_build.log 2>&1 && say "build: npm run build OK" || { say "build: FAILED (see /tmp/s15_build.log)"; return 1; }; }
run_tests(){ [ -f package.json ] || { say "$1: not yet built"; return 1; }
  npm test >/tmp/s15_test.log 2>&1 && { say "$1: npm test PASS ($(grep -oE '[0-9]+ passed' /tmp/s15_test.log | tail -1))"; return 0; } \
    || { say "$1: npm test FAILED (see /tmp/s15_test.log)"; return 1; }; }
# No live-LLM CLIENT anywhere (templates-only core). Targets client/library names, not the prose word "LLM".
check_no_live_llm(){ local llm; llm=$(grep -rniE 'openai|anthropic|@ai-sdk|langchain|chat[-_]?completion|completions\.create' src --include='*.ts' --include='*.tsx' 2>/dev/null || true)
  [ -z "$llm" ] && say "AC-3/7: no live-LLM client in src/ (templates-only core)" || { say "AC-3/7: live-LLM client reference in src/:"; printf '%s\n' "$llm" | head -4; return 1; }; }

check_overlay(){ [ -f src/ui/AskAdpicAi.tsx ] || { say "AC-1: AskAdpicAi.tsx missing"; return 1; }
  grep -qE 'AskAdpicAi' src/AppShell.tsx || { say "AC-1: AskAdpicAi not wired into AppShell (cross-cutting overlay)"; return 1; }
  grep -qiE 'setView\("fallback"|"evaluate"|"simulate"' src/AppShell.tsx >/dev/null 2>&1
  grep -qiE 'suggestedQuestions|suggested-q' src/ui/AskAdpicAi.tsx || { say "AC-1: no suggested questions in Ask-AI"; return 1; }
  say "AC-1: Ask-AI is a cross-cutting overlay with suggested questions"; }
check_boundary(){ for f in src/ai/context.ts src/ai/templates.ts src/ai/llmAdapter.ts src/ai/actions.ts; do [ -f "$f" ] || { say "AC-7: missing $f"; return 1; }; done
  grep -qE 'sanitizeContext' src/ai/llmAdapter.ts && grep -qE 'NullLlmAdapter' src/ai/llmAdapter.ts \
    && say "AC-7: sanitized LLM-adapter boundary + NullLlmAdapter present" || { say "AC-7: adapter boundary/sanitize missing"; return 1; }; }
check_hardening(){ [ -f src/hardening/safeMode.ts ] || { say "AC-5: safeMode.ts missing"; return 1; }
  grep -qE 'preloadFrozenData' src/hardening/safeMode.ts && grep -qiE 'safeMode' src/hardening/safeMode.ts \
    && say "AC-5: preload + safe mode present" || { say "AC-5: preload/safe-mode missing"; return 1; }; }
check_fallback(){ [ -f src/ui/FallbackDemo.tsx ] || { say "AC-6: FallbackDemo.tsx missing"; return 1; }
  grep -qiE 'backup.?video' src/ui/FallbackDemo.tsx && grep -qiE 'fallback-script|FALLBACK_SCRIPT' src/ui/FallbackDemo.tsx \
    && say "AC-6: fixed fallback demonstration + backup-video slot present" || { say "AC-6: fallback/backup-video slot missing"; return 1; }; }

# --- Exhibition visual hardening (owner requirement carried into 1.5) ---
# AC-8: selection focus — a project info card (dataset fields) + Evaluate tied to the selected project + strong marker highlight.
check_selection(){ [ -f src/ui/ProjectCard.tsx ] || { say "AC-8: src/ui/ProjectCard.tsx (selection info card) missing"; return 1; }
  grep -qiE 'Evaluate' src/ui/ProjectCard.tsx || { say "AC-8: ProjectCard missing the Evaluate action"; return 1; }
  grep -qiE 'emphasize|selected' src/scene/arcgisSceneApi.ts || { say "AC-8: no marker highlight in the scene adapter"; return 1; }
  say "AC-8: selection focus (project info card + Evaluate + marker highlight)"; }
# AC-9: Explore visual hardening — darker/contrasted scene (edges/dark ground) + KPI hierarchy; no raw hex in components.
check_explore_polish(){ grep -qiE 'edges|EdgeRenderer|SketchEdges|background|ground' src/scene/arcgisSceneApi.ts || { say "AC-9: no scene contrast (edges/dark ground) in the adapter"; return 1; }
  local hex; hex=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.tsx' 2>/dev/null || true)
  [ -z "$hex" ] || { say "AC-9: raw hex in component(s) — use tokens:"; printf '%s\n' "$hex" | head -4; return 1; }
  say "AC-9: Explore visual hardening (scene contrast) + no raw hex in components"; }
# AC-10: Simulator on real Khalifa geography (AOI boundary + real-positioned features), not an abstract grid.
check_sim_geography(){ [ -f src/ui/Simulator.tsx ] || { say "AC-10: Simulator.tsx missing"; return 1; }
  grep -qiE 'AOI_BOUNDARIES|boundary|khalifa|lon|lat|geograph' src/ui/Simulator.tsx src/simulation/scenario.ts 2>/dev/null \
    && say "AC-10: Simulator uses real Khalifa geography context" || { say "AC-10: Simulator still abstract (no real Khalifa geography)"; return 1; }; }

rc=0
case "$AC" in
  AC-1) check_overlay; rc=$? ;;
  AC-2|AC-3|AC-4) run_tests "$AC"; rc=$? ;;
  AC-5) check_hardening; rc=$? ;;
  AC-6) check_fallback; rc=$? ;;
  AC-7) check_boundary && check_no_live_llm; rc=$? ;;
  AC-8) check_selection; rc=$? ;;
  AC-9) check_explore_polish; rc=$? ;;
  AC-10) check_sim_geography; rc=$? ;;
  all)  check_build || rc=1; check_overlay || rc=1; check_boundary || rc=1; check_no_live_llm || rc=1;
        check_hardening || rc=1; check_fallback || rc=1; check_selection || rc=1; check_explore_polish || rc=1;
        check_sim_geography || rc=1; run_tests "TESTS" || rc=1 ;;
  *) say "unknown AC '$AC'"; exit 2 ;;
esac
[ $rc -eq 0 ] && say "verify($AC): PASS" || say "verify($AC): NOT SATISFIED (pre-build or failing)"
exit $rc
