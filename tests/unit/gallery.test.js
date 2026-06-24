import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderGrid } from '../../src/js/gallery.js'

// gallery.js imports lightbox.js which references DOM — mock it
vi.mock('../../src/js/lightbox.js', () => ({
  initLightbox: () => ({ open: () => {}, close: () => {} }),
}))

vi.mock('../../src/js/reduced-motion.js', () => ({
  prefersReducedMotion: false,
}))

const projects = [
  { id: 1, title: 'Project A', cover_image: '/a.jpg', description: 'Desc A', client: 'Client A', role: 'Stylist', year: 2024, images: [], tags: [] },
  { id: 2, title: 'Project B', cover_image: '/b.jpg', description: 'Desc B', client: null, role: 'Photographer', year: 2023, images: [], tags: [] },
]

describe('renderGrid', () => {
  let container

  beforeEach(() => {
    container = document.createElement('ul')
    document.body.appendChild(container)
  })

  it('renders one card per project', () => {
    renderGrid(projects, container)
    expect(container.querySelectorAll('.gallery-card')).toHaveLength(2)
  })

  it('renders empty state when projects array is empty', () => {
    renderGrid([], container)
    expect(container.querySelector('.gallery-empty')).not.toBeNull()
    expect(container.querySelectorAll('.gallery-card')).toHaveLength(0)
  })

  it('sets correct alt text on card images', () => {
    renderGrid(projects, container)
    const imgs = container.querySelectorAll('.card-image')
    expect(imgs[0].alt).toBe('Project A')
    expect(imgs[1].alt).toBe('Project B')
  })

  it('shows concept description when showConcept option is true', () => {
    renderGrid(projects, container, { showConcept: true })
    const concepts = container.querySelectorAll('.card-concept')
    expect(concepts).toHaveLength(2)
    expect(concepts[0].textContent).toContain('Desc A')
  })

  it('does not show concept text without showConcept option', () => {
    renderGrid(projects, container)
    expect(container.querySelectorAll('.card-concept')).toHaveLength(0)
  })

  it('assigns data-index to each card button', () => {
    renderGrid(projects, container)
    const btns = container.querySelectorAll('[data-index]')
    expect(btns[0].dataset.index).toBe('0')
    expect(btns[1].dataset.index).toBe('1')
  })
})
