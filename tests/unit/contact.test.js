import { describe, it, expect } from 'vitest'
import { validateForm } from '../../src/js/contact.js'

describe('validateForm', () => {
  const valid = { name: 'Jane', email: 'jane@example.com', subject: 'Hello', message: 'Hi there' }

  it('returns no errors for valid input', () => {
    expect(validateForm(valid)).toEqual({})
  })

  it('errors on blank name', () => {
    expect(validateForm({ ...valid, name: '' })).toHaveProperty('name')
  })

  it('errors on missing email', () => {
    expect(validateForm({ ...valid, email: '' })).toHaveProperty('email')
  })

  it('errors on malformed email', () => {
    const errs = validateForm({ ...valid, email: 'notanemail' })
    expect(errs.email).toMatch(/valid email/)
  })

  it('errors on blank subject', () => {
    expect(validateForm({ ...valid, subject: '  ' })).toHaveProperty('subject')
  })

  it('errors on blank message', () => {
    expect(validateForm({ ...valid, message: '' })).toHaveProperty('message')
  })

  it('returns all errors when all fields are blank', () => {
    const errs = validateForm({ name: '', email: '', subject: '', message: '' })
    expect(Object.keys(errs)).toHaveLength(4)
  })
})
