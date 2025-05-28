import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    return import('./build/vite.config.dev').then(m => m.default)
  } else {
    return import('./build/vite.config.prod').then(m => m.default)
  }
})

