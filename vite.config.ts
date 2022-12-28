import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VitePluginInjectPreload from "vite-plugin-inject-preload";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginInjectPreload({
      files: [
        {
          match: /[a-zA-Z]*\.ttf$/,
          attributes: {
            type: "font/ttf",
            as: "font",
            crossorigin: "anonymous",
          },
        },
      ],
      injectTo: "head-prepend",
    }),
    VueI18nPlugin({}),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
