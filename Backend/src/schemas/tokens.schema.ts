import { z } from 'zod'

export const createTokenSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(64),
})

export const updateTokenSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(64),
})

export type CreateTokenInput = z.infer<typeof createTokenSchema>
export type UpdateTokenInput = z.infer<typeof updateTokenSchema>
