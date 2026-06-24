import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/js/reduced-motion.js', () => ({
  prefersReducedMotion: false,
}))

// Build minimal lightbox DOM before importing
function buildLightboxDOM() {
  document.body.innerHTML = `
    <div id="lightbox" hidden>
      <button class="lightbox-close">✕</button>
      <button class="lightbox-prev">←</button>
      <button class="lightbox-next">→</button>
      <div class="lightbox-inner">
        <img class="lightbox-img" src="" alt="" />
        <div class="lightbox-meta">
          <h2 class="lightbox-title"></h2>
          <p class="lightbox-details"></p>
          <p class="lightbox-description"></p>
        </div>
      </div>
    </div>
  `
}

const projects = [
  { id: 1, title: 'Alpha', cover_image: '/alpha.jpg', client: 'X', role: 'Stylist', year: 2024, description: 'Desc alpha' },
  { id: 2, title: 'Beta',  cover_image: '/beta.jpg',  client: 'Y', role: 'Director', year: 2023, description: 'Desc beta' },
  { id: 3, title: 'Gamma', cover_image: '/gamma.jpg', client: null, role: 'Photographer', year: 2022, description: '' },
]

describe('initLightbox', () => {
  let lightbox

  beforeEach(async () => {
    buildLightboxDOM()
    const mod = await import('../../src/js/lightbox.js')
    lightbox = mod.initLightbox(projects)
  })

  it('opens lightbox and sets title', () => {
    lightbox.open(0)
    expect(document.getElementById('lightbox').hidden).toBe(false)
    expect(document.querySelector('.lightbox-title').textContent).toBe('Alpha')
  })

  it('closes lightbox', () => {
    lightbox.open(0)
    lightbox.close()
    expect(document.getElementById('lightbox').hidden).toBe(true)
  })

  it('navigates forward with wrap-around', () => {
    lightbox.open(2) // last item
    document.querySelector('.lightbox-next').click()
    expect(document.querySelector('.lightbox-title').textContent).toBe('Alpha') // wraps to 0
  })

  it('navigates backward with wrap-around', () => {
    lightbox.open(0)
    document.querySelector('.lightbox-prev').click()
    expect(document.querySelector('.lightbox-title').textContent).toBe('Gamma') // wraps to last
  })

  it('sets details string from client, role, year', () => {
    lightbox.open(0)
    expect(document.querySelector('.lightbox-details').textContent).toContain('X')
    expect(document.querySelector('.lightbox-details').textContent).toContain('2024')
  })

  it('closes on close button click', () => {
    lightbox.open(1)
    document.querySelector('.lightbox-close').click()
    expect(document.getElementById('lightbox').hidden).toBe(true)
  })
})
