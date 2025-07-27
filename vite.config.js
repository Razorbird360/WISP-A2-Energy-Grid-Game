import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/WISP-A2-Energy-Grid-Game/' : './',
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
}))