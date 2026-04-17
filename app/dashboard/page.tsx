import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getSupplierOverviewData, SUPPLIERS } from '@/lib/mock-data'
import { formatRupiah, formatNumber, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import SparklineCard from '@/components/charts/sparkline-card'
import SalesTrendChart from '@/components/charts/sales-trend-chart'
import StatusDonutChart from '@/components/charts/status-donut-chart'
import ProductImage from '@/components/ui/product-image'
import {
  Megaphone, ArrowRight, AlertTriangle, TrendingUp, TrendingDown,
  Package, ChevronRight, Flame,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user     = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const supplier = SUPPLIERS.find((s) => s.id === user.supplierId)
  const data     = getSupplierOverviewData(user.supplierId)

  const unitSparkData    = data.salesTrend.map((d) => d.units)
  const revenueSparkData = data.salesTrend.map((d) => d.revenue)
  // Rating sparkline: simulate small variation around avgRating
  const ratingSparkData  = data.salesTrend.slice(-14).map((_, i) =>
    Math.max(3, Math.min(5, data.avgRating + (Math.sin(i * 0.8) * 0.3)))
  )

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-bold text-[22px] text-gray-900">
            Halo, {supplier?.brandName ?? user.name}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Ringkasan performa produk Anda — bulan ini
          </p>
        </div>
        {data.hasFastMove && (
          <Link
            href="/dashboard/ads"
            className="hidden sm:flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-brand"
          >
            <Megaphone size={15} /> Ajukan Iklan
          </Link>
        )}
      </div>

      {/* Trending alert banner */}
      {data.hasFastMove && (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                <span className="text-brand-600">{data.fastMoveProductName}</span> sedang TRENDING minggu ini!
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Boost penjualan dengan program iklan FoodStocks sekarang</p>
            </div>
          </div>
          <Link
            href="/dashboard/ads"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shadow-brand"
          >
            Lihat Peluang Iklan <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── Sparkline stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <SparklineCard
          label="Unit Terjual"
          sublabel="30 hari terakhir"
          value={formatNumber(data.unitsThisMonth)}
          growth={data.unitsMomGrowth}
          data={unitSparkData}
          accentColor="#16A34A"
          bgColor="#F0FDF4"
        />
        <SparklineCard
          label="Total GMV"
          sublabel="30 hari terakhir"
          value={formatRupiah(data.gmvThisMonth, true)}
          growth={data.gmvMomGrowth}
          data={revenueSparkData}
          accentColor="#E8161A"
          bgColor="#FFF1F2"
        />
        <SparklineCard
          label="Total SKU"
          sublabel="produk aktif"
          value={formatNumber(data.totalSkus)}
          growth={null}
          data={unitSparkData.map((_, i) => data.totalSkus)}
          accentColor="#7C3AED"
          bgColor="#F5F3FF"
        />
        <SparklineCard
          label="Rating Rata-rata"
          sublabel={`${formatNumber(data.totalReviews)} ulasan`}
          value={`${data.avgRating.toFixed(1)} ⭐`}
          growth={null}
          data={ratingSparkData}
          accentColor="#D97706"
          bgColor="#FFFBEB"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Tren Penjualan</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">30 Hari</span>
          </div>
          <SalesTrendChart data={data.salesTrend} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-heading font-semibold text-[15px] text-gray-900 mb-5">Status Produk</h2>
          <StatusDonutChart
            fastMove={data.fastMoveCount}
            normal={data.normalCount}
            slowMove={data.slowMoveCount}
          />
        </div>
      </div>

      {/* ── Fast-move products table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Produk Fast-Move</h2>
            <p className="text-xs text-gray-400 mt-0.5">Produk dengan pertumbuhan penjualan tertinggi minggu ini</p>
          </div>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
          >
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Produk</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Unit / 30H</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">GMV</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">WoW</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.products
                .filter((p) => p.status === 'fast_move')
                .slice(0, 5)
                .map((p) => {
                  const cfg = STATUS_CONFIG[p.status]
                  return (
                    <tr key={p.id} className="group hover:bg-gray-50/50 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 flex-shrink-0 overflow-hidden">
                            <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link href={`/dashboard/products/${p.id}`} className="text-[13.5px] font-semibold text-gray-800 hover:text-brand-600 transition">
                              {p.name}
                            </Link>
                            <p className="text-[11px] text-gray-400">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-[13.5px] font-medium text-gray-700">{formatNumber(p.unitsLast30d)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden md:table-cell">
                        <span className="text-[13.5px] font-medium text-gray-700">{formatRupiah(p.gmvLast30d, true)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${p.wowGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {p.wowGrowth >= 0
                            ? <TrendingUp size={12} />
                            : <TrendingDown size={12} />}
                          {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/dashboard/products/${p.id}`} className="p-1.5 text-gray-300 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition flex items-center justify-center">
                          <ChevronRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              {data.products.filter((p) => p.status === 'fast_move').length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                    Belum ada produk fast-move saat ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Low stock alert ── */}
      {data.products.some((p) => p.currentStock < p.stockThreshold) && (
        <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-50 bg-red-50/50">
            <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={14} className="text-red-500" />
            </div>
            <p className="font-semibold text-red-700 text-sm">Peringatan Stok Hampir Habis</p>
          </div>
          <div className="px-6 py-4 space-y-2">
            {data.products
              .filter((p) => p.currentStock < p.stockThreshold)
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    Sisa {formatNumber(p.currentStock)} unit
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
