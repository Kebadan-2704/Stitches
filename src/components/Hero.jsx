import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Splitting from 'splitting';
import { scrambleText } from '../js/text-animations';
import { isMobile, isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef();

  // GSAP Animations
  useGSAP(() => {
    const title = document.getElementById('hero-title');
    if (title) {
      if (isReducedMotion()) {
        title.style.opacity = '1';
      } else {
        scrambleText(title, 1.5);
      }
    }

    const tagline = document.querySelector('.hero-tagline[data-splitting]');
    if (tagline) {
      if (isReducedMotion()) {
        tagline.style.opacity = '1';
      } else {
        const result = Splitting({ target: tagline, by: 'chars' });
        if (result && result[0]) {
          const chars = result[0].chars || [];
          gsap.from(chars, {
            opacity: 0,
            y: 20,
            rotateX: -40,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 1.8,
          });
        }
      }
    }

    if (!isReducedMotion()) {
      // Subtitle Crossfade Loop
      const subtitles = gsap.utils.toArray('.subtitle-item');
      if (subtitles.length > 0) {
        const tl = gsap.timeline({ repeat: -1 });
        subtitles.forEach((item, index) => {
          tl.fromTo(item, 
            { y: 20, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
          )
          .to(item, { y: -20, opacity: 0, scale: 1.02, duration: 1.2, ease: 'power2.in', delay: 2.5 });
        });
      }

      // Background layers parallax
      const layers = [
        { selector: '.hero-bg-1', speed: 0.3 },
        { selector: '.hero-bg-2', speed: 0.5 },
        { selector: '.hero-bg-3', speed: 0.7 },
      ];

      layers.forEach(({ selector, speed }) => {
        const layer = document.querySelector(selector);
        if (layer) {
          gsap.to(layer, {
            y: () => window.innerHeight * speed * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // Pin & Fade Content
      const hero = document.getElementById('hero');
      const heroContent = hero?.querySelector('.hero-content');
      if (hero && heroContent) {
        gsap.to(heroContent, {
          opacity: 0,
          scale: 0.9,
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        });
      }

      // Scroll indicator animation
      const scrollInner = document.querySelector('.scroll-line-inner');
      if (scrollInner) {
        gsap.to(scrollInner, {
          y: '100%',
          duration: 1.5,
          repeat: -1,
          ease: 'power2.inOut',
          yoyo: true,
        });
      }
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div id="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar"></div>
      </div>
      
      <section id="hero" data-section="true" className="dynamic-hero">
        <div className="hero-bg-layers">
          <div className="hero-bg-layer hero-bg-1"></div>
          <div className="hero-bg-layer hero-bg-2"></div>
          <div className="hero-bg-layer hero-bg-3"></div>
        </div>
        <div className="hero-grain" aria-hidden="true"></div>

        {/* ═══════════ SVG STITCHING ANIMATION ═══════════ */}
        <div className="hero-stitches-overlay" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <path id="stitch-path-1" d="M -100,200 C 300,100 400,600 1100,300" />
              <path id="stitch-path-2" d="M 1100,700 C 600,900 300,400 -100,800" />
              <path id="stitch-path-3" d="M 200,-100 C 400,300 800,200 700,1100" />
              
              <g id="needle-gold">
                <path d="M 0,0 L -30,-1.5 L -30,1.5 Z" fill="#C9A96E" />
                <circle cx="-27" cy="0" r="0.8" fill="#1A0A0F" />
                <path d="M -27,0 C -40,15 -50,-15 -70,0" fill="none" stroke="#C9A96E" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>
              <g id="needle-rose">
                <path d="M 0,0 L -30,-1.5 L -30,1.5 Z" fill="#E91E63" />
                <circle cx="-27" cy="0" r="0.8" fill="#1A0A0F" />
                <path d="M -27,0 C -40,15 -50,-15 -70,0" fill="none" stroke="#E91E63" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>
            </defs>

            {/* Dashed thread paths */}
            <use href="#stitch-path-1" className="stitch-thread thread-1" />
            <use href="#stitch-path-2" className="stitch-thread thread-2" />
            <use href="#stitch-path-3" className="stitch-thread thread-3" />

            {/* Needles following paths */}
            <use href="#needle-gold">
              <animateMotion dur="15s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-1" />
              </animateMotion>
            </use>

            <use href="#needle-rose">
              <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-2" />
              </animateMotion>
            </use>

            <use href="#needle-gold">
              <animateMotion dur="25s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-3" />
              </animateMotion>
            </use>
          </svg>
        </div>

        {/* ═══════════ FLOATING COUTURE PARTICLES ═══════════ */}
        <div className="couture-particles" aria-hidden="true">
          {[...Array(30)].map((_, i) => {
            const type = i % 3; // 0: button, 1: needle, 2: thread
            const isRose = i % 2 === 0;
            const color = isRose ? '#E91E63' : '#C9A96E';
            const size = Math.random() * 25 + 15; // 15px to 40px
            const left = Math.random() * 100;
            const duration = Math.random() * 20 + 15; // 15s to 35s
            const delay = Math.random() * -35; // Random start time
            const rotationSpeed = (Math.random() * 20 + 10) * (Math.random() > 0.5 ? 1 : -1);

            return (
              <div 
                key={i} 
                className="couture-particle"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  opacity: Math.random() * 0.25 + 0.1,
                  '--rot-speed': `${rotationSpeed}s`
                }}
              >
                {type === 0 && (
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="6" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="2" opacity="0.5"/>
                    <circle cx="35" cy="35" r="6" fill={color} />
                    <circle cx="65" cy="35" r="6" fill={color} />
                    <circle cx="35" cy="65" r="6" fill={color} />
                    <circle cx="65" cy="65" r="6" fill={color} />
                  </svg>
                )}
                {type === 1 && (
                  <svg viewBox="0 0 100 100">
                    <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round"/>
                    <ellipse cx="50" cy="8" rx="4" ry="7" fill="none" stroke={color} strokeWidth="3"/>
                  </svg>
                )}
                {type === 2 && (
                  <svg viewBox="0 0 100 100">
                    <path d="M 10 20 Q 50 -10 90 40 T 10 80" fill="none" stroke={color} strokeWidth="4" strokeDasharray="8 8" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        <div className="hero-content">
          <p className="hero-tagline" data-splitting="true">Coimbatore's Custom Couture House</p>
          <h1 className="hero-title" id="hero-title">Stitches</h1>
          
          <div className="hero-subtitle-wrap">
            <span className="subtitle-item">Where every thread tells your story</span>
            <span className="subtitle-item">Bespoke Indian & Western Couture</span>
            <span className="subtitle-item">Handcrafted in Coimbatore</span>
          </div>

          <div className="hero-divider">
            <span className="hero-div-line"></span>
            <span className="hero-div-text">Indian &amp; Western · Bespoke · Handcrafted</span>
            <span className="hero-div-line"></span>
          </div>
          
          <div className="hero-ctas">
            <a href="#gallery" className="hero-cta" id="cta-gallery" data-magnetic="true">
              <span>View Collection</span>
            </a>
            <a href="#contact" className="hero-cta hero-cta-solid" id="cta-contact" data-magnetic="true">
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
        <div className="hero-scroll-indicator" id="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line-wrap">
            <div className="scroll-line-inner"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
