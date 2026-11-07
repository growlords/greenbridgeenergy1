import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/admin/',
  root: './admin',
  publicDir: '../public',
  server: {
    port: 5180,
    open: false,
    host: true
  },
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
    sourcemap: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
