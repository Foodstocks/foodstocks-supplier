import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getNotifications } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const notifications = await getNotifications(user.supplierId)
  return NextResponse.json({ notifications })
}

// PATCH /api/supplier/notifications — mark as read
export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, markAll } = await request.json()

  if (markAll) {
    await prisma.notification.updateMany({
      where: { supplierId: user.supplierId, isRead: false },
      data:  { isRead: true },
    })
    return NextResponse.json({ ok: true })
  }

  if (id) {
    await prisma.notification.updateMany({
      where: { id, supplierId: user.supplierId },
      data:  { isRead: true },
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'id or markAll required' }, { status: 400 })
}
