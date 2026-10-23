import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 打包为单文件 index.html，方便直接上传到 GitHub Pages
export default defineConfig({
  base: './',
  plugins: [vue(), viteSingleFile()],
})
