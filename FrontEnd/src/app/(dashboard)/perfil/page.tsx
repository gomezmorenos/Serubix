import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export const metadata: Metadata = {
  title: 'Perfil | Serubix',
}

export default async function PerfilPage() {
  const session = await auth()
  const user = session!.user
  const initials = (user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
        <p className="text-zinc-400 mt-1">Gestiona tu información personal.</p>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-5 mb-8">
        <div
          className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <p className="text-white font-semibold text-lg">{user.name ?? 'Usuario'}</p>
          <p className="text-zinc-400 text-sm">{user.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-400 border border-blue-500/30">
            Plan Free
          </span>
        </div>
      </div>

      {/* Edit form */}
      <section aria-labelledby="info-heading" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 id="info-heading" className="text-base font-semibold text-white mb-5">
          Información personal
        </h2>
        <ProfileForm name={user.name} email={user.email} />
      </section>

      {/* Security */}
      <section aria-labelledby="security-heading" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 id="security-heading" className="text-base font-semibold text-white mb-1">
          Seguridad
        </h2>
        <p className="text-zinc-400 text-sm mb-5">Cambia tu contraseña de acceso.</p>
        <button
          disabled
          className="px-5 py-2.5 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-lg text-sm cursor-not-allowed"
        >
          Cambiar contraseña — próximamente
        </button>
      </section>

      {/* Danger zone */}
      <section aria-labelledby="danger-heading" className="bg-zinc-900 border border-red-900/30 rounded-xl p-6">
        <h2 id="danger-heading" className="text-base font-semibold text-red-400 mb-1">
          Zona de peligro
        </h2>
        <p className="text-zinc-400 text-sm mb-5">
          Eliminar la cuenta es una acción irreversible. Todos tus datos serán borrados.
        </p>
        <button
          disabled
          className="px-5 py-2.5 bg-red-950/40 text-red-400 border border-red-900/50 rounded-lg text-sm cursor-not-allowed"
        >
          Eliminar cuenta — próximamente
        </button>
      </section>
    </div>
  )
}
