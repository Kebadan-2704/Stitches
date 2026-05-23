import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How long does a custom outfit take to make?",
    answer: "Typically, a custom outfit takes between 3 to 6 weeks from the initial consultation to the final fitting, depending on the complexity of the design and the detailing required."
  },
  {
    question: "Do I need to visit the studio in Coimbatore?",
    answer: "While we love hosting clients at our Coimbatore studio, we also offer virtual consultations and have successfully delivered bespoke outfits to clients globally using our guided measurement process."
  },
  {
    question: "What is your starting price range?",
    answer: "Our bespoke casual and semi-formal wear starts at ₹8,000, while intricate bridal and couture pieces begin at ₹35,000. Each piece is priced based on the fabric, embroidery, and design complexity."
  },
  {
    question: "Can I bring my own fabric?",
    answer: "Yes, you can bring your own fabric, though we highly recommend consulting with us first to ensure the fabric suits your desired silhouette and design."
  }
];

export default function FAQ() {
  const containerRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useGSAP(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReducedMotion) {
      gsap.from('.faq-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }, { scope: containerRef });

  return (
    <section id="faq" data-section="true" ref={containerRef} style={{ background: 'var(--cream)', padding: '100px 60px', color: 'var(--dark)' }}>
      <style>{`
        .faq-container { max-width: 800px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,0.1); padding: 24px 0; }
        .faq-question { display: flex; justify-content: space-between; align-items: center; width: 100%; cursor: pointer; font-family: var(--font-heading); font-size: 1.4rem; color: var(--dark); background: transparent; border: none; text-align: left; }
        .faq-question:hover { color: var(--rose); }
        .faq-icon { font-size: 1.5rem; color: var(--gold); transition: transform 0.3s ease; }
        .faq-icon.open { transform: rotate(45deg); }
        .faq-answer { font-family: var(--font-body); font-size: 1rem; color: var(--mid); line-height: 1.6; max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding-top 0.4s ease; }
        .faq-answer.open { max-height: 200px; padding-top: 16px; }
      `}</style>
      
      <div className="faq-container">
        <h2 className="section-title section-title-center">Frequently Asked <em>Questions</em></h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
                <span className={`faq-icon ${openIndex === index ? 'open' : ''}`}>+</span>
              </button>
              <div 
                id={`faq-answer-${index}`} 
                className={`faq-answer ${openIndex === index ? 'open' : ''}`}
                aria-hidden={openIndex !== index}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
