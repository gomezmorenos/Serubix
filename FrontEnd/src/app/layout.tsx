import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Automatización e Inteligencia Artificial para Empresas | Serubix',
  description:
    'Plataforma especializada en automatización de procesos, asistentes IA e integración de herramientas para mejorar productividad y captación de clientes.',
  keywords: [
    'automatización',
    'inteligencia artificial',
    'procesos empresariales',
    'chatbot',
    'CRM',
    'leads',
    'productividad',
  ],
  authors: [{ name: 'Serubix' }],
  openGraph: {
    title: 'Automatización e Inteligencia Artificial para Empresas',
    description:
      'Plataforma especializada en automatización de procesos, asistentes IA e integración de herramientas.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Serubix',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automatización e Inteligencia Artificial para Empresas',
    description:
      'Plataforma especializada en automatización de procesos, asistentes IA e integración de herramientas.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
