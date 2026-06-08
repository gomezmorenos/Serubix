import { z } from 'zod'

export const ttsSchema = z.object({
  text: z.string().min(1, 'El texto es obligatorio').max(4096, 'Máximo 4096 caracteres'),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional().default('alloy'),
})

export type TtsInput = z.infer<typeof ttsSchema>
