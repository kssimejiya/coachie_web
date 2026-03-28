Update config files for a new locale.

**Input**: $ARGUMENTS as `{code}|{nativeName}|{label}`

1. `public/robots.txt` Googlebot: `Allow: /translate-now/{code}`
2. `public/llms.txt` Localized Pages: `- [{label}](https://coachie-ai.com/translate-now/{code}): {nativeName} landing page`
3. `public/llms-full.txt` Links: `- {nativeName}: https://coachie-ai.com/translate-now/{code}`

Only these 3 files.
