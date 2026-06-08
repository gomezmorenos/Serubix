import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
