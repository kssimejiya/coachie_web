# TranslateNow — Astro SSG Marketing Site

## Project
TranslateNow is an iOS AI translation app. This repo is its Astro SSG marketing site at coachie-ai.com.

## Key Paths
- Pages: `src/pages/translate-now/` (locale pages + `[pair].astro`)
- Data: `src/data/translation-languages.ts`, `src/data/translation-phrases.ts`
- Layout: `src/layouts/TranslateNowLayout.astro`
- Assets: `src/assets/images/translate_*.{webp,png}`
- Config: `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`

## Constants
- APP_STORE_URL: `https://apps.apple.com/in/app/translate-now-ai-translator/id6759827185`
- SUPPORT_EMAIL: `contact@coachie-ai.com`
- PRIVACY_URL: `https://coachie-ai.com/privacy-policy-translation-app`
- TERMS_URL: `https://coachie-ai.com/terms-of-use-translation-app`

## Custom Commands
- `/locale-create {code}|{nativeName}|{langAttr}` — Create a new locale page
- `/locale-nav {code}|{label}` — Update nav/hreflang across all locales
- `/locale-config {code}|{nativeName}|{label}` — Update robots/llms config files
- `/locale-verify {code}` — Quality audit a locale page (structure + SEO + anti-AI)
- `/pair-integrate` — Integrate pair pages system and build

## Critical Rules
1. h1 uses `data-gsap="fade-up"` NEVER `data-gsap-hero-title`
2. FAQ override block between `</main>` and `</TranslateNowLayout>`
3. All images/SVGs/GSAP attrs/Tailwind classes IDENTICAL across locales
4. Read `.claude/references/locale-spec.md` for full page spec
5. Read `.claude/references/quality-gates.md` for writing quality rules
6. Read `.claude/agents/locale-writer.md` for translation voice guidelines
