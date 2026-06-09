import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export const contentService = {
  async createPending(userId: string, tool: string, label: string) {
    return prisma.generatedContent.create({
      data: { userId, tool, label, status: 'pending' },
    })
  },

  async markDone(id: string, filename: string) {
    return prisma.generatedContent.update({
      where: { id },
      data: { status: 'done', filename },
    })
  },

  async markError(id: string) {
    return prisma.generatedContent.update({
      where: { id },
      data: { status: 'error' },
    })
  },

  async getRecent(userId: string) {
    return prisma.generatedContent.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - SEVEN_DAYS_MS) },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string, userId: string) {
    const item = await prisma.generatedContent.findFirst({
      where: { id, userId },
    })
    if (!item) throw new AppError('Contenido no encontrado', 404)
    return item
  },
}
