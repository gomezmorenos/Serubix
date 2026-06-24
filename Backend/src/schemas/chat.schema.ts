import { z } from 'zod'

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(2000, 'Máximo 2000 caracteres'),
  sessionKey: z.string().min(1).max(100),
})

export type ChatMessageInput = z.infer<typeof chatMessageSchema>
