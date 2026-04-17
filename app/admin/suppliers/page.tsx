import { getAdminSuppliersData } from '@/lib/db'
import { formatRupiah, formatNumber, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, Package, TrendingUp, Megaphone, CheckCircle, Clock, MapPin, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

const TIER_CONFIG = {
  small:  { label: 'Small',  bg: 'bg-gray-100',   text: 'text-gray-700',   border: 'border-gray-300'  },
  medium: { label: 'Medium', bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300'  },
  large:  { label: 'Large',  bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
}

export default async function AdminSuppliersPage() {
  const suppliers = await getAdminSuppliersData()

  const totalActive   = suppliers.filter((s) => s.supplier.isActive).length
  const totalGmv      = suppliers.reduce((s, r) => s + r.gmv30d, 0)
  const totalFastMove = suppliers.reduce((s, r) => s + r.fastMove, 0)

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Supplier</h1>
        <p className="text-gray-500 text-sm mt-0.5">Kelola dan pantau semua supplier FoodStocks.id</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users size={20} className="text-brand-500" />, label: 'Supplier Aktif', value: String(totalActive) },
          { icon: <TrendingUp size={20} className="text-brand-500" />, label: 'GMV Total 30H', value: formatRupiah(totalGmv, true) },
          { icon: <Package size={20} className="text-brand-500" />, label: 'Fast-Move SKU', value: String(totalFastMove) },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 lg:p-5">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-3">{icon}</div>
            <p className="font-heading font-bold text-2xl text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Supplier list */}
      <div className="space-y-4">
        {suppliers.map(({ supplier, products, gmv30d, units30d, fastMove, slowMove, avgRating, hasActiveAds, hasPendingAds }) => {
          const tier = TIER_CONFIG[supplier.tier]
          return (
            <div key={supplier.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Logo + info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-brand-600 text-lg">
                      {supplier.brandName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-heading font-bold text-base text-gray-900">{supplier.brandName}</h2>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}>
                        {tier.label}
                      </span>
                      {!supplier.isActive && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    {supplier.description && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">{supplier.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                      {supplier.city && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} /> {supplier.city}
                        </span>
                      )}
                      {supplier.contactPhone && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Phone size={11} /> {supplier.contactPhone}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Bergabung {formatDate(supplier.joinedAt, 'MMM yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ads status */}
                <div className="flex-shrink-0">
                  {hasActiveAds
                    ? <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                        <CheckCircle size={12} /> Ads Aktif
                      </span>
                    : hasPendingAds
                    ? <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full border border-yellow-200">
                        <Clock size={12} /> Ads Pending
                      </span>
                    : <Link href="/admin/ads" className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 hover:border-brand-400 hover:text-brand-600 transition">
                        <Megaphone size={12} /> Tawarkan Iklan
                      </Link>
                  }
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-gray-900">{products.length}</p>
                  <p className="text-xs text-gray-400">Total SKU</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-gray-900">{formatNumber(units30d)}</p>
                  <p className="text-xs text-gray-400">Unit / 30H</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-brand-600">{formatRupiah(gmv30d, true)}</p>
                  <p className="text-xs text-gray-400">GMV 30H</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-green-600">{fastMove}</p>
                  <p className="text-xs text-gray-400">Fast-Move</p>
                </div>
                <div className="text-center">
                  <p className="font-heading font-bold text-lg text-gray-900">
                    {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                  </p>
                  <p className="text-xs text-gray-400">Avg Rating</p>
                </div>
              </div>

              {/* Products preview */}
              {products.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs font-medium text-gray-400 mb-2">Produk ({products.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {products.slice(0, 6).map((p) => (
                      <span key={p.id} className={`text-xs px-2 py-0.5 rounded-full border ${
                        p.status === 'fast_move' ? 'bg-green-50 text-green-700 border-green-200' :
                        p.status === 'slow_move' ? 'bg-red-50 text-red-600 border-red-200' :
                        'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {p.name}
                      </span>
                    ))}
                    {products.length > 6 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                        +{products.length - 6} lainnya
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
