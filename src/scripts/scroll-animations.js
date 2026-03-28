// ============================================================================
// TranslateNow — Cinematic Scroll Animation Engine v2.0
// ============================================================================
// GSAP 3.14+ · ScrollTrigger · Lenis Smooth Scroll
//
// Architecture:
//   - Lenis provides momentum-based smooth scrolling (silky 120fps feel)
//   - GSAP ScrollTrigger owns ALL motion (zero CSS transition conflicts)
//   - Scrub-linked animations for scroll-bound depth and continuity
//   - Pin sequences for storytelling (How It Works, Gallery)
//   - ScrollTrigger.batch() for natural waterfall card reveals
//   - Cross-section parallax for layered depth between sections
//   - autoAlpha (visibility+opacity) for FOUC prevention
//   - Infinite animations auto-pause when off-screen
//   - fromTo() everywhere — no FOUC risk from gsap.from()
//
// Easing System (3 tokens only):
//   enter  → power3.out     (all entrance/exit animations)
//   scrub  → none           (scroll-bound, 1:1 with scroll)
//   pop    → back.out(1.7)  (badges, icons, UI accents)
//   smooth → sine.inOut     (infinite floats, pulses)
//   reveal → power4.out     (hero title, section headings)
// ============================================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

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

function splitChars(el) {
  const original = el.textContent;
  el.setAttribute('aria-label', original);
  el.innerHTML = '';

  const chars = [];
  original.split(/(\s+)/).forEach((segment) => {
    if (/^\s+$/.test(segment)) {
      el.appendChild(document.createTextNode(segment));
      return;
    }
    const wordWrap = document.createElement('span');
    wordWrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
    segment.split('').forEach((ch) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.cssText = 'display:inline-block;';
      s.className = 'tn-split-char';
      wordWrap.appendChild(s);
      chars.push(s);
    });
    el.appendChild(wordWrap);
  });
  return chars;
}

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

function init() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(
      '[data-gsap],[data-gsap="fade-up"],[data-gsap-hero-title],[data-gsap-hero-sub],' +
      '[data-gsap-hero-desc],[data-gsap-hero-cta],[data-gsap-hero-phone],' +
      '[data-gsap-badge],[data-gsap-trust],[data-gsap-dd-text],[data-gsap-dd-phone],' +
      '[data-gsap-robot-img],[data-gsap-robot-text],[data-gsap-cta-icon],' +
      '[data-gsap-cta-glow],[data-gsap-cta-btn],[data-gsap-step],' +
      '[data-gsap-step-icon],[data-gsap-step-label],[data-gsap-shot],' +
      '[data-gsap-writing-card],[data-gsap-stat-item],[data-gsap-plan],' +
      '.tn-glass-card,.tn-section-tag,.tn-faq-item,[data-gsap-how-line],' +
      '[data-gsap-footer] > *',
      { opacity: 1, visibility: 'visible', y: 0, x: 0, scale: 1, rotation: 0, clearProps: 'all' }
    );
    initFAQ();
    initMobileNav();
    return;
  }

  gsap.defaults({ ease: EASE.enter, duration: DUR.base, overwrite: 'auto' });
  gsap.config({ force3D: true, nullTargetWarn: false });
  ScrollTrigger.config({ limitCallbacks: true });

  gsap.set('[data-gsap="fade-up"]',      { autoAlpha: 0, y: 50 });
  gsap.set('.tn-glass-card',              { autoAlpha: 0, y: 60 });
  gsap.set('.tn-faq-item',                { autoAlpha: 0, y: 20 });
  gsap.set('[data-gsap-writing-card]',    { autoAlpha: 0, scale: 0.7 });
  gsap.set('[data-gsap-stat-item]',       { autoAlpha: 0, y: 40 });
  gsap.set('[data-gsap-plan]',            { autoAlpha: 0, y: 60 });
  gsap.set('[data-gsap-shot]',            { autoAlpha: 0, y: 80 });
  gsap.set('[data-gsap-social-item]',     { autoAlpha: 0, y: 20 });
  gsap.set('[data-gsap-footer] > *',      { autoAlpha: 0, y: 25 });

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
  window.__tnLenis = lenis;

  animateNav();
  animateHero();
  animateSocialBar();
  animateSectionHeaders();
  animateCardGrids();
  animateHowItWorks();
  animateScreenshotGallery();
  animateDeepDives();
  animateRobotSection();
  animateWritingTools();
  animateStats();
  animateTestimonials();
  animatePricing();
  animateComparisonTable();
  animateFAQEntrance();
  animateFinalCTA();
  animateFooter();
  animateSectionTransitions();
  animateProgressBar();
  initGenericFadeUp();

  initFAQ();
  initMobileNav();
  initMagnetic('[data-magnetic]');
  initCursorGlow();

  ScrollTrigger.sort();

  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 2500);
  setTimeout(() => ScrollTrigger.refresh(), 6000);
}

