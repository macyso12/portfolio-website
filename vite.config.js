import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'industry-work': resolve(__dirname, 'industry-work.html'),
        'creative-direction': resolve(__dirname, 'creative-direction.html'),
        photography: resolve(__dirname, 'photography.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
