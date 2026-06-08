import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Dashboard | Serubix',
}

const STATS = [
  {
    label: 'Plan actual',
    value: 'Free',
    sub: 'Actualizar a Pro',
    href: '/plan',
    color: 'blue',
  },
  {
    label: 'Herramientas disponibles',
    value: '1',
    sub: 'Text to Speech activo',
    color: 'emerald',
  },
  {
    label: 'Próximamente',
    value: '2',
    sub: 'YouTube Shorts · Text to Image',
    color: 'violet',
  },
]

const QUICK_TOOLS = [
  {
    id: 'tts',
    name: 'Text to Speech',
    description: 'Convierte texto en voz natural con IA',
    badge: 'Disponible',
    badgeStyle: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    href: '/herramientas',
    available: true,
  },
  {
    id: 'shorts',
    name: 'YouTube Shorts',
    description: 'Genera vídeos cortos automáticamente',
    badge: 'Próximamente',
    badgeStyle: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600/50',
    available: false,
  },
  {
    id: 'image',
    name: 'Text to Image',
    description: 'Crea imágenes desde tus descripciones',
    badge: 'Próximamente',
    badgeStyle: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600/50',
    available: false,
  },
]

const STAT_COLORS: Record<string, string> = {
  blue: 'text-blue-400',
  emerald: 'text-emerald-400',
  violet: 'text-violet-400',
}

export default async function DashboardPage() {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Usuario'

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">Hola, {firstName}</h1>
        <p className="text-zinc-400 mt-1">Aquí tienes el resumen de tu cuenta.</p>
      </div>

      {/* Stats */}
      <section aria-labelledby="stats-heading" className="mb-10">
        <h2 id="stats-heading" className="sr-only">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
            >
              <p className="text-zinc-400 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${STAT_COLORS[stat.color]}`}>
                {stat.value}
              </p>
              <p className="text-zinc-500 text-sm mt-1">
                {stat.href ? (
                  <Link href={stat.href} className="text-blue-400 hover:text-blue-300 transition-colors">
                    {stat.sub}
                  </Link>
                ) : (
                  stat.sub
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick access */}
      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-lg font-semibold text-white mb-4">
          Acceso rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm">{tool.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tool.badgeStyle}`}>
                  {tool.badge}
                </span>
              </div>
              <p className="text-zinc-400 text-sm flex-1 mb-4">{tool.description}</p>
              {tool.available ? (
                <Link
                  href={tool.href!}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Ir a la herramienta →
                </Link>
              ) : (
                <span className="text-zinc-600 text-sm">En desarrollo</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