function animateNav() {
  const nav = document.querySelector('.tn-nav');
  if (!nav) return;

  ScrollTrigger.create({
    start: 0,
    end: 100,
    onUpdate(self) {
      const p = self.progress;
      const s = nav.style;
      s.background         = `rgba(10,10,16,${p * 0.95})`;
      s.backdropFilter     = `blur(${p * 24}px) saturate(${1 + p * 0.5})`;
      s.webkitBackdropFilter = s.backdropFilter;
      s.borderBottomColor  = `rgba(255,255,255,${p * 0.06})`;
      s.boxShadow          = p > 0.05 ? `0 1px ${p * 40}px rgba(0,0,0,${p * 0.35})` : 'none';
    },
  });
}

function animateHero() {
  const section = document.querySelector('[data-gsap-hero]');
  if (!section) return;

  const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

  const trust = section.querySelector('[data-gsap-trust]');
  if (trust) {
    tl.fromTo(trust,
      { autoAlpha: 0, y: 30, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }
    );
  }

  const title = section.querySelector('[data-gsap-hero-title]');
  if (title) {
    const gradientSpan = title.querySelector('.tn-gradient-text');
    const gradientHTML = gradientSpan ? gradientSpan.outerHTML : '';

    let plainText = '';
    title.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) plainText += node.textContent;
    });

    title.innerHTML = '';
    const chars = [];
    plainText.split(/(\s+)/).forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        title.appendChild(document.createTextNode(segment));
        return;
      }
      const wordWrap = document.createElement('span');
      wordWrap.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
      segment.split('').forEach((ch) => {
        const s = document.createElement('span');
        s.textContent = ch;
        s.style.cssText = 'display:inline-block;';
        wordWrap.appendChild(s);
        chars.push(s);
      });
      title.appendChild(wordWrap);
    });

    if (gradientHTML) {
      title.insertAdjacentHTML('beforeend', gradientHTML);
    }

    if (chars.length) {
      tl.fromTo(chars,
        { y: 90, opacity: 0, rotateX: 60, transformPerspective: 1000 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.018, duration: DUR.hero, ease: EASE.reveal },
        '-=0.3'
      );
    }

    const newGradient = title.querySelector('.tn-gradient-text');
    if (newGradient) {
      tl.fromTo(newGradient,
        { autoAlpha: 0, y: 45, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1 },
        '-=0.5'
      );
    }
  }

  const sub = section.querySelector('[data-gsap-hero-sub]');
  if (sub) tl.fromTo(sub, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.5');

  const desc = section.querySelector('[data-gsap-hero-desc]');
  if (desc) tl.fromTo(desc, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.5');

  const cta = section.querySelector('[data-gsap-hero-cta]');
  if (cta) tl.fromTo(cta, { autoAlpha: 0, y: 20, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: DUR.base }, '-=0.4');

  const phone = section.querySelector('[data-gsap-hero-phone]');
  if (phone) {
    // Prevent phone + badges from causing horizontal page overflow
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    tl.fromTo(phone,
      { autoAlpha: 0, y: 130, scale: 0.78, rotateY: -14, transformPerspective: 1200 },
      { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, duration: 1.5, ease: EASE.enter },
      '-=1.1'
    );

    const float = gsap.to(phone, {
      y: -14, duration: 3.5, repeat: -1, yoyo: true, ease: EASE.smooth, delay: 2.2,
    });
    autoManage(float, phone);
  }

  const badges = section.querySelectorAll('[data-gsap-badge]');
  badges.forEach((badge, i) => {
    tl.fromTo(badge,
      { autoAlpha: 0, scale: 0.3, y: 30 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: EASE.pop },
      `-=${0.7 - i * 0.1}`
    );
    const float = gsap.to(badge, {
      y: '-=10', duration: 2.8 + i * 0.6, repeat: -1, yoyo: true,
      ease: EASE.smooth, delay: 2.5 + i * 0.4,
    });
    autoManage(float, badge);
  });

  const glow = section.querySelector('[data-gsap-hero-glow]');
  if (glow) {
    const pulse = gsap.to(glow, {
      scale: 1.15, opacity: 0.6, duration: 4.5, repeat: -1, yoyo: true, ease: EASE.smooth,
    });
    autoManage(pulse, section);
  }

  const heroInner = section.querySelector('.max-w-6xl');
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

function animateSocialBar() {
  const bar = document.querySelector('[data-gsap-social]');
  if (!bar) return;
  const items = bar.querySelectorAll('[data-gsap-social-item]');
  if (!items.length) return;

  gsap.fromTo(items,
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.5,
      scrollTrigger: { trigger: bar, start: 'top 93%' } }
  );
}

function animateSectionHeaders() {
  document.querySelectorAll('[data-gsap-section-header]').forEach((header) => {
    const tag = header.querySelector('.tn-section-tag');
    const h2  = header.querySelector('h2');
    const p   = header.querySelector('p');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: header, start: 'top 83%' },
    });

    if (tag) tl.fromTo(tag,
      { autoAlpha: 0, y: 20, scale: 0.92 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 }
    );
    if (h2) tl.fromTo(h2,
      { autoAlpha: 0, y: 50, rotateX: 10, transformPerspective: 800 },
      { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, ease: EASE.reveal },
      '-=0.35'
    );
    if (p) tl.fromTo(p,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: DUR.base },
      '-=0.5'
    );
  });
}

