import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAllAdsRequests } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requests = await getAllAdsRequests()
  return NextResponse.json({ requests })
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status, rejectionReason } = await request.json()
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }

  const statusEnum = (status as string).toUpperCase() as
    'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'

  const updated = await prisma.adsRequest.update({
    where: { id },
    data: {
      status:          statusEnum,
      rejectionReason: rejectionReason ?? null,
      reviewedAt:      new Date(),
    },
  })

  return NextResponse.json({
    request: {
      ...updated,
      packageTier: updated.packageTier.toLowerCase(),
      status:      updated.status.toLowerCase(),
      createdAt:   updated.createdAt.toISOString(),
      updatedAt:   updated.updatedAt.toISOString(),
    },
  })
}
