import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-helmet'],
      output: {
        globals: {
          'react-helmet': 'Helmet'
        }
      }
    }
  }
})

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