function animateCardGrids() {
  document.querySelectorAll('[data-gsap-card-grid]').forEach((grid) => {
    const cards = grid.querySelectorAll('.tn-glass-card');
    if (!cards.length) return;

    ScrollTrigger.batch(cards, {
      start: 'top 90%',
      onEnter(batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 60, rotateX: 10, transformPerspective: 1000 },
          { autoAlpha: 1, y: 0, rotateX: 0, stagger: 0.06, duration: 0.8,
            ease: EASE.enter, overwrite: true }
        );
      },
      once: true,
    });

    initTilt(cards);
  });
}

// ─── How It Works ───────────────────────────────────────────────────────────
// FIX: Removed per-step hidden states and ScrollTrigger.batch() reveal.
// Previously each step was hidden (autoAlpha:0) and only revealed individually
// when its own top edge crossed 85% of viewport. On mobile (single column),
// step 3 would only appear when the section was nearly scrolled past.
// Now all 3 steps are visible as soon as the section enters viewport.
// The connecting line draw-in animation is kept for visual polish.

function animateHowItWorks() {
  const wrapper = document.querySelector('[data-gsap-how]');
  if (!wrapper) return;

  const line = wrapper.querySelector('[data-gsap-how-line]');

  // Animate connecting line when wrapper enters viewport
  if (line) {
    gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(line, {
      scaleX: 1, duration: 1.4, ease: 'power2.inOut',
      scrollTrigger: { trigger: wrapper, start: 'top 80%' },
    });
  }

  // Steps are now always visible — no batch reveal, no hidden initial states
}

