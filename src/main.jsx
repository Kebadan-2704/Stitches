import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css' // We can still use the global CSS for now
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
