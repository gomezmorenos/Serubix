import { createHash, randomBytes } from 'node:crypto'
import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type { CreateTokenInput, UpdateTokenInput } from '../schemas/tokens.schema'

const TOKEN_SELECT = {
  id: true,
  name: true,
  prefix: true,
  createdAt: true,
  lastUsedAt: true,
} as const

function generateToken() {
  const raw = `srx_${randomBytes(32).toString('hex')}`
  const hash = createHash('sha256').update(raw).digest('hex')
  const prefix = raw.slice(0, 12)
  return { raw, hash, prefix }
}

export const tokensService = {
  async list(userId: string) {
    return prisma.token.findMany({
      where: { userId },
      select: TOKEN_SELECT,
      orderBy: { createdAt: 'desc' },
    })
  },

  async create(userId: string, input: CreateTokenInput) {
    const { raw, hash, prefix } = generateToken()
    const token = await prisma.token.create({
      data: { userId, name: input.name, tokenHash: hash, prefix },
      select: TOKEN_SELECT,
    })
    return { ...token, token: raw }
  },

  async update(userId: string, tokenId: string, input: UpdateTokenInput) {
    const existing = await prisma.token.findUnique({ where: { id: tokenId } })
    if (!existing || existing.userId !== userId) throw new AppError('Token no encontrado', 404)

    return prisma.token.update({
      where: { id: tokenId },
      data: { name: input.name },
      select: TOKEN_SELECT,
    })
  },

  async delete(userId: string, tokenId: string) {
    const existing = await prisma.token.findUnique({ where: { id: tokenId } })
    if (!existing || existing.userId !== userId) throw new AppError('Token no encontrado', 404)

    await prisma.token.delete({ where: { id: tokenId } })
  },
}
