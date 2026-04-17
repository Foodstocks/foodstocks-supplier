import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getSupplierOverviewData, SUPPLIERS } from '@/lib/mock-data'
import { formatRupiah, formatNumber, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import SalesTrendChart from '@/components/charts/sales-trend-chart'
import StatusDonutChart from '@/components/charts/status-donut-chart'
import ProductImage from '@/components/ui/product-image'
import {
  TrendingUp, TrendingDown, Megaphone, ArrowRight, AlertTriangle,
  ChevronRight, ShoppingCart, DollarSign, Star, Flame, Package,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function StatCard({
  icon, iconBg, label, value, growth, sub,
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  growth: number | null
  sub?: string
}) {
  const isUp   = growth !== null && growth > 0
  const isDown = growth !== null && growth < 0
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {growth !== null && (
          <span className={`flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-lg
            ${isUp ? 'bg-green-50 text-green-600' : isDown ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'}`}>
            {isUp ? <TrendingUp size={11} /> : isDown ? <TrendingDown size={11} /> : null}
            {isUp ? '+' : ''}{growth.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="font-heading font-bold text-[26px] text-gray-900 leading-none">{value}</p>
      <p className="text-[12px] font-semibold text-gray-500 mt-1.5">{label}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const supplier = SUPPLIERS.find((s) => s.id === user.supplierId)
  const data     = getSupplierOverviewData(user.supplierId)

  return (
    <div className="space-y-6 max-w-[1280px]">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-bold text-[22px] text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Halo, <span className="font-medium text-gray-600">{supplier?.brandName ?? user.name}</span> — berikut performa produk Anda
          </p>
        </div>
        {data.hasFastMove && (
          <Link
            href="/dashboard/ads"
            className="hidden sm:flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-brand"
          >
            <Megaphone size={14} /> Ajukan Iklan
          </Link>
        )}
      </div>

      {/* ── Trending banner ── */}
      {data.hasFastMove && (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Flame size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                <span className="text-brand-600">{data.fastMoveProductName}</span> sedang TRENDING minggu ini!
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Manfaatkan momentum ini dengan program iklan FoodStocks</p>
            </div>
          </div>
          <Link
            href="/dashboard/ads"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap shadow-brand"
          >
            Lihat Peluang <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign size={19} className="text-brand-500" />}
          iconBg="bg-brand-50"
          label="Total GMV"
          value={formatRupiah(data.gmvThisMonth, true)}
          growth={data.gmvMomGrowth}
          sub="30 hari terakhir"
        />
        <StatCard
          icon={<ShoppingCart size={19} className="text-blue-500" />}
          iconBg="bg-blue-50"
          label="Unit Terjual"
          value={formatNumber(data.unitsThisMonth)}
          growth={data.unitsMomGrowth}
          sub="30 hari terakhir"
        />
        <StatCard
          icon={<Package size={19} className="text-violet-500" />}
          iconBg="bg-violet-50"
          label="Total SKU"
          value={formatNumber(data.totalSkus)}
          growth={null}
          sub="produk aktif"
        />
        <StatCard
          icon={<Star size={19} className="text-amber-500" />}
          iconBg="bg-amber-50"
          label="Rating Rata-rata"
          value={data.avgRating.toFixed(1)}
          growth={null}
          sub={`${formatNumber(data.totalReviews)} ulasan`}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-semibold text-[15px] text-gray-900">Sales Overview</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Tren penjualan 30 hari terakhir</p>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">30 Hari</span>
          </div>
          <SalesTrendChart data={data.salesTrend} />
        </div>

        {/* Status Produk */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Status Produk</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Distribusi performa SKU</p>
          </div>
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
            <p className="text-[12px] text-gray-400 mt-0.5">Produk dengan pertumbuhan tertinggi minggu ini</p>
          </div>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-1.5 text-[13px] font-medium text-brand-500 hover:text-brand-600 transition"
          >
            Lihat Semua <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">#</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Produk</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Unit / 30H</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden md:table-cell">GMV</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">WoW</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="px-4 py-3 w-10" aria-label="Aksi" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.products
                .filter((p) => p.status === 'fast_move')
                .slice(0, 6)
                .map((p, idx) => {
                  const cfg = STATUS_CONFIG[p.status]
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition">
                      <td className="px-6 py-3.5">
                        <span className="text-[12px] font-bold text-gray-300">{String(idx + 1).padStart(2, '0')}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 flex-shrink-0 overflow-hidden">
                            <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <Link href={`/dashboard/products/${p.id}`} className="text-[13px] font-semibold text-gray-800 hover:text-brand-600 transition block">
                              {p.name}
                            </Link>
                            <p className="text-[11px] text-gray-400">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-[13px] font-semibold text-gray-700">{formatNumber(p.unitsLast30d)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden md:table-cell">
                        <span className="text-[13px] font-semibold text-gray-700">{formatRupiah(p.gmvLast30d, true)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${p.wowGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {p.wowGrowth >= 0
                            ? <TrendingUp size={11} />
                            : <TrendingDown size={11} />}
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
                        <Link
                          href={`/dashboard/products/${p.id}`}
                          className="p-1.5 text-gray-300 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition flex items-center justify-center"
                        >
                          <ChevronRight size={15} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              {data.products.filter((p) => p.status === 'fast_move').length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">
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
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-50 bg-red-50/40">
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
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    <span className="text-[13.5px] font-medium text-gray-800">{p.name}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-red-600">
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
