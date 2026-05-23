import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import Atropos from 'atropos/react';
import 'atropos/css';
import FocusTrap from 'focus-trap-react';
import { isReducedMotion } from '../js/utils';
import { fetchGalleryImages } from '../lib/cms-mock';

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Gallery() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxData, setLightboxData] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const flipStateRef = useRef(null);
  const isAnimatingClose = useRef(false);

  useEffect(() => {
    const loadItems = async () => {
      const items = await fetchGalleryImages();
      setGalleryItems(items);
      setLoading(false);
    };
    loadItems();
  }, []);

  useGSAP(() => {
    if (!loading && !isReducedMotion() && gridRef.current) {
      const gridItems = gsap.utils.toArray('.gallery-item', gridRef.current);
      if (gridItems.length > 0) {
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
    }
  }, { scope: containerRef, dependencies: [loading] });

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
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(item)}
                tabIndex="0"
                role="button"
                aria-label={`View ${item.name}`}
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
                          alt={`Custom ${item.name} Design - Stitches Coimbatore`}
                          loading="lazy"
                          decoding="async"
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
      <FocusTrap active={lightboxOpen} focusTrapOptions={{ fallbackFocus: '#lightbox' }}>
        <div 
          id="lightbox" 
          tabIndex="-1"
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
                    alt={`${lightboxData.name} - Detailed View`}
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
      </FocusTrap>
    </div>
  );
}
