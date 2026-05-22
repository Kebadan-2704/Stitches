import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

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
        <Marquee />
        <About />
        <Services />
        <Gallery />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
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
