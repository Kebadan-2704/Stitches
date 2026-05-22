import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { lerp, isMobile, isReducedMotion } from '../js/utils';

export default function Cursor() {
  const containerRef = useRef();
  const dotRef = useRef();
  const ringRef = useRef();
  const canvasRef = useRef();

  useGSAP(() => {
    if (isMobile()) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      if (canvasRef.current) canvasRef.current.style.display = 'none';
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trailCanvas = canvasRef.current;
    if (!dot || !ring || !trailCanvas) return;

    const trailCtx = trailCanvas.getContext('2d');
    let mouse = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };
    let trail = [];
    const TRAIL_LENGTH = 20;
    const RING_LERP = 0.12;
    let rafId = null;

    const resizeCanvas = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    resizeCanvas();

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      trail.push({ x: mouse.x, y: mouse.y, age: 0 });
      if (trail.length > TRAIL_LENGTH) {
        trail.shift();
      }
    };

    const showCursor = () => {
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    };

    const hideCursor = () => {
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    };

    const drawTrail = () => {
      if (!trailCtx) return;

      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

      if (trail.length < 2 || isReducedMotion()) return;

      for (let i = 0; i < trail.length; i++) {
        trail[i].age++;
      }

      trail = trail.filter((p) => p.age < 30);

      if (trail.length < 2) return;

      trailCtx.beginPath();
      trailCtx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const prev = trail[i - 1];
        const midX = (prev.x + p.x) / 2;
        const midY = (prev.y + p.y) / 2;
        trailCtx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }

      const lastPoint = trail[trail.length - 1];
      const alpha = Math.max(0, 1 - lastPoint.age / 30);
      trailCtx.strokeStyle = `rgba(201, 169, 110, ${alpha * 0.3})`;
      trailCtx.lineWidth = 1.5;
      trailCtx.lineCap = 'round';
      trailCtx.stroke();
    };

    const animate = () => {
      if (dot) {
        dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      }

      ringPos.x = lerp(ringPos.x, mouse.x, RING_LERP);
      ringPos.y = lerp(ringPos.y, mouse.y, RING_LERP);

      if (ring) {
        ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }

      drawTrail();

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mouseenter', showCursor);
    document.addEventListener('mouseleave', hideCursor);

    const interactiveSelectors = 'a, button, .service-card, .gallery-item, .filter-btn, [data-magnetic], input, select, textarea';
    
    const handleMouseOver = (e) => {
      if (e.target.closest(interactiveSelectors)) {
        dot?.classList.add('cursor-hover');
        ring?.classList.add('cursor-hover');
      }
    };
    
    const handleMouseOut = (e) => {
      if (e.target.closest(interactiveSelectors)) {
        dot?.classList.remove('cursor-hover');
        ring?.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    const magneticElements = document.querySelectorAll('[data-magnetic]');
    const magneticMoveHandlers = new Map();
    const magneticLeaveHandlers = new Map();

    magneticElements.forEach((el) => {
      const moveHandler = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 40) {
          const pull = 0.3;
          el.style.transform = `translate(${distX * pull}px, ${distY * pull}px)`;
        }
      };
      
      const leaveHandler = () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      };

      el.addEventListener('mousemove', moveHandler);
      el.addEventListener('mouseleave', leaveHandler);
      magneticMoveHandlers.set(el, moveHandler);
      magneticLeaveHandlers.set(el, leaveHandler);
    });

    animate();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mouseenter', showCursor);
      document.removeEventListener('mouseleave', hideCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      
      magneticElements.forEach((el) => {
        el.removeEventListener('mousemove', magneticMoveHandlers.get(el));
        el.removeEventListener('mouseleave', magneticLeaveHandlers.get(el));
      });
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div ref={dotRef} id="cursor" aria-hidden="true"></div>
      <div ref={ringRef} id="cursor-ring" aria-hidden="true"></div>
      <canvas ref={canvasRef} id="cursor-trail" aria-hidden="true"></canvas>
    </div>
  );
}
