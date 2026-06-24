'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useContentItems } from '@/hooks/useContentItems'
import { authHeaders } from '@/lib/api'
import type { ContentItem } from '@/types/content'

const TOOL_NAMES: Record<string, string> = {
  tts: 'Text to Speech',
  'youtube-shorts': 'YouTube Shorts',
  'text-to-image': 'Text to Image',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

export function ContentGrid() {
  const { data: session } = useSession()
  const { items, loading } = useContentItems()
  const [downloading, setDownloading] = useState<string | null>(null)

  async function handleDownload(item: ContentItem) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl || !session?.backendToken) return
    setDownloading(item.id)
    try {
      const res = await fetch(`${apiUrl}/tools/content/${item.id}/download`, {
        headers: authHeaders(session.backendToken),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.filename ?? 'audio.mp3'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="text-zinc-500" size={24} />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <EmptyIcon />
        <p className="mt-3 text-sm">No hay contenido generado en los últimos 7 días.</p>
        <p className="text-xs mt-1 text-zinc-600">
          Ve a <span className="text-zinc-400">Herramientas</span> y genera tu primer audio.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/60">
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Herramienta</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Contenido</th>
            <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha</th>
            <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {items.map((item) => (
            <tr key={item.id} className="bg-zinc-900 hover:bg-zinc-800/40 transition-colors">
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 text-zinc-300 font-medium">
                  <ToolIcon tool={item.tool} />
                  {TOOL_NAMES[item.tool] ?? item.tool}
                </span>
              </td>
              <td className="px-5 py-4 text-zinc-400 max-w-xs truncate">{item.label}</td>
              <td className="px-5 py-4 text-zinc-500">{timeAgo(item.createdAt)}</td>
              <td className="px-5 py-4 text-right">
                {item.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs">
                    <Spinner size={14} />
                    Generando
                  </span>
                )}
                {item.status === 'done' && (
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={downloading === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 disabled:opacity-50 transition-colors text-xs font-medium border border-blue-500/20"
                    aria-label={`Descargar ${item.label}`}
                  >
                    {downloading === item.id ? <Spinner size={12} /> : <DownloadIcon />}
                    Descargar
                  </button>
                )}
                {item.status === 'error' && (
                  <span className="inline-flex items-center gap-1.5 text-red-400 text-xs">
                    <ErrorIcon />
                    Error
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Spinner({ size = 16, className = 'text-blue-400' }: Readonly<{ size?: number; className?: string }>) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg className="mx-auto text-zinc-700" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function ToolIcon({ tool }: Readonly<{ tool: string }>) {
  if (tool === 'tts') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}
