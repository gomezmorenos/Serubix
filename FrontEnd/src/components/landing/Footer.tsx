import type { LandingContent } from '@/features/landing/landing.types'

type FooterProps = LandingContent['footer']

export function Footer({ brand, tagline, links, contact, copyright }: FooterProps) {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-xl mb-3">{brand}</div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">{tagline}</p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <div className="text-zinc-300 font-semibold text-sm mb-4">Navegación</div>
            <ul className="space-y-2" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <div className="text-zinc-300 font-semibold text-sm mb-4">Contacto</div>
            <a
              href={`mailto:${contact}`}
              className="text-zinc-400 hover:text-white text-sm transition-colors"
              aria-label={`Enviar email a ${contact}`}
            >
              {contact}
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center">
          <p className="text-zinc-500 text-xs">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
