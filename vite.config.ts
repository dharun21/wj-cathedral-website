import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative assets work on localhost, a GitHub project path, and a future custom domain.
  base: './',
  plugins: [react(), tailwindcss()],
})
