import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type { UpdateProfileInput } from '../schemas/users.schema'

function currentMonth(): number {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}

export const usersService = {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        provider: true,
        planId: true,
        plan: { select: { id: true, name: true, ttsLimit: true } },
        createdAt: true,
      },
    })
    if (!user) throw new AppError('Usuario no encontrado', 404)
    return user
  },

  async updateProfile(userId: string, { name }: UpdateProfileInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true, planId: true },
    })
    return user
  },

  async getUsage(userId: string) {
    const month = currentMonth()
    const rows = await prisma.usage.groupBy({
      by: ['tool'],
      where: { userId, month },
      _sum: { amount: true },
    })
    return rows.map((r) => ({ tool: r.tool, amount: r._sum.amount ?? 0 }))
  },
}
