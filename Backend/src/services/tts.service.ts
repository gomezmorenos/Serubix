import OpenAI from 'openai'
import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type { TtsInput } from '../schemas/tools.schema'

function currentMonth(): number {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}

export const ttsService = {
  async generate(userId: string, { text, voice }: TtsInput): Promise<Buffer> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new AppError('El servicio TTS no está configurado', 503)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planId: true, plan: { select: { ttsLimit: true } } },
    })
    if (!user) throw new AppError('Usuario no encontrado', 404)

    const { ttsLimit } = user.plan
    if (ttsLimit > 0) {
      const month = currentMonth()
      const agg = await prisma.usage.aggregate({
        where: { userId, tool: 'tts', month },
        _sum: { amount: true },
      })
      const used = agg._sum.amount ?? 0
      if (used + text.length > ttsLimit) {
        throw new AppError(
          `Límite mensual del plan ${user.planId} alcanzado (${ttsLimit} caracteres). Actualiza a Pro para uso ilimitado.`,
          402,
        )
      }
    }

    const openai = new OpenAI({ apiKey })
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice ?? 'alloy',
      input: text,
    })

    await prisma.usage.create({
      data: { userId, tool: 'tts', amount: text.length, month: currentMonth() },
    })

    return Buffer.from(await response.arrayBuffer())
  },
}
