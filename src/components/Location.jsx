import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

export default function Location() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedMotion) {
      gsap.from('.location-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, { scope: containerRef });

  return (
    <section id="location" data-section="true" ref={containerRef} style={{ background: 'var(--dark)', padding: '100px 60px', color: 'var(--white)' }}>
      <style>{`
        .location-container { max-width: 1000px; margin: 0 auto; text-align: center; }
        .location-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-lg); overflow: hidden; margin-top: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .location-map { width: 100%; height: 400px; border: none; }
        .location-details { padding: 30px; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; background: rgba(0,0,0,0.2); }
        .loc-item h4 { font-family: var(--font-heading); color: var(--gold); margin-bottom: 8px; font-size: 1.2rem; }
        .loc-item p { font-family: var(--font-body); color: var(--ivory); font-size: 0.9rem; line-height: 1.5; opacity: 0.8; }
      `}</style>
      
      <div className="location-container">
        <span className="section-label" style={{justifyContent: 'center'}}><span className="label-line"></span>Visit Us</span>
        <h2 className="section-title section-title-center">Our <em>Studio</em></h2>
        
        <div className="location-card">
          <iframe 
            className="location-map"
            src="https://maps.google.com/maps?q=RS+Puram,+Coimbatore,+Tamil+Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Stitches Studio Location in Coimbatore"
          ></iframe>
          <div className="location-details">
            <div className="loc-item">
              <h4>Address</h4>
              <p>123 Fashion Avenue<br/>RS Puram, Coimbatore<br/>Tamil Nadu 641002</p>
            </div>
            <div className="loc-item">
              <h4>Hours</h4>
              <p>Mon - Sat: 10:00 AM - 7:00 PM<br/>Sunday: By Appointment Only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
