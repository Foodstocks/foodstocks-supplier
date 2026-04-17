import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getAdminOverviewData } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await getAdminOverviewData()
  return NextResponse.json(data)
}
