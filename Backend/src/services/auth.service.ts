import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import { AppError } from '../lib/errors'
import type { RegisterInput, LoginInput } from '../schemas/auth.schema'

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  provider: true,
  planId: true,
  createdAt: true,
} as const

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) throw new AppError('El email ya está registrado', 409)

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: USER_SELECT,
    })

    const token = signToken({ id: user.id, email: user.email })
    return { user, token }
  },

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user?.passwordHash) throw new AppError('Credenciales incorrectas', 401)

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new AppError('Credenciales incorrectas', 401)

    const token = signToken({ id: user.id, email: user.email })
    const { passwordHash: _, ...safeUser } = user
    return { user: safeUser, token }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...USER_SELECT,
        plan: { select: { id: true, name: true, ttsLimit: true } },
      },
    })
    if (!user) throw new AppError('Usuario no encontrado', 404)
    return user
  },
}
