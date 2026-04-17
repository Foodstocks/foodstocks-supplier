import { NextRequest, NextResponse } from 'next/server'
import { recalculateAllProductStatus } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Secured with CRON_SECRET env var (set in Vercel → Environment Variables)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { updated } = await recalculateAllProductStatus()
    return NextResponse.json({ ok: true, updated, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[cron/recalculate-status]', err)
    return NextResponse.json({ error: 'Recalculation failed' }, { status: 500 })
  }
}
