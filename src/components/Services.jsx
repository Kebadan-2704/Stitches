import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Splitting from 'splitting';
import { isMobile, isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const numCards = 4;

  useGSAP(() => {
    let cleanupResize;

    if (isMobile()) {
      if (trackRef.current) {
        trackRef.current.style.flexDirection = 'column';
        trackRef.current.style.width = '100%';
        const cards = gsap.utils.toArray('.service-card', trackRef.current);
        cards.forEach((card) => {
          card.style.width = '100%';
          card.style.minWidth = '100%';
        });
      }
    } else {
      const track = trackRef.current;
      const scrollContainer = scrollContainerRef.current;
      const cards = gsap.utils.toArray('.service-card', trackRef.current);
      if (track && scrollContainer && cards.length > 0 && !isReducedMotion()) {
        const getScrollAmount = () => {
          const trackWidth = track.scrollWidth;
          const viewportWidth = window.innerWidth;
          return -(trackWidth - viewportWidth);
        };

        gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollContainer,
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              const index = Math.min(
                Math.floor(progress * cards.length),
                cards.length - 1
              );
              
              setActiveIndex(index);

              cards.forEach((card, i) => {
                if (i === index) {
                  gsap.to(card, { scale: 1, opacity: 1, duration: 0.3 });
                } else {
                  gsap.to(card, { scale: 0.92, opacity: 0.6, duration: 0.3 });
                }
              });
            },
          },
        });

        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener('resize', onResize);
        cleanupResize = () => window.removeEventListener('resize', onResize);
      }
    }

    if (!isReducedMotion()) {
      // 1. Text color fill animation for the title
      const title = document.querySelector('#services-title');
      if (title && Splitting) {
        // Use Splitting for a reliable character-by-character color reveal
        const split = Splitting({ target: title, by: 'chars' });
        
        // Make sure we have chars to animate
        if (split && split[0] && split[0].chars) {
          gsap.fromTo(split[0].chars,
            { color: '#A8B2B8' },
            {
              color: (i, target) => {
                 // Make the <em> tags rose, rest dark
                 return target.closest('em') ? 'var(--rose)' : 'var(--dark)';
              },
              ease: 'power2.out',
              duration: 0.1,
              stagger: 0.05,
              scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      } else if (title) {
         // Fallback if Splitting is not available
         gsap.fromTo(title, {color: '#A8B2B8'}, {
             color: 'var(--dark)', 
             duration: 1.5,
             scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' }
         });
      }

      // 2. Card animations
      const cards = gsap.utils.toArray('.service-card', containerRef.current);
      cards.forEach((card) => {
        const inner = card.querySelector('.service-card-inner');
        if (!inner) return;

        const children = inner.children;
        if (!children.length) return;

        gsap.from(children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'left 80%',
            end: 'left 20%',
            toggleActions: 'play none none none',
            ...(isMobile() ? { start: 'top 85%' } : {}),
          },
        });
      });
    }

    return () => {
      if (cleanupResize) cleanupResize();
    };
  }, { scope: containerRef });

  return (
    <section id="services" ref={containerRef} data-section="true">
      <div className="services-header">
        <span className="section-label section-label-center" data-reveal="true">What We Offer</span>
        <h2 id="services-title" className="section-title section-title-center">Dressed for every <em>occasion</em></h2>
        <div className="gold-rule gold-rule-center" data-reveal="true"></div>
        <p className="services-intro" data-reveal-lines="true">From traditional Indian ceremony wear to elegant Western evening gowns — we craft the outfit you've always imagined.</p>
      </div>
      <div className="services-scroll-container" id="services-scroll" ref={scrollContainerRef}>
        <div className="services-track" id="services-track" ref={trackRef}>
          <div className="service-card" data-tilt="true">
            <div className="service-card-inner">
              <span className="service-icon">🥻</span>
              <h3>Indian Traditional</h3>
              <p>Lehengas, sarees, churidars, and fusion sets crafted with rich fabrics and traditional embellishments for festivals and ceremonies.</p>
              <div className="service-tags">
                <span className="tag">Lehenga</span>
                <span className="tag">Saree</span>
                <span className="tag">Churidar</span>
              </div>
            </div>
          </div>
          <div className="service-card" data-tilt="true">
            <div className="service-card-inner">
              <span className="service-icon">👗</span>
              <h3>Western Wear</h3>
              <p>Gowns, A-line dresses, tiered frocks, and midi dresses tailored to your silhouette — for parties, formals, and everyday chic.</p>
              <div className="service-tags">
                <span className="tag">Gowns</span>
                <span className="tag">Midi Dress</span>
                <span className="tag">Frock</span>
              </div>
            </div>
          </div>
          <div className="service-card" data-tilt="true">
            <div className="service-card-inner">
              <span className="service-icon">✨</span>
              <h3>Fusion &amp; Bridal Sets</h3>
              <p>Matching bridesmaid sets, coordinated group outfits, and Indo-Western fusion looks for weddings and special events.</p>
              <div className="service-tags">
                <span className="tag">Bridesmaid</span>
                <span className="tag">Group Sets</span>
                <span className="tag">Event Wear</span>
              </div>
            </div>
          </div>
          <div className="service-card" data-tilt="true">
            <div className="service-card-inner">
              <span className="service-icon">💎</span>
              <h3>Occasion Couture</h3>
              <p>One-of-a-kind statement pieces for milestone moments — engagements, receptions, cocktail evenings, and red-carpet entrances.</p>
              <div className="service-tags">
                <span className="tag">Engagement</span>
                <span className="tag">Reception</span>
                <span className="tag">Cocktail</span>
              </div>
            </div>
          </div>
        </div>
        <div className="services-dots" id="services-dots">
          {Array.from({ length: numCards }).map((_, i) => (
            <button
              key={i}
              className={`service-dot ${i === activeIndex ? 'active' : ''}`}
              aria-label={`Service ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
