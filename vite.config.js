import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        // 明确列出所有游戏页面，确保没有遗漏
        'aka-geometry-dash-spam': './games/aka-geometry-dash-spam.html',
        'Geometry-Dash-Spam-Test': './games/Geometry-Dash-Spam-Test.html',
        'geometry-dash-spam-test': './geometry-dash-spam-test.html',
        'geometry-dash-spam-challenge': './games/geometry-dash-spam-challenge.html',
        'geometry-dash-spam-chall': './games/geometry-dash-spam-chall.html',
        'geometry-dash-spam-master': './games/geometry-dash-spam-master.html',
        'geometry-dash-spam-wave': './games/geometry-dash-spam-wave.html',
        'geometry-dash-wave-spam': './games/geometry-dash-wave-spam.html'
      }
    }
  },
  server: {
    port: 3000
  }
})