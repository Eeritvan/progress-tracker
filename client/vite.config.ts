import path from 'path'
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
const ReactCompilerConfig = { target: '18' }
import tailwindcss from '@tailwindcss/vite'
import 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', ReactCompilerConfig]
        ]
      }
    }) as PluginOption,
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  }
})
