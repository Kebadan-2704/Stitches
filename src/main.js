/**
 * main.js — Entry point: imports CSS, registers GSAP plugins, initializes all modules
 */

// ─── CSS Imports ───
import './styles/index.css';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// ─── GSAP + ScrollTrigger Registration ───
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ─── Module Imports ───
import * as smoothScroll from './js/smooth-scroll.js';
import * as cursor from './js/cursor.js';
import * as preloader from './js/preloader.js';
import * as nav from './js/nav.js';
import * as scrollAnimations from './js/scroll-animations.js';
import * as hero from './js/hero.js';
import * as marquee from './js/marquee.js';
import * as about from './js/about.js';
import * as services from './js/services.js';
import * as gallery from './js/gallery.js';
import * as process from './js/process.js';
import * as testimonials from './js/testimonials.js';
import * as contact from './js/contact.js';
import * as footer from './js/footer.js';

// ─── Utility import ───
import { isReducedMotion } from './js/utils.js';

// ─── Init Sequence ───
async function main() {
  if (isReducedMotion()) {
    // Skip preloader animation, immediately set up everything
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
      preloaderEl.style.display = 'none';
      preloaderEl.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.add('loaded');

    initCore();
    initSections();
  } else {
    // Run preloader, then initialize everything
    try {
      await preloader.init();
    } catch (e) {
      // If preloader fails, just continue
      console.warn('Preloader error:', e);
      const preloaderEl = document.getElementById('preloader');
      if (preloaderEl) {
        preloaderEl.style.display = 'none';
      }
      document.body.classList.add('loaded');
    }

    initCore();
    initSections();
  }
}

/**
 * Core modules: smooth scroll, cursor, nav, scroll animations
 */
function initCore() {
  smoothScroll.init();
  cursor.init();
  nav.init();
  scrollAnimations.init();
}

/**
 * Section modules: hero through footer
 */
function initSections() {
  hero.init();
  marquee.init();
  about.init();
  services.init();
  gallery.init();
  process.init();
  testimonials.init();
  contact.init();
  footer.init();

  // Refresh ScrollTrigger after all sections are initialized
  // Use a small delay to ensure DOM is settled
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
}

// ─── Start the app ───
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
