import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Get proxy target from environment variable with fallback
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET || 'http://10.0.130.163:8000';

  // Log proxy configuration in development
  if (mode === 'development') {
    // eslint-disable-next-line no-console
    console.log(`[Vite] API Proxy configured: /api -> ${apiProxyTarget}`);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
  };
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
