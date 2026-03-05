import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/restapis': {
        target: 'http://localhost:4566',
        changeOrigin: true,
      }
    }
  }
})
