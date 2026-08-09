import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/MARKDOWN_FOR_PHP/dist/',
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: ({ names }) =>
          names?.some((name) => name.endsWith('.css'))
            ? 'assets/app.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
