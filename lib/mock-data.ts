import { format, subDays } from 'date-fns'
import { seededRandom, calculateProductStatus } from './utils'
import type {
  Supplier, Product, ProductWithStatus, DailySale, Review,
  AdsRequest, Notification, Channel, ChannelBreakdown, SalesTrendPoint,
} from './types'

// ─── Demo Users ────────────────────────────────────────────────────────────

export const DEMO_USERS = [
  { id: 'u1', email: 'supplier@demo.com',  password: 'demo123', name: 'Dian Rahayu',   role: 'supplier' as const, supplierId: 's1' },
  { id: 'u2', email: 'supplier2@demo.com', password: 'demo123', name: 'Budi Santoso',  role: 'supplier' as const, supplierId: 's2' },
  { id: 'u3', email: 'supplier3@demo.com', password: 'demo123', name: 'Shanty Garut',  role: 'supplier' as const, supplierId: 's3' },
  { id: 'u4', email: 'supplier4@demo.com', password: 'demo123', name: 'Ayu Pratiwi',   role: 'supplier' as const, supplierId: 's4' },
  { id: 'u5', email: 'supplier5@demo.com', password: 'demo123', name: 'Rizal Hakim',   role: 'supplier' as const, supplierId: 's5' },
  { id: 'u6', email: 'admin@demo.com',     password: 'demo123', name: 'Rizky Pratama', role: 'admin'    as const },
]

// ─── Suppliers ─────────────────────────────────────────────────────────────

export const SUPPLIERS: Supplier[] = [
  { id: 's1', userId: 'u1', brandName: 'Raftels', logoUrl: '/brands/raftels.png',    description: 'Fish skin snack premium khas Indonesia', city: 'Jakarta',  contactName: 'Dian Rahayu',  contactPhone: '0812-1111-2222', contactWa: '6281211112222', tier: 'medium', joinedAt: '2024-10-01', isActive: true },
  { id: 's2', userId: 'u2', brandName: 'Baso Aci Bestie', logoUrl: '/brands/basoaci.png', description: 'Baso aci instan terenak se-Indonesia',     city: 'Bandung', contactName: 'Budi Santoso', contactPhone: '0813-2222-3333', contactWa: '6281322223333', tier: 'medium', joinedAt: '2024-08-15', isActive: true },
  { id: 's3', userId: 'u3', brandName: 'Baso Aci Shanty', logoUrl: '/brands/shanty.png',  description: 'Baso aci khas Garut asli',                city: 'Garut',   contactName: 'Shanty',       contactPhone: '0814-3333-4444', contactWa: '6281433334444', tier: 'small',  joinedAt: '2025-01-10', isActive: true },
  { id: 's4', userId: 'u4', brandName: 'Keripik MeTime',  logoUrl: '/brands/metime.png',  description: 'Keripik homemade untuk me time quality',  city: 'Surabaya',contactName: 'Ayu Pratiwi',  contactPhone: '0815-4444-5555', contactWa: '6281544445555', tier: 'small',  joinedAt: '2025-02-20', isActive: true },
  { id: 's5', userId: 'u5', brandName: 'Deep Talk Snack', logoUrl: '/brands/deeptalk.png',description: 'Snack untuk sesi ngobrol seru',           city: 'Yogyakarta', contactName: 'Rizal Hakim', contactPhone: '0816-5555-6666', contactWa: '6281655556666', tier: 'small', joinedAt: '2025-03-05', isActive: true },
]

