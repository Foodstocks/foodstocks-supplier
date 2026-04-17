import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Placeholder for scheduled product status recalculation
  // With real DB: would recalculate fast_move/slow_move status for all products
  return NextResponse.json({ ok: true, message: 'Status recalculation skipped (mock data mode)' })
}
