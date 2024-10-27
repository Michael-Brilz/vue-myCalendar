// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'Vue3CalendarScheduler',
      fileName: (format) => `vue3-calendar-scheduler.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    }
  },
  plugins: [vue()]
})
