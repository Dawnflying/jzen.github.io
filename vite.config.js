import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    // 插件：在构建后创建 .nojekyll 文件（禁用 Jekyll 处理）
    {
      name: 'create-nojekyll',
      closeBundle() {
        try {
          writeFileSync(resolve(__dirname, 'dist/.nojekyll'), '')
          console.log('✓ Created .nojekyll file to disable Jekyll processing')
        } catch (error) {
          console.warn('⚠ Could not create .nojekyll file:', error.message)
        }
      }
    }
  ],
  base: '/jarvis-zen-blog/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 5003,
    open: true
  }
})

