Integrate the language pair pages system, update config, and build.

**Process (9 tasks)**:
1. Verify `src/data/translation-languages.ts` has 15 languages, `getAllPairs()` returns 210
2. Verify `src/data/translation-phrases.ts` has 15 codes × 20 phrases
3. Verify `src/pages/translate-now/[pair].astro` imports resolve correctly
4. Fix TranslateNowLayout.astro to accept: keywords, structuredData, hreflangLinks as optional props
5. Add to `public/robots.txt`: `Allow: /translate-now/{lang}-to-*` for all 15 languages
6. Add Language Pair section to `public/llms.txt`
7. Add pair page link to `public/llms-full.txt`
8. Add 20 pair links section to `src/pages/translate-now/index.astro` before footer
9. Run `npm run build` — fix errors until success. Expected: 225+ pages. Report total.
