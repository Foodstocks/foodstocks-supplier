import { redirect, notFound } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { PRODUCTS, getProductWithStatus, getProductSalesTrend, getReviewsData } from '@/lib/mock-data'
import { formatRupiah, formatNumber, formatDateShort, STATUS_CONFIG, CHANNEL_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Megaphone, Package, Star, AlertTriangle } from 'lucide-react'
import ProductSalesChart from '@/components/charts/product-sales-chart'
import ChannelPieChart from '@/components/charts/channel-pie-chart'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const product = PRODUCTS.find((p) => p.id === params.id && p.supplierId === user.supplierId)
  if (!product) notFound()

  const withStatus = getProductWithStatus(product)
  const trend30    = getProductSalesTrend(product.id, 30)
  const reviews    = getReviewsData().filter((r) => r.productId === product.id).slice(0, 5)
  const cfg        = STATUS_CONFIG[withStatus.status]
  const isLow      = product.currentStock < product.stockThreshold
  const ratingDist = [5,4,3,2,1].map((r) => ({
    star: r,
    count: reviews.filter((rev) => rev.rating === r).length,
  }))

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div>
        <Link href="/dashboard/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3 transition">
          <ArrowLeft size={16} /> Kembali ke Produk
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-16 h-16 rounded-xl bg-brand-100 flex-shrink-0 overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-xl text-gray-900">{product.name}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku} · {product.category} · {formatRupiah(product.priceSell ?? product.priceSupplier * 1.5)}</p>
            {withStatus.wowGrowth !== 0 && (
              <p className={`text-sm font-semibold mt-1 ${withStatus.wowGrowth > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {withStatus.wowGrowth > 0 ? '↑' : '↓'} {Math.abs(withStatus.wowGrowth).toFixed(0)}% week-over-week
              </p>
            )}
          </div>
          {withStatus.status === 'fast_move' && (
            <Link href="/dashboard/ads" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition whitespace-nowrap">
              <Megaphone size={16} /> Ajukan Iklan
            </Link>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Unit / 7 Hari',   value: formatNumber(withStatus.unitsLast7d) },
          { label: 'Unit / 30 Hari',  value: formatNumber(withStatus.unitsLast30d) },
          { label: 'GMV 30 Hari',     value: formatRupiah(withStatus.gmvLast30d, true) },
          { label: 'Rating',          value: withStatus.avgRating > 0 ? `${withStatus.avgRating.toFixed(1)} ⭐` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-heading font-bold text-xl text-gray-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Sales chart + stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Tren Penjualan 30 Hari</h2>
          <ProductSalesChart data={trend30} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Stok & Velocity</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600">Stok saat ini</span>
                <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatNumber(product.currentStock)} unit
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isLow ? 'bg-red-500' : 'bg-brand-500'}`}
                  style={{ width: `${Math.min(100, (product.currentStock / Math.max(product.currentStock, product.stockThreshold * 3)) * 100)}%` }}
                />
              </div>
              {isLow && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Stok menipis — segera restock
                </p>
              )}
            </div>
            <div className="text-sm space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Threshold restock</span>
                <span className="font-medium">{formatNumber(product.stockThreshold)} unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rata-rata/hari</span>
                <span className="font-medium">{Math.round(withStatus.unitsLast30d / 30)} unit</span>
              </div>
              {withStatus.unitsLast30d > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. habis dalam</span>
                  <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                    {Math.max(0, Math.round(product.currentStock / (withStatus.unitsLast30d / 30)))} hari
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Channel + Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Penjualan per Channel (30 Hari)</h2>
          {withStatus.channelBreakdown.length > 0
            ? <ChannelPieChart data={withStatus.channelBreakdown} />
            : <p className="text-sm text-gray-400 text-center py-8">Belum ada data channel</p>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">
            Rating & Ulasan
            <span className="text-gray-400 font-normal text-sm ml-2">({withStatus.totalReviews} total)</span>
          </h2>
          {withStatus.avgRating > 0 ? (
            <>
              <div className="flex items-end gap-3 mb-4">
                <span className="font-heading font-bold text-4xl text-gray-900">{withStatus.avgRating.toFixed(1)}</span>
                <div className="pb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={16} className={s <= Math.round(withStatus.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">dari 5.0</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {ratingDist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 w-3">{star}</span>
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${withStatus.totalReviews > 0 ? (count / withStatus.totalReviews) * 100 : 0}%` }} />
                    </div>
                    <span className="text-gray-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
              {reviews.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-medium text-gray-500">Ulasan Terbaru</p>
                  {reviews.slice(0, 3).map((r) => (
                    <div key={r.id} className="text-xs text-gray-600">
                      <span className="font-medium">{r.reviewerName}</span>
                      {' '}<span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                      {r.reviewText && <span className="text-gray-500"> — "{r.reviewText}"</span>}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Belum ada ulasan</p>
          )}
        </div>
      </div>

      {/* Insight Card */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm mb-1">Insight FoodStocks</p>
            {withStatus.status === 'fast_move' && (
              <p className="text-sm text-gray-600">
                Produk ini terjual <strong>{(withStatus.unitsLast30d / 30).toFixed(0)} unit/hari</strong>, lebih cepat dari rata-rata produk di kategori yang sama.
                {isLow ? ' Stok akan segera habis — restock segera dan manfaatkan momentum ini dengan program iklan.' : ' Momentum bagus! Pertimbangkan boost dengan program iklan untuk hasil maksimal.'}
              </p>
            )}
            {withStatus.status === 'normal' && (
              <p className="text-sm text-gray-600">
                Produk ini dalam performa normal dengan rata-rata <strong>{(withStatus.unitsLast30d / 30).toFixed(0)} unit/hari</strong>.
                Promo atau live selling bisa membantu mendorong ke kategori fast-move.
              </p>
            )}
            {withStatus.status === 'slow_move' && (
              <p className="text-sm text-gray-600">
                Penjualan produk ini di bawah rata-rata. Pertimbangkan review harga, packaging, atau strategi promosi baru.
                Hubungi tim FoodStocks untuk diskusi lebih lanjut.
              </p>
            )}
            {withStatus.status === 'fast_move' && (
              <Link href="/dashboard/ads" className="inline-flex items-center gap-2 mt-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                <Megaphone size={15} /> Ajukan Iklan Sekarang
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
