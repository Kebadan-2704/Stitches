import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Process() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const needleRef = useRef(null);
  const processTimelineRef = useRef(null);
  const stepsRef = useRef([]);

  const addToStepsRef = (el) => {
    if (el && !stepsRef.current.includes(el)) {
      stepsRef.current.push(el);
    }
  };

  useGSAP(() => {
    const buildTimeline = () => {
      const svg = svgRef.current;
      const path = pathRef.current;
      const processTimeline = processTimelineRef.current;
      const markers = stepsRef.current.map(step => step.querySelector('.step-marker'));

      if (!svg || !path || !markers.length || !processTimeline) return;

      const timelineRect = processTimeline.getBoundingClientRect();
      svg.setAttribute('width', timelineRect.width);
      svg.setAttribute('height', timelineRect.height);
      svg.style.width = '100%';
      svg.style.height = '100%';

      const points = [];
      markers.forEach((marker) => {
        const markerRect = marker.getBoundingClientRect();
        const x = markerRect.left - timelineRect.left + markerRect.width / 2;
        const y = markerRect.top - timelineRect.top + markerRect.height / 2;
        points.push({ x, y });
      });

      if (points.length < 2) return;

      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midY = (prev.y + curr.y) / 2;
        d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
      }
      path.setAttribute('d', d);

      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      path.dataset.length = pathLength;
    };

    buildTimeline();
    
    const handleResize = debounce(() => {
      buildTimeline();
      ScrollTrigger.refresh();
    }, 200);
    window.addEventListener('resize', handleResize);

    const path = pathRef.current;
    const needle = needleRef.current;
    const processSection = containerRef.current;

    if (!isReducedMotion()) {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: processSection,
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 1,
          onUpdate: (self) => {
            if (needle && path.getTotalLength) {
              const progress = self.progress;
              const len = path.getTotalLength();
              const point = path.getPointAtLength(progress * len);
              needle.setAttribute('cx', point.x);
              needle.setAttribute('cy', point.y);
              needle.style.opacity = progress > 0.01 ? '1' : '0';
            }
          },
        },
      });
    } else if (path) {
      path.style.strokeDashoffset = '0';
    }

    stepsRef.current.forEach((step) => {
      if (!step) return;
      const content = step.querySelector('.step-content');
      const h4 = content?.querySelector('h4');
      const p = content?.querySelector('p');

      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        end: 'bottom 50%',
        onEnter: () => {
          step.classList.add('active');
          if (!isReducedMotion() && h4 && p) {
            gsap.from([h4, p], {
              y: 20,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        },
        onLeaveBack: () => {
          step.classList.remove('active');
        },
      });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, { scope: containerRef });

  return (
    <section id="process" data-section="true" ref={containerRef}>
      <div className="process-header">
        <span className="section-label" data-reveal="true">How It Works</span>
        <h2 className="section-title" data-reveal-title="true">Your outfit, <em>step by step</em></h2>
      </div>
      <div className="process-timeline" id="process-timeline" ref={processTimelineRef}>
        <svg className="timeline-svg" id="timeline-svg" preserveAspectRatio="none" ref={svgRef}>
          <path className="timeline-path" id="timeline-path" ref={pathRef} fill="none" stroke="#C9A96E" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000"/>
          <circle className="timeline-needle" id="timeline-needle" ref={needleRef} r="6" fill="#8B2252" stroke="#C9A96E" strokeWidth="2"/>
        </svg>
        <div className="process-steps">
          <div className="process-step" data-step="1" ref={addToStepsRef}>
            <div className="step-marker">
              <div className="step-number">01</div>
              <div className="step-pulse"></div>
            </div>
            <div className="step-content">
              <h4>Consultation</h4>
              <p>Share your vision — occasion, style, fabric preferences, and budget. We listen before we design.</p>
            </div>
          </div>
          <div className="process-step" data-step="2" ref={addToStepsRef}>
            <div className="step-marker">
              <div className="step-number">02</div>
              <div className="step-pulse"></div>
            </div>
            <div className="step-content">
              <h4>Design &amp; Measurements</h4>
              <p>We sketch the design, select fabrics, and take precise measurements for a perfect fit.</p>
            </div>
          </div>
          <div className="process-step" data-step="3" ref={addToStepsRef}>
            <div className="step-marker">
              <div className="step-number">03</div>
              <div className="step-pulse"></div>
            </div>
            <div className="step-content">
              <h4>Crafting</h4>
              <p>Every piece is hand-cut and stitched with care. We keep you updated through the process.</p>
            </div>
          </div>
          <div className="process-step" data-step="4" ref={addToStepsRef}>
            <div className="step-marker">
              <div className="step-number">04</div>
              <div className="step-pulse"></div>
            </div>
            <div className="step-content">
              <h4>Fitting &amp; Delivery</h4>
              <p>Try on your piece, request any final adjustments, and receive your finished garment with pride.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
