import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { ADS_REQUESTS, PRODUCTS, getProductWithStatus } from '@/lib/mock-data'
import type { AdsRequest } from '@/lib/types'
import { format } from 'date-fns'

// In-memory store for new requests during session
const sessionRequests: AdsRequest[] = []

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const all = [...ADS_REQUESTS, ...sessionRequests]
    .filter((r) => r.supplierId === user.supplierId)
    .map((r) => {
      const product = PRODUCTS.find((p) => p.id === r.productId)
      return { ...r, product: product ? getProductWithStatus(product) : undefined }
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return NextResponse.json({ requests: all })
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
  const product = PRODUCTS.find((p) => p.id === productId && p.supplierId === user.supplierId)
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  const now = new Date().toISOString()
  const newRequest: AdsRequest = {
    id:             `ar-${Date.now()}`,
    supplierId:     user.supplierId,
    productId,
    packageTier,
    notes,
    preferredStart,
    status:         'pending',
    createdAt:      now,
    updatedAt:      now,
  }
  sessionRequests.push(newRequest)
  return NextResponse.json({ request: newRequest }, { status: 201 })
}
