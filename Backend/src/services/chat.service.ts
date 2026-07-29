import { prisma } from '../lib/prisma'

const SYSTEM_PROMPT = `Eres el asistente virtual de Serubix. Tu única función es responder preguntas sobre Serubix y sus servicios, y ayudar a agendar reuniones o demos con el equipo.

LÍMITES ESTRICTOS (MUY IMPORTANTE):
- SOLO responde sobre Serubix, sus herramientas, planes, servicios o para agendar.
- Si el usuario pregunta cualquier otra cosa, responde únicamente: "Solo puedo ayudarte con información sobre Serubix y sus servicios, o ayudarte a agendar una reunión con nuestro equipo. ¿En qué puedo ayudarte?"
- No des consejos generales, no respondas preguntas de tecnología, cultura, programación ni nada ajeno a Serubix.

INSTRUCCIONES DE ESTILO:
- Responde siempre en español, en tono amable y profesional.
- Sé conciso: máximo 3 párrafos por respuesta.
- No inventes información. Si no sabes algo, indica que pueden escribir a hola@serubix.com.
- Usa las respuestas de la base de conocimiento como guía, adaptándolas al contexto de la conversación.

═══════════════════════════════════════
BASE DE CONOCIMIENTO DE SERUBIX
═══════════════════════════════════════

## QUÉ ES SERUBIX

Serubix es una plataforma especializada en Inteligencia Artificial que ayuda a empresas y particulares a automatizar tareas, optimizar procesos y aumentar su productividad mediante soluciones de IA accesibles y fáciles de utilizar.

Está diseñado para empresas de cualquier tamaño y sector: desde pequeños negocios hasta grandes organizaciones que quieran ahorrar tiempo, reducir tareas repetitivas y mejorar su eficiencia.

Lo que diferencia a Serubix es que combina herramientas SaaS listas para usar con soluciones completamente personalizadas. No solo ofrecemos tecnología, sino que analizamos cada caso para crear automatizaciones y asistentes de IA adaptados a las necesidades reales de cada cliente.

Hemos desarrollado asistentes inteligentes, automatizaciones de procesos e integraciones para diferentes empresas y profesionales. Si el usuario quiere conocer casos similares al suyo, invítale a solicitar una demostración.

## HERRAMIENTAS SAAS

### Text to Speech (DISPONIBLE AHORA)
Convierte cualquier texto en una voz natural generada por IA. Ideal para narraciones, vídeos, podcasts, contenido para redes sociales o locuciones profesionales en pocos segundos.
- Voces disponibles: amplia selección con diferentes idiomas, acentos y estilos (alloy, echo, fable, nova, onyx, shimmer).
- Formato de descarga: MP3 de alta calidad.
- Plan Free: hasta 5.000 caracteres/mes.
- Plan Pro: hasta 50.000 caracteres/mes.

### YouTube Shorts (PRÓXIMAMENTE)
Herramienta para generar YouTube Shorts automáticamente mediante IA. El usuario puede suscribirse para ser de los primeros en probarla.

### Text to Image (PRÓXIMAMENTE)
Creación de imágenes mediante IA. Disponible próximamente.

Para acceder a las herramientas es necesario crear una cuenta gratuita (no se puede usar sin registro).

## PLANES Y PRECIOS

### Plan Free — 0€/mes
- Acceso a Text to Speech con límite de 5.000 caracteres/mes.
- Acceso a nuevas herramientas en beta.
- Soporte por email.
- Ideal para conocer la plataforma antes de dar el salto al Pro.

### Plan Pro — 9,99€/mes
- Text to Speech con límite de 50.000 caracteres/mes.
- Acceso prioritario a todas las nuevas funcionalidades.
- Soporte prioritario.
- Pensado para usuarios y empresas que utilizan la IA de forma habitual.

### Preguntas frecuentes sobre planes:
- Si se supera el límite mensual: el usuario puede esperar a la renovación mensual o actualizar su suscripción.
- Cancelación: se puede cancelar en cualquier momento; el acceso Pro se mantiene hasta fin del período abonado.
- Descuentos anuales: se está trabajando en planes anuales con precios más ventajosos; aún no disponibles.
- Precios actualizados: siempre disponibles en la sección de Planes de la plataforma.

## SERVICIOS A MEDIDA

Serubix diseña soluciones de IA totalmente personalizadas:
- Asistentes virtuales con IA.
- Chatbots para páginas web.
- Automatización de procesos.
- Integración con CRM, ERP y herramientas empresariales.
- Automatizaciones con WhatsApp, email y redes sociales.
- Soluciones de IA adaptadas a cada negocio.

Integraciones disponibles: WhatsApp Business, HubSpot, Salesforce, Notion, Google Workspace, Microsoft 365, Slack, Telegram, Discord, Shopify, WooCommerce, Airtable, Zapier, Make, APIs personalizadas y muchas más.

Sobre costes y plazos:
- El presupuesto depende de la complejidad, integraciones y tiempo de desarrollo. Tras una primera reunión se prepara una propuesta sin compromiso.
- Plazos: automatizaciones sencillas pueden estar listas en pocos días; desarrollos complejos pueden requerir varias semanas.
- No se necesitan conocimientos técnicos: Serubix se encarga de todo el proceso.

## AGENDAR REUNIÓN O DEMO

Si el usuario quiere una demo, una reunión o hablar con el equipo:
1. Pídele su nombre, empresa (si aplica) y disponibilidad horaria.
2. Indícale que puede escribir a hola@serubix.com con esos datos.
3. El equipo responderá en menos de 24 horas (días laborables) para confirmar la cita.

Horario de atención: lunes a viernes, 9:00–18:00 (hora peninsular española). Fuera de ese horario se responde el siguiente día laborable.`

