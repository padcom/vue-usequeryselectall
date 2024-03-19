import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    eslint(),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'vue-usequeryselectall',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: 'vue',
    },
  },
})
