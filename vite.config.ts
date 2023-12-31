import { defineConfig, splitVendorChunkPlugin } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'

const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  plugins: [
    react(),
    svgr(),
    createHtmlPlugin(),
    splitVendorChunkPlugin()
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve('src/style/variables.less')}";`,
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks (id) {
          const moduleEntry = '/node_modules/'
          const utilEntry = 'src/utils/'
          if (id.includes(moduleEntry)) {
            const modules = id.match(/\/node_modules\/(.*?)\//g) as RegExpMatchArray
            if (Array.isArray(modules)) {
              switch (modules[1]) {
                case `${moduleEntry}@tauri-apps/`:
                  return 'tauri'
                case `${moduleEntry}react/`:
                  return 'react'
                case `${moduleEntry}react-router-dom/`:
                  return 'react-router'
                case `${moduleEntry}react-redux/`:
                case `${moduleEntry}@reduxjs/`:
                  return 'redux'
                case `${moduleEntry}antd/`:
                  return 'ui'
                case `${moduleEntry}swiper/`:
                  return 'swiper'
                case `${moduleEntry}howler/`:
                case `${moduleEntry}mitt/`:
                  return 'core'
                case `${moduleEntry}axios/`:
                case `${moduleEntry}qs/`:
                case `${moduleEntry}qrcode/`:
                  return 'request'
                case `${moduleEntry}react-hotkeys/`:
                  return 'hot-key'
                case `${moduleEntry}react-virtualized-auto-sizer/`:
                  return 'auto-sizer'
                case `${moduleEntry}react-window/`:
                  return 'virtualize'
                case `${moduleEntry}react-lrc/`:
                  return 'lrc'
                default:
                  return 'vendor'
              }
            }
          } else if (id.includes(utilEntry)) {
            return 'util'
          }
        }
      }
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}))
