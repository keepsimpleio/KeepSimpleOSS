import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'AskUxCore',
      formats: ['iife'],
      // App loads this exact path from /public/ask-ux-core-dev.js — keep
      // the build output filename in sync. `outDir` below writes the
      // bundle straight into the Next.js public dir.
      fileName: () => 'ask-ux-core-dev.js',
    },
    outDir: resolve(__dirname, '..', 'public'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2018',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
