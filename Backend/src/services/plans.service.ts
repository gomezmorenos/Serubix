import { prisma } from '../lib/prisma'

export const plansService = {
  async getAll() {
    return prisma.plan.findMany({ orderBy: { ttsLimit: 'asc' } })
  },
}
