import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const user = await getAuthUser()
  if (!user) return redirect('/login')
  return redirect(user.role === 'admin' ? '/admin' : '/dashboard')
}
