import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import { currentMonth } from '../lib/date'
import type { CreateGrantInput } from '../schemas/credits.schema'

export const creditsService = {
  async getSummary(userId: string) {
    const now = new Date()
    const month = currentMonth()

    const [user, usedAgg, grants] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { plan: { select: { id: true, name: true, ttsLimit: true } } },
      }),
      prisma.usage.aggregate({
        where: { userId, tool: 'tts', month },
        _sum: { amount: true },
      }),
      prisma.creditGrant.findMany({
        where: {
          userId,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        select: { id: true, amount: true, reason: true, expiresAt: true, createdAt: true },
      }),
    ])

    if (!user) throw new AppError('Usuario no encontrado', 404)

    const planLimit = user.plan.ttsLimit
    const bonusCredits = grants.reduce((sum, g) => sum + g.amount, 0)
    const totalLimit = planLimit + bonusCredits
    const used = usedAgg._sum.amount ?? 0
    const remaining = Math.max(0, totalLimit - used)

    // Primer día del mes siguiente
    const d = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    return {
      plan: user.plan,
      monthlyLimit: planLimit,
      bonusCredits,
      totalLimit,
      used,
      remaining,
      resetsAt: d.toISOString(),
      grants,
    }
  },

  async getHistory(userId: string) {
    const rows = await prisma.usage.groupBy({
      by: ['month'],
      where: { userId, tool: 'tts' },
      _sum: { amount: true },
      orderBy: { month: 'desc' },
      take: 12,
    })
    return rows.map((r) => ({ month: r.month, used: r._sum.amount ?? 0 }))
  },

  async createGrant(input: CreateGrantInput) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } })
    if (!user) throw new AppError('Usuario no encontrado', 404)

    return prisma.creditGrant.create({
      data: {
        userId: input.userId,
        amount: input.amount,
        reason: input.reason,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    })
  },

  async deleteGrant(grantId: string) {
    const grant = await prisma.creditGrant.findUnique({ where: { id: grantId } })
    if (!grant) throw new AppError('Concesión de crédito no encontrada', 404)
    await prisma.creditGrant.delete({ where: { id: grantId } })
  },
}
