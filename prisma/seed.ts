/**
 * prisma/seed.ts
 * Seeds the database with all demo data from lib/mock-data.ts.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { subDays, format } from 'date-fns'

const prisma = new PrismaClient()

// ─── Channel / Status enum helpers ────────────────────────────────────────

type PrismaChannel = 'SHOPEE' | 'TIKTOK' | 'WEBSITE' | 'LIVE_SHOPEE' | 'LIVE_TIKTOK' | 'RESELLER'
type PrismaStatus  = 'FAST_MOVE' | 'NORMAL' | 'SLOW_MOVE'

function toChannel(c: string): PrismaChannel {
  return c.toUpperCase() as PrismaChannel
}

// ─── Deterministic RNG (mirrors mock-data.ts) ──────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function calculateStatus(units7d: number, wowGrowth: number, percentileRank: number): PrismaStatus {
  if (units7d > 100 || percentileRank >= 80 || wowGrowth > 30) return 'FAST_MOVE'
  if (units7d < 20  || wowGrowth < -20) return 'SLOW_MOVE'
  return 'NORMAL'
}

// ─── Main seed ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...')

  // ── 0. Clear existing data (reverse FK order) ──────────────────────────
  await prisma.notification.deleteMany()
  await prisma.adsCampaign.deleteMany()
  await prisma.adsRequest.deleteMany()
  await prisma.productStatusCache.deleteMany()
  await prisma.review.deleteMany()
  await prisma.dailySale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()
  console.log('✓ Cleared existing data')

  // ── 1. Users + Suppliers ───────────────────────────────────────────────
  const hashedPw = await bcrypt.hash('demo123', 10)

  const usersData = [
    { id: 'u1', email: 'supplier@demo.com',  name: 'Dian Rahayu',   role: 'SUPPLIER' as const, supplierId: 's1' },
    { id: 'u2', email: 'supplier2@demo.com', name: 'Budi Santoso',  role: 'SUPPLIER' as const, supplierId: 's2' },
    { id: 'u3', email: 'supplier3@demo.com', name: 'Shanty Garut',  role: 'SUPPLIER' as const, supplierId: 's3' },
    { id: 'u4', email: 'supplier4@demo.com', name: 'Ayu Pratiwi',   role: 'SUPPLIER' as const, supplierId: 's4' },
    { id: 'u5', email: 'supplier5@demo.com', name: 'Rizal Hakim',   role: 'SUPPLIER' as const, supplierId: 's5' },
    { id: 'u6', email: 'admin@demo.com',     name: 'Rizky Pratama', role: 'ADMIN'    as const, supplierId: null },
  ]

  for (const u of usersData) {
    await prisma.user.create({
      data: { id: u.id, email: u.email, password: hashedPw, role: u.role, name: u.name },
    })
  }
  console.log('✓ Users created')

  const suppliersData = [
    { id: 's1', userId: 'u1', brandName: 'Raftels',           city: 'Jakarta',    contactName: 'Dian Rahayu',  contactPhone: '0812-1111-2222', contactWa: '6281211112222', tier: 'MEDIUM' as const, description: 'Fish skin snack premium khas Indonesia', joinedAt: new Date('2024-10-01') },
    { id: 's2', userId: 'u2', brandName: 'Baso Aci Bestie',   city: 'Bandung',    contactName: 'Budi Santoso', contactPhone: '0813-2222-3333', contactWa: '6281322223333', tier: 'MEDIUM' as const, description: 'Baso aci instan terenak se-Indonesia',    joinedAt: new Date('2024-08-15') },
    { id: 's3', userId: 'u3', brandName: 'Baso Aci Shanty',   city: 'Garut',      contactName: 'Shanty',       contactPhone: '0814-3333-4444', contactWa: '6281433334444', tier: 'SMALL'  as const, description: 'Baso aci khas Garut asli',                joinedAt: new Date('2025-01-10') },
    { id: 's4', userId: 'u4', brandName: 'Keripik MeTime',    city: 'Surabaya',   contactName: 'Ayu Pratiwi',  contactPhone: '0815-4444-5555', contactWa: '6281544445555', tier: 'SMALL'  as const, description: 'Keripik homemade untuk me time quality',  joinedAt: new Date('2025-02-20') },
    { id: 's5', userId: 'u5', brandName: 'Deep Talk Snack',   city: 'Yogyakarta', contactName: 'Rizal Hakim',  contactPhone: '0816-5555-6666', contactWa: '6281655556666', tier: 'SMALL'  as const, description: 'Snack untuk sesi ngobrol seru',           joinedAt: new Date('2025-03-05') },
  ]

  for (const s of suppliersData) {
    await prisma.supplier.create({ data: s })
  }
  console.log('✓ Suppliers created')

  // ── 2. Products ────────────────────────────────────────────────────────
  const productsData = [
    // Raftels (s1)
    { id: 'p1',  supplierId: 's1', sku: 'RFT-BAL-85',  name: 'Raftels Balado 85g',        category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 214, stockThreshold: 50, listedAt: new Date('2024-10-05') },
    { id: 'p2',  supplierId: 's1', sku: 'RFT-ORI-85',  name: 'Raftels Original 85g',      category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 89,  stockThreshold: 50, listedAt: new Date('2024-10-05') },
    { id: 'p3',  supplierId: 's1', sku: 'RFT-KEJ-50',  name: 'Raftels Keju 50g',          category: 'Fish Skin', priceSupplier:  8000, priceSell: 13000, weightGram: 50,  currentStock: 456, stockThreshold: 60, listedAt: new Date('2024-11-01') },
    { id: 'p4',  supplierId: 's1', sku: 'RFT-PED-100', name: 'Raftels Pedas 100g',        category: 'Fish Skin', priceSupplier: 14000, priceSell: 21000, weightGram: 100, currentStock: 12,  stockThreshold: 30, listedAt: new Date('2024-11-15') },
    { id: 'p5',  supplierId: 's1', sku: 'RFT-BBQ-85',  name: 'Raftels BBQ 85g',           category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 330, stockThreshold: 50, listedAt: new Date('2025-01-20') },
    { id: 'p6',  supplierId: 's1', sku: 'RFT-ASM-85',  name: 'Raftels Asam Manis 85g',    category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 175, stockThreshold: 50, listedAt: new Date('2025-02-01') },
    { id: 'p7',  supplierId: 's1', sku: 'RFT-BND-200', name: 'Raftels Bundle 3-Pack',     category: 'Bundle',    priceSupplier: 32000, priceSell: 49000, weightGram: 255, currentStock: 98,  stockThreshold: 25, listedAt: new Date('2025-02-15') },
    { id: 'p8',  supplierId: 's1', sku: 'RFT-SPC-85',  name: 'Raftels Sapi Panggang 85g', category: 'Fish Skin', priceSupplier: 13000, priceSell: 20000, weightGram: 85,  currentStock: 42,  stockThreshold: 30, listedAt: new Date('2025-03-01') },
    // Baso Aci Bestie (s2)
    { id: 'p9',  supplierId: 's2', sku: 'BAB-ORI-5',   name: 'Baso Aci Bestie Original 5pcs', category: 'Baso Aci', priceSupplier:  9000, priceSell: 14000, weightGram: 100, currentStock: 385, stockThreshold: 80, listedAt: new Date('2024-08-20') },
    { id: 'p10', supplierId: 's2', sku: 'BAB-PED-5',   name: 'Baso Aci Bestie Pedas 5pcs',    category: 'Baso Aci', priceSupplier:  9500, priceSell: 14500, weightGram: 100, currentStock: 210, stockThreshold: 80, listedAt: new Date('2024-08-20') },
    { id: 'p11', supplierId: 's2', sku: 'BAB-BND-10',  name: 'Baso Aci Bestie Bundle 10pcs',  category: 'Bundle',   priceSupplier: 17000, priceSell: 26000, weightGram: 200, currentStock: 150, stockThreshold: 40, listedAt: new Date('2024-09-01') },
    { id: 'p12', supplierId: 's2', sku: 'BAB-KJU-5',   name: 'Baso Aci Bestie Keju 5pcs',     category: 'Baso Aci', priceSupplier: 10000, priceSell: 15500, weightGram: 110, currentStock: 28,  stockThreshold: 40, listedAt: new Date('2025-01-05') },
    // Baso Aci Shanty (s3)
    { id: 'p13', supplierId: 's3', sku: 'BAS-GAR-5',   name: 'Baso Aci Shanty Garut 5pcs',  category: 'Baso Aci', priceSupplier: 10000, priceSell: 15000, weightGram: 120, currentStock: 120, stockThreshold: 50, listedAt: new Date('2025-01-15') },
    { id: 'p14', supplierId: 's3', sku: 'BAS-GAR-10',  name: 'Baso Aci Shanty Garut 10pcs', category: 'Baso Aci', priceSupplier: 18500, priceSell: 27000, weightGram: 240, currentStock: 75,  stockThreshold: 30, listedAt: new Date('2025-01-15') },
    { id: 'p15', supplierId: 's3', sku: 'BAS-PED-5',   name: 'Baso Aci Shanty Pedas 5pcs',  category: 'Baso Aci', priceSupplier: 10500, priceSell: 15500, weightGram: 120, currentStock: 45,  stockThreshold: 30, listedAt: new Date('2025-02-10') },
    // Keripik MeTime (s4)
    { id: 'p16', supplierId: 's4', sku: 'KMT-ORI-80',  name: 'Keripik MeTime Original 80g',  category: 'Keripik', priceSupplier:  8500, priceSell: 13000, weightGram: 80, currentStock: 200, stockThreshold: 50, listedAt: new Date('2025-02-25') },
    { id: 'p17', supplierId: 's4', sku: 'KMT-PED-80',  name: 'Keripik MeTime Pedas 80g',     category: 'Keripik', priceSupplier:  9000, priceSell: 13500, weightGram: 80, currentStock: 88,  stockThreshold: 40, listedAt: new Date('2025-02-25') },
    { id: 'p18', supplierId: 's4', sku: 'KMT-BBQ-80',  name: 'Keripik MeTime BBQ 80g',       category: 'Keripik', priceSupplier:  9000, priceSell: 13500, weightGram: 80, currentStock: 15,  stockThreshold: 30, listedAt: new Date('2025-03-10') },
    // Deep Talk (s5)
    { id: 'p19', supplierId: 's5', sku: 'DTS-MIX-100', name: 'Deep Talk Mix Snack 100g', category: 'Mix Snack', priceSupplier: 11000, priceSell: 17000, weightGram: 100, currentStock: 95,  stockThreshold: 40, listedAt: new Date('2025-03-10') },
    { id: 'p20', supplierId: 's5', sku: 'DTS-PED-100', name: 'Deep Talk Pedas 100g',     category: 'Mix Snack', priceSupplier: 11500, priceSell: 17500, weightGram: 100, currentStock: 52,  stockThreshold: 30, listedAt: new Date('2025-03-10') },
    { id: 'p21', supplierId: 's5', sku: 'DTS-SWT-100', name: 'Deep Talk Sweet 100g',     category: 'Mix Snack', priceSupplier: 11000, priceSell: 17000, weightGram: 100, currentStock: 30,  stockThreshold: 30, listedAt: new Date('2025-03-15') },
    { id: 'p22', supplierId: 's5', sku: 'DTS-BND-3',   name: 'Deep Talk Bundle 3-Pack',  category: 'Bundle',    priceSupplier: 30000, priceSell: 45000, weightGram: 300, currentStock: 18,  stockThreshold: 15, listedAt: new Date('2025-03-20') },
  ]

  for (const p of productsData) {
    await prisma.product.create({ data: p })
  }
  console.log('✓ Products created')

  // ── 3. Daily sales ─────────────────────────────────────────────────────

  const PRODUCT_VOLUMES: Record<string, { base: number; trend: 'up' | 'stable' | 'down'; channels: Record<string, number> }> = {
    p1:  { base: 320, trend: 'up',     channels: { SHOPEE: 0.68, TIKTOK: 0.22, RESELLER: 0.10 } },
    p2:  { base: 230, trend: 'up',     channels: { SHOPEE: 0.60, TIKTOK: 0.25, RESELLER: 0.15 } },
    p3:  { base:  88, trend: 'stable', channels: { SHOPEE: 0.70, TIKTOK: 0.20, RESELLER: 0.10 } },
    p4:  { base:  12, trend: 'down',   channels: { SHOPEE: 0.80, TIKTOK: 0.20 } },
    p5:  { base: 150, trend: 'up',     channels: { SHOPEE: 0.65, TIKTOK: 0.25, RESELLER: 0.10 } },
    p6:  { base:  65, trend: 'stable', channels: { SHOPEE: 0.72, TIKTOK: 0.18, RESELLER: 0.10 } },
    p7:  { base:  55, trend: 'stable', channels: { SHOPEE: 0.65, TIKTOK: 0.20, RESELLER: 0.15 } },
    p8:  { base:  28, trend: 'stable', channels: { SHOPEE: 0.75, TIKTOK: 0.25 } },
    p9:  { base: 275, trend: 'up',     channels: { SHOPEE: 0.55, TIKTOK: 0.30, RESELLER: 0.15 } },
    p10: { base: 180, trend: 'stable', channels: { SHOPEE: 0.60, TIKTOK: 0.28, RESELLER: 0.12 } },
    p11: { base: 110, trend: 'stable', channels: { SHOPEE: 0.62, TIKTOK: 0.25, RESELLER: 0.13 } },
    p12: { base:  18, trend: 'down',   channels: { SHOPEE: 0.80, TIKTOK: 0.20 } },
    p13: { base:  95, trend: 'up',     channels: { SHOPEE: 0.65, TIKTOK: 0.25, RESELLER: 0.10 } },
    p14: { base:  60, trend: 'stable', channels: { SHOPEE: 0.70, TIKTOK: 0.20, RESELLER: 0.10 } },
    p15: { base:  30, trend: 'stable', channels: { SHOPEE: 0.75, TIKTOK: 0.25 } },
    p16: { base:  70, trend: 'stable', channels: { SHOPEE: 0.70, TIKTOK: 0.20, RESELLER: 0.10 } },
    p17: { base:  45, trend: 'stable', channels: { SHOPEE: 0.72, TIKTOK: 0.18, RESELLER: 0.10 } },
    p18: { base:  10, trend: 'down',   channels: { SHOPEE: 0.80, TIKTOK: 0.20 } },
    p19: { base:  55, trend: 'stable', channels: { SHOPEE: 0.68, TIKTOK: 0.22, RESELLER: 0.10 } },
    p20: { base:  35, trend: 'stable', channels: { SHOPEE: 0.70, TIKTOK: 0.20, RESELLER: 0.10 } },
    p21: { base:  20, trend: 'down',   channels: { SHOPEE: 0.78, TIKTOK: 0.22 } },
    p22: { base:  22, trend: 'stable', channels: { SHOPEE: 0.65, TIKTOK: 0.25, RESELLER: 0.10 } },
  }

  const salesBatch: Array<{
    productId: string; saleDate: Date; channel: PrismaChannel
    unitsSold: number; grossRevenue: number
  }> = []

  for (const p of productsData) {
    const vol = PRODUCT_VOLUMES[p.id]
    if (!vol) continue
    const rng       = seededRandom(parseInt(p.id.replace(/\D/g, ''), 10) * 13)
    const baseDaily = vol.base / 7

    for (let daysAgo = 59; daysAgo >= 0; daysAgo--) {
      const date             = subDays(new Date(), daysAgo)
      const trendMultiplier  = vol.trend === 'up'
        ? 1 + (59 - daysAgo) / 59 * 0.45
        : vol.trend === 'down'
        ? 1 - (59 - daysAgo) / 59 * 0.35
        : 1

      for (const [channel, share] of Object.entries(vol.channels)) {
        const noise = 0.7 + rng() * 0.6
        const units = Math.max(0, Math.round(baseDaily * share * trendMultiplier * noise))
        if (units === 0) continue
        salesBatch.push({
          productId:    p.id,
          saleDate:     date,
          channel:      channel as PrismaChannel,
          unitsSold:    units,
          grossRevenue: units * (p.priceSell ?? p.priceSupplier * 1.5),
        })
      }
    }
  }

  // Batch insert in chunks of 500
  const CHUNK = 500
  for (let i = 0; i < salesBatch.length; i += CHUNK) {
    await prisma.dailySale.createMany({ data: salesBatch.slice(i, i + CHUNK) })
  }
  console.log(`✓ Daily sales created (${salesBatch.length} records)`)

  // ── 4. Reviews ────────────────────────────────────────────────────────
  const REVIEW_TEXTS = [
    'Enak banget! Pesan lagi deh~',
    'Suka banget rasanya, kriuk dan gurih',
    'Packaging rapih, produk sampai dalam kondisi baik',
    'Pedas nya pas banget di lidah saya',
    'Cocok buat nonton drakor',
    'Udah jadi camilan favorit keluarga',
    'Worth it banget harganya',
    'Lumayan, tapi kurang pedas untuk selera saya',
    'Beli lagi dan lagi, ketagihan!',
    'Rasa original paling enak menurut saya',
  ]
  const REVIEWERS  = ['Rina','Budi','Sari','Dedi','Ana','Tono','Yuli','Hendra','Dewi','Eko']
  const R_CHANNELS: PrismaChannel[] = ['SHOPEE','TIKTOK','WEBSITE']

  const ratingDist: Record<string, number[]> = {
    p1:[5,5,5,5,4,5,5,4,5,5,5,4,5,3,5], p2:[5,5,4,5,4,4,5,5,4,5,4,5],
    p3:[4,4,5,4,4,3,5,4,4,5],            p4:[3,4,3,2,4,3,5,3,2,4],
    p5:[5,5,4,5,5,4,5],                  p6:[4,4,5,4,4,5],
    p7:[5,5,4,5,4],                      p8:[4,4,3,4,5,4],
    p9:[5,5,5,4,5,5,5,4,5],              p10:[5,4,5,5,4,5,4],
    p11:[5,5,4,5,4,5],                   p12:[3,4,3,4,3],
    p13:[5,5,4,5,4,5],                   p14:[4,5,4,4,5],
    p15:[4,4,5,4],                       p16:[4,4,5,4,4],
    p17:[4,4,3,4,5],                     p18:[3,3,4,3],
    p19:[4,5,4,4,5],                     p20:[4,4,5,4],
    p21:[3,4,3,4],                       p22:[5,4,5,4],
  }
  const rng42 = seededRandom(42)

  const reviewBatch = productsData.flatMap((p) => {
    const ratings = ratingDist[p.id] || [4, 5, 4]
    return ratings.map((rating) => ({
      productId:    p.id,
      channel:      R_CHANNELS[Math.floor(rng42() * R_CHANNELS.length)],
      rating,
      reviewText:   REVIEW_TEXTS[Math.floor(rng42() * REVIEW_TEXTS.length)],
      reviewerName: REVIEWERS[Math.floor(rng42() * REVIEWERS.length)],
      reviewDate:   subDays(new Date(), Math.floor(rng42() * 30)),
    }))
  })
  await prisma.review.createMany({ data: reviewBatch })
  console.log(`✓ Reviews created (${reviewBatch.length} records)`)

  // ── 5. Compute + insert ProductStatusCache ────────────────────────────
  const thirtyDaysAgo  = subDays(new Date(), 30)
  const sevenDaysAgo   = subDays(new Date(), 7)
  const fourteenDaysAgo = subDays(new Date(), 14)

  const allSales   = await prisma.dailySale.findMany()
  const allReviews = await prisma.review.findMany()

  const productMetrics = productsData.map((p) => {
    const sales30  = allSales.filter((s) => s.productId === p.id && s.saleDate >= thirtyDaysAgo)
    const sales7   = allSales.filter((s) => s.productId === p.id && s.saleDate >= sevenDaysAgo)
    const prevWeek = allSales.filter((s) => s.productId === p.id && s.saleDate >= fourteenDaysAgo && s.saleDate < sevenDaysAgo)
    const pReviews = allReviews.filter((r) => r.productId === p.id)

    const units30  = sales30.reduce((sum, s) => sum + s.unitsSold, 0)
    const units7   = sales7.reduce((sum, s) => sum + s.unitsSold, 0)
    const gmv30    = sales30.reduce((sum, s) => sum + Number(s.grossRevenue), 0)
    const prev7    = prevWeek.reduce((sum, s) => sum + s.unitsSold, 0)
    const wow      = prev7 > 0 ? ((units7 - prev7) / prev7) * 100 : 0
    const avgRat   = pReviews.length > 0 ? pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length : 0

    return { productId: p.id, units30, units7, gmv30, wow, avgRat, reviewCount: pReviews.length }
  })

  const sorted30 = [...productMetrics].sort((a, b) => a.units30 - b.units30)
  for (const m of productMetrics) {
    const rank           = sorted30.findIndex((x) => x.units30 >= m.units30)
    const percentileRank = (rank / Math.max(1, sorted30.length)) * 100
    const status         = calculateStatus(m.units7, m.wow, percentileRank)
    await prisma.productStatusCache.create({
      data: {
        productId:       m.productId,
        status,
        unitsLast7d:     m.units7,
        unitsLast30d:    m.units30,
        gmvLast30d:      m.gmv30,
        wowGrowth:       m.wow,
        percentileRank,
        avgRating:       Math.round(m.avgRat * 10) / 10,
        totalReviews:    m.reviewCount,
        lastCalculatedAt: new Date(),
      },
    })
  }
  console.log('✓ Product status cache computed and stored')

  // ── 6. Ads Requests ───────────────────────────────────────────────────
  const adsData = [
    { id: 'ar1', supplierId: 's1', productId: 'p1', packageTier: 'STARTER' as const, notes: 'Mau coba dulu paket starter',        status: 'APPROVED'  as const, preferredStart: subDays(new Date(), 5),  createdAt: subDays(new Date(), 6) },
    { id: 'ar2', supplierId: 's2', productId: 'p9', packageTier: 'BOOSTER' as const, notes: 'Produk lagi nge-trend, mau boost',   status: 'PENDING'   as const, preferredStart: subDays(new Date(), 2),  createdAt: subDays(new Date(), 3) },
    { id: 'ar3', supplierId: 's1', productId: 'p2', packageTier: 'STARTER' as const, notes: 'Produk original juga mau di-boost',  status: 'PENDING'   as const, preferredStart: subDays(new Date(), 1),  createdAt: subDays(new Date(), 2) },
    { id: 'ar4', supplierId: 's1', productId: 'p5', packageTier: 'BOOSTER' as const, notes: 'BBQ lagi naik, mau makin gasss!',    status: 'COMPLETED' as const, preferredStart: subDays(new Date(), 14), createdAt: subDays(new Date(), 20) },
    { id: 'ar5', supplierId: 's3', productId: 'p13',packageTier: 'STARTER' as const, notes: 'Perdana iklan di FoodStocks',        status: 'REVIEWING' as const, preferredStart: subDays(new Date(), 1),  createdAt: subDays(new Date(), 1) },
  ]
  for (const a of adsData) {
    await prisma.adsRequest.create({ data: a })
  }
  console.log('✓ Ads requests created')

  // ── 7. Notifications ──────────────────────────────────────────────────
  const notifData = [
    { supplierId: 's1', type: 'FAST_MOVE'    as const, title: 'Raftels Balado masuk Fast-Move!',          body: 'Produk Anda naik +45% week-over-week. Cek peluang iklan untuk boost lebih jauh.',      data: { productId: 'p1'  }, isRead: false, createdAt: subDays(new Date(), 0) },
    { supplierId: 's1', type: 'ADS_APPROVED' as const, title: 'Request iklan disetujui!',                  body: 'Starter Pack untuk Raftels Balado mulai besok. Siap-siap penjualan naik!',              data: { requestId: 'ar1' }, isRead: false, createdAt: subDays(new Date(), 0) },
    { supplierId: 's1', type: 'STOCK_LOW'    as const, title: 'Stok Raftels Original hampir habis',        body: 'Tersisa 89 unit. Estimasi habis dalam 4 hari. Segera hubungi FoodStocks untuk restock.', data: { productId: 'p2'  }, isRead: false, createdAt: subDays(new Date(), 1) },
    { supplierId: 's1', type: 'REVIEW_NEW'   as const, title: '3 ulasan baru untuk Raftels Keju',          body: 'Rating baru: 4.5/5.0 dari 3 pembeli terverifikasi.',                                    data: { productId: 'p3'  }, isRead: true,  createdAt: subDays(new Date(), 2) },
    { supplierId: 's1', type: 'FAST_MOVE'    as const, title: 'Raftels BBQ masuk Fast-Move!',              body: 'Raftels BBQ naik +28% minggu ini. Pertimbangkan iklan untuk momentum ini.',              data: { productId: 'p5'  }, isRead: true,  createdAt: subDays(new Date(), 3) },
    { supplierId: 's1', type: 'ADS_COMPLETED'as const, title: 'Campaign Raftels BBQ selesai',              body: 'Campaign Booster Pack selesai. Lihat laporan performa campaign Anda.',                    data: { requestId: 'ar4' }, isRead: true,  createdAt: subDays(new Date(), 7) },
    { supplierId: 's2', type: 'FAST_MOVE'    as const, title: 'Baso Aci Bestie Original Fast-Move!',       body: 'Penjualan naik signifikan minggu ini. Stok cukup untuk 2 minggu ke depan.',               data: { productId: 'p9'  }, isRead: false, createdAt: subDays(new Date(), 0) },
    { supplierId: 's2', type: 'STOCK_LOW'    as const, title: 'Stok Baso Aci Bestie Keju menipis',         body: 'Tersisa 28 unit. Estimasi habis dalam 5 hari.',                                          data: { productId: 'p12' }, isRead: false, createdAt: subDays(new Date(), 1) },
    { supplierId: 's3', type: 'FAST_MOVE'    as const, title: 'Baso Aci Shanty Garut Trending!',           body: 'Produk Anda mulai viral di TikTok. Ini saat tepat untuk iklan!',                         data: { productId: 'p13' }, isRead: false, createdAt: subDays(new Date(), 0) },
    { supplierId: 's4', type: 'SYSTEM'       as const, title: 'Selamat datang di FoodStocks Dashboard!',   body: 'Dashboard Anda sudah aktif. Mulai pantau performa produk Anda di sini.',                  data: {},                   isRead: true,  createdAt: subDays(new Date(), 5) },
  ]
  for (const n of notifData) {
    await prisma.notification.create({ data: n })
  }
  console.log('✓ Notifications created')

  console.log('\n✅ Seed complete!')
  console.log('   Demo accounts:')
  console.log('   supplier@demo.com  / demo123')
  console.log('   admin@demo.com     / demo123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
