import path from 'node:path'
import { promises as fs } from 'node:fs'
import OpenAI from 'openai'
import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import { contentService } from './content.service'
import type { TtsInput } from '../schemas/tools.schema'

export const STORAGE_DIR = path.join(process.cwd(), 'storage')

function currentMonth(): number {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}

async function checkPlanLimit(userId: string, textLength: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planId: true, plan: { select: { ttsLimit: true } } },
  })
  if (!user) throw new AppError('Usuario no encontrado', 404)

  const { ttsLimit } = user.plan
  if (ttsLimit > 0) {
    const agg = await prisma.usage.aggregate({
      where: { userId, tool: 'tts', month: currentMonth() },
      _sum: { amount: true },
    })
    const used = agg._sum.amount ?? 0
    if (used + textLength > ttsLimit) {
      throw new AppError(
        `Límite mensual del plan ${user.planId} alcanzado (${ttsLimit} caracteres). Actualiza a Pro para uso ilimitado.`,
        402,
      )
    }
  }
}

async function generateAndStore(userId: string, contentId: string, input: TtsInput) {
  const apiKey = process.env.OPENAI_API_KEY!
  const openai = new OpenAI({ apiKey })

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice: input.voice ?? 'alloy',
    input: input.text,
  })

  await fs.mkdir(STORAGE_DIR, { recursive: true })
  const filename = `${contentId}.mp3`
  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(path.join(STORAGE_DIR, filename), buffer)

  await prisma.usage.create({
    data: { userId, tool: 'tts', amount: input.text.length, month: currentMonth() },
  })

  await contentService.markDone(contentId, filename)
}

export const ttsService = {
  async startGeneration(userId: string, input: TtsInput): Promise<string> {
    if (!process.env.OPENAI_API_KEY) throw new AppError('El servicio TTS no está configurado', 503)

    await checkPlanLimit(userId, input.text.length)

    const label = input.text.length > 60 ? `${input.text.substring(0, 57)}...` : input.text
    const content = await contentService.createPending(userId, 'tts', label)

    // Fire-and-forget: no se espera para poder responder 202 inmediatamente
    generateAndStore(userId, content.id, input).catch(async (err) => {
      console.error('[TTS]', err.message)
      await contentService.markError(content.id).catch(() => null)
    })

    return content.id
  },
}
