import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // En producción se sirve detrás de /klinix/ (reverse proxy).
  // En desarrollo mantenemos / para no romper `vite dev`.
  const base = mode === 'production' ? '/klinix/' : '/'

  return {
    base,
    plugins: [react()],
  }
})
