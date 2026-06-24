// Generates canvas-based placeholder images for missing <img> elements.
// Each placeholder has a unique tonal gradient + subtle pattern so the
// grid feels visually varied rather than identically broken.

const PALETTES = [
  ['#1a1612', '#2a2018', '#c9b99a'],
  ['#12151a', '#181e2a', '#9aabc9'],
  ['#161a12', '#1e2a18', '#9ac9aa'],
  ['#1a1218', '#2a1820', '#c99ab0'],
  ['#141214', '#201820', '#b09ac9'],
  ['#1a1512', '#2a1f18', '#c9a98a'],
]

function makePlaceholder(width, height, index, label) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const [dark, mid, accent] = PALETTES[index % PALETTES.length]

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, dark)
  grad.addColorStop(0.6, mid)
  grad.addColorStop(1, dark)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Subtle diagonal lines (texture)
  ctx.strokeStyle = accent + '18'
  ctx.lineWidth = 1
  for (let i = -height; i < width + height; i += 28) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + height, height)
    ctx.stroke()
  }

  // Central accent mark
  const cx = width / 2
  const cy = height / 2
  const size = Math.min(width, height) * 0.12
  ctx.strokeStyle = accent + '60'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - size, cy)
  ctx.lineTo(cx + size, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - size)
  ctx.lineTo(cx, cy + size)
  ctx.stroke()

  // Corner brackets
  const b = Math.min(width, height) * 0.08
  const m = Math.min(width, height) * 0.06
  ctx.strokeStyle = accent + '40'
  ctx.lineWidth = 1
  ;[
    [m, m, 1, 1],
    [width - m, m, -1, 1],
    [m, height - m, 1, -1],
    [width - m, height - m, -1, -1],
  ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath()
    ctx.moveTo(x + dx * b, y)
    ctx.lineTo(x, y)
    ctx.lineTo(x, y + dy * b)
    ctx.stroke()
  })

  // Label text
  if (label) {
    ctx.fillStyle = accent + '55'
    ctx.font = `${Math.max(10, width * 0.045)}px "Helvetica Neue", Arial, sans-serif`
    ctx.letterSpacing = '0.15em'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label.toUpperCase(), cx, cy + size * 2.2)
  }

  return canvas.toDataURL('image/jpeg', 0.85)
}

// Apply shimmer while image loads, swap to canvas placeholder on error
export function applyPlaceholders() {
  const imgs = Array.from(document.querySelectorAll('img[src]')).filter((img) => {
    const wrap = img.closest('.card-image-wrap, .preview-image-wrap, .about-portrait')
    return wrap || img.id === 'hero-fallback'
  })

  imgs.forEach((img, idx) => {
    const wrap = img.closest('.card-image-wrap, .preview-image-wrap, .about-portrait')
    // Read dimensions from HTML attributes (reliable before natural size is known)
    const w = parseInt(img.getAttribute('width'), 10) || 600
    const h = parseInt(img.getAttribute('height'), 10) || 750
    const label = img.alt || ''

    function replace() {
      if (wrap) wrap.classList.remove('loading')
      img.src = makePlaceholder(w, h, idx, label)
    }

    // Add shimmer while loading
    if (wrap && (!img.complete || img.naturalWidth === 0)) {
      wrap.classList.add('loading')
    }

    img.addEventListener('load', () => {
      if (wrap) wrap.classList.remove('loading')
    }, { once: true })

    img.addEventListener('error', replace, { once: true })

    // Already broken and complete (cached 404 or immediate fail)
    if (img.complete && img.naturalWidth === 0) replace()
  })
}
