// ─── Auth ──────────────────────────────────────────────────────────────────

export type UserRole = 'supplier' | 'admin'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  supplierId?: string
}

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: UserRole
  supplierId?: string
}

// ─── Enums ─────────────────────────────────────────────────────────────────

export type ProductStatus = 'fast_move' | 'normal' | 'slow_move'
export type Channel = 'shopee' | 'tiktok' | 'website' | 'live_shopee' | 'live_tiktok' | 'reseller'
export type AdsTier = 'starter' | 'booster' | 'premium'
export type AdsRequestStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'cancelled'
export type CampaignStatus = 'scheduled' | 'active' | 'completed' | 'cancelled'
export type NotificationType = 'stock_low' | 'fast_move' | 'ads_approved' | 'ads_rejected' | 'ads_started' | 'ads_completed' | 'review_new' | 'system'
export type SupplierTier = 'small' | 'medium' | 'large'

// ─── Supplier ──────────────────────────────────────────────────────────────

export interface Supplier {
  id: string
  userId: string
  brandName: string
  logoUrl?: string
  description?: string
  city?: string
  contactName?: string
  contactPhone?: string
  contactWa?: string
  tier: SupplierTier
  joinedAt: string
  isActive: boolean
}

// ─── Product ───────────────────────────────────────────────────────────────

export interface Product {
  id: string
  supplierId: string
  sku: string
  name: string
  description?: string
  imageUrl?: string
  category?: string
  priceSupplier: number
  priceSell?: number
  weightGram?: number
  currentStock: number
  stockThreshold: number
  isActive: boolean
  listedAt: string
}

export interface ProductWithStatus extends Product {
  status: ProductStatus
  unitsLast7d: number
  unitsLast30d: number
  gmvLast30d: number
  wowGrowth: number
  momGrowth: number
  avgRating: number
  totalReviews: number
  channelBreakdown: ChannelBreakdown[]
}

export interface ChannelBreakdown {
  channel: Channel
  units: number
  revenue: number
  percentage: number
}

// ─── Sales ─────────────────────────────────────────────────────────────────

export interface DailySale {
  id: string
  productId: string
  saleDate: string
  channel: Channel
  unitsSold: number
  grossRevenue: number
}

export interface SalesTrendPoint {
  date: string
  units: number
  revenue: number
}

// ─── Reviews ───────────────────────────────────────────────────────────────

export interface Review {
  id: string
  productId: string
  channel: Channel
  rating: number
  reviewText?: string
  reviewerName?: string
  reviewDate: string
}

// ─── Ads ───────────────────────────────────────────────────────────────────

export interface AdsRequest {
  id: string
  supplierId: string
  productId: string
  packageTier: AdsTier
  notes?: string
  preferredStart?: string
  status: AdsRequestStatus
  rejectionReason?: string
  createdAt: string
  updatedAt: string
  product?: ProductWithStatus
  supplier?: Supplier
}

export interface AdsCampaign {
  id: string
  requestId: string
  supplierId: string
  productId: string
  packageTier: AdsTier
  priceCharged: number
  startDate: string
  endDate: string
  status: CampaignStatus
  channels: string[]
}

export const ADS_PACKAGES: Record<AdsTier, { label: string; price: number; priceLabel: string; benefits: string[]; estimate: string }> = {
  starter: {
    label: 'Starter',
    price: 500000,
    priceLabel: 'Rp 500K',
    benefits: [
      'Shopee Ads boost untuk produk Anda',
      'Push ke 500+ reseller aktif FoodStocks',
      'Prioritas tampil di katalog FoodStocks',
    ],
    estimate: '+40–60 unit/minggu',
  },
  booster: {
    label: 'Booster',
    price: 1500000,
    priceLabel: 'Rp 1,5Jt',
    benefits: [
      'Semua benefit Starter',
      '1 slot Live Selling (Shopee/TikTok)',
      'Highlight di TikTok Shop FoodStocks',
      'Prioritas masuk paket bundling',
    ],
    estimate: '+120–180 unit/minggu',
  },
  premium: {
    label: 'Premium',
    price: 3000000,
    priceLabel: 'Rp 3Jt',
    benefits: [
      'Semua benefit Booster',
      'Review konten kreator / micro-influencer',
      'Banner di homepage foodstocks.id',
      'Prioritas restock & order minimum',
      'Laporan campaign detail (before/after)',
    ],
    estimate: '+250–350 unit/minggu',
  },
}

// ─── Notification ──────────────────────────────────────────────────────────

export interface Notification {
  id: string
  supplierId: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, string>
  isRead: boolean
  createdAt: string
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export interface SupplierOverview {
  totalSkus: number
  unitsThisMonth: number
  unitsMomGrowth: number
  gmvThisMonth: number
  gmvMomGrowth: number
  avgRating: number
  totalReviews: number
  fastMoveCount: number
  normalCount: number
  slowMoveCount: number
  hasFastMove: boolean
  fastMoveProductName?: string
  salesTrend: SalesTrendPoint[]
}

export interface AdminOverview {
  totalSuppliers: number
  activeSuppliers: number
  totalGmv30d: number
  gmvGrowth: number
  pendingAdsRequests: number
  activeAdsRevenue: number
  supplierRankings: SupplierRanking[]
}

export interface SupplierRanking {
  supplier: Supplier
  gmv30d: number
  unitsSold30d: number
  fastMoveCount: number
  totalSkus: number
  hasActiveAds: boolean
  hasPendingAds: boolean
}