// ─── Products ──────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // Raftels (s1) — 8 produk
  { id: 'p1',  supplierId: 's1', sku: 'RFT-BAL-85',  name: 'Raftels Balado 85g',       description: 'Fish skin balado pedas manis', imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 214, stockThreshold: 50, isActive: true, listedAt: '2024-10-05' },
  { id: 'p2',  supplierId: 's1', sku: 'RFT-ORI-85',  name: 'Raftels Original 85g',     description: 'Fish skin rasa original gurih', imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 89,  stockThreshold: 50, isActive: true, listedAt: '2024-10-05' },
  { id: 'p3',  supplierId: 's1', sku: 'RFT-KEJ-50',  name: 'Raftels Keju 50g',         description: 'Fish skin rasa keju creamy',   imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier:  8000, priceSell: 13000, weightGram: 50,  currentStock: 456, stockThreshold: 60, isActive: true, listedAt: '2024-11-01' },
  { id: 'p4',  supplierId: 's1', sku: 'RFT-PED-100', name: 'Raftels Pedas 100g',       description: 'Fish skin super pedas level 3', imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 14000, priceSell: 21000, weightGram: 100, currentStock: 12,  stockThreshold: 30, isActive: true, listedAt: '2024-11-15' },
  { id: 'p5',  supplierId: 's1', sku: 'RFT-BBQ-85',  name: 'Raftels BBQ 85g',          description: 'Fish skin rasa BBQ smoky',      imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 330, stockThreshold: 50, isActive: true, listedAt: '2025-01-20' },
  { id: 'p6',  supplierId: 's1', sku: 'RFT-ASM-85',  name: 'Raftels Asam Manis 85g',   description: 'Fish skin asam manis segar',    imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 12000, priceSell: 18500, weightGram: 85,  currentStock: 175, stockThreshold: 50, isActive: true, listedAt: '2025-02-01' },
  { id: 'p7',  supplierId: 's1', sku: 'RFT-BND-200', name: 'Raftels Bundle 3-Pack',     description: 'Bundle 3 rasa pilihan',         imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Bundle',    priceSupplier: 32000, priceSell: 49000, weightGram: 255, currentStock: 98,  stockThreshold: 25, isActive: true, listedAt: '2025-02-15' },
  { id: 'p8',  supplierId: 's1', sku: 'RFT-SPC-85',  name: 'Raftels Sapi Panggang 85g',description: 'Fish skin rasa sapi panggang',  imageUrl: 'https://placehold.co/80x80/F97316/white?text=RFT', category: 'Fish Skin', priceSupplier: 13000, priceSell: 20000, weightGram: 85,  currentStock: 42,  stockThreshold: 30, isActive: true, listedAt: '2025-03-01' },
  // Baso Aci Bestie (s2) — 4 produk
  { id: 'p9',  supplierId: 's2', sku: 'BAB-ORI-5',   name: 'Baso Aci Bestie Original 5pcs', description: 'Baso aci instan isi 5',   imageUrl: 'https://placehold.co/80x80/EA6C0A/white?text=BAB', category: 'Baso Aci', priceSupplier:  9000, priceSell: 14000, weightGram: 100, currentStock: 385, stockThreshold: 80, isActive: true, listedAt: '2024-08-20' },
  { id: 'p10', supplierId: 's2', sku: 'BAB-PED-5',   name: 'Baso Aci Bestie Pedas 5pcs',    description: 'Baso aci instan pedas',   imageUrl: 'https://placehold.co/80x80/EA6C0A/white?text=BAB', category: 'Baso Aci', priceSupplier:  9500, priceSell: 14500, weightGram: 100, currentStock: 210, stockThreshold: 80, isActive: true, listedAt: '2024-08-20' },
  { id: 'p11', supplierId: 's2', sku: 'BAB-BND-10',  name: 'Baso Aci Bestie Bundle 10pcs',  description: 'Bundle hemat isi 10',     imageUrl: 'https://placehold.co/80x80/EA6C0A/white?text=BAB', category: 'Bundle',   priceSupplier: 17000, priceSell: 26000, weightGram: 200, currentStock: 150, stockThreshold: 40, isActive: true, listedAt: '2024-09-01' },
  { id: 'p12', supplierId: 's2', sku: 'BAB-KJU-5',   name: 'Baso Aci Bestie Keju 5pcs',     description: 'Baso aci rasa keju',      imageUrl: 'https://placehold.co/80x80/EA6C0A/white?text=BAB', category: 'Baso Aci', priceSupplier: 10000, priceSell: 15500, weightGram: 110, currentStock: 28,  stockThreshold: 40, isActive: true, listedAt: '2025-01-05' },
  // Baso Aci Shanty (s3) — 3 produk
  { id: 'p13', supplierId: 's3', sku: 'BAS-GAR-5',   name: 'Baso Aci Shanty Garut 5pcs',  description: 'Baso aci khas Garut asli', imageUrl: 'https://placehold.co/80x80/C2570A/white?text=BAS', category: 'Baso Aci', priceSupplier: 10000, priceSell: 15000, weightGram: 120, currentStock: 120, stockThreshold: 50, isActive: true, listedAt: '2025-01-15' },
  { id: 'p14', supplierId: 's3', sku: 'BAS-GAR-10',  name: 'Baso Aci Shanty Garut 10pcs', description: 'Pack ekonomis isi 10',     imageUrl: 'https://placehold.co/80x80/C2570A/white?text=BAS', category: 'Baso Aci', priceSupplier: 18500, priceSell: 27000, weightGram: 240, currentStock: 75,  stockThreshold: 30, isActive: true, listedAt: '2025-01-15' },
  { id: 'p15', supplierId: 's3', sku: 'BAS-PED-5',   name: 'Baso Aci Shanty Pedas 5pcs',  description: 'Varian pedas level 2',    imageUrl: 'https://placehold.co/80x80/C2570A/white?text=BAS', category: 'Baso Aci', priceSupplier: 10500, priceSell: 15500, weightGram: 120, currentStock: 45,  stockThreshold: 30, isActive: true, listedAt: '2025-02-10' },
  // Keripik MeTime (s4) — 3 produk
  { id: 'p16', supplierId: 's4', sku: 'KMT-ORI-80',  name: 'Keripik MeTime Original 80g',  description: 'Keripik tipis renyah',      imageUrl: 'https://placehold.co/80x80/6366F1/white?text=KMT', category: 'Keripik', priceSupplier:  8500, priceSell: 13000, weightGram: 80, currentStock: 200, stockThreshold: 50, isActive: true, listedAt: '2025-02-25' },
  { id: 'p17', supplierId: 's4', sku: 'KMT-PED-80',  name: 'Keripik MeTime Pedas 80g',     description: 'Keripik pedas level 3',    imageUrl: 'https://placehold.co/80x80/6366F1/white?text=KMT', category: 'Keripik', priceSupplier:  9000, priceSell: 13500, weightGram: 80, currentStock: 88,  stockThreshold: 40, isActive: true, listedAt: '2025-02-25' },
  { id: 'p18', supplierId: 's4', sku: 'KMT-BBQ-80',  name: 'Keripik MeTime BBQ 80g',       description: 'Keripik rasa BBQ smoky',   imageUrl: 'https://placehold.co/80x80/6366F1/white?text=KMT', category: 'Keripik', priceSupplier:  9000, priceSell: 13500, weightGram: 80, currentStock: 15,  stockThreshold: 30, isActive: true, listedAt: '2025-03-10' },
  // Deep Talk (s5) — 4 produk
  { id: 'p19', supplierId: 's5', sku: 'DTS-MIX-100', name: 'Deep Talk Mix Snack 100g',      description: 'Mix snack untuk ngobrol', imageUrl: 'https://placehold.co/80x80/14B8A6/white?text=DTS', category: 'Mix Snack', priceSupplier: 11000, priceSell: 17000, weightGram: 100, currentStock: 95,  stockThreshold: 40, isActive: true, listedAt: '2025-03-10' },
  { id: 'p20', supplierId: 's5', sku: 'DTS-PED-100', name: 'Deep Talk Pedas 100g',          description: 'Varian pedas seru',       imageUrl: 'https://placehold.co/80x80/14B8A6/white?text=DTS', category: 'Mix Snack', priceSupplier: 11500, priceSell: 17500, weightGram: 100, currentStock: 52,  stockThreshold: 30, isActive: true, listedAt: '2025-03-10' },
  { id: 'p21', supplierId: 's5', sku: 'DTS-SWT-100', name: 'Deep Talk Sweet 100g',          description: 'Varian manis lezat',      imageUrl: 'https://placehold.co/80x80/14B8A6/white?text=DTS', category: 'Mix Snack', priceSupplier: 11000, priceSell: 17000, weightGram: 100, currentStock: 30,  stockThreshold: 30, isActive: true, listedAt: '2025-03-15' },
  { id: 'p22', supplierId: 's5', sku: 'DTS-BND-3',   name: 'Deep Talk Bundle 3-Pack',       description: 'Bundle 3 rasa',           imageUrl: 'https://placehold.co/80x80/14B8A6/white?text=DTS', category: 'Bundle',    priceSupplier: 30000, priceSell: 45000, weightGram: 300, currentStock: 18,  stockThreshold: 15, isActive: true, listedAt: '2025-03-20' },
]

