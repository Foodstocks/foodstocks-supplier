import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'
import { formatNumber, formatRupiah } from '@/lib/utils'
import RestockForm from '@/components/ui/restock-form'
import { AlertTriangle, Package, TrendingDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RestockPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const products = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  const lowStock = products.filter((p) => p.currentStock < p.stockThreshold)

  // Sort: low stock first, then by name
  const sortedProducts = [...products].sort((a, b) => {
    const aLow = a.currentStock < a.stockThreshold ? 0 : 1
    const bLow = b.currentStock < b.stockThreshold ? 0 : 1
    return aLow - bLow || a.name.localeCompare(b.name)
  })

  const productOptions = sortedProducts.map((p) => ({
    id:           p.id,
    name:         p.name,
    sku:          p.sku,
    currentStock: p.currentStock,
    threshold:    p.stockThreshold,
  }))

  // Avg daily velocity
  const withVelocity = products.map((p) => ({
    ...p,
    dailyAvg: Math.round(p.unitsLast30d / 30),
    daysLeft:  p.unitsLast30d > 0
      ? Math.max(0, Math.round(p.currentStock / (p.unitsLast30d / 30)))
      : 999,
  })).sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div className="space-y-6 max-w-[1280px]">

      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-[22px] text-gray-900">Restock Request</h1>
        <p className="text-gray-400 text-sm mt-0.5">Ajukan permintaan restock produk ke tim FoodStocks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Alert if low stock */}
          {lowStock.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 mb-0.5">
                  {lowStock.length} produk stok kritis
                </p>
                <p className="text-xs text-red-500">
                  {lowStock.map((p) => p.name).join(', ')} — segera ajukan restock
                </p>
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading font-semibold text-[15px] text-gray-900 mb-5">Buat Request Baru</h2>
            <RestockForm products={productOptions} />
          </div>
        </div>

        {/* Stok overview sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-heading font-semibold text-[14px] text-gray-900 mb-4">Estimasi Stok Habis</h2>
            <div className="space-y-3">
              {withVelocity.slice(0, 6).map((p) => {
                const isLow    = p.currentStock < p.stockThreshold
                const isCrit   = p.daysLeft <= 7
                const isWarn   = p.daysLeft <= 14 && !isCrit
                return (
                  <div key={p.id} className={`p-3 rounded-xl border ${isCrit ? 'bg-red-50 border-red-200' : isWarn ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-gray-800 truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{formatNumber(p.currentStock)} unit · {p.dailyAvg}/hari</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isCrit ? 'bg-red-100 text-red-700' : isWarn ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.daysLeft >= 999 ? '∞' : `${p.daysLeft}h`}
                      </span>
                    </div>
                    {isLow && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <AlertTriangle size={10} className="text-red-500" />
                        <span className="text-[10px] text-red-600 font-semibold">Di bawah threshold</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info card */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-brand-500" />
              <p className="font-semibold text-brand-700 text-sm">Cara Kerja Restock</p>
            </div>
            <ol className="space-y-2 text-xs text-brand-700">
              <li className="flex gap-2"><span className="font-bold text-brand-500 flex-shrink-0">1.</span>Isi form request dengan produk dan jumlah yang dibutuhkan</li>
              <li className="flex gap-2"><span className="font-bold text-brand-500 flex-shrink-0">2.</span>Tim FoodStocks akan menghubungi Anda dalam 1×24 jam</li>
              <li className="flex gap-2"><span className="font-bold text-brand-500 flex-shrink-0">3.</span>Jadwal pengiriman stok akan dikonfirmasi via WhatsApp</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
