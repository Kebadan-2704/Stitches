/**
 * smooth-scroll.js — Lenis smooth scroll with GSAP integration
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion, setScrollVelocity } from './utils.js';

let lenis = null;

export function getLenis() {
  return lenis;
}

export function init() {
  if (isReducedMotion()) {
    // Still create a minimal Lenis for scrollTo support, but with instant scrolling
    lenis = new Lenis({
      duration: 0,
      easing: (t) => t,
      smoothWheel: false,
      smoothTouch: false,
    });
  } else {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo (close to easeOutQuart)
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
  }

  // Connect Lenis scroll to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Update shared scroll velocity
  lenis.on('scroll', ({ velocity }) => {
    setScrollVelocity(velocity);
  });

  // Use GSAP ticker for Lenis raf loop
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Disable GSAP's built-in lag smoothing so it stays synced with Lenis
  gsap.ticker.lagSmoothing(0);

  // Cleanup on page unload
  window.addEventListener('beforeunload', destroy);

  return lenis;
}

export function destroy() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export default { init, getLenis, destroy };
