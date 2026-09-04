#!/usr/bin/env bash
# Stage 1.2 — post-build verification (Explore / 3D shell).
# Runs AFTER the builder implements src/. Each AC's done-criterion invokes this
# with its AC id. Pre-build, checks report NOT-YET-BUILT (non-zero) honestly.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2
AC="${1:-all}"
say(){ printf '  %s\n' "$*"; }

check_build(){ [ -f package.json ] || { say "AC-1: package.json missing (not yet built)"; return 1; }
  npm run build >/tmp/s12_build.log 2>&1 && say "AC-1: npm run build OK" || { say "AC-1: build FAILED"; return 1; }; }
check_scene(){ grep -rqE 'SceneView' src/ 2>/dev/null && grep -rqE 'SceneLayer|Esri3D_Buildings' src/ 2>/dev/null \
  && say "AC-1: SceneView + Esri 3D layer present" || { say "AC-1: SceneView/3D layer missing"; return 1; }; }
# Mandatory checklist (mechanical): no raw hex colors in COMPONENTS (*.tsx). Design tokens live in
# src/theme/*.css and are the sanctioned home for hex — components must reference tokens (var()/className).
check_no_raw_hex(){ local hits; hits=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.tsx' 2>/dev/null || true)
  [ -z "$hits" ] && say "AC-1: no raw hex in components (tokens only)" \
    || { say "AC-1: raw hex color(s) in component(s) — use tokens:"; printf '%s\n' "$hits" | head -5; return 1; }; }
check_explore(){ grep -rqiE 'KpiStrip' src/ && grep -rqiE 'Filters' src/ && grep -rqiE 'goTo|flyTo|fly-to' src/ \
  && say "AC-2: KPI+filters+fly-to present" || { say "AC-2: explore UI missing"; return 1; }; }
check_switch(){ grep -rqiE 'AoiSwitcher' src/ || { say "AC-3: switcher missing"; return 1; }
  local n; n=$(grep -rhoE 'new[[:space:]]+SceneView' src/ 2>/dev/null | wc -l | tr -d ' ')
  [ "${n:-0}" = "1" ] || { say "AC-3: SceneView constructed $n times (expected exactly 1 — swap on mounted view)"; return 1; }
  ! grep -rnE 'location\.reload|location\.href[[:space:]]*=|window\.location[[:space:]]*=' src/ >/dev/null 2>&1 \
    || { say "AC-3: full-reload call (location.reload/href=) present — switch must update the mounted view"; return 1; }
  say "AC-3: AOI switcher present; SceneView constructed once (n=$n); no full-reload call"; }
check_degrade(){ grep -rqiE 'reem.*(enabled|disable)|alReemEnabled|degrade' src/ 2>/dev/null \
  && say "AC-4: Al Reem degrade path present" || { say "AC-4: degrade path missing"; return 1; }; }
# Mandatory checklist (mechanical): Explore-only + no live LLM. Targets CODE (not narrative copy — the
# story legitimately says "Simulate its impact"): forbid LLM clients anywhere, and forbid Assessment/
# Simulate/Ask-AI brought in as MODULES (import paths) or used as COMPONENTS (<Assessment/<Simulate/<AskAI).
check_no_forbidden(){
  local llm mod comp
  llm=$(grep -rniE 'openai|anthropic|\bllm\b|chat[-_]?completion|assistants?[-_]?api' src --include='*.ts' --include='*.tsx' 2>/dev/null || true)
  mod=$(grep -rnE "from[[:space:]]+['\"][^'\"]*(assessment|simulat|ask[-_]?adpic|ask[-_]?ai)" src --include='*.ts' --include='*.tsx' 2>/dev/null || true)
  comp=$(grep -rnE '<(Assessment|Simulat|AskAdpic|AskAi|AskADPIC)' src --include='*.tsx' 2>/dev/null || true)
  local hits="$llm$mod$comp"
  [ -z "$hits" ] && say "AC-4: no live-LLM client and no Assessment/Simulate/Ask-AI module/component in src/" \
    || { say "AC-4: forbidden code (LLM client or Assessment/Simulate/Ask-AI module/component):"; printf '%s\n' "$llm" "$mod" "$comp" | grep . | head -5; return 1; }; }
check_data(){ [ -f src/data/provenance.ts ] || { say "AC-5: provenance.ts missing"; return 1; }
  # Every DATASET module (record-bearing) must carry a provenance tag. Datasets follow a naming
  # convention: *.demo.ts (synthetic), *boundaries.ts / *boundary.ts (geometry), and frozen *.json.
  # (Pure logic/type modules — provenance.ts, types.ts, filters.ts, kpis.ts — are not datasets.)
  local missing=""; for f in $(find src/data \( -name '*.demo.ts' -o -iname '*boundar*.ts' -o -name '*.json' \) 2>/dev/null); do
    grep -qE 'provenance|OFFICIAL_PUBLIC|DERIVED|SYNTHETIC_DEMO' "$f" || missing="$missing $f"; done
  [ -z "$missing" ] || { say "AC-5: datasets missing provenance tag:$missing"; return 1; }
  grep -rqE 'IS_DEMO|isDemo' src/data 2>/dev/null || { say "AC-5: synthetic records lack IS_DEMO"; return 1; }
  # STRUCTURAL mockup-number guard (fixes the vacuous bare-219 hole): forbid a numeric literal rendered as a
  # JSX TEXT NODE in src/ui — i.e. a KPI/count typed between tags: >219<, >AED 85B<, >~250,000<, >85%<.
  # Matches: optional AED/currency + digits (with . , ~ K M B % ) as the sole text of an element, OR a bare
  # 2+ digit number as the sole text. Ignores code numbers (coords/ids/px) which are never JSX text nodes.
  local jsx; jsx=$(grep -rnE '>[[:space:]]*(AED[[:space:]]*)?[~]?[0-9][0-9.,]*[[:space:]]*[KMB%]?[[:space:]]*<|>[[:space:]]*[0-9]{2,}[[:space:]]*<' src/ui 2>/dev/null || true)
  [ -z "$jsx" ] || { say "AC-5: hard-coded numeric literal in JSX text (KPIs must be computed from the dataset):"; printf '%s\n' "$jsx" | head -5; return 1; }
  grep -rqiE 'Attribution' src/ || { say "AC-5: attribution element missing"; return 1; }
  say "AC-5: all datasets (.ts+.json) provenance-tagged, IS_DEMO present, no hard-coded JSX KPI literal, attribution present"; }

case "$AC" in
  AC-1) check_build && check_scene && check_no_raw_hex ;;
  AC-2) check_explore ;;
  AC-3) check_switch ;;
  AC-4) check_degrade && check_no_forbidden ;;
  AC-5) check_data ;;
  all)  check_build; check_scene; check_no_raw_hex; check_explore; check_switch; check_degrade; check_no_forbidden; check_data ;;
  *) say "unknown AC '$AC'"; exit 2 ;;
esac
rc=$?
[ $rc -eq 0 ] && say "verify($AC): PASS" || say "verify($AC): NOT SATISFIED (pre-build or failing)"
exit $rc
