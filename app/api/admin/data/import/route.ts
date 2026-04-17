import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recalculateAllProductStatus } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/data/import
 * Accepts multipart/form-data with a CSV file.
 * Expected CSV format (exported from Shopee Seller Center):
 *   product_sku,sale_date,channel,units_sold,gross_revenue
 *   RFT-BAL-85,2026-04-17,SHOPEE,45,832500
 */
export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file     = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const text  = await file.text()
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV kosong atau format salah' }, { status: 400 })
    }

    // Parse header
    const header = lines[0].toLowerCase().split(',').map((h) => h.trim())
    const idx = {
      sku:     header.indexOf('product_sku'),
      date:    header.indexOf('sale_date'),
      channel: header.indexOf('channel'),
      units:   header.indexOf('units_sold'),
      revenue: header.indexOf('gross_revenue'),
    }
    if (Object.values(idx).some((i) => i === -1)) {
      return NextResponse.json({
        error: 'Format CSV tidak valid. Kolom yang dibutuhkan: product_sku, sale_date, channel, units_sold, gross_revenue',
      }, { status: 400 })
    }

    // Load all product SKUs → IDs
    const products = await prisma.product.findMany({ select: { id: true, sku: true } })
    const skuMap   = Object.fromEntries(products.map((p) => [p.sku.toUpperCase(), p.id]))

    let inserted = 0
    let skipped  = 0

    const validChannels = new Set(['SHOPEE','TIKTOK','WEBSITE','LIVE_SHOPEE','LIVE_TIKTOK','RESELLER'])

    for (const line of lines.slice(1)) {
      const cols    = line.split(',').map((c) => c.trim())
      const sku     = cols[idx.sku]?.toUpperCase()
      const dateStr = cols[idx.date]
      const channel = cols[idx.channel]?.toUpperCase()
      const units   = parseInt(cols[idx.units] ?? '0', 10)
      const revenue = parseFloat(cols[idx.revenue] ?? '0')

      const productId = skuMap[sku]
      if (!productId || !dateStr || !validChannels.has(channel) || isNaN(units) || isNaN(revenue)) {
        skipped++
        continue
      }

      try {
        await prisma.dailySale.upsert({
          where:  { productId_saleDate_channel: { productId, saleDate: new Date(dateStr), channel: channel as any } },
          create: { productId, saleDate: new Date(dateStr), channel: channel as any, unitsSold: units, grossRevenue: revenue },
          update: { unitsSold: units, grossRevenue: revenue },
        })
        inserted++
      } catch {
        skipped++
      }
    }

    // Recalculate product status after import
    const { updated } = await recalculateAllProductStatus()

    return NextResponse.json({ ok: true, inserted, skipped, statusUpdated: updated })
  } catch (err) {
    console.error('[/api/admin/data/import]', err)
    return NextResponse.json({ error: 'Import gagal' }, { status: 500 })
  }
}
