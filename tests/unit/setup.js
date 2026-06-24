// Stub browser APIs missing from jsdom
global.IntersectionObserver = class {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
}
