import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import Navbar from '@/components/layout/navbar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) return redirect('/login')
  if (user.role !== 'admin') return redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 px-5 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
