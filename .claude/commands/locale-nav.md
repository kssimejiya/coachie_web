Update navigation and hreflang for a new locale across all existing files.

**Input**: $ARGUMENTS as `{code}|{label}`

**Process**:
1. Find ALL .astro files in `src/pages/translate-now/` except `[pair].astro` and `{code}.astro`
2. In each file, add to LANGUAGE_LINKS: `{ href: '/translate-now/{code}', label: '{label}' }`
3. In each file, add to HREFLANG_LINKS before x-default: `{ lang: '{code}', href: 'https://coachie-ai.com/translate-now/{code}' }`
4. Do NOT modify `{code}.astro` or `[pair].astro`
5. Report: number of files updated