function animateScreenshotGallery() {
  const gallery = document.querySelector('[data-gsap-gallery]');
  if (!gallery) return;

  const track = gallery.querySelector('[data-gsap-gallery-track]');
  const shots = gallery.querySelectorAll('[data-gsap-shot]');
  if (!track || !shots.length) return;

  ScrollTrigger.matchMedia({

    [BP.desktop]() {
      gsap.fromTo(shots,
        { autoAlpha: 0, y: 80, scale: 0.85, rotation: (i) => (i % 2 === 0 ? -4 : 4) },
        { autoAlpha: 1, y: 0, scale: 1, rotation: 0, stagger: 0.05, duration: 0.8,
          scrollTrigger: { trigger: gallery, start: 'top 88%' } }
      );

      const getAmount = () => {
        const overflow = track.scrollWidth - track.parentElement.offsetWidth;
        return Math.max(0, overflow);
      };

      if (getAmount() > 50) {
        track.style.overflow = 'visible';

        // Hold + Scroll: first ~15% of scroll range is a pause (images sit
        // still so user sees them all), then horizontal scrub begins.
        const holdRatio = 0.35;
        const scrollDist = () => getAmount() / (1 - holdRatio);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: 'top 50%',
            end: () => `+=${scrollDist()}`,
            pin: gallery,
            scrub: DUR.scrub,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Hold phase — pinned, no movement, user absorbs the full gallery
        tl.to(track, { x: 0, duration: holdRatio });
        // Scroll phase — horizontal movement
        tl.to(track, { x: () => -getAmount(), duration: 1 - holdRatio, ease: EASE.scrub });
      }

      shots.forEach((shot, i) => {
        gsap.to(shot, {
          y: i % 2 === 0 ? -15 : 15,
          scrollTrigger: {
            trigger: gallery,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        });
      });
    },

    [BP.mobile]() {
      gsap.fromTo(shots,
        { autoAlpha: 0, y: 50, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, stagger: 0.04, duration: DUR.base,
          scrollTrigger: { trigger: gallery, start: 'top 88%' } }
      );
    },
  });
}

function animateDeepDives() {
  document.querySelectorAll('[data-gsap-deepdive]').forEach((section) => {
    const textCol  = section.querySelector('[data-gsap-dd-text]');
    const phoneCol = section.querySelector('[data-gsap-dd-phone]');
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
      const tag     = textCol.querySelector('[data-gsap-dd-tag]');
      const h3      = textCol.querySelector('h3');
      const p       = textCol.querySelector('p');
      const bullets = textCol.querySelectorAll('li');

      if (tag) tl.fromTo(tag,
        { autoAlpha: 0, x: xSign * 45 },
        { autoAlpha: 1, x: 0, duration: 0.5 }, 0);
      if (h3) tl.fromTo(h3,
        { autoAlpha: 0, x: xSign * 70 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: EASE.reveal }, 0.05);
      if (p) tl.fromTo(p,
        { autoAlpha: 0, x: xSign * 40 },
        { autoAlpha: 1, x: 0, duration: 0.6 }, 0.15);
      if (bullets.length) tl.fromTo(bullets,
        { autoAlpha: 0, x: xSign * 30 },
        { autoAlpha: 1, x: 0, stagger: 0.07, duration: 0.4 }, 0.2);
    }

    if (phoneCol) {
      tl.fromTo(phoneCol,
        { autoAlpha: 0, x: -xSign * 110, scale: 0.85, rotateY: -xSign * 14, transformPerspective: 1200 },
        { autoAlpha: 1, x: 0, scale: 1, rotateY: 0, duration: 1 },
        0
      );

      gsap.to(phoneCol, {
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

function animateRobotSection() {
  const section = document.querySelector('[data-gsap-robot]');
  if (!section) return;

  const robot   = section.querySelector('[data-gsap-robot-img]');
  const textCol = section.querySelector('[data-gsap-robot-text]');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 74%',
      end: 'center 42%',
      scrub: DUR.scrub,
      invalidateOnRefresh: true,
    },
  });

  if (robot) {
    tl.fromTo(robot,
      { autoAlpha: 0, scale: 0.6, rotation: -12 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 1 }, 0);

    const bob = gsap.to(robot, {
      y: -18, rotation: 3, duration: 3.5, repeat: -1, yoyo: true, ease: EASE.smooth,
    });
    autoManage(bob, section);
  }

  if (textCol) {
    const els = textCol.querySelectorAll('h2, p, li, span');
    tl.fromTo(els,
      { autoAlpha: 0, x: -40 },
      { autoAlpha: 1, x: 0, stagger: 0.04, duration: 0.6 },
      0.08
    );
  }
}

function animateWritingTools() {
  const grid = document.querySelector('[data-gsap-writing]');
  if (!grid) return;

  const cards = grid.querySelectorAll('[data-gsap-writing-card]');
  if (!cards.length) return;

  ScrollTrigger.batch(cards, {
    start: 'top 90%',
    onEnter(batch) {
      gsap.fromTo(batch,
        { autoAlpha: 0, scale: 0.7, rotation: (_, el) => {
          const idx = Array.from(cards).indexOf(el);
          return idx % 2 === 0 ? -8 : 8;
        }},
        { autoAlpha: 1, scale: 1, rotation: 0, stagger: 0.06, duration: 0.6,
          ease: EASE.pop, overwrite: true }
      );
    },
    once: true,
  });
}

function animateStats() {
  const strip = document.querySelector('[data-gsap-stats]');
  if (!strip) return;

  const items = strip.querySelectorAll('[data-gsap-stat-item]');
  gsap.fromTo(items,
    { autoAlpha: 0, y: 40, scale: 0.9 },
    { autoAlpha: 1, y: 0, scale: 1, stagger: 0.1, duration: DUR.base,
      scrollTrigger: { trigger: strip, start: 'top 88%' } }
  );

  document.querySelectorAll('[data-gsap-stat]').forEach((el) => {
    const target = parseInt(el.dataset.gsapTarget, 10);
    const suffix = el.dataset.gsapSuffix || '';
    if (isNaN(target)) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      ease: 'power2.out',
      duration: 1,
      onUpdate() { el.textContent = Math.floor(obj.val) + suffix; },
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        end: 'top 55%',
        scrub: 0.8,
      },
    });
  });
}

