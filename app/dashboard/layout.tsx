import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'
import { getUnreadNotificationCount } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'supplier') redirect('/admin')

  const unreadCount = await getUnreadNotificationCount(user.supplierId!)

  return (
    <div className="flex min-h-screen bg-[#F4F5F8]">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} unreadCount={unreadCount} />
        <main className="flex-1 p-5 lg:p-7 pb-24 lg:pb-7 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
