import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api/resend': {
        target: 'https://api.resend.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/resend/, '')
      }
    }
  }
});
