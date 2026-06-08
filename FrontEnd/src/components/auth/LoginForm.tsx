'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { GoogleButton } from './GoogleButton'

interface LoginFormProps {
  callbackUrl: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email o contraseña incorrectos')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Ha ocurrido un error. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@empresa.com"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-zinc-500 text-sm">o continúa con</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} />

      <p className="text-center text-zinc-400 text-sm mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}
