import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { isReducedMotion, getScrollVelocity } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (isReducedMotion()) return;

    const tracks = gsap.utils.toArray('.marquee-track', containerRef.current);
    if (!tracks.length) return;

    const tweens = [];

    tracks.forEach((track) => {
      const contents = track.querySelectorAll('.marquee-content');
      if (!contents.length) return;

      const isReverse = track.classList.contains('marquee-reverse');
      const direction = isReverse ? 1 : -1;

      const tween = gsap.to(contents, {
        xPercent: direction * -100,
        repeat: -1,
        duration: 30,
        ease: 'none',
      });

      if (isReverse) {
        gsap.set(contents, { xPercent: -100 });
        tween.kill();
        const reverseTween = gsap.to(contents, {
          xPercent: 0,
          repeat: -1,
          duration: 30,
          ease: 'none',
        });
        tweens.push(reverseTween);
      } else {
        tweens.push(tween);
      }
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: () => {
        const velocity = Math.abs(getScrollVelocity());
        const speedMultiplier = 1 + Math.min(velocity / 300, 3);

        tweens.forEach((tween) => {
          gsap.to(tween, {
            timeScale: speedMultiplier,
            duration: 0.3,
            overwrite: true,
          });
        });
      },
    });
  }, { scope: containerRef });

  return (
    <section id="marquee" ref={containerRef} data-section="true" aria-label="Brand keywords">
      <div className="marquee-row marquee-row-1">
        <div className="marquee-track">
          <div className="marquee-content">
            <span>Bespoke</span><span className="marquee-dot">✦</span>
            <span>Handcrafted</span><span className="marquee-dot">✦</span>
            <span>Coimbatore</span><span className="marquee-dot">✦</span>
            <span>Custom Couture</span><span className="marquee-dot">✦</span>
            <span>Indian &amp; Western</span><span className="marquee-dot">✦</span>
            <span>Designer Wear</span><span className="marquee-dot">✦</span>
            <span>Made to Order</span><span className="marquee-dot">✦</span>
            <span>Lidya Grace</span><span className="marquee-dot">✦</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>Bespoke</span><span className="marquee-dot">✦</span>
            <span>Handcrafted</span><span className="marquee-dot">✦</span>
            <span>Coimbatore</span><span className="marquee-dot">✦</span>
            <span>Custom Couture</span><span className="marquee-dot">✦</span>
            <span>Indian &amp; Western</span><span className="marquee-dot">✦</span>
            <span>Designer Wear</span><span className="marquee-dot">✦</span>
            <span>Made to Order</span><span className="marquee-dot">✦</span>
            <span>Lidya Grace</span><span className="marquee-dot">✦</span>
          </div>
        </div>
      </div>
      <div className="marquee-row marquee-row-2">
        <div className="marquee-track marquee-reverse">
          <div className="marquee-content">
            <span>Lehenga</span><span className="marquee-dot">◈</span>
            <span>Saree</span><span className="marquee-dot">◈</span>
            <span>Gown</span><span className="marquee-dot">◈</span>
            <span>Frock</span><span className="marquee-dot">◈</span>
            <span>Fusion Wear</span><span className="marquee-dot">◈</span>
            <span>Churidar</span><span className="marquee-dot">◈</span>
            <span>Bridesmaid Sets</span><span className="marquee-dot">◈</span>
            <span>A-line Dress</span><span className="marquee-dot">◈</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>Lehenga</span><span className="marquee-dot">◈</span>
            <span>Saree</span><span className="marquee-dot">◈</span>
            <span>Gown</span><span className="marquee-dot">◈</span>
            <span>Frock</span><span className="marquee-dot">◈</span>
            <span>Fusion Wear</span><span className="marquee-dot">◈</span>
            <span>Churidar</span><span className="marquee-dot">◈</span>
            <span>Bridesmaid Sets</span><span className="marquee-dot">◈</span>
            <span>A-line Dress</span><span className="marquee-dot">◈</span>
          </div>
        </div>
      </div>
    </section>
  );
}
