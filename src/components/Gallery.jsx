import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import Atropos from 'atropos/react';
import 'atropos/css';
import { isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger, Flip);

const galleryItems = [
  { id: 1, name: 'Emerald Lehenga', category: 'indian', image: '/gallery/img-1.png', color: '#2E7D32' },
  { id: 2, name: 'Silk Gown', category: 'gown', image: '/gallery/img-2.png', color: '#8B2252' },
  { id: 3, name: 'Fusion Saree Dress', category: 'fusion', image: '/gallery/img-3.png', color: '#C9A96E' },
  { id: 4, name: 'A-Line Midi', category: 'western', image: '/gallery/img-4.png', color: '#5C3348' },
  { id: 5, name: 'Bridal Lehenga', category: 'indian', image: '/gallery/img-5.png', color: '#C2185B' },
  { id: 6, name: 'Evening Gown', category: 'gown', image: '/gallery/img-6.png', color: '#1A0A0F' },
  { id: 7, name: 'Indo-Western Set', category: 'fusion', image: '/gallery/img-7.png', color: '#9B7B8A' },
  { id: 8, name: 'Tiered Frock', category: 'western', image: '/gallery/img-8.png', color: '#E8D5A3' },
  { id: 9, name: 'Churidar Set', category: 'indian', image: '/gallery/img-9.png', color: '#3A1F2A' },
  { id: 10, name: 'Cocktail Gown', category: 'gown', image: '/gallery/img-10.png', color: '#8B2252' },
  { id: 11, name: 'Fusion Anarkali', category: 'fusion', image: '/gallery/img-11.png', color: '#C9A96E' },
  { id: 12, name: 'Party Dress', category: 'western', image: '/gallery/img-12.png', color: '#5C3348' },
];

export default function Gallery() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [lightboxData, setLightboxData] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const flipStateRef = useRef(null);
  const isAnimatingClose = useRef(false);

  useGSAP(() => {
    if (!isReducedMotion() && gridRef.current) {
      const gridItems = gsap.utils.toArray('.gallery-item', gridRef.current);
      gsap.from(gridItems, {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: containerRef });

  useGSAP(() => {
    if (flipStateRef.current && !isReducedMotion()) {
      Flip.from(flipStateRef.current, {
        targets: '.gallery-item, .gallery-grid',
        duration: 0.4,
        ease: 'power3.out',
        scale: true,
        absolute: '.gallery-item',
        onEnter: (elements) => {
          return gsap.from(elements, {
            opacity: 0,
            scale: 0.9,
            y: 30,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out'
          });
        },
        onLeave: (elements) => {
          return gsap.to(elements, {
            opacity: 0,
            scale: 0.9,
            duration: 0.25,
          });
        }
      });
      flipStateRef.current = null;
    }
  }, { scope: containerRef, dependencies: [filter] });

  useGSAP(() => {
    if (lightboxOpen && !isReducedMotion() && !isAnimatingClose.current) {
      gsap.fromTo('.lightbox-content', {
        opacity: 0,
        scale: 0.8
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
      });
      gsap.fromTo('#lightbox', {
        backgroundColor: 'rgba(0,0,0,0)',
      }, {
        backgroundColor: 'rgba(0,0,0,0.9)',
        duration: 0.3,
      });
    }
  }, { scope: containerRef, dependencies: [lightboxOpen] });

  const handleFilterClick = (newFilter) => {
    if (newFilter === filter) return;
    if (!isReducedMotion()) {
      flipStateRef.current = Flip.getState('.gallery-item, .gallery-grid');
    }
    setFilter(newFilter);
  };

  const openLightbox = (item) => {
    isAnimatingClose.current = false;
    setLightboxData(item);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    if (isAnimatingClose.current) return;
    isAnimatingClose.current = true;

    if (!isReducedMotion()) {
      gsap.to('.lightbox-content', {
        opacity: 0,
        scale: 0.9,
        duration: 0.25,
        ease: 'power3.in',
      });
      gsap.to('#lightbox', {
        backgroundColor: 'rgba(0,0,0,0)',
        duration: 0.25,
        onComplete: () => {
          setLightboxOpen(false);
          setLightboxData(null);
          isAnimatingClose.current = false;
        }
      });
    } else {
      setLightboxOpen(false);
      setLightboxData(null);
      isAnimatingClose.current = false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div ref={containerRef}>
      <section id="gallery" data-section="true" className="dynamic-gallery">
        <div className="gallery-header">
          <span className="section-label" data-reveal="true">Portfolio</span>
          <h2 className="section-title" data-reveal-title="true">The <em>Collection</em></h2>
          <p className="gallery-intro" data-reveal-lines="true">A glimpse into our handcrafted wardrobe — each piece made to order, never mass-produced.</p>
        </div>
        <div className="gallery-filters" data-reveal="true">
          {['all', 'western', 'indian', 'fusion', 'gown'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              data-filter={f}
              data-magnetic="true"
              onClick={() => handleFilterClick(f)}
            >
              {f === 'all' ? 'All' : f === 'gown' ? 'Gowns' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="gallery-grid" id="gallery-grid" ref={gridRef}>
          {galleryItems.map(item => {
            const isVisible = filter === 'all' || item.category === filter;
            return (
              <div
                key={item.id}
                className="gallery-item"
                data-category={item.category}
                style={{ display: isVisible ? 'block' : 'none' }}
                onClick={() => openLightbox(item)}
              >
                <Atropos
                  activeOffset={40}
                  shadowScale={1.05}
                  className="my-atropos"
                  rotateXMax={15}
                  rotateYMax={15}
                  highlight={true}
                >
                  <div className="gallery-item-inner" data-atropos-offset="-5">
                    <div className="gallery-img-wrap" data-atropos-offset="0">
                      <img
                        src={`${item.image}?v=2`}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="gallery-overlay" data-atropos-offset="5">
                      <span className="gallery-category" data-atropos-offset="10">{item.category}</span>
                      <h4 className="gallery-name" data-atropos-offset="15">{item.name}</h4>
                    </div>
                  </div>
                </Atropos>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ GALLERY LIGHTBOX ═══════════ */}
      <div 
        id="lightbox" 
        className={`lightbox ${lightboxOpen ? 'active' : ''}`} 
        aria-hidden={!lightboxOpen} 
        role="dialog" 
        aria-label="Image viewer"
        onClick={(e) => {
          if (e.target.id === 'lightbox') closeLightbox();
        }}
      >
        <button className="lightbox-close" id="lightbox-close" aria-label="Close lightbox" onClick={closeLightbox}>
          <svg viewBox="0 0 24 24" width="28" height="28">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2"/>
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <div className="lightbox-content" id="lightbox-content">
          {lightboxData && (
            <>
              <div className="lightbox-image-wrap">
                <img
                  src={lightboxData.image}
                  alt={lightboxData.name}
                  style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = `linear-gradient(135deg, #8B2252, #C9A96E)`;
                  }}
                />
              </div>
              <div className="lightbox-info">
                <span className="lightbox-category">{lightboxData.category}</span>
                <h3 className="lightbox-name">{lightboxData.name}</h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
