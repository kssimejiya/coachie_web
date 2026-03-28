# Locale Page Specification

## Template: `src/pages/translate-now/de.astro`
Read this file first. Match its structure exactly.

## 17 Sections (in order)
1. Hero — badge, h1 (`data-gsap="fade-up"`), h2, desc, CTA, phone mockup + 3 floating badges
2. Social Proof — 5 items with SVG icons
3. Core Features — 9 cards with icon, title, desc
4. How It Works — 3 steps with connecting line, step icons, labels
5. Screenshot Gallery — 11 phone frames, horizontal scroll
6. Deep Dives — 4 alternating-layout sections with tag, title, desc, bullets, phone image
7. AI Conversation — Robot image + feature list
8. Writing Tools — 5 centered cards
9. Privacy & Offline — Feature list + phone screenshot
10. AI Intelligence — 8 glass cards
11. iOS Integration — 8 glass cards
12. Use Cases — 6 cards with icons
13. Stats — 4 animated counters
14. Testimonials — 3 review cards with stars
15. Comparison Table — 22 rows (TranslateNow vs Google vs DeepL)
16. FAQ — 20 accordion items
17. E-E-A-T + Final CTA + Footer

## Data Constants Required
FEATURES(9), STEPS(3), SCREENSHOTS(11), DEEP_DIVES(4), WRITING_TOOLS(5), AI_FEATURES(8), IOS_FEATURES(8), USE_CASES(6), STATS(4), TESTIMONIALS(3), COMPARISON(22), FAQ_ITEMS(20)

## 5 Structured Data Schemas
FAQPage, MobileApplication (rating 4.8/150, 3 offers), BreadcrumbList (3 levels), HowTo (3 steps), Organization

## Imports (IDENTICAL across all locales)
```
TranslateNowLayout, { Image }, translateIcon, translateRobot, translateSs1-11
```

## FAQ Override Block
Between `</main>` and `</TranslateNowLayout>` — CSS `.faq-active` + JS clone-and-replace handler.

## Arabic-only: RTL CSS override block at top of content.
