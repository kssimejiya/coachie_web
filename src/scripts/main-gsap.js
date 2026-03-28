// ============================================================================
// Coachie Main Page — Cinematic Scroll Animation Engine
// ============================================================================
// GSAP 3.14+ · ScrollTrigger · Lenis Smooth Scroll
//
// Easing System:
//   enter  → power3.out     (entrance/exit animations)
//   scrub  → none           (scroll-bound, 1:1 with scroll)
//   pop    → back.out(1.7)  (badges, icons, UI accents)
//   smooth → sine.inOut     (infinite floats, pulses)
//   reveal → power4.out     (hero title, section headings)
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Design Tokens ──────────────────────────────────────────────────────────
const EASE = {
  enter:  'power3.out',
  scrub:  'none',
  pop:    'back.out(1.7)',
  smooth: 'sine.inOut',
  reveal: 'power4.out',
};

const DUR = {
  fast:  0.4,
  base:  0.7,
  slow:  1.0,
  hero:  1.2,
  scrub: 1.2,
};

const BP = {
  desktop: '(min-width: 1024px)',
  mobile:  '(max-width: 1023px)',
};

// ─── Guard: prevent double-init ─────────────────────────────────────────────
let isInitialized = false;

// ─── Utilities ──────────────────────────────────────────────────────────────

function initMagnetic(selector) {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll(selector).forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.25;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * strength,
        y: (e.clientY - r.top  - r.height / 2) * strength,
        duration: DUR.fast,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)', overwrite: 'auto' });
    });
  });
}

function initTilt(cards) {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  cards.forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        rotateY:  ((e.clientX - r.left) / r.width  - 0.5) * 6,
        rotateX: -((e.clientY - r.top)  / r.height - 0.5) * 6,
        transformPerspective: 800,
        duration: DUR.fast,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    });
  });
}

function autoManage(tween, triggerEl) {
  ScrollTrigger.create({
    trigger: triggerEl,
    start: 'top 130%',
    end: 'bottom -30%',
    onEnter:     () => tween.play(),
    onLeave:     () => tween.pause(),
    onEnterBack: () => tween.play(),
    onLeaveBack: () => tween.pause(),
  });
  tween.pause();
}

// ─── Cleanup (for Astro View Transitions) ───────────────────────────────────

function cleanup() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.killTweensOf('*');
  isInitialized = false;
  if (window.__mainLenis) {
    window.__mainLenis.destroy();
    window.__mainLenis = null;
  }
}

// ─── Init ───────────────────────────────────────────────────────────────────

function init() {
  // Guard: don't double-init
  if (isInitialized) return;
  isInitialized = true;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(
      '[data-gsap],[data-gsap="fade-up"],[data-gsap-hero-title],[data-gsap-hero-sub],' +
      '[data-gsap-hero-desc],[data-gsap-hero-cta],[data-gsap-hero-image],' +
      '[data-gsap-hero-badge],[data-gsap-hero-stat],[data-gsap-section-tag],' +
      '[data-gsap-section-title],[data-gsap-section-desc],[data-gsap-card],' +
      '[data-gsap-product-image],[data-gsap-product-text],[data-gsap-product-tag],' +
      '[data-gsap-product-title],[data-gsap-product-desc],[data-gsap-product-item],' +
      '[data-gsap-testimonial],[data-gsap-testimonial-stat],' +
      '[data-gsap-cta-content],[data-gsap-cta-image],' +
      '[data-gsap-footer] > *',
      { opacity: 1, visibility: 'visible', y: 0, x: 0, scale: 1, rotation: 0 }
    );
    return;
  }

  gsap.defaults({ ease: EASE.enter, duration: DUR.base, overwrite: 'auto' });
  gsap.config({ force3D: true, nullTargetWarn: false });
  ScrollTrigger.config({ limitCallbacks: true });

  // Initial hidden states for non-hero elements
  // (Hero elements are hidden by inline CSS in HeroSection.astro — no gsap.set needed)
  gsap.set('[data-gsap="fade-up"]',        { autoAlpha: 0, y: 50 });
  gsap.set('[data-gsap-card]',             { autoAlpha: 0, y: 60 });
  gsap.set('[data-gsap-hero-stat]',        { autoAlpha: 0, y: 30, scale: 0.85 });
  gsap.set('[data-gsap-testimonial]',      { autoAlpha: 0, y: 40 });
  gsap.set('[data-gsap-testimonial-stat]', { autoAlpha: 0, y: 25, scale: 0.85 });
  gsap.set('[data-gsap-footer] > *',       { autoAlpha: 0, y: 25 });

  // ─── Lenis Smooth Scroll (lazy-loaded on first interaction) ─────────────
  function initLenis() {
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration:           1.2,
        easing:             (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation:        'vertical',
        gestureOrientation: 'vertical',
        smoothWheel:        true,
        touchMultiplier:    1.5,
      });

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
      window.__mainLenis = lenis;
    });
  }
  // Defer Lenis until user starts scrolling
  var lenisLoaded = false;
  function onFirstInteraction() {
    if (lenisLoaded) return;
    lenisLoaded = true;
    window.removeEventListener('scroll', onFirstInteraction, { passive: true });
    window.removeEventListener('wheel', onFirstInteraction, { passive: true });
    window.removeEventListener('touchstart', onFirstInteraction, { passive: true });
    initLenis();
  }
  window.addEventListener('scroll', onFirstInteraction, { passive: true });
  window.addEventListener('wheel', onFirstInteraction, { passive: true });
  window.addEventListener('touchstart', onFirstInteraction, { passive: true });

  // ─── Run all animations ─────────────────────────────────────────────────
  animateNav();
  animateHero();
  animateSectionHeaders();
  animateFeatureCards();
  animateProductSections();
  animateTestimonials();
  animateDownloadCTA();
  animateFooter();
  animateSectionTransitions();
  animateProgressBar();
  initGenericFadeUp();

  initMagnetic('[data-magnetic]');
  initCursorGlow();

  ScrollTrigger.sort();

  // Single delayed refresh after images/fonts settle — removed multiple refreshes
  // that were causing re-triggers
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

