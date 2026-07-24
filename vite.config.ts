import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  root: 'src',
  plugins: [preact()],
  resolve: {
    // @preact/preset-vite aliases react/react-dom/jsx-runtime to preact/compat,
    // but not this React 18 entry point — src/index.js imports createRoot from it.
    alias: {
      'react-dom/client': 'preact/compat/client',
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 1234,
  },
});
