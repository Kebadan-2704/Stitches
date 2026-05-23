import { useEffect, Suspense, lazy } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import ErrorBoundary from './components/ErrorBoundary'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import ScrollToTop from './components/ScrollToTop'
import Legal from './components/Legal'

const SectionFallback = () => <div style={{height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A96E'}}>Loading section...</div>;

const Marquee = lazy(() => import('./components/Marquee'))
const About = lazy(() => import('./components/About'))
const Services = lazy(() => import('./components/Services'))
import Gallery from './components/Gallery'
const Process = lazy(() => import('./components/Process'))
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Location from './components/Location'
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

function HomeLayout() {
  const lenis = useLenis(({ scroll }) => {
    // Optional global scroll logic
  })

  // Integrate Lenis with GSAP ScrollTrigger
  useEffect(() => {
    const update = (time) => {
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
    }
  }, [lenis])

  return (
    <>
      <Helmet>
        <title>Stitches | Bespoke Custom Designer Wear in Coimbatore</title>
        <meta name="description" content="Premium custom tailoring and bespoke designer wear crafted specifically for your silhouette. Based in Coimbatore." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Stitches",
              "image": "https://stitches-coimbatore.com/favicon.svg",
              "url": "https://stitches-coimbatore.com",
              "telephone": "+919876543210",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Fashion Avenue, RS Puram",
                "addressLocality": "Coimbatore",
                "addressRegion": "TN",
                "postalCode": "641002",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 11.00455585,
                "longitude": 76.95029015
              },
              "priceRange": "₹₹₹"
            }
          `}
        </script>
      </Helmet>
      
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Marquee />
          <About />
          <Services />
        </Suspense>
        <Gallery />
        <Suspense fallback={<SectionFallback />}>
          <Process />
        </Suspense>
        <Testimonials />
        <FAQ />
        <Location />
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
            <Routes>
              <Route path="/" element={<HomeLayout />} />
              <Route path="/privacy-policy" element={<Legal type="privacy" />} />
              <Route path="/terms-of-service" element={<Legal type="terms" />} />
            </Routes>
          </ReactLenis>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  )
}
