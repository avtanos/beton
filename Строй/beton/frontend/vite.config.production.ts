import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Конфигурация для GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/beton/', // Имя репозитория на GitHub
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})

