import type { LandingContent } from '@/features/landing/landing.types'

type ServicesSectionProps = LandingContent['services']

export function ServicesSection({ label, title, subtitle, cards }: ServicesSectionProps) {
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

        <ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Nuestros servicios"
        >
          {cards.map((card) => (
            <li
              key={card.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-800/60 hover:bg-zinc-900/80 transition-all"
            >
              <span className="text-3xl mb-5 block" aria-hidden="true">
                {card.icon}
              </span>
              <h3 className="text-white font-semibold text-xl mb-3">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
