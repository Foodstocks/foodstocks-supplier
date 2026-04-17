import { getAdminOverviewData } from '@/lib/db'
import { formatRupiah, formatNumber } from '@/lib/utils'
import Link from 'next/link'
import { Users, TrendingUp, Megaphone, DollarSign, ChevronRight, CheckCircle, Clock } from 'lucide-react'
import AdminDataImport from '@/components/admin/data-import'

export default async function AdminPage() {
  const overview = await getAdminOverviewData()
  const { supplierRankings: rankings, totalGmv30d: totalGmv, pendingAdsRequests: pendingCount, activeAdsRevenue: adsRevenue, activeSuppliers, totalSuppliers } = overview

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">FoodStocks.id Supplier Dashboard</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users size={20} className="text-brand-500"/>, label:'Supplier Aktif', value: String(activeSuppliers), sub:`dari ${totalSuppliers} total` },
          { icon: <TrendingUp size={20} className="text-brand-500"/>, label:'GMV 30 Hari', value: formatRupiah(totalGmv, true), sub:'semua supplier' },
          { icon: <Megaphone size={20} className="text-brand-500"/>, label:'Pending Ads', value: String(pendingCount), sub:'request menunggu review' },
          { icon: <DollarSign size={20} className="text-brand-500"/>, label:'Revenue Iklan', value: formatRupiah(adsRevenue, true), sub:'dari program ads' },
        ].map(({ icon, label, value, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-3">{icon}</div>
            <p className="font-heading font-bold text-2xl text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Ads pipeline quick view */}
      {pendingCount > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-brand-500" />
            <p className="text-sm font-semibold text-gray-900">
              {pendingCount} request iklan menunggu review
            </p>
          </div>
          <Link href="/admin/ads" className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Review Sekarang <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Supplier ranking table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-base text-gray-900">Ranking Supplier (GMV 30 Hari)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Supplier</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">GMV 30H</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Unit</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Fast-Move</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Iklan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rankings.map(({ supplier, gmv30d, unitsSold30d: units30d, fastMoveCount: fastMove, totalSkus, hasActiveAds: hasActive, hasPendingAds: hasPending }, idx) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 text-sm font-bold text-gray-400">#{idx + 1}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{supplier.brandName}</p>
                      <p className="text-xs text-gray-400">{totalSkus} SKU · {supplier.city}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatRupiah(gmv30d, true)}</p>
                  </td>
                  <td className="px-4 py-4 text-right hidden md:table-cell">
                    <p className="text-sm text-gray-700">{formatNumber(units30d)}</p>
                  </td>
                  <td className="px-4 py-4 text-center hidden lg:table-cell">
                    {fastMove > 0
                      ? <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{fastMove} SKU</span>
                      : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {hasActive
                      ? <span className="flex items-center justify-center gap-1 text-xs font-semibold text-green-600"><CheckCircle size={12}/>Aktif</span>
                      : hasPending
                      ? <span className="flex items-center justify-center gap-1 text-xs font-semibold text-yellow-600"><Clock size={12}/>Pending</span>
                      : <span className="text-xs text-gray-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Import */}
      <AdminDataImport />
    </div>
  )
}
