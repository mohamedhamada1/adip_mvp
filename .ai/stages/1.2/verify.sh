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
check_switch(){ grep -rqiE 'AoiSwitcher' src/ || { say "AC-3: switcher missing"; return 1; }
  # SceneView must be constructed exactly once (swap on the mounted view, not re-instantiated per switch)
  local n; n=$(grep -rhoE 'new[[:space:]]+SceneView' src/ 2>/dev/null | wc -l | tr -d ' ')
  [ "${n:-0}" = "1" ] || { say "AC-3: SceneView constructed $n times (expected exactly 1 — swap on mounted view)"; return 1; }
  # AOI switching must NOT force a full document reload
  ! grep -rnE 'location\.reload|location\.href[[:space:]]*=|window\.location[[:space:]]*=' src/ >/dev/null 2>&1 \
    || { say "AC-3: full-reload call (location.reload/href=) present — switch must update the mounted view"; return 1; }
  say "AC-3: AOI switcher present; SceneView constructed once (n=$n); no full-reload call"; }
check_degrade(){ grep -rqiE 'reem.*(enabled|disable)|alReemEnabled|degrade' src/ 2>/dev/null \
  && say "AC-4: Al Reem degrade path present" || { say "AC-4: degrade path missing"; return 1; }; }
check_data(){ [ -f src/data/provenance.ts ] || { say "AC-5: provenance.ts missing"; return 1; }
  # EVERY dataset module under src/data — .ts AND frozen .json (e.g. AD-SDI boundaries) — must carry a
  # provenance tag; only the type module provenance.ts is exempt.
  local missing=""; for f in $(find src/data \( -name '*.ts' -o -name '*.json' \) ! -name 'provenance.ts' 2>/dev/null); do
    grep -qE 'provenance|OFFICIAL_PUBLIC|DERIVED|SYNTHETIC_DEMO' "$f" || missing="$missing $f"; done
  [ -z "$missing" ] || { say "AC-5: datasets missing provenance tag:$missing"; return 1; }
  grep -rqE 'IS_DEMO|isDemo' src/data 2>/dev/null || { say "AC-5: synthetic records lack IS_DEMO"; return 1; }
  # deterministic mockup guard: distinctive budget literals (AED <n>B, incl. 85B/1.42B) — NOT bare 139/219
  ! grep -rnE 'AED[ ]*[0-9]+([.][0-9]+)?[ ]*B|\b[0-9]+([.][0-9]+)?B\b' src/ >/dev/null 2>&1 \
    || { say "AC-5: mockup budget literal (AED <n>B) present in src/ — KPIs must be computed"; return 1; }
  grep -rqiE 'Attribution' src/ || { say "AC-5: attribution element missing"; return 1; }
  say "AC-5: all datasets (.ts+.json) provenance-tagged, IS_DEMO present, no mockup budget literal, attribution present"; }

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
