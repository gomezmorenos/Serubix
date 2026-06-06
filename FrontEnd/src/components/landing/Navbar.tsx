'use client'

import { useState, useEffect } from 'react'
import type { NavItem } from '@/features/landing/landing.types'

interface NavbarProps {
  brand: string
  items: NavItem[]
  cta: string
}

export function Navbar({ brand, items, cta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        <a
          href="#"
          className="text-white font-bold text-xl tracking-tight hover:text-blue-400 transition-colors"
          aria-label={`${brand} — Inicio`}
        >
          {brand}
        </a>

        <ul className="hidden md:flex items-center gap-8" role="list">
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          {cta}
        </a>
      </nav>
    </header>
  )
}
