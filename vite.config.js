import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        'classic-spam': './games/classic-spam.html',
        'extreme-spam': './games/extreme-spam.html'
      }
    }
  },
  server: {
    port: 3000
  }
})