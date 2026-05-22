import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { annotate } from 'rough-notation';
import { counterAnimation } from '../js/text-animations';
import { isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. Annotations
    const highlights = gsap.utils.toArray('[data-annotate="highlight"]', containerRef.current);
    highlights.forEach((el) => {
      const annotation = annotate(el, {
        type: 'highlight',
        color: '#C9A96E40',
        padding: 4,
        multiline: true,
        animationDuration: isReducedMotion() ? 0 : 800,
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => annotation.show(),
      });
    });

    const underlines = gsap.utils.toArray('[data-annotate="underline"]', containerRef.current);
    underlines.forEach((el) => {
      const annotation = annotate(el, {
        type: 'underline',
        color: '#8B2252',
        strokeWidth: 2,
        padding: 2,
        multiline: true,
        animationDuration: isReducedMotion() ? 0 : 600,
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => annotation.show(),
      });
    });

    // 2. Counters
    const counters = gsap.utils.toArray('[data-counter]', containerRef.current);
    counters.forEach((el) => {
      const endValue = parseInt(el.dataset.counter, 10);
      if (isNaN(endValue)) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          counterAnimation(el, endValue, 2);
        },
      });
    });

    // 3. Card Wipe
    const wipes = gsap.utils.toArray('.card-wipe', containerRef.current);
    if (isReducedMotion()) {
      wipes.forEach((wipe) => {
        wipe.style.transform = 'scaleX(0)';
      });
    } else {
      wipes.forEach((wipe) => {
        gsap.set(wipe, { scaleX: 1, transformOrigin: 'right center' });
        gsap.to(wipe, {
          scaleX: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: wipe.parentElement,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });
    }

    // 4. Stat stagger
    const stats = gsap.utils.toArray('.stat', containerRef.current);
    if (stats.length && !isReducedMotion()) {
      gsap.from(stats, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.about-stats'),
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} data-section="true">
      <div className="about-left">
        <span className="section-label" data-reveal="true">
          <span className="label-line"></span>Our Story
        </span>
        <h2 className="section-title" data-reveal-title="true">
          Crafted with <em data-annotate="highlight">intention</em>,<br/>worn with pride
        </h2>
        <div className="gold-rule" data-reveal="true"></div>
        <p className="about-text" data-reveal-lines="true">Stitches is a bespoke fashion atelier rooted in Coimbatore, where every garment is made from scratch — designed around you, your body, your occasion.</p>
        <p className="about-text-small" data-reveal-lines="true">Founded and managed by <em data-annotate="underline">Lidya Grace</em>, the brand bridges the gap between Indian tradition and contemporary Western silhouettes. Whether you're dressing for a wedding, a festive celebration, or simply everyday elegance — each piece is cut, stitched, and finished by hand.</p>
        <div className="about-stats">
          <div className="stat" data-reveal="true">
            <div className="stat-number" data-counter="29">0</div>
            <div className="stat-suffix">+</div>
            <div className="stat-label">Designs Created</div>
          </div>
          <div className="stat" data-reveal="true">
            <div className="stat-number" data-counter="100">0</div>
            <div className="stat-suffix">%</div>
            <div className="stat-label">Custom Made</div>
          </div>
          <div className="stat" data-reveal="true">
            <div className="stat-number" data-counter="2">0</div>
            <div className="stat-suffix"></div>
            <div className="stat-label">Style Worlds</div>
          </div>
        </div>
      </div>
      <div className="about-right">
        <div className="about-image-card" data-reveal="true" data-tilt="true">
          <div className="card-wipe" aria-hidden="true"></div>
          <div className="big-initial" aria-hidden="true">S</div>
          <div className="about-card-inner">
            <h3>Lidya Grace</h3>
            <p>"I believe fashion is deeply personal. Every stitch I make carries the story of the woman who'll wear it."</p>
            <div className="about-card-tag">
              <span className="tag-icon">📍</span>
              <span>Coimbatore, Tamil Nadu</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
