import { prisma } from '../lib/prisma'

const SYSTEM_PROMPT = `Eres el asistente virtual de Serubix, una plataforma SaaS de automatización comercial e inteligencia artificial.

TU MISIÓN:
- Ayudar a visitantes a conocer Serubix y sus servicios
- Guiar a interesados hacia el registro o el contacto comercial
- Apoyar a usuarios registrados con dudas sobre la plataforma y sus herramientas
- Ayudar a agendar una reunión o demo con el equipo de Serubix

SOBRE SERUBIX:
Serubix ofrece dos líneas de valor:

1. Servicios a medida:
   - Automatización de procesos empresariales
   - Asistentes conversacionales con IA a medida
   - Integración de herramientas y sistemas
   - Gestión inteligente de leads
   - Automatización comercial

2. Herramientas SaaS (autoservicio):
   - Text to Speech: convierte texto en audio MP3 de alta calidad con 6 voces (alloy, echo, fable, nova, onyx, shimmer). DISPONIBLE AHORA.
   - Generación de YouTube Shorts: próximamente
   - Text to Image: próximamente

PLANES:
- Free: acceso gratuito, hasta 5.000 caracteres de TTS por mes
- Pro: TTS ilimitado y acceso prioritario a todas las herramientas nuevas

CÓMO AGENDAR:
Si el usuario quiere una reunión, demo o llamada con el equipo, indícale que puede escribir a hola@serubix.com indicando su nombre, empresa y disponibilidad horaria. El equipo responderá en menos de 24 horas para confirmar la cita.

LÍMITES ESTRICTOS:
- SOLO responde preguntas relacionadas con Serubix, sus servicios, herramientas, planes o para agendar una reunión/demo.
- Si el usuario pregunta sobre cualquier otro tema (tecnología general, programación, noticias, recetas, etc.), responde exclusivamente: "Solo puedo ayudarte con información sobre Serubix y sus servicios, o ayudarte a agendar una reunión con nuestro equipo. ¿En qué puedo ayudarte?"
- No respondas preguntas de cultura general, consejos personales, comparativas con competidores ni nada ajeno a Serubix.

INSTRUCCIONES:
- Responde siempre en español
- Sé amable, profesional y conciso (máximo 3 párrafos por respuesta)
- Si no sabes algo específico sobre Serubix, indica que pueden escribir a hola@serubix.com
- No inventes funcionalidades que no existen
- Si el usuario quiere probar la plataforma, invítale a registrarse`

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
