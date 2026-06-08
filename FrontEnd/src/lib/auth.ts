import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig, DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}

const config: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password || password.length < 6) return null

        // TODO: validate against backend API when ready
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // })
        // if (!res.ok) return null
        // return res.json()

        return {
          id: 'dev-' + Buffer.from(email).toString('base64').slice(0, 8),
          email,
          name: email.split('@')[0],
          image: null,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
