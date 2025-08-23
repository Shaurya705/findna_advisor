import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  resolve: {
    alias: {
      components: resolve(__dirname, './src/components'),
      pages: resolve(__dirname, './src/pages'),
      contexts: resolve(__dirname, './src/contexts'),
      hooks: resolve(__dirname, './src/hooks'),
      services: resolve(__dirname, './src/services'),
      utils: resolve(__dirname, './src/utils'),
      styles: resolve(__dirname, './src/styles'),
    },
  },
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});