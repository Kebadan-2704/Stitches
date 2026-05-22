/**
 * text-animations.js — Reusable text animation creators
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Splitting from 'splitting';
import { isReducedMotion } from './utils.js';

/**
 * Split text into lines/words/chars and animate them in with GSAP.
 * @param {HTMLElement} element - DOM element to split and animate
 * @param {Object} options - Configuration
 * @param {string} options.type - 'lines' | 'words' | 'chars'
 * @param {number} options.stagger - Stagger between items
 * @param {number} options.duration - Animation duration
 * @param {string} options.from - Direction: 'bottom' | 'left' | 'right'
 * @param {Object} options.scrollTrigger - GSAP ScrollTrigger config
 * @returns {gsap.core.Tween|null}
 */
export function splitTextReveal(element, options = {}) {
  if (!element) return null;

  const {
    type = 'lines',
    stagger = 0.08,
    duration = 0.8,
    from = 'bottom',
    scrollTrigger = null,
    mask = false,
  } = options;

  if (isReducedMotion()) {
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    return null;
  }

  // Use Splitting.js to split the text
  // For 'lines' type, Splitting doesn't have a direct lines mode,
  // so we split by words and group by visual line position
  let splitType = type === 'lines' ? 'words' : type;
  const result = Splitting({ target: element, by: splitType });

  if (!result || !result[0]) {
    element.style.opacity = '1';
    return null;
  }

  let targets;

  if (type === 'lines') {
    // Group words by their vertical position to form lines
    const words = result[0].words || [];
    if (words.length === 0) {
      element.style.opacity = '1';
      return null;
    }

    // Wrap lines if mask is desired
    if (mask) {
      // Group words by top position
      const lineGroups = [];
      let currentLine = [];
      let currentTop = null;

      words.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const top = Math.round(rect.top);
        if (currentTop === null || Math.abs(top - currentTop) < 5) {
          currentLine.push(word);
          if (currentTop === null) currentTop = top;
        } else {
          lineGroups.push(currentLine);
          currentLine = [word];
          currentTop = top;
        }
      });
      if (currentLine.length) lineGroups.push(currentLine);

      // Wrap each line group in a div with overflow hidden
      lineGroups.forEach((lineWords) => {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'block';
        wrapper.style.overflow = 'hidden';
        lineWords[0].parentNode.insertBefore(wrapper, lineWords[0]);
        lineWords.forEach((w) => wrapper.appendChild(w));
      });

      targets = words;
    } else {
      targets = words;
    }
  } else if (type === 'chars') {
    targets = result[0].chars || [];
  } else {
    targets = result[0].words || [];
  }

  if (!targets || targets.length === 0) {
    element.style.opacity = '1';
    return null;
  }

  const fromVars = {
    y: from === 'bottom' ? 30 : from === 'top' ? -30 : 0,
    x: from === 'left' ? -30 : from === 'right' ? 30 : 0,
    opacity: 0,
  };

  const toVars = {
    y: 0,
    x: 0,
    opacity: 1,
    duration,
    stagger,
    ease: 'power3.out',
  };

  if (scrollTrigger) {
    toVars.scrollTrigger = scrollTrigger;
  }

  // Make the parent visible
  element.style.opacity = '1';
  element.style.visibility = 'visible';

  return gsap.from(targets, { ...fromVars, ...toVars });
}

/**
 * Scramble text effect: show random characters, then resolve to real text.
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Total duration in seconds
 * @returns {Promise}
 */
export function scrambleText(element, duration = 1.5) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return; }

    if (isReducedMotion()) {
      element.style.opacity = '1';
      resolve();
      return;
    }

    const originalText = element.textContent;
    const chars = '▓░▒█▄▀◆◇■□●○◎✦✧✫❖';
    const len = originalText.length;
    const frameInterval = 40; // ms per frame
    const totalFrames = Math.ceil((duration * 1000) / frameInterval);
    let frame = 0;

    element.style.opacity = '1';

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolvedCount = Math.floor(progress * len);
      let display = '';

      for (let i = 0; i < len; i++) {
        if (originalText[i] === ' ') {
          display += ' ';
        } else if (i < resolvedCount) {
          display += originalText[i];
        } else {
          display += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = display;

      if (frame >= totalFrames) {
        clearInterval(interval);
        element.textContent = originalText;
        resolve();
      }
    }, frameInterval);
  });
}

/**
 * Animate a number from 0 to endValue.
 * @param {HTMLElement} element - Target element to put the number in
 * @param {number} endValue - Final number value
 * @param {number} duration - Animation duration in seconds
 * @returns {gsap.core.Tween|null}
 */
export function counterAnimation(element, endValue, duration = 2) {
  if (!element) return null;

  if (isReducedMotion()) {
    element.textContent = endValue;
    return null;
  }

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value);
    },
  });
}
