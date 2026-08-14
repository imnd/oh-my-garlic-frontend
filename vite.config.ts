import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [svelte()],
    preview: {
      allowedHosts: (env?.VITE_ALLOWED_HOSTS || '').split(',').filter(Boolean)
    }
  }
})