import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  preview: {
    allowedHosts: (import.meta.env.VITE_ALLOWED_HOSTS || '').split(',').filter(Boolean)
  }
})