// ─── Sales data generator ──────────────────────────────────────────────────

// Base weekly volumes per product (units/week at peak)
const PRODUCT_VOLUMES: Record<string, { base: number; trend: 'up' | 'stable' | 'down'; channels: Record<Channel, number> }> = {
  p1:  { base: 320, trend: 'up',     channels: { shopee: 0.68, tiktok: 0.22, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p2:  { base: 230, trend: 'up',     channels: { shopee: 0.60, tiktok: 0.25, reseller: 0.15, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p3:  { base:  88, trend: 'stable', channels: { shopee: 0.70, tiktok: 0.20, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p4:  { base:  12, trend: 'down',   channels: { shopee: 0.80, tiktok: 0.20, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p5:  { base: 150, trend: 'up',     channels: { shopee: 0.65, tiktok: 0.25, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p6:  { base:  65, trend: 'stable', channels: { shopee: 0.72, tiktok: 0.18, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p7:  { base:  55, trend: 'stable', channels: { shopee: 0.65, tiktok: 0.20, reseller: 0.15, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p8:  { base:  28, trend: 'stable', channels: { shopee: 0.75, tiktok: 0.25, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p9:  { base: 275, trend: 'up',     channels: { shopee: 0.55, tiktok: 0.30, reseller: 0.15, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p10: { base: 180, trend: 'stable', channels: { shopee: 0.60, tiktok: 0.28, reseller: 0.12, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p11: { base: 110, trend: 'stable', channels: { shopee: 0.62, tiktok: 0.25, reseller: 0.13, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p12: { base:  18, trend: 'down',   channels: { shopee: 0.80, tiktok: 0.20, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p13: { base:  95, trend: 'up',     channels: { shopee: 0.65, tiktok: 0.25, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p14: { base:  60, trend: 'stable', channels: { shopee: 0.70, tiktok: 0.20, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p15: { base:  30, trend: 'stable', channels: { shopee: 0.75, tiktok: 0.25, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p16: { base:  70, trend: 'stable', channels: { shopee: 0.70, tiktok: 0.20, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p17: { base:  45, trend: 'stable', channels: { shopee: 0.72, tiktok: 0.18, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p18: { base:  10, trend: 'down',   channels: { shopee: 0.80, tiktok: 0.20, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p19: { base:  55, trend: 'stable', channels: { shopee: 0.68, tiktok: 0.22, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p20: { base:  35, trend: 'stable', channels: { shopee: 0.70, tiktok: 0.20, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
  p21: { base:  20, trend: 'down',   channels: { shopee: 0.78, tiktok: 0.22, reseller: 0,    website: 0, live_shopee: 0, live_tiktok: 0 } },
  p22: { base:  22, trend: 'stable', channels: { shopee: 0.65, tiktok: 0.25, reseller: 0.10, website: 0, live_shopee: 0, live_tiktok: 0 } },
}

function generateDailySales(): DailySale[] {
  const sales: DailySale[] = []
  const today = new Date()

  PRODUCTS.forEach((p) => {
    const vol = PRODUCT_VOLUMES[p.id]
    if (!vol) return
    const rng = seededRandom(parseInt(p.id.replace(/\D/g, ''), 10) * 13)
    const baseDaily = vol.base / 7

    for (let daysAgo = 59; daysAgo >= 0; daysAgo--) {
      const date = format(subDays(today, daysAgo), 'yyyy-MM-dd')
      const trendMultiplier = vol.trend === 'up'
        ? 1 + (59 - daysAgo) / 59 * 0.45
        : vol.trend === 'down'
        ? 1 - (59 - daysAgo) / 59 * 0.35
        : 1

      const channels = Object.entries(vol.channels).filter(([, share]) => share > 0) as [Channel, number][]
      channels.forEach(([channel, share]) => {
        const noise = 0.7 + rng() * 0.6
        const units = Math.max(0, Math.round(baseDaily * share * trendMultiplier * noise))
        if (units === 0) return
        sales.push({
          id:           `${p.id}-${date}-${channel}`,
          productId:    p.id,
          saleDate:     date,
          channel,
          unitsSold:    units,
          grossRevenue: units * (p.priceSell || p.priceSupplier * 1.5),
        })
      })
    }
  })
  return sales
}

// Memoize sales data generation
let _salesCache: DailySale[] | null = null
export function getSalesData(): DailySale[] {
  if (!_salesCache) _salesCache = generateDailySales()
  return _salesCache
}

// ─── Reviews ───────────────────────────────────────────────────────────────

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

function generateReviews(): Review[] {
  const reviews: Review[] = []
  const ratingDist: Record<string, number[]> = {
    p1: [5,5,5,5,4,5,5,4,5,5,5,4,5,3,5],
    p2: [5,5,4,5,4,4,5,5,4,5,4,5],
    p3: [4,4,5,4,4,3,5,4,4,5],
    p4: [3,4,3,2,4,3,5,3,2,4],
    p5: [5,5,4,5,5,4,5],
    p6: [4,4,5,4,4,5],
    p7: [5,5,4,5,4],
    p8: [4,4,3,4,5,4],
    p9: [5,5,5,4,5,5,5,4,5],
    p10:[5,4,5,5,4,5,4],
    p11:[5,5,4,5,4,5],
    p12:[3,4,3,4,3],
    p13:[5,5,4,5,4,5],
    p14:[4,5,4,4,5],
    p15:[4,4,5,4],
    p16:[4,4,5,4,4],
    p17:[4,4,3,4,5],
    p18:[3,3,4,3],
    p19:[4,5,4,4,5],
    p20:[4,4,5,4],
    p21:[3,4,3,4],
    p22:[5,4,5,4],
  }

  const reviewers = ['Rina', 'Budi', 'Sari', 'Dedi', 'Ana', 'Tono', 'Yuli', 'Hendra', 'Dewi', 'Eko']
  const rng = seededRandom(42)
  const channels: Channel[] = ['shopee', 'tiktok', 'website']

  PRODUCTS.forEach((p) => {
    const ratings = ratingDist[p.id] || [4, 5, 4]
    ratings.forEach((rating, i) => {
      const daysAgo = Math.floor(rng() * 30)
      reviews.push({
        id:          `rev-${p.id}-${i}`,
        productId:   p.id,
        channel:     channels[Math.floor(rng() * channels.length)],
        rating,
        reviewText:  REVIEW_TEXTS[Math.floor(rng() * REVIEW_TEXTS.length)],
        reviewerName: reviewers[Math.floor(rng() * reviewers.length)],
        reviewDate:  format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
      })
    })
  })
  return reviews
}

let _reviewsCache: Review[] | null = null
export function getReviewsData(): Review[] {
  if (!_reviewsCache) _reviewsCache = generateReviews()
  return _reviewsCache
}

// ─── Ads Requests ──────────────────────────────────────────────────────────

export const ADS_REQUESTS: AdsRequest[] = [
  { id: 'ar1', supplierId: 's1', productId: 'p1', packageTier: 'starter',  notes: 'Mau coba dulu paket starter',  preferredStart: format(subDays(new Date(), 5), 'yyyy-MM-dd'), status: 'approved', createdAt: format(subDays(new Date(), 6), 'yyyy-MM-dd\'T\'HH:mm:ss'), updatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss') },
  { id: 'ar2', supplierId: 's2', productId: 'p9', packageTier: 'booster',  notes: 'Produk lagi nge-trend, mau boost',preferredStart: format(subDays(new Date(), 2), 'yyyy-MM-dd'), status: 'pending',  createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'), updatedAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss') },
  { id: 'ar3', supplierId: 's1', productId: 'p2', packageTier: 'starter',  notes: 'Produk original juga mau di-boost', preferredStart: format(subDays(new Date(), 1), 'yyyy-MM-dd'), status: 'pending',  createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'), updatedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss') },
  { id: 'ar4', supplierId: 's1', productId: 'p5', packageTier: 'booster',  notes: 'BBQ lagi naik, mau makin gasss!', preferredStart: format(subDays(new Date(), 14), 'yyyy-MM-dd'), status: 'completed', createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd\'T\'HH:mm:ss'), updatedAt: format(subDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss') },
  { id: 'ar5', supplierId: 's3', productId:'p13', packageTier: 'starter',  notes: 'Perdana iklan di FoodStocks',     preferredStart: format(subDays(new Date(), 1), 'yyyy-MM-dd'), status: 'reviewing', createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'), updatedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss') },
]

// ─── Notifications ─────────────────────────────────────────────────────────

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1',  supplierId: 's1', type: 'fast_move',    title: 'Raftels Balado masuk Fast-Move!',       body: 'Produk Anda naik +45% week-over-week. Cek peluang iklan untuk boost lebih jauh.',     data: { productId: 'p1' }, isRead: false, createdAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'08:00:00") },
  { id: 'n2',  supplierId: 's1', type: 'ads_approved', title: 'Request iklan disetujui!',              body: 'Starter Pack untuk Raftels Balado mulai besok. Siap-siap penjualan naik!',            data: { requestId: 'ar1' }, isRead: false, createdAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'10:30:00") },
  { id: 'n3',  supplierId: 's1', type: 'stock_low',    title: 'Stok Raftels Original hampir habis',    body: 'Tersisa 89 unit. Estimasi habis dalam 4 hari. Segera hubungi FoodStocks untuk restock.', data: { productId: 'p2' }, isRead: false, createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'09:00:00") },
  { id: 'n4',  supplierId: 's1', type: 'review_new',   title: '3 ulasan baru untuk Raftels Keju',     body: 'Rating baru: 4.5/5.0 dari 3 pembeli terverifikasi.',                                   data: { productId: 'p3' }, isRead: true,  createdAt: format(subDays(new Date(), 2), "yyyy-MM-dd'T'14:00:00") },
  { id: 'n5',  supplierId: 's1', type: 'fast_move',    title: 'Raftels BBQ masuk Fast-Move!',          body: 'Raftels BBQ naik +28% minggu ini. Pertimbangkan iklan untuk momentum ini.',            data: { productId: 'p5' }, isRead: true,  createdAt: format(subDays(new Date(), 3), "yyyy-MM-dd'T'08:00:00") },
  { id: 'n6',  supplierId: 's1', type: 'ads_completed','title': 'Campaign Raftels BBQ selesai',        body: 'Campaign Booster Pack selesai. Lihat laporan performa campaign Anda.',                  data: { requestId: 'ar4' }, isRead: true,  createdAt: format(subDays(new Date(), 7), "yyyy-MM-dd'T'18:00:00") },
  { id: 'n7',  supplierId: 's2', type: 'fast_move',    title: 'Baso Aci Bestie Original Fast-Move!',   body: 'Penjualan naik signifikan minggu ini. Stok cukup untuk 2 minggu ke depan.',             data: { productId: 'p9' }, isRead: false, createdAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'09:00:00") },
  { id: 'n8',  supplierId: 's2', type: 'stock_low',    title: 'Stok Baso Aci Bestie Keju menipis',    body: 'Tersisa 28 unit. Estimasi habis dalam 5 hari.',                                         data: { productId: 'p12' }, isRead: false, createdAt: format(subDays(new Date(), 1), "yyyy-MM-dd'T'10:00:00") },
  { id: 'n9',  supplierId: 's3', type: 'fast_move',    title: 'Baso Aci Shanty Garut Trending!',       body: 'Produk Anda mulai viral di TikTok. Ini saat tepat untuk iklan!',                       data: { productId: 'p13' }, isRead: false, createdAt: format(subDays(new Date(), 0), "yyyy-MM-dd'T'11:00:00") },
  { id: 'n10', supplierId: 's4', type: 'system',       title: 'Selamat datang di FoodStocks Dashboard!', body: 'Dashboard Anda sudah aktif. Mulai pantau performa produk Anda di sini.',            data: {}, isRead: true,  createdAt: format(subDays(new Date(), 5), "yyyy-MM-dd'T'08:00:00") },
]

// ─── Computed helpers ──────────────────────────────────────────────────────

export function getProductsBySupplier(supplierId: string): Product[] {
  return PRODUCTS.filter((p) => p.supplierId === supplierId && p.isActive)
}

export function getSalesByProduct(productId: string, days = 30): DailySale[] {
  const sales = getSalesData()
  const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd')
  return sales.filter((s) => s.productId === productId && s.saleDate >= cutoff)
}

export function getProductWithStatus(product: Product): ProductWithStatus {
  const sales30 = getSalesByProduct(product.id, 30)
  const sales7  = getSalesByProduct(product.id, 7)
  const prevWeek = getSalesData().filter((s) => {
    const cutoff7  = format(subDays(new Date(), 7),  'yyyy-MM-dd')
    const cutoff14 = format(subDays(new Date(), 14), 'yyyy-MM-dd')
    return s.productId === product.id && s.saleDate >= cutoff14 && s.saleDate < cutoff7
  })

  const unitsLast30d = sales30.reduce((s, r) => s + r.unitsSold, 0)
  const unitsLast7d  = sales7.reduce((s, r)  => s + r.unitsSold, 0)
  const gmvLast30d   = sales30.reduce((s, r) => s + r.grossRevenue, 0)
  const prevUnits7d  = prevWeek.reduce((s, r) => s + r.unitsSold, 0)
  const wowGrowth    = prevUnits7d > 0 ? ((unitsLast7d - prevUnits7d) / prevUnits7d) * 100 : 0

  // All products for percentile
  const allProductUnits = PRODUCTS.map((p) => {
    const s = getSalesData().filter((s2) => {
      const cutoff = format(subDays(new Date(), 30), 'yyyy-MM-dd')
      return s2.productId === p.id && s2.saleDate >= cutoff
    })
    return s.reduce((sum, r) => sum + r.unitsSold, 0)
  }).sort((a, b) => a - b)
  const rank = allProductUnits.findIndex((u) => u >= unitsLast30d)
  const percentileRank = (rank / allProductUnits.length) * 100

  const reviews = getReviewsData().filter((r) => r.productId === product.id)
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  // Channel breakdown
  const channelMap: Record<string, { units: number; revenue: number }> = {}
  sales30.forEach((s) => {
    if (!channelMap[s.channel]) channelMap[s.channel] = { units: 0, revenue: 0 }
    channelMap[s.channel].units   += s.unitsSold
    channelMap[s.channel].revenue += s.grossRevenue
  })
  const channelBreakdown: ChannelBreakdown[] = Object.entries(channelMap).map(([ch, v]) => ({
    channel:    ch as Channel,
    units:      v.units,
    revenue:    v.revenue,
    percentage: unitsLast30d > 0 ? Math.round((v.units / unitsLast30d) * 100) : 0,
  })).sort((a, b) => b.units - a.units)

  return {
    ...product,
    status:          calculateProductStatus(unitsLast7d, wowGrowth, percentileRank),
    unitsLast7d,
    unitsLast30d,
    gmvLast30d,
    wowGrowth,
    momGrowth:       0,
    avgRating:       Math.round(avgRating * 10) / 10,
    totalReviews:    reviews.length,
    channelBreakdown,
  }
}

export function getProductSalesTrend(productId: string, days = 30): SalesTrendPoint[] {
  const today = new Date()
  const points: SalesTrendPoint[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd')
    const daySales = getSalesData().filter((s) => s.productId === productId && s.saleDate === date)
    points.push({
      date,
      units:   daySales.reduce((s, r) => s + r.unitsSold, 0),
      revenue: daySales.reduce((s, r) => s + r.grossRevenue, 0),
    })
  }
  return points
}

export function getSupplierOverviewData(supplierId: string) {
  const products = getProductsBySupplier(supplierId)
  const withStatus = products.map(getProductWithStatus)

  const thisMonth  = withStatus.reduce((s, p) => s + p.unitsLast30d,  0)
  const thisMonthGmv = withStatus.reduce((s, p) => s + p.gmvLast30d, 0)

  // Prev month
  const prevMonthSales = getSalesData().filter((s) => {
    const cutoff30 = format(subDays(new Date(), 30), 'yyyy-MM-dd')
    const cutoff60 = format(subDays(new Date(), 60), 'yyyy-MM-dd')
    return products.some((p) => p.id === s.productId) && s.saleDate >= cutoff60 && s.saleDate < cutoff30
  })
  const prevMonth    = prevMonthSales.reduce((s, r) => s + r.unitsSold, 0)
  const prevMonthGmv = prevMonthSales.reduce((s, r) => s + r.grossRevenue, 0)

  const allReviews = getReviewsData().filter((r) => products.some((p) => p.id === r.productId))
  const avgRating  = allReviews.length > 0 ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0

  // Trend aggregated
  const today = new Date()
  const salesTrend: SalesTrendPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd')
    const daySales = getSalesData().filter(
      (s) => products.some((p) => p.id === s.productId) && s.saleDate === date
    )
    salesTrend.push({ date, units: daySales.reduce((s, r) => s + r.unitsSold, 0), revenue: daySales.reduce((s, r) => s + r.grossRevenue, 0) })
  }

  const fastMove = withStatus.filter((p) => p.status === 'fast_move')

  return {
    totalSkus:          products.length,
    unitsThisMonth:     thisMonth,
    unitsMomGrowth:     prevMonth > 0 ? ((thisMonth - prevMonth) / prevMonth) * 100 : 0,
    gmvThisMonth:       thisMonthGmv,
    gmvMomGrowth:       prevMonthGmv > 0 ? ((thisMonthGmv - prevMonthGmv) / prevMonthGmv) * 100 : 0,
    avgRating:          Math.round(avgRating * 10) / 10,
    totalReviews:       allReviews.length,
    fastMoveCount:      fastMove.length,
    normalCount:        withStatus.filter((p) => p.status === 'normal').length,
    slowMoveCount:      withStatus.filter((p) => p.status === 'slow_move').length,
    hasFastMove:        fastMove.length > 0,
    fastMoveProductName: fastMove[0]?.name,
    salesTrend,
    products:           withStatus,
  }
}
