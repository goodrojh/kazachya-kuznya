import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Для GitHub Pages сборка идёт с base = /<repo>/ (задаётся в CI через BASE_PATH).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssTarget: 'safari14',
  },
})
