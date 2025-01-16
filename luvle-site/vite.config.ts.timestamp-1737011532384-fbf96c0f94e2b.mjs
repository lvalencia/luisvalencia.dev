// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/lvalencia/Sandbox/luisvalencia.dev/.yarn/__virtual__/vite-virtual-bb69048100/0/cache/vite-npm-4.5.2-e430b2c117-3feb39f8da.zip/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/lvalencia/Sandbox/luisvalencia.dev/.yarn/__virtual__/@vitejs-plugin-vue-virtual-eddcc535b3/0/cache/@vitejs-plugin-vue-npm-3.2.0-d467fde943-f8863eac12.zip/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VitePluginInjectPreload from "file:///Users/lvalencia/Sandbox/luisvalencia.dev/.yarn/__virtual__/vite-plugin-inject-preload-virtual-5b0751b77c/0/cache/vite-plugin-inject-preload-npm-1.2.0-166160a7c1-9bca8d4701.zip/node_modules/vite-plugin-inject-preload/dist/index.mjs";
import VueI18nPlugin from "file:///Users/lvalencia/Sandbox/luisvalencia.dev/.yarn/__virtual__/@intlify-unplugin-vue-i18n-virtual-ec8d5aa352/0/cache/@intlify-unplugin-vue-i18n-npm-0.8.1-e92fb84421-2207f2d135.zip/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/lvalencia/Sandbox/luisvalencia.dev/luvle-site/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VitePluginInjectPreload({
      files: [
        {
          match: /[a-zA-Z]*\.ttf$/,
          attributes: {
            type: "font/ttf",
            as: "font",
            crossorigin: "anonymous"
          }
        }
      ],
      injectTo: "head-prepend"
    }),
    VueI18nPlugin({})
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  optimizeDeps: {
    include: ["@luvle/utils"]
  },
  build: {
    commonjsOptions: {
      include: [/luvle-utils/]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbHZhbGVuY2lhL1NhbmRib3gvbHVpc3ZhbGVuY2lhLmRldi9sdXZsZS1zaXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbHZhbGVuY2lhL1NhbmRib3gvbHVpc3ZhbGVuY2lhLmRldi9sdXZsZS1zaXRlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9sdmFsZW5jaWEvU2FuZGJveC9sdWlzdmFsZW5jaWEuZGV2L2x1dmxlLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IFZpdGVQbHVnaW5JbmplY3RQcmVsb2FkIGZyb20gXCJ2aXRlLXBsdWdpbi1pbmplY3QtcHJlbG9hZFwiO1xuaW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSBcIkBpbnRsaWZ5L3VucGx1Z2luLXZ1ZS1pMThuL3ZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBWaXRlUGx1Z2luSW5qZWN0UHJlbG9hZCh7XG4gICAgICBmaWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgbWF0Y2g6IC9bYS16QS1aXSpcXC50dGYkLyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICB0eXBlOiBcImZvbnQvdHRmXCIsXG4gICAgICAgICAgICBhczogXCJmb250XCIsXG4gICAgICAgICAgICBjcm9zc29yaWdpbjogXCJhbm9ueW1vdXNcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGluamVjdFRvOiBcImhlYWQtcHJlcGVuZFwiLFxuICAgIH0pLFxuICAgIFZ1ZUkxOG5QbHVnaW4oe30pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJAbHV2bGUvdXRpbHNcIl0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICBpbmNsdWRlOiBbL2x1dmxlLXV0aWxzL10sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VSxTQUFTLGVBQWUsV0FBVztBQUVqWCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyw2QkFBNkI7QUFDcEMsT0FBTyxtQkFBbUI7QUFMc0wsSUFBTSwyQ0FBMkM7QUFRalEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osd0JBQXdCO0FBQUEsTUFDdEIsT0FBTztBQUFBLFFBQ0w7QUFBQSxVQUNFLE9BQU87QUFBQSxVQUNQLFlBQVk7QUFBQSxZQUNWLE1BQU07QUFBQSxZQUNOLElBQUk7QUFBQSxZQUNKLGFBQWE7QUFBQSxVQUNmO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFVBQVU7QUFBQSxJQUNaLENBQUM7QUFBQSxJQUNELGNBQWMsQ0FBQyxDQUFDO0FBQUEsRUFDbEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxNQUNmLFNBQVMsQ0FBQyxhQUFhO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
