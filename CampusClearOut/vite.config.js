import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/

//added a proxy 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api': {
          target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:3000',
          changeOrigin: true,
          secure: false,      
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('sending request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('received response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
  },
});
