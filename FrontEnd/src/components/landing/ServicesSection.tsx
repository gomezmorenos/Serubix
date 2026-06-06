import type { LandingContent, ServiceCard, SaasProduct } from '@/features/landing/landing.types'

type ServicesSectionProps = LandingContent['services']

const BADGE_STYLES: Record<string, string> = {
  available: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  beta: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  soon: 'bg-zinc-700/60 text-zinc-400 border border-zinc-600/50',
}

export function ServicesSection({ label, title, subtitle, custom, saas }: Readonly<ServicesSectionProps>) {
  return (
    <section id="servicios" className="py-24 bg-zinc-950" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            {label}
          </span>
          <h2 id="services-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Servicios a medida */}
        <div className="mb-16" aria-labelledby="custom-services-title">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 bg-blue-950/50 border border-blue-800/40 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" aria-hidden="true" />
                {custom.label}
              </span>
            </div>
            <div className="flex-1 h-px bg-zinc-800" aria-hidden="true" />
          </div>
          <p className="text-zinc-400 text-base mb-8 max-w-3xl">{custom.subtitle}</p>
          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Servicios a medida"
          >
            {custom.cards.map((card: ServiceCard) => (
              <li
                key={card.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 hover:border-blue-800/60 hover:bg-zinc-900/80 transition-all group"
              >
                <span className="text-3xl mb-5 block" aria-hidden="true">{card.icon}</span>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Productos SaaS */}
        <div aria-labelledby="saas-products-title">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 bg-violet-950/50 border border-violet-700/40 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
                {saas.label}
              </span>
            </div>
            <div className="flex-1 h-px bg-zinc-800" aria-hidden="true" />
          </div>
          <p className="text-zinc-400 text-base mb-8 max-w-3xl">{saas.subtitle}</p>
          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Productos SaaS"
          >
            {saas.products.map((product: SaasProduct) => (
              <li
                key={product.id}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-7 hover:border-violet-700/50 hover:bg-zinc-900/80 transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="text-3xl" aria-hidden="true">{product.icon}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badgeVariant]}`}
                    aria-label={`Estado: ${product.badge}`}
                  >
                    {product.badge}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-300 transition-colors">
                  {product.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{product.description}</p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