// ─── Navigation ─────────────────────────────────────────────────────────────

function animateNav() {
  const nav = document.getElementById('site-header');
  if (!nav) return;

  ScrollTrigger.create({
    start: 0,
    end: 100,
    onUpdate(self) {
      const p = self.progress;
      const s = nav.style;
      s.background           = `rgba(255,255,255,${p * 0.95})`;
      s.backdropFilter       = `blur(${p * 16}px) saturate(${1 + p * 0.3})`;
      s.webkitBackdropFilter = s.backdropFilter;
      s.borderBottomColor    = `rgba(0,0,0,${p * 0.06})`;
      s.boxShadow            = p > 0.05 ? `0 1px ${p * 30}px rgba(0,0,0,${p * 0.08})` : 'none';
    },
  });
}

// ─── Hero Section ───────────────────────────────────────────────────────────
//
// FIX: Replaced splitChars (which destroyed innerHTML and rebuilt DOM causing
// a visible flash) with a non-destructive line-by-line clip/translate reveal.
// The original text stays in the DOM untouched — no innerHTML rewrite.
//

function animateHero() {
  const section = document.querySelector('[data-gsap-hero]');
  if (!section) return;

  const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

  // Badge
  const badge = section.querySelector('[data-gsap-hero-badge]');
  if (badge) {
    tl.fromTo(badge,
      { autoAlpha: 0, y: 30, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }
    );
  }

  // Title — NON-DESTRUCTIVE reveal (no splitChars / no innerHTML rewrite)
  // Each [data-gsap-hero-title-line] span slides up from behind a clip mask.
  const title = section.querySelector('[data-gsap-hero-title]');
  if (title) {
    const lines = title.querySelectorAll('[data-gsap-hero-title-line]');

    // Wrap each line in a clip container for the slide-up reveal
    lines.forEach((line) => {
      // Only wrap if not already wrapped (prevents double-wrap on re-init)
      if (line.parentElement.classList.contains('hero-line-clip')) return;
      const wrapper = document.createElement('span');
      wrapper.style.cssText = 'display:block;overflow:hidden;';
      wrapper.className = 'hero-line-clip';
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    // Make title container visible (was hidden by CSS to prevent FOUC)
    gsap.set(title, { visibility: 'visible', opacity: 1 });

    // Animate each line sliding up from below the clip boundary
    const lineEls = title.querySelectorAll('[data-gsap-hero-title-line]');
    if (lineEls.length) {
      tl.fromTo(lineEls,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, stagger: 0.12, duration: DUR.hero, ease: EASE.reveal },
        '-=0.3'
      );
    }
  }

  // Subtitle
  const sub = section.querySelector('[data-gsap-hero-sub]');
  if (sub) tl.fromTo(sub, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.5');

  // CTA button
  const cta = section.querySelector('[data-gsap-hero-cta]');
  if (cta) tl.fromTo(cta, { autoAlpha: 0, y: 20, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: DUR.base }, '-=0.4');

  // Stats
  const stats = section.querySelectorAll('[data-gsap-hero-stat]');
  if (stats.length) {
    tl.fromTo(stats,
      { autoAlpha: 0, y: 30, scale: 0.85 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: EASE.pop },
      '-=0.3'
    );
  }

  // Hero image — immediately visible (no animation delay for LCP)
  const heroImage = section.querySelector('[data-gsap-hero-image]');
  if (heroImage) {
    gsap.set(heroImage, { autoAlpha: 1 });

    // Floating animation (starts after hero timeline completes)
    const float = gsap.to(heroImage, {
      y: -14, duration: 3.5, repeat: -1, yoyo: true, ease: EASE.smooth, delay: 2.2,
    });
    autoManage(float, heroImage);
  }

  // Hero parallax scroll-out
  const heroInner = section.querySelector('[data-gsap-hero-inner]');
  if (heroInner) {
    gsap.to(heroInner, {
      y: -100,
      autoAlpha: 0.15,
      scale: 0.96,
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom 35%',
        scrub: DUR.scrub,
      },
    });
  }
}

// ─── Section Headers ────────────────────────────────────────────────────────

function animateSectionHeaders() {
  document.querySelectorAll('[data-gsap-section-header]').forEach((header) => {
    const tag   = header.querySelector('[data-gsap-section-tag]');
    const title = header.querySelector('[data-gsap-section-title]');
    const desc  = header.querySelector('[data-gsap-section-desc]');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: header, start: 'top 83%' },
    });

    if (tag) tl.fromTo(tag,
      { autoAlpha: 0, y: 20, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }
    );
    if (title) tl.fromTo(title,
      { autoAlpha: 0, y: 50, rotateX: 10, transformPerspective: 800 },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, ease: EASE.reveal },
      '-=0.35'
    );
    if (desc) tl.fromTo(desc,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: DUR.base },
      '-=0.5'
    );
  });
}

