import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { isReducedMotion } from '../js/utils';

export default function Preloader() {
  const containerRef = useRef();

  useGSAP(() => {
    const preloader = containerRef.current;

    if (!preloader) {
      return;
    }

    if (isReducedMotion()) {
      preloader.style.display = 'none';
      preloader.setAttribute('aria-hidden', 'true');
      document.body.classList.add('loaded');
      return;
    }

    const needleLine = preloader.querySelector('.needle-line');
    const needleEye = preloader.querySelector('.needle-eye');
    const needleTip = preloader.querySelector('.needle-tip');
    const threadPath = preloader.querySelector('.thread-path');
    const logo = preloader.querySelector('.preloader-logo');
    const progressBar = preloader.querySelector('.preloader-progress-bar');

    const needleLineLength = needleLine ? needleLine.getTotalLength() : 140;
    const threadPathLength = threadPath ? threadPath.getTotalLength() : 400;

    if (needleLine) {
      needleLine.style.strokeDasharray = needleLineLength;
      needleLine.style.strokeDashoffset = needleLineLength;
    }
    if (needleEye) {
      const eyeLength = needleEye.getTotalLength ? needleEye.getTotalLength() : 38;
      needleEye.style.strokeDasharray = eyeLength;
      needleEye.style.strokeDashoffset = eyeLength;
    }
    if (needleTip) {
      gsap.set(needleTip, { opacity: 0 });
    }
    if (threadPath) {
      threadPath.style.strokeDasharray = threadPathLength;
      threadPath.style.strokeDashoffset = threadPathLength;
    }
    if (logo) {
      gsap.set(logo, { opacity: 0, y: 10 });
    }
    if (progressBar) {
      gsap.set(progressBar, { width: '0%' });
    }

    const exitPreloader = () => {
      gsap.to(preloader, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8,
        ease: 'power3.inOut',
        onStart: () => {
          preloader.style.clipPath = 'circle(100% at 50% 50%)';
        },
        onComplete: () => {
          preloader.style.display = 'none';
          preloader.setAttribute('aria-hidden', 'true');
          document.body.classList.add('loaded');
        },
      });
    };

    const tl = gsap.timeline({
      onComplete: exitPreloader,
    });

    let windowLoaded = false;
    const onWindowLoad = () => { windowLoaded = true; };

    if (document.readyState === 'complete') {
      windowLoaded = true;
    } else {
      window.addEventListener('load', onWindowLoad, { once: true });
    }

    if (needleLine) {
      tl.to(needleLine, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0);
    }
    if (needleEye) {
      tl.to(needleEye, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.3);
    }
    if (needleTip) {
      tl.to(needleTip, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.8);
    }
    if (threadPath) {
      tl.to(threadPath, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, 1.0);
    }
    if (logo) {
      tl.to(logo, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.8);
    }
    if (progressBar) {
      tl.to(progressBar, { width: '70%', duration: 1.5, ease: 'power1.out' }, 0.5);
      tl.to(progressBar, {
        width: '100%',
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          if (!windowLoaded) {
            tl.pause();
            const checkLoaded = () => {
              if (windowLoaded) {
                tl.resume();
              } else {
                requestAnimationFrame(checkLoaded);
              }
            };
            checkLoaded();
          }
        },
      });
    }

    tl.to({}, { duration: 0.3 });

    return () => {
      window.removeEventListener('load', onWindowLoad);
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <div id="preloader" aria-hidden="true" ref={containerRef}>
      <div className="preloader-inner">
        <svg className="preloader-needle" viewBox="0 0 100 200" width="40" height="80">
          <line x1="50" y1="10" x2="50" y2="150" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" className="needle-line"/>
          <circle cx="50" cy="10" r="6" fill="none" stroke="#C9A96E" strokeWidth="2" className="needle-eye"/>
          <path d="M50 150 Q30 170 50 190 Q70 170 50 150" fill="#C9A96E" className="needle-tip"/>
        </svg>
        <svg className="preloader-thread" viewBox="0 0 300 60" width="200" height="40">
          <path d="M0 30 Q50 0 100 30 Q150 60 200 30 Q250 0 300 30" fill="none" stroke="#8B2252" strokeWidth="2" strokeDasharray="400" strokeDashoffset="400" className="thread-path"/>
        </svg>
        <div className="preloader-logo">Stitches</div>
        <div className="preloader-progress">
          <div className="preloader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
