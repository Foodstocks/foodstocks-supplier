import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { PRODUCTS, getProductWithStatus, getProductSalesTrend, getReviewsData } from '@/lib/mock-data'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const product = PRODUCTS.find((p) => p.id === params.id && p.supplierId === user.supplierId)
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  const withStatus = getProductWithStatus(product)
  const trend30    = getProductSalesTrend(product.id, 30)
  const reviews    = getReviewsData().filter((r) => r.productId === product.id)

  return NextResponse.json({ product: withStatus, trend30, reviews })
}
