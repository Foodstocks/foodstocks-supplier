import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import Navbar from '@/components/layout/navbar'
import { NOTIFICATIONS } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) redirect('/login')
  if (user.role !== 'supplier') redirect('/admin')

  const unreadCount = NOTIFICATIONS.filter(
    (n) => n.supplierId === user.supplierId && !n.isRead
  ).length

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex flex-col">
      <Navbar user={user} unreadCount={unreadCount} />
      <main className="flex-1 px-5 lg:px-8 py-6 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
