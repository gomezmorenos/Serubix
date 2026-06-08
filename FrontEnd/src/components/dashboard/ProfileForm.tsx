'use client'

import { useState } from 'react'

interface ProfileFormProps {
  name: string | null | undefined
  email: string | null | undefined
}

export function ProfileForm({ name, email }: Readonly<ProfileFormProps>) {
  const [displayName, setDisplayName] = useState(name ?? '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')

    // TODO: call backend API when ready
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: displayName }),
    // })

    await new Promise((r) => setTimeout(r, 700))
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Nombre
        </label>
        <input
          id="profile-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={email ?? ''}
          disabled
          className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-400 cursor-not-allowed"
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          El email no puede modificarse desde aquí.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === 'saving'}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm"
        >
          {status === 'saving' ? 'Guardando...' : 'Guardar cambios'}
        </button>
        {status === 'saved' && (
          <span className="text-emerald-400 text-sm">Cambios guardados correctamente.</span>
        )}
      </div>
    </form>
  )
}
