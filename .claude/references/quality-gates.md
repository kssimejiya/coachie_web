# Quality Gates — Locale Page Writing & SEO

## Anti-AI Writing Rules (CRITICAL)

### Forbidden Phrases (flag as AI-written)
Never use these in any locale page translation:
- "In today's digital world" / "In today's fast-paced world"
- "Whether you're a... or a..."
- "It's important to note that"
- "This comprehensive guide"
- "In conclusion"
- "Dive into" / "Dive deeper"
- "Unlock the power of"
- "Seamlessly" (overused)
- "Revolutionize" / "Revolutionary"
- "Cutting-edge" (unless in tech specs)
- "Leverage" (as a verb meaning "use")
- "Navigate the complexities"
- "Game-changer" / "Game-changing"
- "Robust" (for non-technical descriptions)
- "Elevate your"
- "Empower" / "Empowering"
- "Delve into"

### Writing Style Rules
1. **Sentence variety**: Mix short (5-8 words) with medium (12-18 words). Never >25 words.
2. **Paragraph variety**: Some 1-sentence paragraphs. Most 2-3 sentences. None >4.
3. **No hedging**: Don't write "might", "could potentially", "it's worth noting". Be direct.
4. **Specifics over generics**: "135 languages" not "many languages". "59 offline" not "dozens offline".
5. **Active voice**: "TranslateNow translates 135 languages" not "135 languages are translated by TranslateNow"
6. **No filler intros**: Start sections with the point, not throat-clearing.
7. **Concrete benefits**: "Translate menus in Japan without WiFi" not "Experience seamless offline translation"
8. **Asymmetric structure**: Don't make every feature card the same length. Vary 1-3 sentences.

### Burstiness Score Target
- Aim for burstiness >0.7 (human writing has high variance in sentence length)
- AI writing is typically <0.5 (uniform sentence lengths)
- Technique: After writing, check — do you have both 4-word sentences AND 20-word sentences?

### Vocabulary Diversity (TTR)
- Target Type-Token Ratio >0.65
- Don't repeat the same adjective within 200 words
- Use language-specific synonyms, not the same word translated identically each time

## SEO Checklist (per locale page)

### Title Tag (score: /10)
- [ ] Contains primary keyword in target language
- [ ] Contains brand name "TranslateNow"
- [ ] 50-60 characters
- [ ] Compelling — not just keywords
- [ ] Unique across all locale pages

### Meta Description (score: /10)
- [ ] 150-160 characters
- [ ] Contains CTA ("Download free" / equivalent)
- [ ] Contains key differentiators (voice cloning, AR, 135+ languages)
- [ ] Natural language, not keyword stuffing

### H1 (score: /10)
- [ ] Single H1 per page
- [ ] Contains primary keyword in target language
- [ ] Different from title tag (related but not identical)
- [ ] Uses `data-gsap="fade-up"` NOT `data-gsap-hero-title`

### Structured Data (score: /10)
- [ ] FAQPage schema with all 20 FAQ items
- [ ] MobileApplication with aggregateRating (4.8/150)
- [ ] BreadcrumbList (3 levels)
- [ ] HowTo (3 steps)
- [ ] Organization (Coachie AI)
- [ ] All in target language with correct inLanguage

### Content Depth (score: /10)
- [ ] 9 features with unique descriptions (not just translated, but localized)
- [ ] 20 FAQ items with long-form answers
- [ ] 22-row comparison table
- [ ] 4 deep-dive sections with bullet points
- [ ] 3 testimonials with locale-appropriate quotation marks
- [ ] Cultural relevance in descriptions (not just word-for-word translation)

### Internal Linking (score: /10)
- [ ] LANGUAGE_LINKS contains all other locales
- [ ] HREFLANG_LINKS contains all locales + x-default
- [ ] Footer links to Privacy Policy, Terms, Support email

### Technical (score: /10)
- [ ] `lang` attribute correct on TranslateNowLayout
- [ ] `canonical` URL correct
- [ ] All image imports present (11 screenshots + icon + robot)
- [ ] Noscript fallback block present
- [ ] FAQ override script+style block present

## Scoring
- 90-100: Ship immediately
- 80-89: Minor fixes needed
- 70-79: Rewrite weakest sections
- <70: Full rewrite required

## Verification Command
After creating a locale page, run `/locale-verify {code}` to audit against this checklist.
