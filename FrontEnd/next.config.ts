import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    // En producción (Docker), AUTH_API_URL apunta al servicio interno del backend.
    // En local dev, el browser llama al backend directamente (NEXT_PUBLIC_API_URL=http://localhost:4000),
    // por lo que estos rewrites solo se activan en producción.
    const backendUrl = process.env.AUTH_API_URL ?? 'http://backend:4000'
    return [
      {
        source: '/backend/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
