import { defineConfig } from 'vite'
const input = {
  main: './index.html',
  about: './about.html',
  blog: './blog.html',
  privacy: './privacy-policy.html',
  terms: './terms-of-service.html',
  spamTest: './geometry-dash-spam-test.html',
  spamChallenge: './games/geometry-dash-spam-challenge.html',
  spamChallengeChall: './games/geometry-dash-spam-chall.html',
  spamMaster: './games/geometry-dash-spam-master.html',
  spamWave: './games/geometry-dash-spam-wave.html',
  waveSpam: './games/geometry-dash-wave-spam.html',
  akaSpam: './games/aka-geometry-dash-spam.html',
  waveGuide: './blog/master-wave-control-advanced-techniques.html',
  updateGuide: './blog/geometry-dash-22-update-everything-you-need-to-know.html'
}

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input
    },
    copyPublicDir: true
  },
  server: {
    port: 3000
  }
})
