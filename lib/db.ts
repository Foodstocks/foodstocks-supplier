/**
 * lib/db.ts
 * Async database query functions (replaces lib/mock-data.ts).
 * All functions are drop-in async replacements for the mock equivalents.
 */

import { prisma } from './prisma'
import { subDays, format } from 'date-fns'
import { calculateProductStatus } from './utils'
import type {
  ProductWithStatus, ChannelBreakdown, Channel, ProductStatus,
  SalesTrendPoint, Supplier, Review, AdsRequest, Notification,
} from './types'

// ─── Enum conversions ──────────────────────────────────────────────────────

function toChannel(c: string): Channel {
  return c.toLowerCase() as Channel // SHOPEE → shopee, LIVE_SHOPEE → live_shopee
}

function toProductStatus(s: string): ProductStatus {
  return s.toLowerCase() as ProductStatus // FAST_MOVE → fast_move
}

function toNum(v: unknown): number {
  return Number(v)
}

// ─── Supplier helpers ──────────────────────────────────────────────────────

export async function getSupplierById(supplierId: string): Promise<Supplier | null> {
  const s = await prisma.supplier.findUnique({ where: { id: supplierId } })
  if (!s) return null
  return mapSupplier(s)
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  const rows = await prisma.supplier.findMany({ where: { isActive: true }, orderBy: { joinedAt: 'asc' } })
  return rows.map(mapSupplier)
}

function mapSupplier(s: {
  id: string; userId: string; brandName: string; logoUrl: string | null
  description: string | null; city: string | null; contactName: string | null
  contactPhone: string | null; contactWa: string | null; tier: string
  joinedAt: Date; isActive: boolean
}): Supplier {
  return {
    id:           s.id,
    userId:       s.userId,
    brandName:    s.brandName,
    logoUrl:      s.logoUrl ?? undefined,
    description:  s.description ?? undefined,
    city:         s.city ?? undefined,
    contactName:  s.contactName ?? undefined,
    contactPhone: s.contactPhone ?? undefined,
    contactWa:    s.contactWa ?? undefined,
    tier:         s.tier.toLowerCase() as Supplier['tier'],
    joinedAt:     format(s.joinedAt, "yyyy-MM-dd"),
    isActive:     s.isActive,
  }
}

// ─── Product helpers ───────────────────────────────────────────────────────

type PrismaProductFull = Awaited<ReturnType<typeof prisma.product.findMany<{
  include: {
    statusCache: true
    dailySales: true
    reviews: true
  }
}>>>[number]

