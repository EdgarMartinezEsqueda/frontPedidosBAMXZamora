import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        assets: path.resolve(__dirname, "./src/assets"),
        components: path.resolve(__dirname, "./src/components"),
        context: path.resolve(__dirname, "./src/context"),
        fonts: path.resolve(__dirname, "./fonts"),
        hooks: path.resolve(__dirname, "./src/hooks"),
        lib: path.resolve(__dirname, "./src/lib"),
        pages: path.resolve(__dirname, "./src/pages"),
        utils: path.resolve(__dirname, "./src/utils"),
      }
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      }
    },
  }
})