// ─── Feature Cards ──────────────────────────────────────────────────────────

function animateFeatureCards() {
  document.querySelectorAll('[data-gsap-card-grid]').forEach((grid) => {
    const cards = grid.querySelectorAll('[data-gsap-card]');
    if (!cards.length) return;

    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter(batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 60, rotateX: 10, transformPerspective: 1000 },
          { autoAlpha: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 0.8,
            ease: EASE.enter, overwrite: true }
        );
      },
      once: true,
    });

    initTilt(cards);
  });
}

// ─── Product Sections (Deep Dives) ──────────────────────────────────────────

function animateProductSections() {
  document.querySelectorAll('[data-gsap-product]').forEach((section) => {
    const imageCol = section.querySelector('[data-gsap-product-image]');
    const textCol  = section.querySelector('[data-gsap-product-text]');
    const reversed = section.dataset.gsapReversed === 'true';
    const xSign    = reversed ? 1 : -1;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'center 40%',
        scrub: DUR.scrub,
        invalidateOnRefresh: true,
      },
    });

    if (textCol) {
      const tag     = textCol.querySelector('[data-gsap-product-tag]');
      const title   = textCol.querySelector('[data-gsap-product-title]');
      const desc    = textCol.querySelector('[data-gsap-product-desc]');
      const items   = textCol.querySelectorAll('[data-gsap-product-item]');

      if (tag) tl.fromTo(tag,
        { autoAlpha: 0, x: xSign * 45 },
        { autoAlpha: 1, x: 0, duration: 0.5 }, 0);
      if (title) tl.fromTo(title,
        { autoAlpha: 0, x: xSign * 70 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: EASE.reveal }, 0.05);
      if (desc) tl.fromTo(desc,
        { autoAlpha: 0, x: xSign * 40 },
        { autoAlpha: 1, x: 0, duration: 0.6 }, 0.15);
      if (items.length) tl.fromTo(items,
        { autoAlpha: 0, x: xSign * 30 },
        { autoAlpha: 1, x: 0, stagger: 0.07, duration: 0.4 }, 0.2);
    }

    if (imageCol) {
      tl.fromTo(imageCol,
        { autoAlpha: 0, x: -xSign * 110, scale: 0.85, rotateY: -xSign * 14, transformPerspective: 1200 },
        { autoAlpha: 1, x: 0, scale: 1, rotateY: 0, duration: 1 },
        0
      );

      gsap.to(imageCol, {
        y: -35,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2.2,
        },
      });
    }
  });
}

// ─── Testimonials ───────────────────────────────────────────────────────────

