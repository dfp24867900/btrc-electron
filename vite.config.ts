import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';

import vueJsx from '@vitejs/plugin-vue-jsx';
import cesium from 'vite-plugin-cesium';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      cesium(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`.
          entry: 'electron/main.ts'
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: path.join(__dirname, 'electron/preload.ts')
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer:
          process.env.NODE_ENV === 'test'
            ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
              undefined
            : {}
      }),

      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // resolve vue-i18n warning: You are running the esm-bundler build of vue-i18n.
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    base: mode === 'production' ? './' : '/', // 开发环境使用绝对路径，生产环境使用相对路径
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    server: {
      proxy: {
        // gis地图资源
        '/gis/': {
          target: loadEnv('development', './').VITE_APP_DEV_GISRESOURCE_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/gis/, '')
        },
        // 自研功能
        '/api': {
          target: loadEnv('development', './').VITE_APP_DEV_WEB_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        },
        // // gis-websocket
        // '/common-gis/websocket': {
        //   target: loadEnv('development', './').VITE_APP_DEV_GISSOCKET_URL,
        //   changeOrigin: true,
        //   ws: true
        // }
      }
    }
  };
});
