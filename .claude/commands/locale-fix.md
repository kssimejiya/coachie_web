Fix issues in a TranslateNow locale page based on a quality audit.

**Input**: $ARGUMENTS as `{code}` (e.g., `pt`)

**Process**:
1. Read `.claude/references/quality-gates.md` and `.claude/agents/locale-writer.md`
2. Read `src/pages/translate-now/{code}.astro`
3. Read `src/pages/translate-now/de.astro` as reference for correct structure
4. Fix ALL of these categories:
   - **Missing sections**: Add any sections that are missing
   - **Wrong counts**: Fix feature/FAQ/comparison counts to match spec
   - **Technical issues**: Fix h1 GSAP attr, FAQ override, missing imports, lang/canonical
   - **Anti-AI phrases**: Replace any forbidden phrases with natural alternatives
   - **Uniform sentences**: Rewrite to vary sentence lengths
   - **SEO gaps**: Fix title length, add missing structured data, fix hreflang
5. Save the fixed file
6. Report what was fixed
