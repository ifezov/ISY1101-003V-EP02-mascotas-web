import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/mascotas': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/index.css', 'src/test/**'],
      thresholds: {
        lines:      90,
        functions:  90,
        branches:   90,
        statements: 90,
      },
    },
  },
})
