import { defineConfig, devices } from '@playwright/test'

const authFile = 'e2e/.auth/user.json'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Paso 1 — crea el usuario E2E y guarda las cookies de sesión
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // Tests del flujo de autenticación (sin sesión guardada)
    {
      name: 'auth-flow',
      testMatch: /auth\.spec\.ts/,
      dependencies: ['setup'],
    },

    // Tests del dashboard (usan la sesión guardada)
    {
      name: 'dashboard',
      testMatch: /tts\.spec\.ts/,
      use: { storageState: authFile },
      dependencies: ['setup'],
    },

    // ChatWidget — no requiere sesión
    {
      name: 'chat',
      testMatch: /chat\.spec\.ts/,
    },
  ],
})