function buildProductWithStatus(p: PrismaProductFull): ProductWithStatus {
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  const sevenDaysAgo  = format(subDays(new Date(), 7),  'yyyy-MM-dd')
  const fourteenDaysAgo = format(subDays(new Date(), 14), 'yyyy-MM-dd')

  const sales30   = p.dailySales.filter((s) => format(s.saleDate, 'yyyy-MM-dd') >= thirtyDaysAgo)
  const sales7    = p.dailySales.filter((s) => format(s.saleDate, 'yyyy-MM-dd') >= sevenDaysAgo)
  const prevWeek  = p.dailySales.filter((s) => {
    const d = format(s.saleDate, 'yyyy-MM-dd')
    return d >= fourteenDaysAgo && d < sevenDaysAgo
  })

  const unitsLast30d = p.statusCache?.unitsLast30d ?? sales30.reduce((sum, s) => sum + s.unitsSold, 0)
  const unitsLast7d  = p.statusCache?.unitsLast7d  ?? sales7.reduce((sum, s) => sum + s.unitsSold, 0)
  const gmvLast30d   = p.statusCache?.gmvLast30d != null
    ? toNum(p.statusCache.gmvLast30d)
    : sales30.reduce((sum, s) => sum + toNum(s.grossRevenue), 0)

  const prevUnits7d = prevWeek.reduce((sum, s) => sum + s.unitsSold, 0)
  const wowGrowth   = p.statusCache?.wowGrowth ?? (prevUnits7d > 0
    ? ((unitsLast7d - prevUnits7d) / prevUnits7d) * 100
    : 0)

  const momGrowth = p.statusCache?.momGrowth ?? 0

  // Reviews
  const avgRating   = p.statusCache?.avgRating ?? (p.reviews.length > 0
    ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
    : 0)
  const totalReviews = p.statusCache?.totalReviews ?? p.reviews.length

  // Status
  const percentileRank = p.statusCache?.percentileRank ?? 50
  const status: ProductStatus = p.statusCache
    ? toProductStatus(p.statusCache.status)
    : calculateProductStatus(unitsLast7d, wowGrowth, percentileRank)

  // Channel breakdown from sales30
  const channelMap: Record<string, { units: number; revenue: number }> = {}
  sales30.forEach((s) => {
    const ch = toChannel(s.channel)
    if (!channelMap[ch]) channelMap[ch] = { units: 0, revenue: 0 }
    channelMap[ch].units   += s.unitsSold
    channelMap[ch].revenue += toNum(s.grossRevenue)
  })
  const channelBreakdown: ChannelBreakdown[] = Object.entries(channelMap).map(([ch, v]) => ({
    channel:    ch as Channel,
    units:      v.units,
    revenue:    v.revenue,
    percentage: unitsLast30d > 0 ? Math.round((v.units / unitsLast30d) * 100) : 0,
  })).sort((a, b) => b.units - a.units)

  return {
    id:             p.id,
    supplierId:     p.supplierId,
    sku:            p.sku,
    name:           p.name,
    description:    p.description ?? undefined,
    imageUrl:       p.imageUrl ?? undefined,
    category:       p.category ?? undefined,
    priceSupplier:  toNum(p.priceSupplier),
    priceSell:      p.priceSell != null ? toNum(p.priceSell) : undefined,
    weightGram:     p.weightGram ?? undefined,
    currentStock:   p.currentStock,
    stockThreshold: p.stockThreshold,
    isActive:       p.isActive,
    listedAt:       format(p.listedAt, 'yyyy-MM-dd'),
    status,
    unitsLast7d,
    unitsLast30d,
    gmvLast30d,
    wowGrowth,
    momGrowth,
    avgRating:      Math.round(avgRating * 10) / 10,
    totalReviews,
    channelBreakdown,
  }
}

export async function getProductsBySupplier(supplierId: string): Promise<ProductWithStatus[]> {
  const products = await prisma.product.findMany({
    where:   { supplierId, isActive: true },
    include: { statusCache: true, dailySales: true, reviews: true },
    orderBy: { listedAt: 'asc' },
  })
  return products.map(buildProductWithStatus)
}

export async function getProductById(productId: string, supplierId?: string): Promise<ProductWithStatus | null> {
  const where = supplierId ? { id: productId, supplierId } : { id: productId }
  const p = await prisma.product.findFirst({
    where,
    include: { statusCache: true, dailySales: true, reviews: true },
  })
  if (!p) return null
  return buildProductWithStatus(p)
}

export async function getProductSalesTrend(productId: string, days = 30): Promise<SalesTrendPoint[]> {
  const today = new Date()
  const since = subDays(today, days)
  const sales = await prisma.dailySale.findMany({
    where:   { productId, saleDate: { gte: since } },
    orderBy: { saleDate: 'asc' },
  })

  const points: SalesTrendPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date     = format(subDays(today, i), 'yyyy-MM-dd')
    const daySales = sales.filter((s) => format(s.saleDate, 'yyyy-MM-dd') === date)
    points.push({
      date,
      units:   daySales.reduce((s, r) => s + r.unitsSold, 0),
      revenue: daySales.reduce((s, r) => s + toNum(r.grossRevenue), 0),
    })
  }
  return points
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where:   { productId },
    orderBy: { reviewDate: 'desc' },
  })
  return rows.map((r) => ({
    id:           r.id,
    productId:    r.productId,
    channel:      toChannel(r.channel),
    rating:       r.rating,
    reviewText:   r.reviewText ?? undefined,
    reviewerName: r.reviewerName ?? undefined,
    reviewDate:   format(r.reviewDate, 'yyyy-MM-dd'),
  }))
}

