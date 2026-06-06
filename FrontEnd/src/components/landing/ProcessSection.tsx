import type { LandingContent } from '@/features/landing/landing.types'

type ProcessSectionProps = LandingContent['process']

export function ProcessSection({ label, title, subtitle, steps }: ProcessSectionProps) {
  return (
    <section id="como-funciona" className="py-24 bg-zinc-900" aria-labelledby="process-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4 block">
            {label}
          </span>
          <h2 id="process-title" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" aria-label="Pasos del proceso">
          {steps.map((step, index) => (
            <li key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-5 left-full w-full h-px bg-zinc-700 -translate-x-8 z-0"
                  aria-hidden="true"
                />
              )}
              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-4"
                  aria-label={`Paso ${step.step}`}
                >
                  {step.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
