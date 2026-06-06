import type { LandingContent } from '@/features/landing/landing.types'

type BenefitsSectionProps = LandingContent['benefits']

export function BenefitsSection({ label, title, subtitle, items }: BenefitsSectionProps) {
  return (
    <section id="beneficios" className="py-24 bg-zinc-950" aria-labelledby="benefits-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            {label}
          </span>
          <h2 id="benefits-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Beneficios de la plataforma"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center"
            >
              <div
                className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2"
                aria-label={`${item.metric}${item.unit}`}
              >
                {item.metric}
                <span className="text-blue-600/80">{item.unit}</span>
              </div>
              <h3 className="text-white font-semibold text-base mb-2">{item.label}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
