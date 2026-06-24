export function validateForm({ name, email, subject, message }) {
  const errors = {}
  if (!name?.trim()) errors.name = 'Name is required.'
  if (!email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!subject?.trim()) errors.subject = 'Subject is required.'
  if (!message?.trim()) errors.message = 'Message is required.'
  return errors
}

const form = document.getElementById('contact-form')
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // Honeypot check
    if (form.querySelector('[name="_gotcha"]')?.value) return

    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    }

    const errors = validateForm(data)
    showErrors(errors)
    if (Object.keys(errors).length) return

    const submitLabel = form.querySelector('.submit-label')
    const submitSending = form.querySelector('.submit-sending')
    const btn = form.querySelector('.submit-btn')

    btn.disabled = true
    submitLabel.hidden = true
    submitSending.hidden = false

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      })

      if (res.ok) {
        form.hidden = true
        document.querySelector('.form-success').hidden = false
      } else {
        throw new Error('Non-OK response')
      }
    } catch {
      document.querySelector('.form-error-global').hidden = false
      btn.disabled = false
      submitLabel.hidden = false
      submitSending.hidden = true
    }
  })

  // Clear field errors on input
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      const errEl = document.getElementById(`${field.id}-error`)
      if (errEl) errEl.textContent = ''
      field.removeAttribute('aria-invalid')
    })
  })
}

function showErrors(errors) {
  const fields = ['name', 'email', 'subject', 'message']
  fields.forEach((id) => {
    const input = document.getElementById(id)
    const errEl = document.getElementById(`${id}-error`)
    if (!input || !errEl) return
    if (errors[id]) {
      errEl.textContent = errors[id]
      input.setAttribute('aria-invalid', 'true')
    } else {
      errEl.textContent = ''
      input.removeAttribute('aria-invalid')
    }
  })
  // Focus first error field
  const firstError = Object.keys(errors)[0]
  if (firstError) document.getElementById(firstError)?.focus()
}
