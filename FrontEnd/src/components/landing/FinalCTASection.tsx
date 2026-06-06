import type { LandingContent } from '@/features/landing/landing.types'

type FinalCTASectionProps = LandingContent['finalCTA']

export function FinalCTASection({ title, subtitle, primaryCTA, note }: FinalCTASectionProps) {
  return (
    <section id="contacto" className="py-24 bg-zinc-950" aria-labelledby="cta-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
          </div>

          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 sm:p-16">
            <h2
              id="cta-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              {title}
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto">{subtitle}</p>
            <a
              href="mailto:hola@automatizaia.com"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 text-lg"
            >
              {primaryCTA}
            </a>
            <p className="text-zinc-500 text-sm mt-6 italic">{note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
