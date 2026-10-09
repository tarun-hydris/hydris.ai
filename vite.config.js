import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Multi-page build: every page is a real HTML file, so any static host
// (Vercel, Netlify, GitHub Pages) serves /platform/, /about/, /press/, /contact/, /privacy/, /terms/ and 404.html natively.
export default defineConfig({
  plugins: [react()],
  appType: 'mpa',
  server: { port: 5173, strictPort: true },
  // Pre-bundle every runtime dependency together so dev never loads two copies of React
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
      'gsap', 'gsap/ScrollTrigger', 'gsap/InertiaPlugin', 'lenis', 'ogl',
      'motion/react', '@vercel/analytics/react', '@vercel/speed-insights/react',
    ],
  },
  resolve: { dedupe: ['react', 'react-dom'] },
  preview: { port: 4173 },
  build: {
    rollupOptions: {
      input: {
        main: r('./index.html'),
        platform: r('./platform/index.html'),
        about: r('./about/index.html'),
        press: r('./press/index.html'),
        contact: r('./contact/index.html'),
        privacy: r('./privacy/index.html'),
        terms: r('./terms/index.html'),
        notFound: r('./404.html'),
      },
      output: {
        // Long-lived vendor chunks: cached across pages and deploys
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\/](react|react-dom|scheduler)[\/]/.test(id)) return 'react';
          if (id.includes('gsap') || id.includes('lenis')) return 'scroll';
          if (/[\/](motion|motion-dom|motion-utils|framer-motion)[\/]/.test(id)) return 'motion';
          if (id.includes('ogl')) return 'ogl';
          return 'vendor';
        },
      },
    },
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: true,
  },
});
