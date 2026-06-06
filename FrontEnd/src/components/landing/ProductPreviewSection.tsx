import type { LandingContent } from '@/features/landing/landing.types'

type ProductPreviewSectionProps = LandingContent['productPreview']

const MOCK_STATS = [
  { label: 'Leads activos', value: '128', change: '+12%' },
  { label: 'Automatizaciones', value: '34', change: '+5' },
  { label: 'Respuestas IA', value: '1.2k', change: '+340' },
  { label: 'Conversión', value: '24%', change: '+3%' },
]

const MOCK_LEADS = [
  { name: 'Ana García', status: 'Nuevo', dotColor: 'bg-blue-500' },
  { name: 'Carlos M.', status: 'En proceso', dotColor: 'bg-yellow-500' },
  { name: 'Empresa XYZ', status: 'Convertido', dotColor: 'bg-green-500' },
]

const SIDEBAR_ITEMS = ['Dashboard', 'Leads', 'Asistentes', 'Flujos', 'Analítica', 'Ajustes']

export function ProductPreviewSection({ label, title, subtitle }: ProductPreviewSectionProps) {
  return (
    <section id="producto" className="py-24 bg-zinc-900" aria-labelledby="preview-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            {label}
          </span>
          <h2 id="preview-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          role="img"
          aria-label="Vista previa del dashboard de la plataforma"
        >
          <WindowBar />

          <div className="flex min-h-80">
            <Sidebar />
            <DashboardContent />
          </div>
        </div>
      </div>
    </section>
  )
}

function WindowBar() {
  return (
    <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-red-500/60" aria-hidden="true" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/60" aria-hidden="true" />
      <div className="w-3 h-3 rounded-full bg-green-500/60" aria-hidden="true" />
      <div className="ml-4 flex-1 bg-zinc-800 rounded-md px-3 py-1 text-zinc-500 text-xs">
        app.serubix.com/dashboard
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <div className="hidden sm:flex flex-col w-44 bg-zinc-900/50 border-r border-zinc-800 p-3 gap-1 flex-shrink-0">
      {SIDEBAR_ITEMS.map((item, i) => (
        <div
          key={item}
          className={`px-3 py-2 rounded-lg text-xs font-medium ${
            i === 0 ? 'bg-blue-600/20 text-blue-400' : 'text-zinc-400'
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="flex-1 p-5 min-w-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <div className="text-zinc-400 text-xs mb-1 truncate">{stat.label}</div>
            <div className="text-white font-bold text-xl">{stat.value}</div>
            <div className="text-green-400 text-xs mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <LeadsPreview />
        <AssistantPreview />
      </div>
    </div>
  )
}

function LeadsPreview() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-white text-sm font-semibold mb-3">Últimos leads</div>
      <div className="space-y-2">
        {MOCK_LEADS.map((lead) => (
          <div key={lead.name} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
              {lead.name[0]}
            </div>
            <span className="text-zinc-300 text-xs flex-1 truncate">{lead.name}</span>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${lead.dotColor}`} aria-hidden="true" />
            <span className="text-zinc-500 text-xs flex-shrink-0">{lead.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AssistantPreview() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-white text-sm font-semibold mb-3">Asistente IA</div>
      <div className="space-y-2">
        <div className="bg-zinc-800 rounded-lg p-2.5">
          <div className="text-zinc-400 text-xs mb-1">Cliente</div>
          <div className="text-zinc-200 text-xs">¿Tienen planes para pequeñas empresas?</div>
        </div>
        <div className="bg-blue-950/40 border border-blue-900/30 rounded-lg p-2.5">
          <div className="text-blue-400 text-xs mb-1">Asistente IA</div>
          <div className="text-zinc-200 text-xs">
            Sí, tenemos planes desde €99/mes adaptados a pequeñas empresas…
          </div>
        </div>
      </div>
    </div>
  )
}
