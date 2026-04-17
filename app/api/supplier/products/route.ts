import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const products = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  return NextResponse.json({ products })
}
