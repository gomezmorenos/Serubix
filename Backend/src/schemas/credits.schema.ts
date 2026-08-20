import { z } from 'zod'

export const createGrantSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().positive('El crédito debe ser positivo'),
  reason: z.string().max(255).optional(),
  expiresAt: z.string().datetime().optional(),
})

export type CreateGrantInput = z.infer<typeof createGrantSchema>
