import { prefersReducedMotion } from './reduced-motion.js'
import { applyPlaceholders } from './placeholders.js'

// Scroll reveal
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
} else {
  // Skip animation — make all reveal elements immediately visible
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'))
}

// 3D hero scene
const heroCanvas = document.getElementById('hero-canvas')
const heroFallback = document.getElementById('hero-fallback')

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const lowEnd = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4

if (!prefersReducedMotion && supportsWebGL() && !lowEnd && heroCanvas) {
  import('./three-scene.js').then(({ initScene }) => {
    initScene(heroCanvas)
    heroCanvas.style.display = 'block'
    if (heroFallback) heroFallback.hidden = true
  }).catch(() => {
    showFallback()
  })
} else {
  showFallback()
}

function showFallback() {
  if (heroCanvas) heroCanvas.style.display = 'none'
  if (heroFallback) heroFallback.hidden = false
}

// Apply shimmer + canvas placeholders to all static images on the home page
applyPlaceholders()
