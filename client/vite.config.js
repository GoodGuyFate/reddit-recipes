import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,   // serve index.html for all unknown routes
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // wherever your API runs locally
        changeOrigin: true
      }
    }
  }
})                                              