import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'
import { formatRupiah, formatNumber, CHANNEL_CONFIG } from '@/lib/utils'
import type { Channel } from '@/lib/types'
import Link from 'next/link'
import { TrendingUp, TrendingDown, BarChart2, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const products = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  const totalUnits   = products.reduce((s, p) => s + p.unitsLast30d, 0)
  const totalRevenue = products.reduce((s, p) => s + p.gmvLast30d, 0)

  // ── Aggregate by channel ──
  const channelMap: Record<string, { units: number; revenue: number }> = {}
  for (const p of products) {
    for (const cb of p.channelBreakdown) {
      if (!channelMap[cb.channel]) channelMap[cb.channel] = { units: 0, revenue: 0 }
      channelMap[cb.channel].units   += cb.units
      channelMap[cb.channel].revenue += cb.revenue
    }
  }
  const channels = Object.entries(channelMap)
    .map(([ch, d]) => ({
      channel: ch as Channel,
      units:   d.units,
      revenue: d.revenue,
      pctUnits:   totalUnits   > 0 ? Math.round((d.units   / totalUnits)   * 100) : 0,
      pctRevenue: totalRevenue > 0 ? Math.round((d.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // ── Per-product channel table ──
  const productChannelRows = products
    .filter((p) => p.channelBreakdown.length > 0)
    .sort((a, b) => b.gmvLast30d - a.gmvLast30d)

  const bestChannel = channels[0]

  return (
    <div className="space-y-6 max-w-[1280px]">

      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-[22px] text-gray-900">Analitik Channel</h1>
        <p className="text-gray-400 text-sm mt-0.5">Distribusi penjualan per platform — 30 hari terakhir</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Unit',    value: formatNumber(totalUnits),          sub: '30 hari', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Revenue', value: formatRupiah(totalRevenue, true),  sub: '30 hari', color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Channel Aktif', value: String(channels.length),           sub: 'platform', color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Best Channel',  value: bestChannel ? CHANNEL_CONFIG[bestChannel.channel]?.label ?? bestChannel.channel : '—',
            sub: bestChannel ? `${bestChannel.pctRevenue}% revenue` : '', color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
            <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Channel breakdown bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Revenue per channel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Revenue per Channel</h2>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">30 Hari</span>
          </div>
          <div className="space-y-4">
            {channels.map(({ channel, revenue, pctRevenue }) => {
              const cfg = CHANNEL_CONFIG[channel]
              return (
                <div key={channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg?.hex ?? '#94A3B8' }} />
                      <span className="text-[13px] font-semibold text-gray-700">{cfg?.label ?? channel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-gray-800">{formatRupiah(revenue, true)}</span>
                      <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-12 text-center">
                        {pctRevenue}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pctRevenue}%`, backgroundColor: cfg?.hex ?? '#94A3B8' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Unit per channel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Volume Unit per Channel</h2>
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">30 Hari</span>
          </div>
          <div className="space-y-4">
            {channels.map(({ channel, units, pctUnits }) => {
              const cfg = CHANNEL_CONFIG[channel]
              return (
                <div key={channel}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg?.hex ?? '#94A3B8' }} />
                      <span className="text-[13px] font-semibold text-gray-700">{cfg?.label ?? channel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-gray-800">{formatNumber(units)} unit</span>
                      <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full w-12 text-center">
                        {pctUnits}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pctUnits}%`, backgroundColor: cfg?.hex ?? '#94A3B8' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Per-product channel table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="font-heading font-semibold text-[15px] text-gray-900">Channel per Produk</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Platform dengan kontribusi terbesar per SKU</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-6 py-3">Produk</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Top Channel</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Unit 30H</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Revenue</th>
                <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">WoW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productChannelRows.map((p) => {
                const top = p.channelBreakdown[0]
                const cfg = top ? CHANNEL_CONFIG[top.channel] : null
                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-3.5">
                      <Link href={`/dashboard/products/${p.id}`} className="text-[13px] font-semibold text-gray-800 hover:text-brand-600 transition block">
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-gray-400">{p.sku}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      {top && cfg ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.hex }} />
                          <span className="text-[13px] font-medium text-gray-700">{cfg.label}</span>
                          <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{top.percentage}%</span>
                        </div>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                      <span className="text-[13px] font-semibold text-gray-700">{formatNumber(p.unitsLast30d)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[13px] font-semibold text-gray-700">{formatRupiah(p.gmvLast30d, true)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${p.wowGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.wowGrowth >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                      </span>
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
