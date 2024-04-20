import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { BASE_ERL } from './src/content/common'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      host: '0.0.0.0',
      port: 1023,
      open: true,
      proxy: {
          '^(/user|/notice|/course|/homework|/file|/discussion|/sign|/video|/score|/defence|/log|/courseFile)': {
              target: BASE_ERL,    //请求域名
              changeOrigin: true,
          }
      }
  	},
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
