import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from 'path';
import { defineConfig } from 'vite';
/**
 * The TypeScript compiler itself doesn't handle runtime module resolution; it's mainly a compile-time feature.
 * This means that when you run your code, the runtime environment needs to know how to resolve these mapped paths.
 *
 * In the context of Vite, which is a frontend build tool, this runtime resolution is not handled by default.
 * The vite-tsconfig-paths plugin comes into play to bridge this gap. It interprets the paths configured in
 * your tsconfig.json and provides the necessary runtime resolution during development.
 *
 * This additional step is required because the TypeScript compiler's paths resolution is not automatically
 * translated into runtime resolution in every development environment or build tool
 */
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), sentryVitePlugin({
    org: "michael-6qq",
    project: "javascript-react"
  })],

  resolve: {
    alias: {
      lib: path.resolve(__dirname, 'src/lib'),
    },
  },

  build: {
    sourcemap: true
  }
});