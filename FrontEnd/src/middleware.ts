import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/herramientas', '/perfil', '/plan']
const AUTH_ONLY = ['/login', '/register']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p))

  if (!isLoggedIn && isProtected) {
    const url = new URL('/login', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && isAuthOnly) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico).*)'],
}
