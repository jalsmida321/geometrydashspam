import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        'aka-geometry-dash-spam': './games/aka-geometry-dash-spam.html',
        'geometry-dash-spam-wave': './games/geometry-dash-spam-wave.html',
        'geometry-dash-spam-test': './games/Geometry-Dash-Spam-Test.html',
        'geometry-dash-spam-challenge': './games/geometry-dash-spam-challenge.html',
        'geometry-dash-spam-chall': './games/geometry-dash-spam-chall.html',
        'geometry-dash-spam-master': './games/geometry-dash-spam-master.html',
        'geometry-dash-wave-spam': './games/geometry-dash-wave-spam.html'
      }
    }
  },
  server: {
    port: 3000
  }
})