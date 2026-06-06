import type { LandingContent } from '@/features/landing/landing.types'

type HeroSectionProps = LandingContent['hero']

export function HeroSection({
  badge,
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  trustNote,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden pt-16"
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-wider">
          <span
            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
            aria-hidden="true"
          />
          {badge}
        </span>

        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 tracking-tight"
        >
          {title}
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#contacto"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {primaryCTA}
          </a>
          <a
            href="#servicios"
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {secondaryCTA}
          </a>
        </div>

        <p className="text-sm text-zinc-500 italic">{trustNote}</p>
      </div>
    </section>
  )
}
