import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'supplier' || !user.supplierId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const products = await getProductsBySupplier(user.supplierId)
  return NextResponse.json({ products })
}