// ─── Supplier overview (for dashboard page) ────────────────────────────────

export async function getSupplierOverviewData(supplierId: string) {
  const products = await getProductsBySupplier(supplierId)

  const thisMonth    = products.reduce((s, p) => s + p.unitsLast30d, 0)
  const thisMonthGmv = products.reduce((s, p) => s + p.gmvLast30d,   0)

  // Previous month (days 30–60)
  const since30 = subDays(new Date(), 30)
  const since60 = subDays(new Date(), 60)
  const prevSales = await prisma.dailySale.findMany({
    where: {
      product:  { supplierId },
      saleDate: { gte: since60, lt: since30 },
    },
  })
  const prevMonth    = prevSales.reduce((s, r) => s + r.unitsSold, 0)
  const prevMonthGmv = prevSales.reduce((s, r) => s + toNum(r.grossRevenue), 0)

  // Avg rating
  const allRatings = products.flatMap((p) => Array(p.totalReviews).fill(p.avgRating))
  const avgRating  = products.reduce((s, p) => s + p.avgRating * p.totalReviews, 0)
    / Math.max(1, products.reduce((s, p) => s + p.totalReviews, 0))

  // Trend (30 days)
  const today = new Date()
  const trendSales = await prisma.dailySale.findMany({
    where:   { product: { supplierId }, saleDate: { gte: since30 } },
    orderBy: { saleDate: 'asc' },
  })
  const salesTrend: SalesTrendPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const date     = format(subDays(today, i), 'yyyy-MM-dd')
    const daySales = trendSales.filter((s) => format(s.saleDate, 'yyyy-MM-dd') === date)
    salesTrend.push({
      date,
      units:   daySales.reduce((s, r) => s + r.unitsSold, 0),
      revenue: daySales.reduce((s, r) => s + toNum(r.grossRevenue), 0),
    })
  }

  const fastMove = products.filter((p) => p.status === 'fast_move')

  return {
    totalSkus:           products.length,
    unitsThisMonth:      thisMonth,
    unitsMomGrowth:      prevMonth > 0 ? ((thisMonth - prevMonth) / prevMonth) * 100 : 0,
    gmvThisMonth:        thisMonthGmv,
    gmvMomGrowth:        prevMonthGmv > 0 ? ((thisMonthGmv - prevMonthGmv) / prevMonthGmv) * 100 : 0,
    avgRating:           Math.round(avgRating * 10) / 10,
    totalReviews:        products.reduce((s, p) => s + p.totalReviews, 0),
    fastMoveCount:       fastMove.length,
    normalCount:         products.filter((p) => p.status === 'normal').length,
    slowMoveCount:       products.filter((p) => p.status === 'slow_move').length,
    hasFastMove:         fastMove.length > 0,
    fastMoveProductName: fastMove[0]?.name,
    salesTrend,
    products,
  }
}

// ─── Admin overview ────────────────────────────────────────────────────────

