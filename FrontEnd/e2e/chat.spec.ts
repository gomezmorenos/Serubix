import { test, expect } from '@playwright/test'

const API = process.env.E2E_API_URL ?? 'http://localhost:4000'

// Respuesta SSE simulada: evento de sesión + un delta + [DONE]
const FAKE_SSE_RESPONSE = [
  'data: {"type":"session","sessionKey":"e2e-session-key"}\n\n',
  'data: {"type":"delta","content":"¡Hola! Soy el asistente de Serubix."}\n\n',
  'data: {"type":"delta","content":" ¿En qué puedo ayudarte?"}\n\n',
  'data: [DONE]\n\n',
].join('')

test.describe('ChatWidget', () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar el endpoint SSE del chat
    await page.route(`${API}/chat/message`, async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        body: FAKE_SSE_RESPONSE,
      })
    })

    // Interceptar historial (sesión nueva → vacío)
    await page.route(`${API}/chat/history**`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // Ir a la landing (el ChatWidget está en el layout global)
    await page.goto('/')
  })

  test('el botón flotante del chat es visible en la página', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Abrir chat con el asistente' }),
    ).toBeVisible()
  })

  test('abrir el chat muestra la ventana con el saludo inicial', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir chat con el asistente' }).click()

    await expect(page.getByRole('dialog', { name: 'Asistente Serubix' })).toBeVisible()
    await expect(page.getByText('¡Hola! Soy el asistente de Serubix')).toBeVisible()
  })

  test('enviar un mensaje → aparece la respuesta del asistente', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir chat con el asistente' }).click()

    const textarea = page.getByRole('textbox', { name: 'Mensaje al asistente' })
    await textarea.fill('¿Qué es Serubix?')
    await page.getByRole('button', { name: 'Enviar mensaje' }).click()

    // El mensaje del usuario aparece
    await expect(page.getByText('¿Qué es Serubix?')).toBeVisible()

    // La respuesta del asistente aparece
    await expect(
      page.getByText('¡Hola! Soy el asistente de Serubix.'),
    ).toBeVisible({ timeout: 8_000 })
  })

  test('Enter envía el mensaje (sin Shift)', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir chat con el asistente' }).click()

    const textarea = page.getByRole('textbox', { name: 'Mensaje al asistente' })
    await textarea.fill('Hola')
    await textarea.press('Enter')

    await expect(page.getByText('Hola', { exact: true })).toBeVisible()
    await expect(
      page.getByText('¡Hola! Soy el asistente de Serubix.'),
    ).toBeVisible({ timeout: 8_000 })
  })

  test('cerrar el chat oculta la ventana', async ({ page }) => {
    await page.getByRole('button', { name: 'Abrir chat con el asistente' }).click()
    await expect(page.getByRole('dialog', { name: 'Asistente Serubix' })).toBeVisible()

    await page.getByRole('button', { name: 'Cerrar chat' }).first().click()
    await expect(page.getByRole('dialog', { name: 'Asistente Serubix' })).not.toBeVisible()
  })
})
