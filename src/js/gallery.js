import { initLightbox } from './lightbox.js'
import { applyPlaceholders } from './placeholders.js'

const FALLBACK_SRC = '/images/placeholder.jpg'

export function renderGrid(projects, container, options = {}) {
  container.innerHTML = ''

  if (!projects.length) {
    container.innerHTML = '<p class="gallery-empty">No projects yet.</p>'
    return
  }

  projects.forEach((project, index) => {
    const li = document.createElement('li')
    li.className = 'gallery-card'
    li.setAttribute('role', 'listitem')

    const coverSrc = project.cover_image || FALLBACK_SRC
    const conceptLine = options.showConcept && project.description
      ? `<p class="card-concept">${escapeHtml(project.description)}</p>`
      : ''
    const titleOverlay = options.photoMode ? '' : `
      <div class="card-overlay">
        <p class="card-title">${escapeHtml(project.title)}</p>
        ${project.client ? `<p class="card-client">${escapeHtml(project.client)}</p>` : ''}
      </div>`

    li.innerHTML = `
      <button class="card-btn" aria-label="Open ${escapeHtml(project.title)}" data-index="${index}">
        <div class="card-image-wrap">
          <img
            class="card-image"
            src="${escapeHtml(coverSrc)}"
            alt="${escapeHtml(project.title)}"
            width="600"
            height="750"
            loading="lazy"
          />
          ${titleOverlay}
        </div>
        ${conceptLine}
        ${options.photoMode ? `<p class="card-title-photo sr-only">${escapeHtml(project.title)}</p>` : ''}
      </button>
    `

    // Broken image fallback
    const img = li.querySelector('img')
    img.addEventListener('error', () => { img.src = FALLBACK_SRC })

    container.appendChild(li)
  })

  // Intersection Observer for lazy reveal
  const cards = container.querySelectorAll('.gallery-card')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  cards.forEach((card) => {
    card.classList.add('reveal')
    observer.observe(card)
  })

  // Apply shimmer + canvas placeholders to all newly rendered card images
  applyPlaceholders()

  // Wire lightbox
  const lightbox = initLightbox(projects)
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-index]')
    if (btn) lightbox.open(parseInt(btn.dataset.index, 10))
  })
}

export async function initGallery(jsonPath, container, options = {}) {
  try {
    const url = import.meta.env.BASE_URL.replace(/\/$/, '') + jsonPath
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to load ${jsonPath}`)
    const projects = await res.json()
    renderGrid(projects, container, options)
  } catch (err) {
    container.innerHTML = '<p class="gallery-empty">Could not load projects.</p>'
    console.error(err)
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
