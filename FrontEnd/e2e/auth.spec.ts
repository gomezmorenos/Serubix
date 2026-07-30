import { test, expect } from '@playwright/test'
import { E2E_USER } from './constants'

// Ejecutar estos tests sin sesión guardada (flujo de auth en frío)
test.use({ storageState: { cookies: [], origins: [] } })

// Email único por ejecución para no colisionar con el usuario E2E fijo
const RUN_ID = Date.now()
const NEW_USER = {
  name: 'Test Playwright',
  email: `playwright-${RUN_ID}@test.com`,
  password: 'playwright-pass-123',
}

test.describe('Registro', () => {
  test('registro completo → redirige a /login con mensaje de éxito', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Nombre').fill(NEW_USER.name)
    await page.getByLabel('Email').fill(NEW_USER.email)
    await page.getByLabel('Contraseña', { exact: true }).fill(NEW_USER.password)
    await page.getByLabel('Confirmar contraseña').fill(NEW_USER.password)
    await page.getByRole('button', { name: 'Crear cuenta' }).click()

    await expect(page).toHaveURL('/login?registered=true', { timeout: 10_000 })
    await expect(page.getByText('Cuenta creada con éxito')).toBeVisible()
  })

  test('contraseñas que no coinciden → muestra error en cliente', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Nombre').fill('Test')
    await page.getByLabel('Email').fill(`mismatch-${RUN_ID}@test.com`)
    await page.getByLabel('Contraseña', { exact: true }).fill('pass-abc-123')
    await page.getByLabel('Confirmar contraseña').fill('pass-xyz-456')
    await page.getByRole('button', { name: 'Crear cuenta' }).click()

    await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible()
    await expect(page).toHaveURL('/register')
  })
})

test.describe('Login', () => {
  test('credenciales válidas → accede al dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill(E2E_USER.email)
    await page.getByLabel('Contraseña').fill(E2E_USER.password)
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 })
    await expect(page.getByRole('heading', { name: /Hola/ })).toBeVisible()
  })

  test('contraseña incorrecta → muestra error', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill(E2E_USER.email)
    await page.getByLabel('Contraseña').fill('wrong-password')
    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    await expect(page.getByText('Email o contraseña incorrectos')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})

test.describe('Rutas protegidas', () => {
  test('/dashboard sin sesión redirige a /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  })

  test('/herramientas sin sesión redirige a /login', async ({ page }) => {
    await page.goto('/herramientas')
    await expect(page).toHaveURL(/\/login/, { timeout: 5_000 })
  })
})
