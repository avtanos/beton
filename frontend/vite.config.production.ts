import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Конфигурация для GitHub Pages
export default defineConfig({
  plugins: [
    react({
      // Отключаем проверку ESLint при сборке
      eslint: {
        lintOnStart: false,
        lintOnSave: false,
      },
    }),
  ],
  base: process.env.VITE_BASE_PATH || '/beton/', // Имя репозитория на GitHub
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  esbuild: {
    // Игнорируем неиспользуемые переменные при сборке
    legalComments: 'none',
    treeShaking: true,
  },
})

