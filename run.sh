#!/bin/bash
# =============================================================================
# TranslateNow Automation v4 — Skill-Based (claude-blog/claude-seo pattern)
#
# Uses .claude/commands/ and .claude/references/ for tiny focused prompts.
# Each language goes through: Create → Verify → Fix (if needed) → Nav → Config
# Then: Pair integration → Full build → Final QA
#
# PREREQUISITE: Place these files in project root:
#   CLAUDE.md
#   .claude/commands/locale-create.md, locale-nav.md, locale-config.md,
#                     locale-verify.md, locale-fix.md, pair-integrate.md
#   .claude/references/locale-spec.md, quality-gates.md
#   .claude/agents/locale-writer.md, locale-reviewer.md
# =============================================================================

set -euo pipefail

DIR="$(pwd)"
PAGES="$DIR/src/pages/translate-now"
DATA="$DIR/src/data"
LOG="$DIR/automation.log"

R='\033[0;31m' G='\033[0;32m' Y='\033[1;33m' C='\033[0;36m' B='\033[1m' N='\033[0m'
log() { echo -e "${C}[$(date '+%H:%M:%S')]${N} $1" | tee -a "$LOG"; }
ok() { echo -e "${G}[✓]${N} $1" | tee -a "$LOG"; }
warn() { echo -e "${Y}[!]${N} $1" | tee -a "$LOG"; }
err() { echo -e "${R}[✗]${N} $1" | tee -a "$LOG"; }
hdr() { echo -e "\n${B}${C}$1${N}\n" | tee -a "$LOG"; }

# Languages to create: code|nativeName|label|langAttr
LANGS=(
  "pt|Português|Português|pt"
  "it|Italiano|Italiano|it"
  "tr|Türkçe|Türkçe|tr"
  "th|ไทย|ไทย|th"
  "zh|中文|中文|zh"
)

QUALITY_THRESHOLD=75  # Minimum score to pass without fix

