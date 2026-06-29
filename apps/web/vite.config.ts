import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(rootDir, "../..");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@conquest/presentation": path.join(repoRoot, "packages/presentation/src/index.ts"),
      "@conquest/gis": path.join(repoRoot, "packages/gis/src/index.ts"),
      "@conquest/contracts": path.join(repoRoot, "packages/contracts/src/index.ts"),
    },
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    open: "/",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    open: "/",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
});
