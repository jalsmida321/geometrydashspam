import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        'aka-geometry-dash-spam': './games/aka-geometry-dash-spam.html',
        'geometry-dash-spam-wave': './games/geometry-dash-spam-wave.html',
        'geometry-dash-spam-test': './games/Geometry-Dash-Spam-Test.html'
      }
    }
  },
  server: {
    port: 3000
  }
})