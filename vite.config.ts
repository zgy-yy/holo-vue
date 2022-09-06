import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'0.0.0.0',
    proxy: {
      '/api': {
        // target: '',	//实际请求地址
        target:'http://10.20.161.210:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api_service/, '')
      }
    }
  }
})
