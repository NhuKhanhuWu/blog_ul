/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. Separate third-party dependencies
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }

          // 2. Automatically chunk all shared hooks
          if (id.includes("src/hooks/")) {
            return "app-shared-hooks";
          }

          // 3. Automatically chunk all utilities/helper files
          if (id.includes("src/utils/")) {
            return "app-shared-utils";
          }
        },
      },
    },
  },

  base: "/", // works on Render
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // for development
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "@/styles/variables" as *;
        @use "@/styles/breakpoints" as *;
      `,
        includePaths: [path.resolve(__dirname, "src/styles")],
      },
    },
  },
});
