import type { LandingContent } from '@/features/landing/landing.types'

type ProblemSectionProps = LandingContent['problem']

export function ProblemSection({ label, title, subtitle, cards }: ProblemSectionProps) {
  return (
    <section id="problema" className="py-24 bg-zinc-950" aria-labelledby="problem-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            {label}
          </span>
          <h2
            id="problem-title"
            className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto"
          >
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Problemas que resolvemos"
        >
          {cards.map((card) => (
            <li
              key={card.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors"
            >
              <span className="text-3xl mb-4 block" aria-hidden="true">
                {card.icon}
              </span>
              <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
