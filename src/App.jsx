import { useEffect, Suspense, lazy } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'

const Marquee = lazy(() => import('./components/Marquee'))
const About = lazy(() => import('./components/About'))
const Services = lazy(() => import('./components/Services'))
import Gallery from './components/Gallery'
const Process = lazy(() => import('./components/Process'))
import Testimonials from './components/Testimonials'
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

function Layout() {
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
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Marquee />
          <About />
          <Services />
        </Suspense>
        <Gallery />
        <Suspense fallback={null}>
          <Process />
        </Suspense>
        <Testimonials />
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
      <Layout />
    </ReactLenis>
  )
}
