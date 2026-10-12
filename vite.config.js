import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/clinic-management-system/',
  build: {
    sourcemap: false,
  },
  plugins: [react()],
})
