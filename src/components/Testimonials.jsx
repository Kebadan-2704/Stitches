import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { fetchTestimonials } from '../lib/cms-mock';

gsap.registerPlugin(ScrollTrigger);

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Testimonials() {
  const containerRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      const data = await fetchTestimonials();
      setTestimonials(data);
      setLoading(false);
    };
    loadTestimonials();
  }, []);

  const doubledTestimonials = [...testimonials, ...testimonials.map(t => ({...t, id: t.id + 5}))];

  useGSAP(() => {
    if (!isReducedMotion()) {
      gsap.from('.testimonials-swiper-wrap', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, { scope: containerRef });

  return (
    <section id="testimonials" data-section="true" className="dynamic-testimonials" ref={containerRef}>
      <div className="testimonials-bg-quote" aria-hidden="true">"</div>
      <div className="testimonials-aurora" aria-hidden="true"></div>
      
      <div className="testimonials-header">
        <span className="section-label" data-reveal="true" style={{color: 'var(--gold)'}}>
          <span className="label-line" style={{background: 'var(--gold)'}}></span>Testimonials
        </span>
        <h2 className="section-title" data-reveal-title="true" style={{color: 'var(--white)'}}>Client <em>Stories</em></h2>
      </div>

      <div className="testimonials-swiper-wrap" data-reveal="true">
        {!loading && (
          <Swiper
            modules={[EffectCoverflow, Pagination, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 20,
              stretch: 0,
              depth: 300,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            className="testimonials-swiper"
          >
            {doubledTestimonials.map((t) => (
              <SwiperSlide key={t.id} className="testimonial-slide" style={{ width: '400px', maxWidth: '85vw' }}>
                <div className="testimonial-card">
                  <div className="t-card-glow"></div>
                  <div className="t-card-content">
                    <div className="t-quote-icon">"</div>
                    <p className="t-text">{t.text}</p>
                    <div className="t-author">
                      <div className="t-author-img">
                        <img 
                          src={`${t.image}?v=2`} 
                          alt={t.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="t-author-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