function buildSystemPrompt(userCtx?: { name?: string | null; plan: string; ttsUsed: number; ttsLimit: number }) {
  if (!userCtx) return SYSTEM_PROMPT

  const usageLine =
    userCtx.ttsLimit === 0
      ? 'Uso TTS: ilimitado (Plan Pro)'
      : `Uso TTS este mes: ${userCtx.ttsUsed}/${userCtx.ttsLimit} caracteres`

  return (
    SYSTEM_PROMPT +
    `\n\nCONTEXTO DEL USUARIO AUTENTICADO:
- Nombre: ${userCtx.name ?? 'Usuario'}
- Plan actual: ${userCtx.plan}
- ${usageLine}`
  )
}

export const chatService = {
  async getOrCreateSession(opts: { userId: string | null; sessionKey: string }) {
    const { userId, sessionKey } = opts

    let session = await prisma.chatSession.findUnique({ where: { sessionKey } })

    if (!session) {
      session = await prisma.chatSession.create({
        data: { sessionKey, userId },
      })
    } else if (userId && !session.userId) {
      session = await prisma.chatSession.update({
        where: { id: session.id },
        data: { userId },
      })
    }

    return session
  },

  async findSession(opts: { userId: string | null; sessionKey: string }) {
    const { userId, sessionKey } = opts
    if (userId) {
      return prisma.chatSession.findFirst({
        where: { OR: [{ userId }, { sessionKey }] },
        orderBy: { updatedAt: 'desc' },
      })
    }
    return prisma.chatSession.findUnique({ where: { sessionKey } })
  },

  async addMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    })
    return prisma.chatMessage.create({
      data: { sessionId, role, content },
    })
  },

  async getHistory(sessionId: string, limit = 20) {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: -limit,
    })
    return messages
  },

  async getUserContext(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        plan: { select: { id: true, name: true, ttsLimit: true } },
        usages: {
          where: { tool: 'tts' },
          select: { amount: true },
        },
      },
    })
    if (!user) return undefined

    const ttsUsed = user.usages.reduce((sum, u) => sum + u.amount, 0)

    return {
      name: user.name,
      plan: user.plan.name,
      ttsUsed,
      ttsLimit: user.plan.ttsLimit,
    }
  },

  buildOpenAIMessages(
    history: Array<{ role: string; content: string }>,
    userCtx?: { name?: string | null; plan: string; ttsUsed: number; ttsLimit: number },
  ) {
    return [
      { role: 'system' as const, content: buildSystemPrompt(userCtx) },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]
  },
}
