import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    port: 31025
  },
  preview: {
    port: 31035,
    open: 'manga-packer.user.js',
  },
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'com.undsf.tmus.mgpk',
        match: [
          'https://telegra.ph/*',
          'https://nhentai.net/g/*/',
          'https://e-hentai.org/g/*/*'
        ],
      },
      build: {
        externalGlobals: {
          // vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
          // pinia: cdn.jsdelivr('Pinia', 'dist/pinia.iife.min.js'),
          // axios: cdn.jsdelivr('axios', 'dist/axios.min.js'),
          jszip: cdn.jsdelivr('JSZip', 'dist/jszip.min.js'),
          'file-saver': cdn.jsdelivr('FileSaver', 'dist/FileSaver.min.js'),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@domains': path.resolve(__dirname, 'src/domains'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    }
  }
});