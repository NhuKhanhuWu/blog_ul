/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // works on Render
  server: {
    proxy: {
      "/api": "http://localhost:3000", // only for local dev
    },
  },
});
