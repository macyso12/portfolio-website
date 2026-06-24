const toggle = document.querySelector('.nav-toggle')
const navLinks = document.getElementById('nav-links')
const body = document.body

function openNav() {
  body.classList.add('nav-open')
  toggle.setAttribute('aria-expanded', 'true')
  // Move focus to first nav link
  navLinks.querySelector('a')?.focus()
}

function closeNav() {
  body.classList.remove('nav-open')
  toggle.setAttribute('aria-expanded', 'false')
}

function isOpen() {
  return body.classList.contains('nav-open')
}

toggle?.addEventListener('click', () => {
  isOpen() ? closeNav() : openNav()
})

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen()) {
    closeNav()
    toggle.focus()
  }
})

// Close on outside click
document.addEventListener('click', (e) => {
  if (isOpen() && !navLinks.contains(e.target) && e.target !== toggle) {
    closeNav()
  }
})

// Set aria-current based on current page filename
const currentFile = window.location.pathname.split('/').pop() || 'index.html'
document.querySelectorAll('.nav-links a').forEach((link) => {
  const href = link.getAttribute('href')
  const linkFile = href.split('/').pop()
  if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
    link.setAttribute('aria-current', 'page')
  }
})
