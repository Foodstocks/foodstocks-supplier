import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus, getProductSalesTrend } from '@/lib/mock-data'
import { formatRupiah, formatNumber, STATUS_CONFIG, CHANNEL_CONFIG } from '@/lib/utils'
import ExportCsvButton from '@/components/ui/export-csv-button'
import Link from 'next/link'
import { FileText, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const products = getProductsBySupplier(user.supplierId).map(getProductWithStatus)

  // Summary
  const totalGmv   = products.reduce((s, p) => s + p.gmvLast30d, 0)
  const totalUnits = products.reduce((s, p) => s + p.unitsLast30d, 0)
  const fastMoves  = products.filter((p) => p.status === 'fast_move').length
  const lowStock   = products.filter((p) => p.currentStock < p.stockThreshold).length

  // CSV data
  const csvData = products.map((p) => ({
    'SKU':            p.sku,
    'Nama Produk':    p.name,
    'Kategori':       p.category ?? '-',
    'Status':         p.status,
    'Unit 7H':        p.unitsLast7d,
    'Unit 30H':       p.unitsLast30d,
    'GMV 30H (Rp)':   p.gmvLast30d,
    'WoW Growth (%)': p.wowGrowth.toFixed(1),
    'MoM Growth (%)': p.momGrowth.toFixed(1),
    'Avg Rating':     p.avgRating.toFixed(1),
    'Total Reviews':  p.totalReviews,
    'Stok':           p.currentStock,
    'Threshold':      p.stockThreshold,
    'Top Channel':    p.channelBreakdown[0] ? CHANNEL_CONFIG[p.channelBreakdown[0].channel]?.label : '-',
  }))

  const sorted = [...products].sort((a, b) => b.gmvLast30d - a.gmvLast30d)

  return (
    <div className="space-y-6 max-w-[1280px]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-bold text-[22px] text-gray-900">Laporan</h1>
          <p className="text-gray-400 text-sm mt-0.5">Ringkasan performa semua produk — 30 hari terakhir</p>
        </div>
        <ExportCsvButton data={csvData} filename="laporan-produk" label="Export CSV" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV 30H',     value: formatRupiah(totalGmv, true),  sub: 'semua produk',      color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Total Unit 30H',    value: formatNumber(totalUnits),       sub: 'unit terjual',      color: 'text-blue-600',  bg: 'bg-blue-50'  },
          { label: 'Fast-Move SKU',     value: String(fastMoves),              sub: `dari ${products.length} produk`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Stok Menipis',      value: String(lowStock),               sub: 'perlu restock',     color: lowStock > 0 ? 'text-red-600' : 'text-gray-400', bg: lowStock > 0 ? 'bg-red-50' : 'bg-gray-50' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
            <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Full product table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Detail Produk</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">{products.length} produk aktif</p>
          </div>
          <ExportCsvButton data={csvData} filename="laporan-produk" label="Export" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Produk</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Unit 7H</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Unit 30H</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">GMV 30H</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">WoW</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Stok</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden xl:table-cell">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((p) => {
                const cfg   = STATUS_CONFIG[p.status]
                const isLow = p.currentStock < p.stockThreshold
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-3.5">
                      <Link href={`/dashboard/products/${p.id}`} className="text-[13px] font-semibold text-gray-800 hover:text-brand-600 transition block">
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-gray-400">{p.sku} · {p.category}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                      <span className="text-[13px] text-gray-700">{formatNumber(p.unitsLast7d)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[13px] font-semibold text-gray-800">{formatNumber(p.unitsLast30d)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden md:table-cell">
                      <span className="text-[13px] font-semibold text-gray-800">{formatRupiah(p.gmvLast30d, true)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${p.wowGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.wowGrowth >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                      <span className={`text-[13px] font-semibold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                        {formatNumber(p.currentStock)}
                      </span>
                      {isLow && (
                        <div className="flex items-center justify-end gap-0.5 mt-0.5">
                          <AlertTriangle size={10} className="text-red-500" />
                          <span className="text-[10px] text-red-500 font-semibold">Menipis</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center hidden xl:table-cell">
                      <span className="text-[13px] text-gray-700">
                        {p.avgRating > 0 ? `${p.avgRating.toFixed(1)} ⭐` : '—'}
                      </span>
                      <p className="text-[10px] text-gray-400">{p.totalReviews} ulasan</p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* CSV info footer */}
        <div className="px-6 py-3.5 border-t border-gray-50 bg-[#FAFAFA] flex items-center justify-between">
          <p className="text-[12px] text-gray-400">
            <FileText size={12} className="inline mr-1.5" />
            Data export mencakup semua kolom termasuk channel, rating, dan stok
          </p>
          <ExportCsvButton data={csvData} filename="laporan-produk" label="Download CSV" />
        </div>
      </div>
    </div>
  )
}
