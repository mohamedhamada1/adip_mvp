#!/usr/bin/env bash
# Stage 1.2 — post-build verification (Explore / 3D shell).
# Runs AFTER the builder implements src/. Each AC's done-criterion invokes this
# with its AC id. Pre-build, checks report NOT-YET-BUILT (non-zero) honestly.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT" || exit 2
AC="${1:-all}"
rc=0
say(){ printf '  %s\n' "$*"; }

check_build(){ [ -f package.json ] || { say "AC-1: package.json missing (not yet built)"; return 1; }
  npm run build >/tmp/s12_build.log 2>&1 && say "AC-1: npm run build OK" || { say "AC-1: build FAILED"; return 1; }; }
check_scene(){ grep -rqE 'SceneView' src/ 2>/dev/null && grep -rqE 'SceneLayer|Esri3D_Buildings' src/ 2>/dev/null \
  && say "AC-1: SceneView + Esri 3D layer present" || { say "AC-1: SceneView/3D layer missing"; return 1; }; }
check_explore(){ grep -rqiE 'KpiStrip' src/ && grep -rqiE 'Filters' src/ && grep -rqiE 'goTo|flyTo|fly-to' src/ \
  && say "AC-2: KPI+filters+fly-to present" || { say "AC-2: explore UI missing"; return 1; }; }
check_switch(){ grep -rqiE 'AoiSwitcher' src/ && say "AC-3: AOI switcher present" || { say "AC-3: switcher missing"; return 1; }; }
check_degrade(){ grep -rqiE 'reem.*(enabled|disable)|alReemEnabled|degrade' src/ 2>/dev/null \
  && say "AC-4: Al Reem degrade path present" || { say "AC-4: degrade path missing"; return 1; }; }
check_data(){ [ -f src/data/provenance.ts ] && grep -rqE 'IS_DEMO|isDemo' src/data 2>/dev/null \
  && ! grep -rnE '\b(139|219)\b|AED[ ]?85B' src/ >/dev/null 2>&1 \
  && grep -rqiE 'Attribution' src/ \
  && say "AC-5: provenance+IS_DEMO, no mockup numbers, attribution present" || { say "AC-5: data/provenance/attribution guard FAILED"; return 1; }; }

case "$AC" in
  AC-1) check_build && check_scene ;;
  AC-2) check_explore ;;
  AC-3) check_switch ;;
  AC-4) check_degrade ;;
  AC-5) check_data ;;
  all)  check_build; check_scene; check_explore; check_switch; check_degrade; check_data ;;
  *) say "unknown AC '$AC'"; exit 2 ;;
esac
rc=$?
[ $rc -eq 0 ] && say "verify($AC): PASS" || say "verify($AC): NOT SATISFIED (pre-build or failing)"
exit $rc
