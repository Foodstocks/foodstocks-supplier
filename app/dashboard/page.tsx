import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getSupplierOverviewData, SUPPLIERS } from '@/lib/mock-data'
import { formatRupiah, formatNumber, formatGrowth, formatDateShort, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import SalesTrendChart from '@/components/charts/sales-trend-chart'
import StatusDonutChart from '@/components/charts/status-donut-chart'
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, Star, Megaphone, ArrowRight, AlertTriangle } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const supplier = SUPPLIERS.find((s) => s.id === user.supplierId)
  const data     = getSupplierOverviewData(user.supplierId)

  const growthColor = (v: number) => v >= 0 ? 'text-green-600' : 'text-red-500'
  const GrowthIcon  = ({ v }: { v: number }) =>
    v >= 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">
          Halo, {supplier?.brandName ?? user.name}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Berikut ringkasan performa produk Anda bulan ini</p>
      </div>

      {/* Ads Banner (conditional) */}
      {data.hasFastMove && (
        <div className="bg-brand-50 border border-brand-300 border-l-4 border-l-brand-500 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                <span className="text-brand-600">{data.fastMoveProductName}</span> sedang TRENDING minggu ini!
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Boost penjualan dengan program iklan FoodStocks sekarang</p>
            </div>
          </div>
          <Link href="/dashboard/ads" className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap">
            Lihat Peluang Iklan <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Package size={20} className="text-brand-500" />}
          label="Total SKU"
          value={formatNumber(data.totalSkus)}
          sub="produk aktif"
          growth={null}
        />
        <SummaryCard
          icon={<ShoppingCart size={20} className="text-brand-500" />}
          label="Unit Terjual"
          value={formatNumber(data.unitsThisMonth)}
          sub="30 hari terakhir"
          growth={data.unitsMomGrowth}
        />
        <SummaryCard
          icon={<DollarSign size={20} className="text-brand-500" />}
          label="Total GMV"
          value={formatRupiah(data.gmvThisMonth, true)}
          sub="30 hari terakhir"
          growth={data.gmvMomGrowth}
        />
        <SummaryCard
          icon={<Star size={20} className="text-brand-500" />}
          label="Rating Rata-rata"
          value={data.avgRating.toFixed(1)}
          sub={`${formatNumber(data.totalReviews)} ulasan`}
          growth={null}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Tren Penjualan 30 Hari</h2>
          <SalesTrendChart data={data.salesTrend} />
        </div>
        {/* Status donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Status Produk</h2>
          <StatusDonutChart
            fastMove={data.fastMoveCount}
            normal={data.normalCount}
            slowMove={data.slowMoveCount}
          />
        </div>
      </div>

      {/* Fast-move products preview */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-base text-gray-900">Produk Fast-Move Minggu Ini</h2>
          <Link href="/dashboard/products" className="text-sm text-brand-500 hover:underline font-medium flex items-center gap-1">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {data.products
            .filter((p) => p.status === 'fast_move')
            .slice(0, 3)
            .map((p) => {
              const cfg = STATUS_CONFIG[p.status]
              return (
                <Link key={p.id} href={`/dashboard/products/${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{formatNumber(p.unitsLast30d)} unit / 30 hari</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <span className="text-xs font-semibold text-green-600">↑{Math.abs(p.wowGrowth).toFixed(0)}%</span>
                    <Link href="/dashboard/ads" onClick={(e) => e.stopPropagation()}
                      className="hidden sm:flex items-center gap-1 text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg font-semibold transition">
                      <Megaphone size={12} /> Iklan
                    </Link>
                  </div>
                </Link>
              )
            })}
          {data.products.filter((p) => p.status === 'fast_move').length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              Belum ada produk fast-move saat ini
            </div>
          )}
        </div>
      </div>

      {/* Low stock alert */}
      {data.products.some((p) => p.currentStock < p.stockThreshold) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <p className="font-semibold text-red-700 text-sm">Stok Hampir Habis</p>
          </div>
          <div className="space-y-1">
            {data.products
              .filter((p) => p.currentStock < p.stockThreshold)
              .map((p) => (
                <p key={p.id} className="text-sm text-red-600">
                  · <strong>{p.name}</strong> — tersisa {formatNumber(p.currentStock)} unit
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon, label, value, sub, growth }: {
  icon: React.ReactNode; label: string; value: string; sub: string; growth: number | null
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">{icon}</div>
        {growth !== null && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {growth >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
            {formatGrowth(growth)}
          </span>
        )}
      </div>
      <p className="font-heading font-bold text-2xl lg:text-3xl text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )
}
