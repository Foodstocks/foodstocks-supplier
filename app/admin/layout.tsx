import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) return redirect('/login')
  if (user.role !== 'admin') return redirect('/dashboard')

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} title="Admin" />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
