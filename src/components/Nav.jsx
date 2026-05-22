import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../js/smooth-scroll';
import { isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Nav() {
  const containerRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useGSAP(() => {
    let lastScroll = 0;
    let scrollAccumulator = 0;
    const navbar = containerRef.current.querySelector('#navbar');
    const menuToggle = containerRef.current.querySelector('#menu-toggle');
    const fullscreenMenu = containerRef.current.querySelector('#fullscreen-menu');
    const menuItems = containerRef.current.querySelectorAll('[data-menu-item]');
    const navLinks = containerRef.current.querySelectorAll('[data-nav]');
    const pageWipe = containerRef.current.querySelector('#page-wipe');
    const footerLinks = containerRef.current.querySelectorAll('.footer-links a, .nav-logo');

    if (!navbar) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const scroll = self.scroll();
        const direction = self.direction; // 1 = down, -1 = up

        if (scroll > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
          navbar.classList.remove('hidden');
          scrollAccumulator = 0;
        }

        if (direction === 1) {
          scrollAccumulator += scroll - lastScroll;
          if (scrollAccumulator > 200 && scroll > 200) {
            navbar.classList.add('hidden');
          }
        } else {
          scrollAccumulator = 0;
          navbar.classList.remove('hidden');
        }

        lastScroll = scroll;
      },
    });

    const scrollToSection = (href) => {
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;

      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const closeMenu = () => {
      setIsMenuOpen(false);
      menuToggle?.classList.remove('active');
      fullscreenMenu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      fullscreenMenu?.setAttribute('aria-hidden', 'true');

      const lenis = getLenis();
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };

    const handleMenuToggleClick = () => {
      setIsMenuOpen((prev) => {
        const nextState = !prev;
        
        menuToggle.classList.toggle('active', nextState);
        fullscreenMenu.classList.toggle('open', nextState);
        menuToggle.setAttribute('aria-expanded', nextState);
        fullscreenMenu.setAttribute('aria-hidden', !nextState);

        const lenis = getLenis();
        if (nextState) {
          if (lenis) lenis.stop();
          document.body.style.overflow = 'hidden';
        } else {
          if (lenis) lenis.start();
          document.body.style.overflow = '';
        }

        if (nextState && !isReducedMotion()) {
          gsap.fromTo(menuItems, 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
          );

          const menuFooter = fullscreenMenu.querySelector('.menu-footer');
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

    if (menuToggle && fullscreenMenu) {
      menuToggle.addEventListener('click', handleMenuToggleClick);
    }

    const handleMenuItemClick = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      closeMenu();

      setTimeout(() => {
        scrollToSection(href);
      }, 300);
    };

    menuItems.forEach((item) => {
      item.addEventListener('click', handleMenuItemClick);
    });

    const handleNavLinkClick = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');

      if (isMenuOpen) {
        closeMenu();
      }

      if (pageWipe && !isReducedMotion()) {
        gsap.set(pageWipe, { transformOrigin: 'left center', scaleX: 0 });

        const tl = gsap.timeline();

        tl.to(pageWipe, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power3.inOut',
        });

        tl.call(() => {
          scrollToSection(href);
        });

        tl.to(pageWipe, {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.4,
          ease: 'power3.inOut',
          delay: 0.15,
        });
      } else {
        scrollToSection(href);
      }
    };

    navLinks.forEach((link) => {
      link.addEventListener('click', handleNavLinkClick);
    });

    const handleFooterLinkClick = (e) => {
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      scrollToSection(href);
    };

    footerLinks.forEach((link) => {
      link.addEventListener('click', handleFooterLinkClick);
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (menuToggle) menuToggle.removeEventListener('click', handleMenuToggleClick);
      menuItems.forEach((item) => item.removeEventListener('click', handleMenuItemClick));
      navLinks.forEach((link) => link.removeEventListener('click', handleNavLinkClick));
      footerLinks.forEach((link) => link.removeEventListener('click', handleFooterLinkClick));
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* ═══════════ SIDE DOT NAVIGATION REMOVED ═══════════ */}

      {/* ═══════════ SCROLL TO TOP REMOVED ═══════════ */}

      {/* ═══════════ NAVIGATION ═══════════ */}
      <header>
        <nav id="navbar" aria-label="Main navigation">
          <a href="#hero" className="nav-logo" id="nav-logo">Stitches</a>
          <ul className="nav-links" id="nav-links">
            <li><a href="#about" data-nav="true">About</a></li>
            <li><a href="#services" data-nav="true">Services</a></li>
            <li><a href="#gallery" data-nav="true">Gallery</a></li>
            <li><a href="#process" data-nav="true">Process</a></li>
            <li><a href="#testimonials" data-nav="true">Voices</a></li>
            <li><a href="#contact" data-nav="true">Contact</a></li>
          </ul>
          <button className="nav-menu-btn" id="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>
        </nav>
      </header>

      {/* ═══════════ FULLSCREEN MOBILE MENU ═══════════ */}
      <div id="fullscreen-menu" className="fullscreen-menu" aria-hidden="true">
        <div className="menu-bg"></div>
        <div className="menu-content">
          <a href="#about" className="menu-item" data-menu-item="true">About</a>
          <a href="#services" className="menu-item" data-menu-item="true">Services</a>
          <a href="#gallery" className="menu-item" data-menu-item="true">Gallery</a>
          <a href="#process" className="menu-item" data-menu-item="true">Process</a>
          <a href="#testimonials" className="menu-item" data-menu-item="true">Voices</a>
          <a href="#contact" className="menu-item" data-menu-item="true">Contact</a>
          <div className="menu-footer">
            <a href="https://www.instagram.com/_s.t.i.t.c.h.e.s._" target="_blank" rel="noopener noreferrer">Instagram</a>
            <span>Coimbatore, India</span>
          </div>
        </div>
      </div>

      {/* ═══════════ PAGE TRANSITION WIPE ═══════════ */}
      <div id="page-wipe" aria-hidden="true"></div>
    </div>
  );
}
