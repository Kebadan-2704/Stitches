/**
 * scroll-animations.js — Scroll progress, side dots, scroll-to-top, reveal animations
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from './smooth-scroll.js';
import { splitTextReveal } from './text-animations.js';
import { isReducedMotion } from './utils.js';

export function init() {
  initScrollProgress();
  initSideDots();
  initScrollToTop();
  initRevealAnimations();
  initRevealTitles();
  initRevealLines();
}

/**
 * Scroll progress bar: width 0% → 100%
 */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress-bar');
  if (!bar) return;

  if (isReducedMotion()) {
    bar.style.width = '0%';
    return;
  }

  gsap.to(bar, {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

/**
 * Side dot navigation: update active dot based on visible section
 */
function initSideDots() {
  const dots = document.querySelectorAll('.side-dot');
  const sections = document.querySelectorAll('[data-section]');

  if (!dots.length || !sections.length) return;

  // Create ScrollTrigger for each section to detect which is active
  sections.forEach((section) => {
    const sectionId = section.id;
    const dot = document.querySelector(`.side-dot[data-section="${sectionId}"]`);
    if (!dot) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(dot),
      onEnterBack: () => setActiveDot(dot),
    });
  });

  function setActiveDot(activeDot) {
    dots.forEach((d) => d.classList.remove('active'));
    activeDot.classList.add('active');
  }

  // Click dot → scroll to section
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const sectionId = dot.dataset.section;
      const section = document.getElementById(sectionId);
      if (!section) return;

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(section, { offset: 0, duration: 1.2 });
      } else {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Scroll-to-top button: show after 300px, click → scroll to top
 */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  ScrollTrigger.create({
    trigger: document.body,
    start: '300px top',
    end: 'bottom bottom',
    onEnter: () => {
      gsap.to(btn, { opacity: 1, scale: 1, duration: 0.3, pointerEvents: 'auto' });
    },
    onLeaveBack: () => {
      gsap.to(btn, { opacity: 0, scale: 0.8, duration: 0.3, pointerEvents: 'none' });
    },
  });

  btn.addEventListener('click', () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * Generic [data-reveal] elements
 */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');

  if (isReducedMotion()) {
    revealElements.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  revealElements.forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/**
 * [data-reveal-title] elements — splitTextReveal with type 'words'
 */
function initRevealTitles() {
  const titles = document.querySelectorAll('[data-reveal-title]');

  titles.forEach((el) => {
    splitTextReveal(el, {
      type: 'words',
      stagger: 0.06,
      duration: 0.7,
      from: 'bottom',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/**
 * [data-reveal-lines] elements — splitTextReveal with type 'lines' and mask
 */
function initRevealLines() {
  const lineElements = document.querySelectorAll('[data-reveal-lines]');

  lineElements.forEach((el) => {
    splitTextReveal(el, {
      type: 'lines',
      stagger: 0.1,
      duration: 0.8,
      from: 'bottom',
      mask: true,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });
}
