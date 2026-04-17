import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { NOTIFICATIONS } from '@/lib/mock-data'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const notifications = NOTIFICATIONS
    .filter((n) => n.supplierId === user.supplierId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json({ notifications })
}
