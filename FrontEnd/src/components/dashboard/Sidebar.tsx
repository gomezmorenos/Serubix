'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface SidebarUser {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface SidebarProps {
  user: SidebarUser
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { href: '/herramientas', label: 'Herramientas', icon: <ToolsIcon /> },
  { href: '/perfil', label: 'Perfil', icon: <UserIcon /> },
  { href: '/plan', label: 'Plan', icon: <CreditCardIcon /> },
]

export function Sidebar({ user }: Readonly<SidebarProps>) {
  const pathname = usePathname()
  const initials = (user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()
  const displayName = user.name ?? user.email?.split('@')[0] ?? 'Usuario'

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          Serubix
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Navegación del área de cliente">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{displayName}</p>
            <p className="text-zinc-400 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2.5 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-sm transition-colors"
        >
          <LogoutIcon />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function ToolsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
