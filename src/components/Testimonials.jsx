import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const testimonials = [
  { id: 1, name: 'Ananya S.', role: 'Bride', text: 'Stitches brought my dream bridal lehenga to life. The attention to detail and the fit were absolutely perfect. I felt like royalty on my big day.', image: '/gallery/img-1.webp' },
  { id: 2, name: 'Meera R.', role: 'Client', text: 'I needed a custom gown for a cocktail party within a week. Lidya and her team not only delivered on time but the craftsmanship was beyond my expectations.', image: '/gallery/img-2.webp' },
  { id: 3, name: 'Kavya T.', role: 'Bridesmaid', text: 'We got our entire bridesmaid squad outfits stitched here. The color coordination and the modern cuts were exactly what we had pinned on Pinterest!', image: '/gallery/img-3.webp' },
  { id: 4, name: 'Priya M.', role: 'Client', text: 'The fusion wear collection is stunning. I got an Indo-Western set that fits like a glove. Have been getting compliments every time I wear it.', image: '/gallery/img-4.webp' },
  { id: 5, name: 'Sneha K.', role: 'Bride', text: 'From the first sketch to the final fitting, the experience was magical. The embroidery work on my reception gown was breathtaking.', image: '/gallery/img-5.webp' }
];

const doubledTestimonials = [...testimonials, ...testimonials.map(t => ({...t, id: t.id + 5}))];

export default function Testimonials() {
  const containerRef = useRef(null);

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
      </div>
    </section>
  );
}
