import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { SUPPLIERS, getProductsBySupplier, getProductWithStatus, ADS_REQUESTS } from '@/lib/mock-data'

export async function GET() {
  const user = await getAuthUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supplierRankings = SUPPLIERS.map((supplier) => {
    const products   = getProductsBySupplier(supplier.id).map(getProductWithStatus)
    const gmv30d     = products.reduce((s, p) => s + p.gmvLast30d, 0)
    const units30d   = products.reduce((s, p) => s + p.unitsLast30d, 0)
    const fastMove   = products.filter((p) => p.status === 'fast_move').length
    const activeAds  = ADS_REQUESTS.filter((r) => r.supplierId === supplier.id && r.status === 'approved').length > 0
    const pendingAds = ADS_REQUESTS.filter((r) => r.supplierId === supplier.id && r.status === 'pending').length > 0
    return { supplier, gmv30d, unitsSold30d: units30d, fastMoveCount: fastMove, totalSkus: products.length, hasActiveAds: activeAds, hasPendingAds: pendingAds }
  }).sort((a, b) => b.gmv30d - a.gmv30d)

  const totalGmv   = supplierRankings.reduce((s, r) => s + r.gmv30d, 0)
  const pendingAds = ADS_REQUESTS.filter((r) => r.status === 'pending' || r.status === 'reviewing').length
  const adsRevenue = ADS_REQUESTS.filter((r) => r.status === 'approved' || r.status === 'completed')
    .reduce((s, r) => {
      const prices = { starter: 500000, booster: 1500000, premium: 3000000 }
      return s + prices[r.packageTier]
    }, 0)

  return NextResponse.json({
    totalSuppliers:    SUPPLIERS.length,
    activeSuppliers:   SUPPLIERS.filter((s) => s.isActive).length,
    totalGmv30d:       totalGmv,
    gmvGrowth:         18.5,
    pendingAdsRequests: pendingAds,
    activeAdsRevenue:  adsRevenue,
    supplierRankings,
  })
}
