import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import FocusTrap from 'focus-trap-react';
import { isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Nav() {
  const containerRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setIsScrolled(self.scroll() > 60);
      },
    });
  }, { scope: containerRef });

  const scrollToSection = (href) => {
    if (!href) return;
    const target = document.querySelector(href);
    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  };

  const handleMenuToggleClick = () => {
    setIsMenuOpen((prev) => {
      const nextState = !prev;
      
      if (nextState) {
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
      } else {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
      }

      if (nextState && !isReducedMotion()) {
        const menuItems = containerRef.current.querySelectorAll('.menu-item');
        gsap.fromTo(menuItems, 
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
        );

        const menuFooter = containerRef.current.querySelector('.menu-footer');
        if (menuFooter) {
          gsap.fromTo(menuFooter, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.6 }
          );
        }
      }
      
      return nextState;
    });
  };

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();

    if (isMenuOpen) {
      closeMenu();
    }

    const pageWipe = containerRef.current.querySelector('#page-wipe');
    if (pageWipe && !isReducedMotion()) {
      gsap.set(pageWipe, { transformOrigin: 'left center', scaleX: 0 });
      const tl = gsap.timeline();
      tl.to(pageWipe, { scaleX: 1, duration: 0.4, ease: 'power3.inOut' });
      tl.call(() => scrollToSection(href));
      tl.to(pageWipe, { scaleX: 0, transformOrigin: 'right center', duration: 0.4, ease: 'power3.inOut', delay: 0.15 });
    } else {
      setTimeout(() => scrollToSection(href), 100);
    }
  };

  return (
    <div ref={containerRef}>
      <header>
        <nav id="navbar" className={isScrolled ? 'scrolled' : ''} aria-label="Main navigation">
          <a href="#hero" className="nav-logo" onClick={(e) => handleNavLinkClick(e, '#hero')}>Stitches</a>
          <ul className="nav-links">
            <li><a href="#about" onClick={(e) => handleNavLinkClick(e, '#about')}>About</a></li>
            <li><a href="#services" onClick={(e) => handleNavLinkClick(e, '#services')}>Services</a></li>
            <li><a href="#gallery" onClick={(e) => handleNavLinkClick(e, '#gallery')}>Gallery</a></li>
            <li><a href="#process" onClick={(e) => handleNavLinkClick(e, '#process')}>Process</a></li>
            <li><a href="#testimonials" onClick={(e) => handleNavLinkClick(e, '#testimonials')}>Voices</a></li>
            <li><a href="#contact" onClick={(e) => handleNavLinkClick(e, '#contact')}>Contact</a></li>
          </ul>
          <button className={`nav-menu-btn ${isMenuOpen ? 'active' : ''}`} aria-label="Toggle menu" aria-expanded={isMenuOpen} onClick={handleMenuToggleClick}>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>
        </nav>
      </header>

      <FocusTrap active={isMenuOpen} focusTrapOptions={{ fallbackFocus: '#fullscreen-menu' }}>
        <div id="fullscreen-menu" tabIndex="-1" className={`fullscreen-menu ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
          <div className="menu-bg"></div>
          <div className="menu-content">
            <a href="#about" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#about')}>About</a>
            <a href="#services" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#services')}>Services</a>
            <a href="#gallery" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#gallery')}>Gallery</a>
            <a href="#process" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#process')}>Process</a>
            <a href="#testimonials" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#testimonials')}>Voices</a>
            <a href="#contact" className="menu-item" onClick={(e) => handleNavLinkClick(e, '#contact')}>Contact</a>
            <div className="menu-footer">
              <a href="https://www.instagram.com/_s.t.i.t.c.h.e.s._" target="_blank" rel="noopener noreferrer">Instagram</a>
              <span>Coimbatore, India</span>
            </div>
          </div>
        </div>
      </FocusTrap>

      <div id="page-wipe" aria-hidden="true"></div>
    </div>
  );
}
