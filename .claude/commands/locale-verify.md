Audit a TranslateNow locale page for quality.

**Input**: $ARGUMENTS as `{code}` (e.g., `pt`)

**Process**:
1. Read `.claude/agents/locale-reviewer.md` — adopt this reviewer persona
2. Read `.claude/references/quality-gates.md` for scoring rubric
3. Read `src/pages/translate-now/{code}.astro`
4. Score the page across 5 categories (20 points each, 100 total):
   - Structure: All 17 sections present with correct item counts
   - Technical: GSAP attrs, FAQ override, imports, lang, canonical, schemas
   - SEO: Title, description, keywords, hreflang, internal links
   - Translation: Native quality, quotation marks, formality, cultural fit
   - Anti-AI: Forbidden phrases, sentence variety, burstiness, no filler
5. Output the review report in the format specified by locale-reviewer.md
6. If score <80: list specific fixes needed
7. If score <70: recommend full rewrite of weakest sections

**Do NOT modify the file. Only analyze and report.**
