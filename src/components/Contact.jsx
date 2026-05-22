import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import confetti from 'canvas-confetti';

const WHATSAPP_NUMBER = '919876543210';
const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Contact() {
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const toastRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    occasion: '',
    style: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastActive, setIsToastActive] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const showFieldError = contextSafe((fieldName, element) => {
    setErrors(prev => ({ ...prev, [fieldName]: true }));
    if (!isReducedMotion() && element) {
      gsap.to(element, {
        x: [-10, 10, -8, 8, -4, 4, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  });

  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const showToast = contextSafe((message) => {
    setToastMessage(message);
    setIsToastActive(true);
    
    const toast = toastRef.current;
    if (toast && !isReducedMotion()) {
      gsap.fromTo(
        toast,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }

    setTimeout(() => {
      if (!isReducedMotion() && toast) {
        gsap.to(toast, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            setIsToastActive(false);
          },
        });
      } else {
        setIsToastActive(false);
      }
    }, 4000);
  });

  const fireConfetti = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const defaults = {
      origin: { x, y },
      colors: ['#FFD700', '#E91E63', '#FFE57F', '#F06292', '#0A2463'],
      disableForReducedMotion: true,
    };

    confetti({ ...defaults, particleCount: 50, spread: 60, startVelocity: 30, scalar: 1.2 });
    confetti({ ...defaults, particleCount: 30, spread: 100, startVelocity: 20, scalar: 0.8, decay: 0.92 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim()) {
      clearFieldError(name);
    }
  };

  const handleFocus = (e) => setFocusedField(e.target.name);
  const handleBlur = () => setFocusedField(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    
    const requiredFields = ['name', 'phone', 'occasion', 'style'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        isValid = false;
        const el = document.getElementById(`form-${field}`);
        showFieldError(field, el);
      }
    });

    if (!isValid) return;

    const whatsappText = encodeURIComponent(
      `Hi! I'd like to enquire about a custom outfit.\n\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Occasion: ${formData.occasion}\n` +
      `Style: ${formData.style}\n` +
      `Details: ${formData.message || 'Not specified'}`
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

    fireConfetti();
    showToast('✨ Private consultation request ready! Redirecting to WhatsApp...');

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);

    setTimeout(() => {
      setFormData({ name: '', phone: '', occasion: '', style: '', message: '' });
      setErrors({});
    }, 2000);
  };

  const getInputClass = (fieldName, baseClass = "form-group") => {
    let classes = [baseClass];
    if (errors[fieldName]) classes.push("error");
    if (formData[fieldName].trim()) classes.push("has-value");
    if (focusedField === fieldName) classes.push("focused");
    return classes.join(" ");
  };

  return (
    <div ref={containerRef}>
      <section id="contact" data-section="true">
        <div className="contact-left">
          <span className="section-label" data-reveal="true">
            <span className="label-line"></span>Get In Touch
          </span>
          <h2 className="section-title" data-reveal-title="true">Let's create something <em>beautiful</em></h2>
          <div className="gold-rule" data-reveal="true"></div>
          <p className="contact-desc" data-reveal-lines="true">Ready to wear something made just for you? Reach out via Instagram DM or fill the form and we'll get back to you within 24 hours.</p>

          <div className="contact-details">
            <div className="contact-detail" data-reveal="true">
              <div className="contact-icon">📍</div>
              <div className="contact-detail-text">
                <label>Location</label>
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>
            <div className="contact-detail" data-reveal="true">
              <div className="contact-icon">📸</div>
              <div className="contact-detail-text">
                <label>Instagram</label>
                <span><a href="https://www.instagram.com/_s.t.i.t.c.h.e.s._" target="_blank" rel="noopener noreferrer">@_s.t.i.t.c.h.e.s._</a></span>
              </div>
            </div>
            <div className="contact-detail" data-reveal="true">
              <div className="contact-icon">👤</div>
              <div className="contact-detail-text">
                <label>Designer</label>
                <span>Lidya Grace (@lidya_grace_)</span>
              </div>
            </div>
            <div className="contact-detail" data-reveal="true">
              <div className="contact-icon">⏰</div>
              <div className="contact-detail-text">
                <label>Response Time</label>
                <span>Within 24 hours via DM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" id="contact-form" noValidate onSubmit={handleSubmit}>
            <h3 data-reveal="true">Private Consultation</h3>
            <p data-reveal="true">Tell us about your dream outfit and we'll help bring it to life.</p>
            <div className="form-row">
              <div className={getInputClass('name')} data-reveal="true">
                <label htmlFor="form-name">Your Name</label>
                <input type="text" id="form-name" name="name" placeholder="Priya Sharma" value={formData.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
              </div>
              <div className={getInputClass('phone')} data-reveal="true">
                <label htmlFor="form-phone">Phone / WhatsApp</label>
                <input type="tel" id="form-phone" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
              </div>
            </div>
            <div className={getInputClass('occasion')} data-reveal="true">
              <label htmlFor="form-occasion">Occasion</label>
              <select id="form-occasion" name="occasion" value={formData.occasion} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required>
                <option value="" disabled>Select occasion type</option>
                <option value="Wedding / Bridal">Wedding / Bridal</option>
                <option value="Bridesmaid / Group Set">Bridesmaid / Group Set</option>
                <option value="Festival / Puja">Festival / Puja</option>
                <option value="Formal / Party">Formal / Party</option>
                <option value="Casual / Everyday">Casual / Everyday</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={getInputClass('style')} data-reveal="true">
              <label htmlFor="form-style">Style Preference</label>
              <select id="form-style" name="style" value={formData.style} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required>
                <option value="" disabled>Indian / Western / Fusion?</option>
                <option value="Indian Traditional">Indian Traditional</option>
                <option value="Western">Western</option>
                <option value="Indo-Western Fusion">Indo-Western Fusion</option>
                <option value="Not sure — need guidance">Not sure — need guidance</option>
              </select>
            </div>
            <div className={getInputClass('message')} data-reveal="true">
              <label htmlFor="form-message">Tell Us More</label>
              <textarea id="form-message" name="message" placeholder="Describe your outfit vision, colour preferences, any reference images, timeline, etc." rows="5" value={formData.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}></textarea>
            </div>
            <button type="submit" className="btn-submit" id="btn-submit" data-magnetic="true" ref={btnRef}>
              <span className="btn-text">Request Private Consultation</span>
              <span className="btn-icon">→</span>
              <span className="btn-ripple"></span>
            </button>
          </form>
        </div>
      </section>

      <div id="toast" className={`toast ${isToastActive ? 'active' : ''}`} role="alert" aria-live="polite" ref={toastRef}>
        {toastMessage}
      </div>

      <div id="noise-overlay" className="noise-overlay" aria-hidden="true"></div>
    </div>
  );
}