function animateTestimonials() {
  const grid = document.querySelector('[data-gsap-testimonials]');
  if (!grid) return;

  const cards = grid.querySelectorAll('.tn-glass-card');
  if (!cards.length) return;

  gsap.fromTo(cards,
    {
      autoAlpha: 0,
      x: (i) => (i === 0 ? -55 : i === cards.length - 1 ? 55 : 0),
      y: (i) => (i === 1 ? 45 : 0),
      scale: 0.92,
    },
    {
      autoAlpha: 1, x: 0, y: 0, scale: 1, stagger: 0.1, duration: 0.9,
      scrollTrigger: { trigger: grid, start: 'top 83%' },
    }
  );
}

function animatePricing() {
  document.querySelectorAll('[data-gsap-plan]').forEach((plan, i) => {
    const featured = plan.dataset.gsapFeatured === 'true';

    gsap.fromTo(plan,
      { autoAlpha: 0, y: 65, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, delay: i * 0.12,
        scrollTrigger: { trigger: plan, start: 'top 88%' } }
    );

    if (featured) {
      const pulse = gsap.fromTo(plan,
        { boxShadow: '0 0 40px rgba(255,107,74,0.1), 0 20px 40px rgba(0,0,0,0.3)' },
        { boxShadow: '0 0 80px rgba(255,107,74,0.22), 0 20px 40px rgba(0,0,0,0.3)',
          duration: 2.5, repeat: -1, yoyo: true, ease: EASE.smooth }
      );
      autoManage(pulse, plan);
    }
  });
}

function animateComparisonTable() {
  const table = document.querySelector('[data-gsap-comparison]');
  if (!table) return;

  // CRITICAL: The table wrapper has class .tn-glass-card which gets globally set to
  // autoAlpha:0, y:60 at init (line ~157). Since this card is NOT inside a
  // [data-gsap-card-grid], animateCardGrids() never reveals it.
  // We must reveal the wrapper card explicitly before animating rows.
  gsap.fromTo(table,
    { autoAlpha: 0, y: 60 },
    {
      autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.enter,
      scrollTrigger: {
        trigger: table,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );

  const rows = table.querySelectorAll('tbody tr');
  if (!rows.length) return;

  gsap.set(rows, { autoAlpha: 0, x: -25 });

  // Stagger rows in after the wrapper is revealed
  gsap.to(rows, {
    autoAlpha: 1,
    x: 0,
    stagger: 0.04,
    duration: 0.45,
    ease: EASE.enter,
    overwrite: true,
    scrollTrigger: {
      trigger: table,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

function animateFAQEntrance() {
  document.querySelectorAll('[data-gsap-faq-list]').forEach((list) => {
    const items = list.querySelectorAll('.tn-faq-item');
    if (!items.length) return;

    ScrollTrigger.batch(items, {
      start: 'top 92%',
      onEnter(batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.5, overwrite: true }
        );
      },
      once: true,
    });
  });
}

function initFAQ() {
  document.querySelectorAll('.tn-faq-content').forEach((c) => {
    gsap.set(c, { height: 0, overflow: 'hidden' });
  });

  document.querySelectorAll('.tn-faq-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.tn-faq-item');
      const content = item?.querySelector('.tn-faq-content');
      const chevron = item?.querySelector('.tn-faq-chevron');
      if (!content) return;

      const isOpen = item.classList.contains('is-open');

      document.querySelectorAll('.tn-faq-item.is-open').forEach((open) => {
        if (open === item) return;
        gsap.to(open.querySelector('.tn-faq-content'), {
          height: 0, duration: DUR.fast, ease: EASE.enter, overwrite: true,
        });
        const ch = open.querySelector('.tn-faq-chevron');
        if (ch) gsap.to(ch, { rotation: 0, duration: 0.3, overwrite: true });
        open.classList.remove('is-open');
      });

      if (isOpen) {
        gsap.to(content, { height: 0, duration: DUR.fast, ease: EASE.enter, overwrite: true });
        if (chevron) gsap.to(chevron, { rotation: 0, duration: 0.3, overwrite: true });
        item.classList.remove('is-open');
      } else {
        gsap.set(content, { height: 'auto' });
        const h = content.offsetHeight;
        gsap.fromTo(content,
          { height: 0 },
          { height: h, duration: 0.5, ease: EASE.enter, overwrite: true }
        );
        if (chevron) gsap.to(chevron, { rotation: 180, duration: 0.35, ease: EASE.enter, overwrite: true });
        item.classList.add('is-open');
      }

      setTimeout(() => ScrollTrigger.refresh(), 600);
    });
  });
}

