import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Acceder | Serubix',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="p-6">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          Serubix
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <footer className="p-6 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} Serubix. Todos los derechos reservados.
      </footer>
    </div>
  )
}
