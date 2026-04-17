import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'
import ProductImage from '@/components/ui/product-image'

export const dynamic = 'force-dynamic'
import { formatNumber, formatRupiah, STATUS_CONFIG, CHANNEL_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Minus, Megaphone, ChevronRight, AlertTriangle } from 'lucide-react'

export default async function ProductsPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const products = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  const fastMoves = products.filter((p) => p.status === 'fast_move').length
  const slowMoves = products.filter((p) => p.status === 'slow_move').length

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Produk Saya</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} produk aktif · {fastMoves} fast-move · {slowMoves} slow-move
          </p>
        </div>
        <Link href="/dashboard/ads" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          <Megaphone size={15} /> Ajukan Iklan
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">Produk</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Stok</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">7 Hari</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">30 Hari</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Rating</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => {
                const cfg      = STATUS_CONFIG[p.status]
                const isLow    = p.currentStock < p.stockThreshold
                const topCh    = p.channelBreakdown[0]

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 flex-shrink-0 overflow-hidden">
                          <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link href={`/dashboard/products/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-brand-600 truncate block max-w-[180px]">
                            {p.name}
                          </Link>
                          <p className="text-xs text-gray-400">{p.sku}</p>
                          {/* Channel mini bar */}
                          {topCh && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-gray-400">{CHANNEL_CONFIG[topCh.channel]?.label}</span>
                              <span className="text-[10px] font-medium text-gray-500">{topCh.percentage}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right hidden md:table-cell">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium text-gray-900">{formatNumber(p.currentStock)}</span>
                        {isLow && (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-red-600">
                            <AlertTriangle size={10} /> Menipis
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{formatNumber(p.unitsLast7d)}</span>
                        <div className="flex items-center justify-end gap-0.5">
                          {p.wowGrowth > 5  ? <TrendingUp size={11} className="text-green-500" /> :
                           p.wowGrowth < -5 ? <TrendingDown size={11} className="text-red-400" /> :
                           <Minus size={11} className="text-gray-400" />}
                          <span className={`text-[10px] font-medium ${p.wowGrowth > 5 ? 'text-green-600' : p.wowGrowth < -5 ? 'text-red-500' : 'text-gray-400'}`}>
                            {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-right hidden sm:table-cell">
                      <span className="text-sm font-medium text-gray-900">{formatNumber(p.unitsLast30d)}</span>
                      <p className="text-[10px] text-gray-400">{formatRupiah(p.gmvLast30d, true)}</p>
                    </td>

                    <td className="px-4 py-4 text-right hidden lg:table-cell">
                      <span className="text-sm text-gray-900">{p.avgRating > 0 ? `${p.avgRating.toFixed(1)} ⭐` : '—'}</span>
                      <p className="text-[10px] text-gray-400">{p.totalReviews} ulasan</p>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {p.status === 'fast_move' && (
                          <Link href="/dashboard/ads"
                            className="hidden group-hover:flex items-center gap-1 text-xs bg-brand-500 text-white px-2.5 py-1.5 rounded-lg font-semibold transition hover:bg-brand-600">
                            <Megaphone size={11}/> Iklan
                          </Link>
                        )}
                        <Link href={`/dashboard/products/${p.id}`} className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition">
                          <ChevronRight size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
