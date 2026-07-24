import { defineConfig } from 'vite';

export default defineConfig({
  // Build output goes to ./dist (Vercel default)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // Inline small assets
    assetsInlineLimit: 4096,
  },
  // Serve assets from root
  base: '/',
});
