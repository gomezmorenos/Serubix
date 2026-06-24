import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Cookies | Serubix',
  description: 'Información sobre el uso de cookies en la plataforma Serubix.',
  robots: { index: false, follow: false },
}

export default function PoliticaDeCookiesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10"
        >
          <ArrowLeftIcon />
          Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Política de Cookies</h1>
        <p className="text-zinc-500 text-sm mb-10">Última actualización: junio de 2025</p>

        <div className="prose-serubix space-y-10">

          <Section title="1. ¿Qué son las cookies?">
            <p>
              Las cookies son pequeños ficheros de texto que los sitios web depositan en el
              navegador o dispositivo del usuario cuando visita una página. Permiten que el
              sitio recuerde información sobre la visita (idioma preferido, sesión iniciada,
              etc.) para que la próxima visita sea más fácil y el sitio resulte más útil.
            </p>
          </Section>

          <Section title="2. ¿Qué cookies utilizamos?">
            <p>Serubix utiliza exclusivamente cookies técnicas y de sesión necesarias para el correcto funcionamiento de la plataforma. No utilizamos cookies publicitarias ni de seguimiento de terceros.</p>

            <table className="w-full text-sm mt-4 border border-zinc-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-900 text-zinc-400 text-xs uppercase">
                  <th className="text-left px-4 py-3">Nombre</th>
                  <th className="text-left px-4 py-3">Tipo</th>
                  <th className="text-left px-4 py-3">Finalidad</th>
                  <th className="text-left px-4 py-3">Duración</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <CookieRow
                  name="authjs.session-token"
                  type="Técnica / Sesión"
                  purpose="Mantiene la sesión autenticada del usuario en la plataforma."
                  duration="30 días"
                />
                <CookieRow
                  name="authjs.csrf-token"
                  type="Técnica / Seguridad"
                  purpose="Protección contra ataques CSRF en formularios y peticiones autenticadas."
                  duration="Sesión"
                />
                <CookieRow
                  name="authjs.callback-url"
                  type="Técnica"
                  purpose="Guarda la URL de redirección tras el proceso de autenticación."
                  duration="Sesión"
                />
                <CookieRow
                  name="serubix_cookies_consent"
                  type="Preferencia (localStorage)"
                  purpose="Almacena la decisión del usuario sobre el aviso de cookies. No es una cookie de navegador sino almacenamiento local."
                  duration="Indefinida (hasta borrar datos del navegador)"
                />
              </tbody>
            </table>
          </Section>

          <Section title="3. Base legal">
            <p>
              El tratamiento de datos mediante cookies técnicas se ampara en el{' '}
              <strong className="text-zinc-200">interés legítimo</strong> del responsable del
              tratamiento y en la{' '}
              <strong className="text-zinc-200">ejecución del contrato</strong> con el usuario
              (prestación del servicio solicitado), conforme al artículo 6.1.b) y 6.1.f) del
              Reglamento (UE) 2016/679 (RGPD) y el artículo 22.2 de la Ley 34/2002 de Servicios
              de la Sociedad de la Información (LSSI).
            </p>
            <p className="mt-3">
              Al tratarse únicamente de cookies técnicas estrictamente necesarias, no es
              obligatorio el consentimiento previo del usuario. No obstante, mostramos el aviso
              informativo por transparencia.
            </p>
          </Section>

          <Section title="4. Cookies de terceros">
            <p>
              Actualmente Serubix <strong className="text-zinc-200">no instala cookies de terceros</strong> con
              fines publicitarios ni analíticos. En el caso de que en el futuro se incorporen
              servicios de análisis de audiencia (p. ej. Google Analytics), esta política se
              actualizará con antelación.
            </p>
          </Section>

          <Section title="5. Cómo gestionar o deshabilitar las cookies">
            <p>
              Puedes configurar tu navegador para bloquear o eliminar las cookies. Ten en cuenta
              que deshabilitar las cookies técnicas puede impedir el correcto funcionamiento del
              acceso a la plataforma.
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-zinc-400">
              <li>
                <strong className="text-zinc-300">Chrome:</strong>{' '}
                Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
              </li>
              <li>
                <strong className="text-zinc-300">Firefox:</strong>{' '}
                Ajustes → Privacidad y seguridad → Cookies y datos del sitio
              </li>
              <li>
                <strong className="text-zinc-300">Safari:</strong>{' '}
                Preferencias → Privacidad → Gestionar datos de sitios web
              </li>
              <li>
                <strong className="text-zinc-300">Edge:</strong>{' '}
                Configuración → Cookies y permisos del sitio
              </li>
            </ul>
            <p className="mt-4">
              También puedes revocar tu preferencia en cualquier momento borrando el dato
              <code className="mx-1 px-1.5 py-0.5 bg-zinc-800 rounded text-xs text-zinc-300">serubix_cookies_consent</code>
              del almacenamiento local de tu navegador (Herramientas de desarrollador → Application → Local Storage).
            </p>
          </Section>

          <Section title="6. Actualizaciones de esta política">
            <p>
              Serubix puede actualizar esta Política de Cookies para reflejar cambios en los
              servicios o en la normativa aplicable. Cuando se produzcan cambios relevantes, se
              notificará mediante un aviso visible en la plataforma. La fecha de la última
              revisión figura en la parte superior de este documento.
            </p>
          </Section>

          <Section title="7. Contacto">
            <p>
              Para cualquier consulta sobre el uso de cookies o el tratamiento de datos puedes
              dirigirte a:{' '}
              <a
                href="mailto:hola@serubix.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                hola@serubix.com
              </a>
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
      <div className="text-zinc-400 leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

function CookieRow({
  name,
  type,
  purpose,
  duration,
}: Readonly<{ name: string; type: string; purpose: string; duration: string }>) {
  return (
    <tr className="bg-zinc-950">
      <td className="px-4 py-3 font-mono text-xs text-blue-400 whitespace-nowrap">{name}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{type}</td>
      <td className="px-4 py-3 text-zinc-400">{purpose}</td>
      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{duration}</td>
    </tr>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}
