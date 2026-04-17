import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { ADS_REQUESTS, SUPPLIERS, PRODUCTS, getProductWithStatus } from '@/lib/mock-data'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const requests = ADS_REQUESTS.map((r) => ({
    ...r,
    supplier: SUPPLIERS.find((s) => s.id === r.supplierId),
    product:  PRODUCTS.find((p) => p.id === r.productId) ? getProductWithStatus(PRODUCTS.find((p) => p.id === r.productId)!) : undefined,
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json({ requests })
}

export async function PATCH(request: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, status, rejectionReason } = await request.json()
  const req = ADS_REQUESTS.find((r) => r.id === id)
  if (!req) return NextResponse.json({ error: 'Request tidak ditemukan' }, { status: 404 })
  req.status = status
  if (rejectionReason) req.rejectionReason = rejectionReason
  req.updatedAt = new Date().toISOString()
  return NextResponse.json({ request: req })
}
