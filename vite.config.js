// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // ✅ 正确导入整个 path 模块

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // ✅ 正确使用 path.resolve
    }
  },
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.name.endsWith('.model3.json') ||
            assetInfo.name.endsWith('.moc3') ||
            assetInfo.name.endsWith('.physics.json') ||
            assetInfo.name.endsWith('.motion3.json')
          ) {
            return 'models/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    }
  },
  publicDir: 'public'
})