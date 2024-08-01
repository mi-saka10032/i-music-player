import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'

const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  plugins: [
    react(),
    svgr(),
    createHtmlPlugin(),
    visualizer()
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
        manualChunks: {
          tauri: ['@tauri-apps/api'],
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd'],
          core: ['howler', 'mitt'],
          store: ['jotai'],
          persist: ['localforage'],
          request: ['axios', 'qrcode', 'qs'],
          swiper: ['swiper'],
          keys: ['react-hotkeys'],
          utils: ['src/utils/index.ts'],
          hooks: ['src/hooks/index.ts']
        }
      }
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}))
