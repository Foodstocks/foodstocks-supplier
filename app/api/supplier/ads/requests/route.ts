import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAdsRequestsBySupplier } from '@/lib/db'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requests = await getAdsRequestsBySupplier(user.supplierId)
  return NextResponse.json({ requests })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { productId, packageTier, notes, preferredStart } = body

  if (!productId || !packageTier) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  // Verify product belongs to this supplier
  const product = await prisma.product.findFirst({
    where: { id: productId, supplierId: user.supplierId },
  })
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  const tierEnum = (packageTier as string).toUpperCase() as 'STARTER' | 'BOOSTER' | 'PREMIUM'

  const newRequest = await prisma.adsRequest.create({
    data: {
      supplierId:    user.supplierId,
      productId,
      packageTier:   tierEnum,
      notes,
      preferredStart: preferredStart ? new Date(preferredStart) : undefined,
      status:        'PENDING',
    },
  })

  return NextResponse.json({
    request: {
      ...newRequest,
      packageTier:    newRequest.packageTier.toLowerCase(),
      status:         newRequest.status.toLowerCase(),
      createdAt:      newRequest.createdAt.toISOString(),
      updatedAt:      newRequest.updatedAt.toISOString(),
      preferredStart: newRequest.preferredStart ? format(newRequest.preferredStart, 'yyyy-MM-dd') : undefined,
    },
  }, { status: 201 })
}
