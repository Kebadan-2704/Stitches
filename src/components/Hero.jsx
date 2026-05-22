import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Typed from 'typed.js';
import Splitting from 'splitting';
import { scrambleText } from '../js/text-animations';
import { isMobile, isReducedMotion } from '../js/utils';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef();
  const canvasRef = useRef();

  // Three.js particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isMobile() || isReducedMotion()) return;

    let scene, camera, renderer, rafId;
    let mouseX = 0, mouseY = 0;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Tailoring Geometries
    const geometries = [
      { geom: new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32), count: 40 }, // Buttons
      { geom: new THREE.CylinderGeometry(0.04, 0.04, 3.5, 8), count: 25 }, // Needles
      { geom: new THREE.TorusGeometry(0.5, 0.15, 16, 32), count: 35 },     // Rings / Eyelets
      { geom: new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16), count: 20 },  // Thread Spools
      { geom: new THREE.SphereGeometry(0.4, 32, 32), count: 40 },          // Pearls / Beads
    ];

    const palette = [
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xE91E63), // Rose
      new THREE.Color(0x0A2463), // Navy Blue
      new THREE.Color(0xFAF6F0), // Ivory
    ];

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    });

    const meshes = [];
    const dummy = new THREE.Object3D();

    geometries.forEach(({ geom, count }) => {
      const mesh = new THREE.InstancedMesh(geom, material, count);
      
      for(let i = 0; i < count; i++) {
        dummy.position.set(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 50
        );
        dummy.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        const scale = Math.random() * 0.5 + 0.5;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const color = palette[Math.floor(Math.random() * palette.length)];
        mesh.setColorAt(i, color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Premium Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);
    
    const dirLight2 = new THREE.DirectionalLight(0xFFD700, 1.5);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const animateParticles = () => {
      if (!renderer || !scene || !camera) return;
      rafId = requestAnimationFrame(animateParticles);

      const time = Date.now() * 0.001;

      meshes.forEach((mesh, index) => {
        mesh.rotation.y += 0.001 * (index + 1);
        mesh.rotation.x += 0.0005 * (index + 1);

        // Interactive mouse movement
        mesh.position.x += (mouseX * 5 - mesh.position.x) * 0.05;
        mesh.position.y += (-mouseY * 5 - mesh.position.y) * 0.05;
        
        // Gentle floating
        mesh.position.y += Math.sin(time + index) * 0.005;
      });

      renderer.render(scene, camera);
    };

    animateParticles();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (renderer) renderer.dispose();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Typed.js
  useEffect(() => {
    const typedEl = document.getElementById('hero-typed');
    if (!typedEl) return;
    
    const typedInstance = new Typed('#hero-typed', {
      strings: [
        'Where every thread tells your story',
        'Bespoke Indian & Western Couture',
        'Handcrafted in Coimbatore',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursorChar: '|',
      startDelay: isReducedMotion() ? 0 : 1500,
    });

    return () => {
      typedInstance.destroy();
    };
  }, []);

  // GSAP Animations
  useGSAP(() => {
    const title = document.getElementById('hero-title');
    if (title) {
      if (isReducedMotion()) {
        title.style.opacity = '1';
      } else {
        scrambleText(title, 1.5);
      }
    }

    const tagline = document.querySelector('.hero-tagline[data-splitting]');
    if (tagline) {
      if (isReducedMotion()) {
        tagline.style.opacity = '1';
      } else {
        const result = Splitting({ target: tagline, by: 'chars' });
        if (result && result[0]) {
          const chars = result[0].chars || [];
          gsap.from(chars, {
            opacity: 0,
            y: 20,
            rotateX: -40,
            duration: 0.5,
            stagger: 0.03,
            ease: 'power3.out',
            delay: 1.8,
          });
        }
      }
    }

    if (!isReducedMotion()) {
      // Background layers parallax
      const layers = [
        { selector: '.hero-bg-1', speed: 0.3 },
        { selector: '.hero-bg-2', speed: 0.5 },
        { selector: '.hero-bg-3', speed: 0.7 },
      ];

      layers.forEach(({ selector, speed }) => {
        const layer = document.querySelector(selector);
        if (layer) {
          gsap.to(layer, {
            y: () => window.innerHeight * speed * 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: '#hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // Pin & Fade Content
      const hero = document.getElementById('hero');
      const heroContent = hero?.querySelector('.hero-content');
      if (hero && heroContent) {
        gsap.to(heroContent, {
          opacity: 0,
          scale: 0.9,
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        });
      }

      // Scroll indicator animation
      const scrollInner = document.querySelector('.scroll-line-inner');
      if (scrollInner) {
        gsap.to(scrollInner, {
          y: '100%',
          duration: 1.5,
          repeat: -1,
          ease: 'power2.inOut',
          yoyo: true,
        });
      }
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div id="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar"></div>
      </div>
      
      <section id="hero" data-section="true" className="dynamic-hero">
        <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true"></canvas>
        <div className="hero-bg-layers">
          <div className="hero-bg-layer hero-bg-1"></div>
          <div className="hero-bg-layer hero-bg-2"></div>
          <div className="hero-bg-layer hero-bg-3"></div>
        </div>
        <div className="hero-grain" aria-hidden="true"></div>

        {/* ═══════════ SVG STITCHING ANIMATION ═══════════ */}
        <div className="hero-stitches-overlay" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <path id="stitch-path-1" d="M -100,200 C 300,100 400,600 1100,300" />
              <path id="stitch-path-2" d="M 1100,700 C 600,900 300,400 -100,800" />
              <path id="stitch-path-3" d="M 200,-100 C 400,300 800,200 700,1100" />
              
              <g id="needle-gold">
                <path d="M 0,0 L -30,-1.5 L -30,1.5 Z" fill="#C9A96E" />
                <circle cx="-27" cy="0" r="0.8" fill="#1A0A0F" />
                <path d="M -27,0 C -40,15 -50,-15 -70,0" fill="none" stroke="#C9A96E" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>
              <g id="needle-rose">
                <path d="M 0,0 L -30,-1.5 L -30,1.5 Z" fill="#E91E63" />
                <circle cx="-27" cy="0" r="0.8" fill="#1A0A0F" />
                <path d="M -27,0 C -40,15 -50,-15 -70,0" fill="none" stroke="#E91E63" strokeWidth="0.8" strokeDasharray="2 2" />
              </g>
            </defs>

            {/* Dashed thread paths */}
            <use href="#stitch-path-1" className="stitch-thread thread-1" />
            <use href="#stitch-path-2" className="stitch-thread thread-2" />
            <use href="#stitch-path-3" className="stitch-thread thread-3" />

            {/* Needles following paths */}
            <use href="#needle-gold">
              <animateMotion dur="15s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-1" />
              </animateMotion>
            </use>

            <use href="#needle-rose">
              <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-2" />
              </animateMotion>
            </use>

            <use href="#needle-gold">
              <animateMotion dur="25s" repeatCount="indefinite" rotate="auto">
                <mpath href="#stitch-path-3" />
              </animateMotion>
            </use>
          </svg>
        </div>

        <div className="hero-content">
          <p className="hero-tagline" data-splitting="true">Coimbatore's Custom Couture House</p>
          <h1 className="hero-title" id="hero-title">Stitches</h1>
          <div className="hero-subtitle-wrap">
            <span id="hero-typed"></span>
          </div>
          <div className="hero-divider">
            <span className="hero-div-line"></span>
            <span className="hero-div-text">Indian &amp; Western · Bespoke · Handcrafted</span>
            <span className="hero-div-line"></span>
          </div>
          <div className="hero-ctas">
            <a href="#gallery" className="hero-cta" id="cta-gallery" data-magnetic="true">
              <span>View Collection</span>
            </a>
            <a href="#contact" className="hero-cta hero-cta-solid" id="cta-contact" data-magnetic="true">
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
        <div className="hero-scroll-indicator" id="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line-wrap">
            <div className="scroll-line-inner"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
