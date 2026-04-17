import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getProductById, getProductSalesTrend, getReviewsByProduct } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const product = await getProductById(params.id, user.supplierId)
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 })

  const [trend30, reviews] = await Promise.all([
    getProductSalesTrend(params.id, 30),
    getReviewsByProduct(params.id),
  ])

  return NextResponse.json({ product, trend30, reviews })
}
