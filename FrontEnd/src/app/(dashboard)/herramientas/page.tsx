import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Herramientas | Serubix',
}

const TOOLS = [
  {
    id: 'tts',
    name: 'Text to Speech',
    description:
      'Convierte cualquier texto en audio de alta calidad con voces naturales generadas por IA. Ideal para podcasts, tutoriales, accesibilidad y contenido de vídeo.',
    badge: 'Disponible',
    badgeStyle: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    available: true,
    icon: <MicIcon />,
    accent: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    id: 'shorts',
    name: 'YouTube Shorts',
    description:
      'Genera automáticamente vídeos cortos optimizados para YouTube Shorts a partir de texto o artículos. Subtítulos, transiciones y música incluidos.',
    badge: 'Próximamente',
    badgeStyle: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600/50',
    available: false,
    icon: <VideoIcon />,
    accent: 'border-zinc-700/50',
  },
  {
    id: 'image',
    name: 'Text to Image',
    description:
      'Crea imágenes profesionales desde descripciones textuales. Múltiples estilos: foto realista, ilustración, arte conceptual, y más.',
    badge: 'Próximamente',
    badgeStyle: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600/50',
    available: false,
    icon: <ImageIcon />,
    accent: 'border-zinc-700/50',
  },
]

export default function HerramientasPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">Herramientas SaaS</h1>
        <p className="text-zinc-400 mt-1">
          Tus herramientas de inteligencia artificial disponibles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {TOOLS.map((tool) => (
          <article
            key={tool.id}
            className={`bg-zinc-900 border rounded-xl p-6 transition-colors ${tool.accent}`}
          >
            <div className="flex items-start gap-5">
              <div
                className={`p-3 rounded-xl flex-shrink-0 ${
                  tool.available
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {tool.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-white">{tool.name}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${tool.badgeStyle}`}>
                    {tool.badge}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  {tool.description}
                </p>

                {tool.available ? (
                  <TextToSpeechWidget />
                ) : (
                  <div className="flex items-center gap-3 py-3 px-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <ClockIcon />
                    <p className="text-zinc-400 text-sm">
                      Esta herramienta estará disponible próximamente.{' '}
                      <a
                        href="mailto:hola@serubix.com"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Avísame cuando esté lista
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function TextToSpeechWidget() {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="tts-text"
          className="block text-sm font-medium text-zinc-300 mb-1.5"
        >
          Texto a convertir
        </label>
        <textarea
          id="tts-text"
          rows={4}
          placeholder="Escribe o pega aquí el texto que quieres convertir a voz..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
          readOnly
        />
      </div>
      <div className="flex items-center gap-3">
        <div>
          <label htmlFor="tts-voice" className="sr-only">Voz</label>
          <select
            id="tts-voice"
            disabled
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-sm focus:outline-none disabled:opacity-60"
          >
            <option>Voz: Natural (ES)</option>
          </select>
        </div>
        <button
          disabled
          className="px-5 py-2 bg-blue-600/50 text-blue-200 rounded-lg text-sm font-medium cursor-not-allowed flex items-center gap-2"
        >
          <MicIcon small />
          Generar audio
        </button>
        <span className="text-zinc-500 text-xs">Integración con backend en desarrollo</span>
      </div>
    </div>
  )
}

function MicIcon({ small = false }: { small?: boolean }) {
  const size = small ? 14 : 22
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 flex-shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
