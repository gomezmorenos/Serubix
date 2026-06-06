import type { LandingContent } from '@/features/landing/landing.types'

type SolutionSectionProps = LandingContent['solution']

export function SolutionSection({ label, title, subtitle, points }: SolutionSectionProps) {
  return (
    <section id="solucion" className="py-24 bg-zinc-900" aria-labelledby="solution-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
              {label}
            </span>
            <h2
              id="solution-title"
              className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight"
            >
              {title}
            </h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">{subtitle}</p>
            <ul className="space-y-3" role="list">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mt-0.5"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-3 h-3 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-zinc-300 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4"
            aria-label="Ilustración del flujo de automatización"
            role="img"
          >
            <FlowStep
              icon="📥"
              color="blue"
              title="Lead capturado"
              subtitle="Formulario web → CRM"
            />
            <Connector />
            <FlowStep
              icon="🤖"
              color="indigo"
              title="Asistente IA activado"
              subtitle="Clasificación y respuesta automática"
            />
            <Connector />
            <FlowStep
              icon="✅"
              color="green"
              title="Seguimiento automatizado"
              subtitle="Email + notificación al equipo"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FlowStep({
  icon,
  color,
  title,
  subtitle,
}: {
  icon: string
  color: 'blue' | 'indigo' | 'green'
  title: string
  subtitle: string
}) {
  const colorMap = {
    blue: { bg: 'bg-blue-600/20', dot: 'bg-blue-400' },
    indigo: { bg: 'bg-indigo-600/20', dot: 'bg-indigo-400' },
    green: { bg: 'bg-green-600/20', dot: 'bg-green-400' },
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-800/50 rounded-xl p-4">
      <div
        className={`w-8 h-8 rounded-lg ${colorMap[color].bg} flex items-center justify-center text-sm flex-shrink-0`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-white text-xs font-medium">{title}</div>
        <div className="text-zinc-500 text-xs truncate">{subtitle}</div>
      </div>
      <div
        className={`ml-auto w-2 h-2 rounded-full ${colorMap[color].dot} animate-pulse flex-shrink-0`}
        aria-hidden="true"
      />
    </div>
  )
}

function Connector() {
  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <div className="w-px h-5 bg-zinc-700" />
    </div>
  )
}
