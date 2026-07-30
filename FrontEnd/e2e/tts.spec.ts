import { test, expect } from '@playwright/test'

// Usa la sesión guardada por auth.setup.ts
// La URL base del API se lee del entorno (E2E_API_URL) o del valor por defecto
const API = process.env.E2E_API_URL ?? 'http://localhost:4000'

test.describe('Text to Speech', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar la petición de generación TTS (OpenAI no disponible en tests)
    await page.route(`${API}/tools/tts`, async (route) => {
      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'e2e-tts-id', status: 'pending' }),
      })
    })

    // Interceptar el polling de contenido
    await page.route(`${API}/tools/content`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'e2e-tts-id',
            tool: 'tts',
            label: 'Texto de prueba para E2E',
            status: 'done',
            filename: 'e2e-audio.mp3',
            createdAt: new Date().toISOString(),
          },
        ]),
      })
    })
  })

  test('la página de herramientas carga con el widget TTS visible', async ({ page }) => {
    await page.goto('/herramientas')

    await expect(page.getByRole('heading', { name: 'Herramientas SaaS' })).toBeVisible()
    await expect(page.getByLabel(/Texto a convertir/)).toBeVisible()
    await expect(page.getByRole('combobox', { name: /Voz/ })).toBeVisible()
  })

  test('generar audio → botón en estado generando → confirmación "En cola"', async ({ page }) => {
    await page.goto('/herramientas')

    const textarea = page.getByLabel(/Texto a convertir/)
    await textarea.fill('Este es un texto de prueba para generación de audio con Playwright.')

    // Verificar el contador de caracteres
    await expect(page.getByText(/\d+\/4096/)).toBeVisible()

    await page.getByRole('button', { name: 'Generar audio' }).click()

    // Confirmación de cola
    await expect(page.getByText('En cola')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('link', { name: 'ver progreso' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'ver progreso' })).toHaveAttribute('href', '/contenido')
  })

  test('cambiar la voz seleccionada antes de generar', async ({ page }) => {
    await page.goto('/herramientas')

    const select = page.getByRole('combobox', { name: /Voz/ })
    await select.selectOption('nova')
    await expect(select).toHaveValue('nova')

    await page.getByLabel(/Texto a convertir/).fill('Texto con voz Nova.')
    await page.getByRole('button', { name: 'Generar audio' }).click()

    await expect(page.getByText('En cola')).toBeVisible({ timeout: 5_000 })
  })

  test('botón deshabilitado mientras el textarea está vacío', async ({ page }) => {
    await page.goto('/herramientas')
    await expect(page.getByRole('button', { name: 'Generar audio' })).toBeDisabled()

    await page.getByLabel(/Texto a convertir/).fill('Algo de texto')
    await expect(page.getByRole('button', { name: 'Generar audio' })).toBeEnabled()
  })
})
