import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión | Serubix',
}

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const callbackUrl = params.callbackUrl ?? '/dashboard'

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Bienvenido de nuevo</h1>
        <p className="text-zinc-400 mt-2">Accede a tu área de cliente</p>
      </div>

      {params.registered && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
          Cuenta creada con éxito. Inicia sesión para continuar.
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />
    </div>
  )
}
