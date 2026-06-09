import type { Metadata } from 'next'
import { ContentGrid } from '@/components/dashboard/ContentGrid'

export const metadata: Metadata = {
  title: 'Contenido Generado | Serubix',
}

export default function ContenidoPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Contenido Generado</h1>
        <p className="text-zinc-400 mt-1">
          Historial de los últimos 7 días. El contenido se elimina automáticamente pasado ese periodo.
        </p>
      </div>
      <ContentGrid />
    </div>
  )
}