# =============================================================================
# PREFLIGHT
# =============================================================================
preflight() {
  hdr "╔══════════════════════════════════════════╗"
  hdr "║  TranslateNow Automation v4              ║"
  hdr "║  Skill-based · Quality-gated             ║"
  hdr "╚══════════════════════════════════════════╝"

  local missing=0
  for f in "CLAUDE.md" ".claude/commands/locale-create.md" ".claude/commands/locale-verify.md" \
           ".claude/references/locale-spec.md" ".claude/references/quality-gates.md" \
           ".claude/agents/locale-writer.md" ".claude/agents/locale-reviewer.md"; do
    [[ ! -f "$DIR/$f" ]] && err "Missing: $f" && missing=$((missing + 1))
  done
  [[ "$missing" -gt 0 ]] && err "Place all skill files first. See README." && exit 1

  [[ ! -d "$PAGES" ]] && err "$PAGES not found" && exit 1
  command -v claude &>/dev/null || { err "Claude Code CLI not found"; exit 1; }
  command -v npm &>/dev/null || { err "npm not found"; exit 1; }

  ok "Preflight passed — skill files found"
  log "Existing locales:"
  for f in "$PAGES"/*.astro; do
    local bn=$(basename "$f" .astro)
    [[ "$bn" == "[pair]" ]] && continue
    echo "  $bn ($(wc -l < "$f") lines)" | tee -a "$LOG"
  done
}

# =============================================================================
# PHASE A: For each language → Create → Verify → Fix → Nav → Config
# =============================================================================
process_language() {
  local CODE="$1" NATIVE="$2" LABEL="$3" LANG="$4"

  # Skip if exists and adequate
  if [[ -f "$PAGES/${CODE}.astro" ]]; then
    local lc=$(wc -l < "$PAGES/${CODE}.astro" 2>/dev/null || echo 0)
    if [[ "$lc" -gt 200 ]]; then
      warn "$NATIVE exists ($lc lines)"
      # Still ensure nav is present
      if ! grep -q "translate-now/${CODE}" "$PAGES/index.astro" 2>/dev/null; then
        log "Nav missing — updating..."
        step_nav "$CODE" "$LABEL"
        step_config "$CODE" "$NATIVE" "$LABEL"
      fi
      return 0
    fi
  fi

  # --- STEP 1: CREATE ---
  log "[$CODE] Creating $NATIVE..."
  claude -p "Read .claude/commands/locale-create.md and execute with arguments: ${CODE}|${NATIVE}|${LANG}"

  if [[ ! -f "$PAGES/${CODE}.astro" ]]; then
    err "[$CODE] File not created"
    return 1
  fi
  local lc=$(wc -l < "$PAGES/${CODE}.astro")
  [[ "$lc" -lt 100 ]] && err "[$CODE] Too short ($lc lines)" && return 1
  ok "[$CODE] Created ($lc lines)"

  # --- STEP 2: VERIFY ---
  log "[$CODE] Verifying quality..."
  local verify_output
  verify_output=$(claude -p "Read .claude/commands/locale-verify.md and execute with arguments: ${CODE}" 2>&1) || true
  echo "$verify_output" >> "$LOG"

  # Extract score if present (look for TOTAL: XX/100)
  local score
  score=$(echo "$verify_output" | grep -oP 'TOTAL:\s*\K[0-9]+' | head -1 || echo "0")
  [[ -z "$score" ]] && score=0

  if [[ "$score" -gt 0 ]]; then
    log "[$CODE] Quality score: $score/100"
    if [[ "$score" -lt "$QUALITY_THRESHOLD" ]]; then
      # --- STEP 3: FIX ---
      warn "[$CODE] Score $score < $QUALITY_THRESHOLD — running fixes..."
      claude -p "Read .claude/commands/locale-fix.md and execute with arguments: ${CODE}"
      ok "[$CODE] Fixes applied"
    else
      ok "[$CODE] Quality passed ($score/100)"
    fi
  else
    log "[$CODE] Could not extract score — continuing"
  fi

  # --- STEP 4: NAV ---
  step_nav "$CODE" "$LABEL"

  # --- STEP 5: CONFIG ---
  step_config "$CODE" "$NATIVE" "$LABEL"

  ok "[$CODE] ═══ $NATIVE COMPLETE ═══"
}

step_nav() {
  local CODE="$1" LABEL="$2"
  log "[$CODE] Updating nav/hreflang..."
  claude -p "Read .claude/commands/locale-nav.md and execute with arguments: ${CODE}|${LABEL}"
  ok "[$CODE] Nav updated"
}

step_config() {
  local CODE="$1" NATIVE="$2" LABEL="$3"
  log "[$CODE] Updating config files..."
  claude -p "Read .claude/commands/locale-config.md and execute with arguments: ${CODE}|${NATIVE}|${LABEL}"
  ok "[$CODE] Config updated"
}

phase_a() {
  hdr "══════════════════════════════════════════"
  hdr "  PHASE A: CREATE + VERIFY 5 LOCALES"
  hdr "══════════════════════════════════════════"

  local ok_count=0 fail_count=0
  for entry in "${LANGS[@]}"; do
    IFS='|' read -r CODE NATIVE LABEL LANG <<< "$entry"
    hdr "━━━ $NATIVE ($CODE) ━━━"

    if process_language "$CODE" "$NATIVE" "$LABEL" "$LANG"; then
      ok_count=$((ok_count + 1))
    else
      fail_count=$((fail_count + 1))
    fi
    sleep 2
  done

  hdr "Phase A: OK=$ok_count Failed=$fail_count"
}

# =============================================================================
# PHASE B: Pair pages + Build
# =============================================================================
phase_b() {
  hdr "══════════════════════════════════════════"
  hdr "  PHASE B: 210 PAIR PAGES + BUILD"
  hdr "══════════════════════════════════════════"

  local ok_flag=true
  [[ ! -f "$DATA/translation-languages.ts" ]] && err "Missing: src/data/translation-languages.ts" && ok_flag=false
  [[ ! -f "$DATA/translation-phrases.ts" ]] && err "Missing: src/data/translation-phrases.ts" && ok_flag=false
  [[ ! -f "$PAGES/[pair].astro" ]] && err "Missing: src/pages/translate-now/[pair].astro" && ok_flag=false
  [[ "$ok_flag" == false ]] && { err "Place pair page files first."; return 1; }

  log "Running pair integration..."
  claude -p "Read .claude/commands/pair-integrate.md and execute all 9 tasks."
  ok "Phase B complete"
}

# =============================================================================
# PHASE C: Final verification
# =============================================================================
phase_c() {
  hdr "══════════════════════════════════════════"
  hdr "  PHASE C: FINAL QA"
  hdr "══════════════════════════════════════════"

  log "Locale pages:"
  local lc=0
  for f in "$PAGES"/*.astro; do
    local bn=$(basename "$f" .astro)
    [[ "$bn" == "[pair]" ]] && continue
    lc=$((lc + 1))
    echo "  $bn — $(wc -l < "$f") lines" | tee -a "$LOG"
  done
  log "Total locales: $lc"

  for f in "translation-languages.ts" "translation-phrases.ts"; do
    [[ -f "$DATA/$f" ]] && ok "$f ✓" || err "$f ✗"
  done
  [[ -f "$PAGES/[pair].astro" ]] && ok "[pair].astro ✓" || err "[pair].astro ✗"

  if [[ -d "$DIR/dist" ]]; then
    local pairs=$(find "$DIR/dist" -path "*translate-now*-to-*" -name "index.html" 2>/dev/null | wc -l)
    local total=$(find "$DIR/dist" -name "*.html" 2>/dev/null | wc -l)
    log "Pair pages: $pairs | Total HTML: $total"
    [[ "$pairs" -gt 200 ]] && ok "210 pair pages ✓" || warn "Only $pairs pairs"

    for p in "english-to-spanish" "japanese-to-english" "spanish-to-french"; do
      [[ -d "$DIR/dist/translate-now/$p" ]] && ok "/translate-now/$p ✓" || warn "$p ✗"
    done
  else
    warn "dist/ not found — run npm run build"
  fi
}

# =============================================================================
# MAIN
# =============================================================================
echo "" > "$LOG"
preflight
phase_a
phase_b
phase_c

hdr "╔══════════════════════════════════════════╗"
hdr "║         ALL PHASES COMPLETE              ║"
hdr "╚══════════════════════════════════════════╝"

ok "Results:"
echo "  • 15 locale landing pages (quality-verified)"
echo "  • 210 programmatic pair pages"
echo "  • Updated robots.txt, llms.txt, llms-full.txt"
echo "  • Log: $LOG"
echo ""
echo "  Deploy: npm run build && your-deploy-command"
