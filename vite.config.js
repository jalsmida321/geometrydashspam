import { defineConfig } from 'vite'
import { readdirSync } from 'fs'
import { join } from 'path'

// 自动扫描所有HTML文件
function getAllHtmlFiles() {
  const input = {}

  // 添加根目录的index.html作为入口
  input['main'] = './index.html'

  // 扫描根目录的所有HTML文件（除了index.html）
  const rootFiles = readdirSync('./').filter(file =>
    file.endsWith('.html') && file !== 'index.html'
  )
  rootFiles.forEach(file => {
    const name = file.replace('.html', '')
    input[name] = `./${file}`
  })

  // 扫描games目录的所有HTML文件
  try {
    const gameFiles = readdirSync('./games').filter(file => file.endsWith('.html'))
    gameFiles.forEach(file => {
      const name = file.replace('.html', '')
      input[name] = `./games/${file}`
    })
  } catch (error) {
    console.log('games目录不存在或为空')
  }

  return input
}

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getAllHtmlFiles()
    },
    copyPublicDir: true  // 确保public目录的文件被复制到构建输出
  },
  server: {
    port: 3000
  }
})