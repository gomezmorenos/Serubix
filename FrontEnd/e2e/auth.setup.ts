import { test as setup, expect, request } from '@playwright/test'
import path from 'node:path'
import { E2E_USER } from './constants'

const authFile = path.join(__dirname, '.auth/user.json')

setup('crear usuario E2E y guardar sesión', async ({ page }) => {
  const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:4000'

  // Registrar el usuario de test (idempotente — 409 si ya existe)
  const api = await request.newContext()
  const res = await api.post(`${apiUrl}/auth/register`, { data: E2E_USER })
  if (!res.ok() && res.status() !== 409) {
    throw new Error(`No se pudo crear el usuario E2E: HTTP ${res.status()}`)
  }
  await api.dispose()

  // Login vía UI para obtener la cookie de sesión de Auth.js
  await page.goto('/login')
  await page.getByLabel('Email').fill(E2E_USER.email)
  await page.getByLabel('Contraseña').fill(E2E_USER.password)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(page).toHaveURL('/dashboard', { timeout: 10_000 })

  // Guardar cookies y localStorage para reutilizarlos en los tests
  await page.context().storageState({ path: authFile })
})
