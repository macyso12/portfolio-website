import { prefersReducedMotion } from './reduced-motion.js'

const FALLBACK_SRC = '/images/placeholder.jpg'

export function initLightbox(projects) {
  const el = document.getElementById('lightbox')
  if (!el) return { open: () => {}, close: () => {} }

  const img = el.querySelector('.lightbox-img')
  const titleEl = el.querySelector('.lightbox-title')
  const detailsEl = el.querySelector('.lightbox-details')
  const descEl = el.querySelector('.lightbox-description')
  const closeBtn = el.querySelector('.lightbox-close')
  const prevBtn = el.querySelector('.lightbox-prev')
  const nextBtn = el.querySelector('.lightbox-next')

  let current = 0
  let triggerEl = null

  function show(index) {
    current = (index + projects.length) % projects.length
    const p = projects[current]
    const src = p.cover_image || FALLBACK_SRC

    if (!prefersReducedMotion) img.style.opacity = '0'
    img.src = src
    img.alt = p.title
    img.onload = () => {
      if (!prefersReducedMotion) img.style.opacity = '1'
    }
    img.onerror = () => { img.src = FALLBACK_SRC }

    if (titleEl) titleEl.textContent = p.title
    if (detailsEl) {
      const parts = [p.client, p.role, p.year].filter(Boolean)
      detailsEl.textContent = parts.join(' · ')
    }
    if (descEl) descEl.textContent = p.description || ''

    prevBtn?.toggleAttribute('hidden', projects.length <= 1)
    nextBtn?.toggleAttribute('hidden', projects.length <= 1)
  }

  function open(index) {
    triggerEl = document.activeElement
    show(index)
    el.hidden = false
    document.body.style.overflow = 'hidden'
    closeBtn?.focus()
  }

  function close() {
    el.hidden = true
    document.body.style.overflow = ''
    triggerEl?.focus()
  }

  closeBtn?.addEventListener('click', close)
  prevBtn?.addEventListener('click', () => show(current - 1))
  nextBtn?.addEventListener('click', () => show(current + 1))

  document.addEventListener('keydown', (e) => {
    if (el.hidden) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowLeft') show(current - 1)
    if (e.key === 'ArrowRight') show(current + 1)
  })

  // Close on backdrop click
  el.addEventListener('click', (e) => {
    if (e.target === el) close()
  })

  // Focus trap
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return
    const focusable = Array.from(el.querySelectorAll('button:not([hidden])'))
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus()
    }
  })

  return { open, close }
}
