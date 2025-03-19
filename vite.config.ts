import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Adicione esta linha para corrigir módulos que podem estar no formato errado
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lucide-react')) return 'vendor-icons';
            return 'vendor';
          }
        },
      },
    },
  },
});
