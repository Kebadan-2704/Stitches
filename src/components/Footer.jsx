import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const randomBetween = (min, max) => Math.random() * (max - min) + min;

// Generate particle data once outside component to avoid hydration mismatches
const particles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: randomBetween(2, 4),
  left: randomBetween(0, 100),
  top: randomBetween(0, 100),
  delay: randomBetween(0, 5),
  duration: randomBetween(3, 7)
}));

export default function Footer() {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  useGSAP(() => {
    const logo = logoRef.current;
    if (logo && !isReducedMotion()) {
      // Stroke to fill animation
      gsap.set(logo, {
        '-webkit-text-stroke': '2px #C9A96E',
        color: 'transparent',
      });

      gsap.to(logo, {
        '-webkit-text-stroke': '0px #C9A96E',
        color: '#C9A96E',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: logo,
          start: 'top 90%',
          end: 'top 60%',
          scrub: true,
        },
      });

      // Parallax
      gsap.to(logo, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }

  }, { scope: containerRef });

  return (
    <footer id="footer" ref={containerRef}>
      <style>{`
        @keyframes footerFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translate(0px, -20px) scale(1.5); opacity: 0.1; }
        }
      `}</style>
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path className="wave-path wave-1" d="M0 60 Q360 0 720 60 Q1080 120 1440 60 L1440 120 L0 120 Z"/>
          <path className="wave-path wave-2" d="M0 80 Q360 20 720 80 Q1080 140 1440 80 L1440 120 L0 120 Z"/>
        </svg>
      </div>
      <div className="footer-particles" id="footer-particles" aria-hidden="true">
        {particles.map(p => (
          <div 
            key={p.id}
            className="footer-particle"
            style={{
              position: 'absolute',
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background: '#C9A96E',
              borderRadius: '50%',
              opacity: 0.3,
              pointerEvents: 'none',
              animation: `footerFloat ${p.duration}s ${p.delay}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      <div className="footer-content">
        <div className="footer-logo" data-reveal="true" ref={logoRef}>Stitches</div>
        <p className="footer-tagline" data-reveal="true">Handcrafted in Coimbatore · Indian &amp; Western · Custom Made</p>
        <div className="footer-links" data-reveal="true" aria-label="Footer links">
          <a href="#about" aria-label="Go to About section">About</a>
          <a href="#services" aria-label="Go to Services section">Services</a>
          <a href="#gallery" aria-label="Go to Gallery section">Gallery</a>
          <a href="#process" aria-label="Go to Process section">Process</a>
          <a href="#contact" aria-label="Go to Contact section">Contact</a>
        </div>
        <div className="footer-social" data-reveal="true">
          <a className="social-btn" href="https://www.instagram.com/_s.t.i.t.c.h.e.s._" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-magnetic="true">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
          </a>
          <a className="social-btn" href="#contact" aria-label="WhatsApp" data-magnetic="true">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.15-1.35A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 10.5c.5 1 1.5 2.5 3 3.5l1.5-1 2 1.5-.5 1.5c-3 1-6.5-2.5-7-5.5l1.5-.5.5 1.5z" fill="currentColor" opacity="0.7"/></svg>
          </a>
          <a className="social-btn" href="mailto:stitches.cbe@gmail.com" aria-label="Email" data-magnetic="true">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M2 4l10 8 10-8" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
          </a>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Stitches by Lidya Grace · All rights reserved · Coimbatore, India
          <br/>
          <Link to="/privacy-policy" style={{opacity: 0.7, marginRight: 15, fontSize: '0.8rem'}}>Privacy Policy</Link>
          <Link to="/terms-of-service" style={{opacity: 0.7, fontSize: '0.8rem'}}>Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}
