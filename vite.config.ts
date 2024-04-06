import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const mobile =
  process.env.TAURI_PLATFORM === "android" ||
  process.env.TAURI_PLATFORM === "ios";

export default defineConfig(({
  command,
  mode
}) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    plugins: [
      vue({ 
        template: { transformAssetUrls }
      }),
      vuetify({
        autoImport: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  
    define: { 'process.env': {} },
    clearScreen: false,
    server: {
      port: 3040,
      strictPort: true,
    },
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  }
})
