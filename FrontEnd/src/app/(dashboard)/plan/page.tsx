import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Plan y facturación | Serubix',
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0€',
    period: 'siempre',
    current: true,
    features: [
      'Acceso a Text to Speech',
      'Hasta 5.000 caracteres/mes',
      'Soporte por email',
      'Acceso a nuevas herramientas en beta',
    ],
    cta: 'Plan actual',
    ctaDisabled: true,
    accent: 'border-blue-500/30 ring-1 ring-blue-500/20',
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29€',
    period: 'mes',
    current: false,
    features: [
      'Todas las herramientas SaaS',
      'Uso ilimitado',
      'YouTube Shorts y Text to Image',
      'Soporte prioritario',
      'Automatizaciones a medida incluidas',
      'Panel de analíticas avanzadas',
    ],
    cta: 'Mejorar a Pro',
    ctaDisabled: false,
    accent: 'border-violet-500/30',
    badge: 'Próximamente',
  },
]

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function PlanPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">Plan y facturación</h1>
        <p className="text-zinc-400 mt-1">
          Gestiona tu suscripción y explora lo que ofrece el plan Pro.
        </p>
      </div>

      {/* Plan cards */}
      <section aria-labelledby="plans-heading" className="mb-10">
        <h2 id="plans-heading" className="sr-only">Planes disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-zinc-900 border rounded-xl p-6 flex flex-col relative ${plan.accent}`}
            >
              {plan.badge && (
                <span className="absolute top-4 right-4 text-xs px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                  {plan.badge}
                </span>
              )}
              {plan.current && (
                <span className="absolute top-4 right-4 text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Plan actual
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-400 text-sm">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8" aria-label={`Características del plan ${plan.name}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    {CHECK_ICON}
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.ctaDisabled}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  plan.current
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default'
                    : 'bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Usage */}
      <section aria-labelledby="usage-heading" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 id="usage-heading" className="text-base font-semibold text-white mb-5">
          Uso del mes actual
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-300">Text to Speech</span>
              <span className="text-sm text-zinc-400">0 / 5.000 caracteres</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-0" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={5000} />
            </div>
          </div>
        </div>
      </section>

      {/* Billing info placeholder */}
      <section aria-labelledby="billing-heading" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 id="billing-heading" className="text-base font-semibold text-white mb-1">
          Facturación
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          La gestión de pagos y facturas estará disponible cuando actualices a Pro.
        </p>
        <Link
          href="mailto:hola@serubix.com"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          ¿Necesitas factura personalizada? Contáctanos →
        </Link>
      </section>
    </div>
  )
}
