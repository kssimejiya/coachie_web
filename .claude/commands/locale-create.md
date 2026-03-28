Create a new TranslateNow locale page.

**Input**: $ARGUMENTS as `{code}|{nativeName}|{langAttr}`

**Process**:
1. Read `.claude/references/locale-spec.md` for page structure
2. Read `.claude/references/quality-gates.md` for writing rules
3. Read `.claude/agents/locale-writer.md` — adopt this writing persona
4. Read `src/pages/translate-now/de.astro` as structural template
5. Scan `src/pages/translate-now/*.astro` to build LANGUAGE_LINKS (exclude current) and HREFLANG_LINKS (include all + x-default)
6. Create `src/pages/translate-now/{code}.astro` with:
   - All 17 sections matching de.astro structure exactly
   - All text translated to natural {nativeName} following locale-writer agent voice
   - `lang="{langAttr}"`, `canonical="https://coachie-ai.com/translate-now/{code}"`
   - All 5 structured data schemas in {nativeName}
   - FAQ with "how to" queries in {nativeName} for voice search
7. Self-check against quality-gates.md anti-AI rules before saving
8. Report: file created, line count, any quality concerns

**Only create this one file. Do not modify other files.**
