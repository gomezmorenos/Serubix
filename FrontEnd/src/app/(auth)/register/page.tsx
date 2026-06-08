import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear cuenta | Serubix',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Crear una cuenta</h1>
        <p className="text-zinc-400 mt-2">Empieza a automatizar tu negocio hoy</p>
      </div>
      <RegisterForm />
    </div>
  )
}
