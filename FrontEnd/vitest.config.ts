import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: [
        'src/test/**',
        'src/features/landing/landing.types.ts',
        'src/lib/auth.ts',
        'src/middleware.ts',
        'src/app/api/**',
        'src/components/Providers.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
