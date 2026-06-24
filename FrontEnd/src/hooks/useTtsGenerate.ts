'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { authHeaders } from '@/lib/api'

export type TtsStatus = 'idle' | 'generating' | 'queued' | 'error'

export function useTtsGenerate() {
  const { data: session } = useSession()
  const [status, setStatus] = useState<TtsStatus>('idle')
  const [error, setError] = useState('')

  async function generate(text: string, voice: string): Promise<boolean> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    setStatus('generating')
    setError('')

    try {
      let res: Response
      try {
        res = await fetch(`${apiUrl}/tools/tts`, {
          method: 'POST',
          headers: authHeaders(session?.backendToken ?? ''),
          body: JSON.stringify({ text, voice }),
        })
      } catch {
        throw new Error('No se puede conectar con el servidor.')
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        if (res.status === 402) throw new Error(data.error)
        throw new Error(data.error ?? 'Error al generar el audio.')
      }

      setStatus('queued')
      return true
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al generar el audio.')
      return false
    }
  }

  const isReady = !!session?.backendToken

  return { status, error, generate, isReady }
}
