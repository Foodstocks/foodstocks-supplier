import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const all      = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  const eligible = all.filter((p) => p.status === 'fast_move' || (p.status === 'normal' && p.unitsLast30d >= 50))
  return NextResponse.json({ products: eligible })
}
