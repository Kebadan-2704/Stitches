import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { isReducedMotion } from '../js/utils';

export default function Preloader() {
  const containerRef = useRef();

  useGSAP(() => {
    const preloader = containerRef.current;
    if (!preloader) return;

    if (isReducedMotion()) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
      document.body.classList.add('loaded');
      return;
    }

    const text = preloader.querySelector('.preloader-logo-text');
    const ring = preloader.querySelector('.preloader-ring');
    const bg = preloader.querySelector('.preloader-bg');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            preloader.setAttribute('aria-hidden', 'true');
            document.body.classList.add('loaded');
          }
        });
      }
    });

    // Elegant Sequence
    tl.to(bg, { opacity: 1, duration: 0.2 })
      .fromTo(ring, { rotation: -90, opacity: 0, scale: 0.9 }, { rotation: 180, opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
      .fromTo(text, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.4)
      .to(ring, { rotation: 360, scale: 1.1, opacity: 0, duration: 1, ease: 'power2.inOut' }, 2.5)
      .to(text, { scale: 1.05, opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 2.6)
      .to({}, { duration: 0.2 }); // small buffer

    return () => tl.kill();
  }, { scope: containerRef });

  return (
    <div id="preloader" aria-hidden="true" ref={containerRef}>
      <div className="preloader-bg"></div>
      <div className="preloader-inner">
        <div className="preloader-ring-wrapper">
          <svg className="preloader-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#C9A96E" strokeWidth="0.8" strokeDasharray="180 120" strokeDashoffset="50" strokeLinecap="round" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E91E63" strokeWidth="0.4" strokeDasharray="50 200" strokeDashoffset="0" strokeLinecap="round" opacity="0.6"/>
          </svg>
        </div>
        <div className="preloader-logo">
          <span className="preloader-logo-text">Stitches</span>
        </div>
      </div>
    </div>
  );
}