export async function getAdminOverviewData() {
  const ADS_PRICES = { STARTER: 500000, BOOSTER: 1500000, PREMIUM: 3000000 } as const

  const suppliers = await prisma.supplier.findMany({
    include: {
      products: {
        where:   { isActive: true },
        include: { statusCache: true, dailySales: true, reviews: true },
      },
      adsRequests: true,
    },
    orderBy: { joinedAt: 'asc' },
  })

  const supplierRankings = suppliers.map((s) => {
    const products  = s.products.map(buildProductWithStatus)
    const gmv30d    = products.reduce((sum, p) => sum + p.gmvLast30d, 0)
    const units30d  = products.reduce((sum, p) => sum + p.unitsLast30d, 0)
    const fastMove  = products.filter((p) => p.status === 'fast_move').length
    const hasActive  = s.adsRequests.some((r) => r.status === 'APPROVED')
    const hasPending = s.adsRequests.some((r) => r.status === 'PENDING' || r.status === 'REVIEWING')
    return {
      supplier:     mapSupplier(s),
      gmv30d,
      unitsSold30d: units30d,
      fastMoveCount: fastMove,
      totalSkus:    products.length,
      hasActiveAds:  hasActive,
      hasPendingAds: hasPending,
    }
  }).sort((a, b) => b.gmv30d - a.gmv30d)

  const allAdsRequests = await prisma.adsRequest.findMany()
  const pendingAds     = allAdsRequests.filter((r) => r.status === 'PENDING' || r.status === 'REVIEWING').length
  const adsRevenue     = allAdsRequests
    .filter((r) => r.status === 'APPROVED' || r.status === 'COMPLETED')
    .reduce((s, r) => s + (ADS_PRICES[r.packageTier as keyof typeof ADS_PRICES] ?? 0), 0)

  return {
    totalSuppliers:    suppliers.length,
    activeSuppliers:   suppliers.filter((s) => s.isActive).length,
    totalGmv30d:       supplierRankings.reduce((s, r) => s + r.gmv30d, 0),
    gmvGrowth:         0, // compute if needed
    pendingAdsRequests: pendingAds,
    activeAdsRevenue:  adsRevenue,
    supplierRankings,
  }
}

export async function getAdminSuppliersData() {
  const ADS_PRICES = { STARTER: 500000, BOOSTER: 1500000, PREMIUM: 3000000 } as const

  const suppliers = await prisma.supplier.findMany({
    include: {
      products: {
        where:   { isActive: true },
        include: { statusCache: true, dailySales: true, reviews: true },
      },
      adsRequests: true,
    },
  })

  return suppliers.map((s) => {
    const products    = s.products.map(buildProductWithStatus)
    const gmv30d      = products.reduce((sum, p) => sum + p.gmvLast30d, 0)
    const units30d    = products.reduce((sum, p) => sum + p.unitsLast30d, 0)
    const fastMove    = products.filter((p) => p.status === 'fast_move').length
    const slowMove    = products.filter((p) => p.status === 'slow_move').length
    const avgRating   = products.length > 0
      ? products.reduce((sum, p) => sum + p.avgRating, 0) / products.length
      : 0
    const hasActiveAds  = s.adsRequests.some((r) => r.status === 'APPROVED' || r.status === 'ACTIVE')
    const hasPendingAds = s.adsRequests.some((r) => r.status === 'PENDING'  || r.status === 'REVIEWING')
    return { supplier: mapSupplier(s), products, gmv30d, units30d, fastMove, slowMove, avgRating, hasActiveAds, hasPendingAds }
  }).sort((a, b) => b.gmv30d - a.gmv30d)
}

// ─── Ads requests ──────────────────────────────────────────────────────────

