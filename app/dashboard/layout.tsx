import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import Sidebar from '@/components/layout/sidebar'
import Topbar from '@/components/layout/topbar'
import { NOTIFICATIONS } from '@/lib/mock-data'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'supplier') redirect('/admin')

  const unreadCount = NOTIFICATIONS.filter(
    (n) => n.supplierId === user.supplierId && !n.isRead
  ).length

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} title="" unreadCount={unreadCount} />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