function animateFinalCTA() {
  const section = document.querySelector('[data-gsap-final-cta]');
  if (!section) return;

  const glow = section.querySelector('[data-gsap-cta-glow]');
  const icon = section.querySelector('[data-gsap-cta-icon]');
  const h2   = section.querySelector('h2');
  const p    = section.querySelector('p');
  const btn  = section.querySelector('[data-gsap-cta-btn]');

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 72%' },
  });

  if (glow) tl.fromTo(glow,
    { scale: 0, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, duration: 1.3, ease: 'power2.out' });
  if (icon) tl.fromTo(icon,
    { autoAlpha: 0, scale: 0, rotation: -180 },
    { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.9, ease: EASE.pop }, '-=0.8');
  if (h2) tl.fromTo(h2,
    { autoAlpha: 0, y: 55, rotateX: 15, transformPerspective: 1000 },
    { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, ease: EASE.reveal }, '-=0.5');
  if (p) tl.fromTo(p,
    { autoAlpha: 0, y: 25 },
    { autoAlpha: 1, y: 0, duration: DUR.base }, '-=0.5');
  if (btn) tl.fromTo(btn,
    { autoAlpha: 0, y: 20, scale: 0.9 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.pop }, '-=0.3');
}

function animateFooter() {
  const footer = document.querySelector('[data-gsap-footer]');
  if (!footer || !footer.children.length) return;

  gsap.fromTo(footer.children,
    { autoAlpha: 0, y: 25 },
    { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.6,
      scrollTrigger: { trigger: footer, start: 'top 93%' } }
  );
}

function animateSectionTransitions() {
  const sections = document.querySelectorAll('main > section');

  sections.forEach((section, i) => {
    if (i === 0) return;

    // Skip How It Works section — its step animations conflict with parallax
    if (section.querySelector('[data-gsap-how]')) return;

    const inner = section.querySelector('.max-w-6xl, .max-w-5xl, .max-w-4xl, .max-w-3xl');
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

  document.querySelectorAll('[data-gsap-parallax-glow]').forEach((glow) => {
    const speed = parseFloat(glow.dataset.gsapParallaxSpeed) || 0.3;
    gsap.to(glow, {
      y: () => -130 * speed,
      scrollTrigger: {
        trigger: glow.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.5,
      },
    });
  });
}

function animateProgressBar() {
  const bar = document.querySelector('.tn-progress-bar');
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

function initMobileNav() {
  const toggle = document.querySelector('.tn-mobile-toggle');
  const menu   = document.querySelector('.tn-mobile-menu');
  if (!toggle || !menu) return;

  let isOpen = false;
  gsap.set(menu, { height: 0, autoAlpha: 0, overflow: 'hidden' });

  toggle.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      gsap.set(menu, { autoAlpha: 1 });
      gsap.to(menu, { height: 'auto', duration: DUR.fast, ease: EASE.enter });
      gsap.fromTo(menu.children,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3, delay: 0.1 }
      );
    } else {
      gsap.to(menu, {
        height: 0, duration: 0.35, ease: EASE.enter,
        onComplete: () => gsap.set(menu, { autoAlpha: 0 }),
      });
    }
  });
}

function initCursorGlow() {
  const glow = document.querySelector('.tn-cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      x: e.clientX, y: e.clientY, duration: 0.8, ease: 'power2.out',
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}