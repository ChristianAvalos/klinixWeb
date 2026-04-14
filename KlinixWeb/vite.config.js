import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const configuredBase = env.VITE_APP_BASE?.trim()
  const base = configuredBase
    ? configuredBase.startsWith('/')
      ? configuredBase.endsWith('/')
        ? configuredBase
        : `${configuredBase}/`
      : `/${configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`}`
    : '/'

  return {
    base,
    plugins: [react()],
  }
})
