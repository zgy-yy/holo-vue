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
        target:'http://192.168.4.1:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api_service/, '')
      }
    }
  }
})