function animateTestimonials() {
  const section = document.querySelector('[data-gsap-testimonials]');
  if (!section) return;

  const cards = section.querySelectorAll('[data-gsap-testimonial]');
  if (cards.length) {
    gsap.fromTo(cards,
      {
        autoAlpha: 0,
        x: (i) => (i === 0 ? -55 : i === cards.length - 1 ? 55 : 0),
        y: (i) => (i > 0 && i < cards.length - 1 ? 45 : 0),
        scale: 0.92,
      },
      {
        autoAlpha: 1, x: 0, y: 0, scale: 1, stagger: 0.12, duration: 0.9,
        scrollTrigger: { trigger: cards[0], start: 'top 83%' },
      }
    );
  }

  const stats = section.querySelectorAll('[data-gsap-testimonial-stat]');
  if (stats.length) {
    gsap.fromTo(stats,
      { autoAlpha: 0, y: 25, scale: 0.85 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: EASE.pop,
        scrollTrigger: { trigger: stats[0], start: 'top 90%' } }
    );
  }
}

// ─── Download CTA ───────────────────────────────────────────────────────────

function animateDownloadCTA() {
  const section = document.querySelector('[data-gsap-download]');
  if (!section) return;

  const content = section.querySelector('[data-gsap-cta-content]');
  const image   = section.querySelector('[data-gsap-cta-image]');

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%' },
  });

  if (content) {
    const h2   = content.querySelector('h2');
    const p    = content.querySelector('p');
    const btns = content.querySelectorAll('a');
    const stats = content.querySelectorAll('[data-gsap-cta-stat]');

    if (h2) tl.fromTo(h2,
      { autoAlpha: 0, y: 55, rotateX: 15, transformPerspective: 1000 },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, ease: EASE.reveal });
    if (p) tl.fromTo(p,
      { autoAlpha: 0, y: 25 },
      { autoAlpha: 1, y: 0, duration: DUR.base }, '-=0.5');
    if (btns.length) tl.fromTo(btns,
      { autoAlpha: 0, y: 20, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: EASE.pop }, '-=0.3');
    if (stats.length) tl.fromTo(stats,
      { autoAlpha: 0, y: 20, scale: 0.85 },
      { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5 }, '-=0.2');
  }

  if (image) {
    tl.fromTo(image,
      { autoAlpha: 0, x: 110, scale: 0.85, rotateY: 14, transformPerspective: 1200 },
      { autoAlpha: 1, x: 0, scale: 1, rotateY: 0, duration: 1.2, ease: EASE.enter },
      0
    );

    const float = gsap.to(image, {
      y: -14, duration: 3.5, repeat: -1, yoyo: true, ease: EASE.smooth, delay: 1.5,
    });
    autoManage(float, section);
  }
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function animateFooter() {
  const footer = document.querySelector('[data-gsap-footer]');
  if (!footer || !footer.children.length) return;

  gsap.fromTo(footer.children,
    { autoAlpha: 0, y: 25 },
    { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6,
      scrollTrigger: { trigger: footer, start: 'top 93%' } }
  );
}

// ─── Section Transitions (Parallax) ─────────────────────────────────────────

function animateSectionTransitions() {
  const sections = document.querySelectorAll('#main-content > section, #main-content > div > section');

  sections.forEach((section, i) => {
    if (i === 0) return;

    const inner = section.querySelector('.max-w-7xl, .max-w-6xl, .max-w-5xl');
    if (!inner) return;

    if (section.offsetHeight < 300) return;

    gsap.fromTo(inner,
      { y: 25 },
      {
        y: -15,
        ease: EASE.scrub,
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

// ─── Progress Bar ───────────────────────────────────────────────────────────

function animateProgressBar() {
  const bar = document.querySelector('.main-progress-bar');
  if (!bar) return;

  gsap.fromTo(bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      transformOrigin: 'left center',
      ease: EASE.scrub,
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    }
  );
}

// ─── Generic Fade Up ────────────────────────────────────────────────────────

function initGenericFadeUp() {
  ScrollTrigger.batch('[data-gsap="fade-up"]', {
    start: 'top 90%',
    onEnter(batch) {
      gsap.to(batch, {
        autoAlpha: 1, y: 0, stagger: 0.06, duration: DUR.base, overwrite: true,
      });
    },
    once: true,
  });
}

// ─── Cursor Glow ────────────────────────────────────────────────────────────

function initCursorGlow() {
  const glow = document.querySelector('.main-cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      x: e.clientX, y: e.clientY, duration: 0.8, ease: 'power2.out',
    });
  });
}

// ─── Boot (supports both fresh loads AND Astro View Transitions) ────────────

function boot() {
  // Clean up any previous GSAP state (for View Transition re-navigations)
  cleanup();
  init();
}

// Initial page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Astro View Transitions: re-init when navigating back to this page
// astro:after-swap fires after Astro replaces the DOM on client-side navigation
document.addEventListener('astro:after-swap', boot);