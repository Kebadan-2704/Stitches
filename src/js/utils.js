/**
 * utils.js — Shared utility helpers for Stitches website
 */

/**
 * Linear interpolation between a and b by factor t
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Debounce: execute fn only after ms milliseconds of inactivity
 */
export function debounce(fn, ms = 100) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Throttle: execute fn at most once every ms milliseconds
 */
export function throttle(fn, ms = 100) {
  let lastTime = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    const remaining = ms - (now - lastTime);
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Detect touch / mobile device (no hover capability)
 */
export function isMobile() {
  return window.matchMedia('(hover: none)').matches;
}

/**
 * Detect user prefers-reduced-motion
 */
export function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get current scroll velocity from stored value.
 * This is updated by smooth-scroll.js via Lenis.
 */
let _scrollVelocity = 0;

export function setScrollVelocity(v) {
  _scrollVelocity = v;
}

export function getScrollVelocity() {
  return _scrollVelocity;
}

/**
 * Random number between min and max (inclusive)
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Map a value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
