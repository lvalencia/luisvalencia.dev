import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnpluginInjectPreload from "unplugin-inject-preload/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnpluginInjectPreload({
      files: [
        {
          entryMatch: /[a-zA-Z]*\.ttf$/,
          attributes: {
            type: "font/ttf",
            as: "font",
            crossorigin: "anonymous",
          },
        },
        {
          outputMatch: /lazy.[a-z-0-9]*.(css|js)$/,
        }
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
  optimizeDeps: {
    include: ["@luvle/utils"],
  },
  build: {
    commonjsOptions: {
      include: [/luvle-utils/],
    },
  },
});
