import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // OneDrive can briefly lock prior hashed assets on Windows. Netlify builds
    // into a fresh checkout, while local rebuilds safely overwrite index.html.
    emptyOutDir: false,
  },
})