export async function getAdsRequestsBySupplier(supplierId: string): Promise<AdsRequest[]> {
  const rows = await prisma.adsRequest.findMany({
    where:   { supplierId },
    include: { product: { include: { statusCache: true, dailySales: true, reviews: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map((r) => ({
    id:              r.id,
    supplierId:      r.supplierId,
    productId:       r.productId,
    packageTier:     r.packageTier.toLowerCase() as AdsRequest['packageTier'],
    notes:           r.notes ?? undefined,
    preferredStart:  r.preferredStart ? format(r.preferredStart, 'yyyy-MM-dd') : undefined,
    status:          r.status.toLowerCase() as AdsRequest['status'],
    rejectionReason: r.rejectionReason ?? undefined,
    createdAt:       r.createdAt.toISOString(),
    updatedAt:       r.updatedAt.toISOString(),
    product:         r.product ? buildProductWithStatus(r.product) : undefined,
  }))
}

export async function getAllAdsRequests() {
  const rows = await prisma.adsRequest.findMany({
    include: {
      supplier: true,
      product:  { include: { statusCache: true, dailySales: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map((r) => ({
    id:              r.id,
    supplierId:      r.supplierId,
    productId:       r.productId,
    packageTier:     r.packageTier.toLowerCase() as AdsRequest['packageTier'],
    notes:           r.notes ?? undefined,
    preferredStart:  r.preferredStart ? format(r.preferredStart, 'yyyy-MM-dd') : undefined,
    status:          r.status.toLowerCase() as AdsRequest['status'],
    rejectionReason: r.rejectionReason ?? undefined,
    createdAt:       r.createdAt.toISOString(),
    updatedAt:       r.updatedAt.toISOString(),
    supplier:        r.supplier ? mapSupplier(r.supplier) : undefined,
    product:         r.product ? buildProductWithStatus(r.product) : undefined,
  }))
}

// ─── Notifications ─────────────────────────────────────────────────────────

export async function getNotifications(supplierId: string): Promise<Notification[]> {
  const rows = await prisma.notification.findMany({
    where:   { supplierId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map((n) => ({
    id:         n.id,
    supplierId: n.supplierId,
    type:       n.type.toLowerCase() as Notification['type'],
    title:      n.title,
    body:       n.body,
    data:       (n.data as Record<string, string>) ?? {},
    isRead:     n.isRead,
    createdAt:  n.createdAt.toISOString(),
  }))
}

export async function getUnreadNotificationCount(supplierId: string): Promise<number> {
  return prisma.notification.count({ where: { supplierId, isRead: false } })
}

// ─── Recalculate status (used by cron) ─────────────────────────────────────

export async function recalculateAllProductStatus(): Promise<{ updated: number }> {
  const allProducts = await prisma.product.findMany({
    where:   { isActive: true },
    include: { dailySales: true, reviews: true },
  })

  const thirtyDaysAgo  = subDays(new Date(), 30)
  const sevenDaysAgo   = subDays(new Date(), 7)
  const fourteenDaysAgo = subDays(new Date(), 14)

  // Compute units30d for all products (for percentile)
  const allUnits30d = allProducts.map((p) => {
    const sales30 = p.dailySales.filter((s) => s.saleDate >= thirtyDaysAgo)
    return { productId: p.id, units: sales30.reduce((sum, s) => sum + s.unitsSold, 0) }
  }).sort((a, b) => a.units - b.units)

  let updated = 0

  for (const p of allProducts) {
    const sales30  = p.dailySales.filter((s) => s.saleDate >= thirtyDaysAgo)
    const sales7   = p.dailySales.filter((s) => s.saleDate >= sevenDaysAgo)
    const prevWeek = p.dailySales.filter((s) => s.saleDate >= fourteenDaysAgo && s.saleDate < sevenDaysAgo)

    const unitsLast30d = sales30.reduce((sum, s) => sum + s.unitsSold, 0)
    const unitsLast7d  = sales7.reduce((sum, s) => sum + s.unitsSold, 0)
    const gmvLast30d   = sales30.reduce((sum, s) => sum + toNum(s.grossRevenue), 0)

    const prevUnits7d  = prevWeek.reduce((sum, s) => sum + s.unitsSold, 0)
    const wowGrowth    = prevUnits7d > 0 ? ((unitsLast7d - prevUnits7d) / prevUnits7d) * 100 : 0

    const rank           = allUnits30d.findIndex((x) => x.units >= unitsLast30d)
    const percentileRank = (rank / Math.max(1, allUnits30d.length)) * 100

    const avgRating    = p.reviews.length > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0
    const totalReviews = p.reviews.length

    const statusStr = calculateProductStatus(unitsLast7d, wowGrowth, percentileRank)
    const statusEnum = statusStr.toUpperCase() as 'FAST_MOVE' | 'NORMAL' | 'SLOW_MOVE'

    await prisma.productStatusCache.upsert({
      where:  { productId: p.id },
      create: { productId: p.id, status: statusEnum, unitsLast7d, unitsLast30d, gmvLast30d, wowGrowth, percentileRank, avgRating, totalReviews, lastCalculatedAt: new Date() },
      update: { status: statusEnum, unitsLast7d, unitsLast30d, gmvLast30d, wowGrowth, percentileRank, avgRating, totalReviews, lastCalculatedAt: new Date() },
    })
    updated++
  }

  return { updated }
}
