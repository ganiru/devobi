import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const plumberUrl = '/plumber'; // URL path for plumber demo site

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: plumberUrl, // Set base path to /plumber
  
  resolve: {
    alias: {
      '@': '/Users/obinnaezeilo/Projects/devobi.com/plumber',
    },
  },
  
  server: {
    proxy: {
      // Plumbing API proxy routes (similar to medspa)
      '/api/plumber': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/plumber/, '')
      },
    }
  },
  
  build: {
    outDir: '../dist-plumber', // Deploy to plumber folder in parent /dist directory
    emptyOutDir: true
  }
});
