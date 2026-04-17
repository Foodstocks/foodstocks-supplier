'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LayoutList, LayoutGrid, TrendingUp, TrendingDown, Minus,
  Megaphone, ChevronRight, AlertTriangle, Star,
} from 'lucide-react'
import { formatNumber, formatRupiah, STATUS_CONFIG, CHANNEL_CONFIG } from '@/lib/utils'
import type { ProductWithStatus } from '@/lib/types'
import ProductImage from '@/components/ui/product-image'

interface Props {
  products: ProductWithStatus[]
}

export default function ProductsView({ products }: Props) {
  const [view, setView] = useState<'list' | 'grid'>('list')

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              view === 'list'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutList size={14} /> List
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all ${
              view === 'grid'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutGrid size={14} /> Grid
          </button>
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-6 py-3.5">Produk</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Stok</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">7 Hari</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">30 Hari</th>
                  <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5 hidden lg:table-cell">Rating</th>
                  <th className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 w-10" aria-label="Aksi" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const cfg   = STATUS_CONFIG[p.status]
                  const isLow = p.currentStock < p.stockThreshold
                  const topCh = p.channelBreakdown[0]
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 flex-shrink-0 overflow-hidden">
                            <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/dashboard/products/${p.id}`} className="text-[13px] font-semibold text-gray-800 hover:text-brand-600 truncate block max-w-[200px] transition">
                              {p.name}
                            </Link>
                            <p className="text-[11px] text-gray-400">{p.sku}</p>
                            {topCh && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHANNEL_CONFIG[topCh.channel]?.hex }} />
                                <span className="text-[10px] text-gray-400">{CHANNEL_CONFIG[topCh.channel]?.label} {topCh.percentage}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className={`text-[13px] font-semibold ${isLow ? 'text-red-600' : 'text-gray-800'}`}>
                          {formatNumber(p.currentStock)}
                        </span>
                        {isLow && (
                          <div className="flex items-center justify-end gap-0.5 mt-0.5">
                            <AlertTriangle size={10} className="text-red-500" />
                            <span className="text-[10px] font-semibold text-red-500">Menipis</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <span className="text-[13px] font-semibold text-gray-800">{formatNumber(p.unitsLast7d)}</span>
                        <div className="flex items-center justify-end gap-0.5 mt-0.5">
                          {p.wowGrowth > 5  ? <TrendingUp size={10} className="text-green-500" /> :
                           p.wowGrowth < -5 ? <TrendingDown size={10} className="text-red-400" /> :
                                              <Minus size={10} className="text-gray-400" />}
                          <span className={`text-[10px] font-medium ${p.wowGrowth > 5 ? 'text-green-600' : p.wowGrowth < -5 ? 'text-red-500' : 'text-gray-400'}`}>
                            {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right hidden sm:table-cell">
                        <span className="text-[13px] font-semibold text-gray-800">{formatNumber(p.unitsLast30d)}</span>
                        <p className="text-[10px] text-gray-400">{formatRupiah(p.gmvLast30d, true)}</p>
                      </td>

                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <span className="text-[13px] text-gray-800">{p.avgRating > 0 ? `${p.avgRating.toFixed(1)} ⭐` : '—'}</span>
                        <p className="text-[10px] text-gray-400">{p.totalReviews} ulasan</p>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 justify-end">
                          {p.status === 'fast_move' && (
                            <Link href="/dashboard/ads"
                              className="hidden group-hover:flex items-center gap-1 text-[11px] bg-brand-500 text-white px-2.5 py-1.5 rounded-lg font-semibold hover:bg-brand-600 transition">
                              <Megaphone size={11} /> Iklan
                            </Link>
                          )}
                          <Link href={`/dashboard/products/${p.id}`} className="p-1.5 text-gray-300 hover:text-brand-500 rounded-lg hover:bg-brand-50 transition">
                            <ChevronRight size={15} />
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
      )}

      {/* ── GRID VIEW ── */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((p) => {
            const cfg   = STATUS_CONFIG[p.status]
            const isLow = p.currentStock < p.stockThreshold
            const topCh = p.channelBreakdown[0]
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">

                {/* Top: image + status */}
                <div className="relative p-5 pb-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-brand-50 flex-shrink-0 overflow-hidden">
                      <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/products/${p.id}`} className="font-heading font-semibold text-[14px] text-gray-900 hover:text-brand-600 transition leading-snug block">
                        {p.name}
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-0.5">{p.sku}</p>
                      {topCh && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHANNEL_CONFIG[topCh.channel]?.hex }} />
                          <span className="text-[10px] text-gray-400">{CHANNEL_CONFIG[topCh.channel]?.label} {topCh.percentage}%</span>
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-0 border-t border-gray-50">
                  <div className="px-4 py-3 text-center border-r border-gray-50">
                    <p className="font-heading font-bold text-[15px] text-gray-900">{formatNumber(p.unitsLast30d)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Unit/30H</p>
                  </div>
                  <div className="px-4 py-3 text-center border-r border-gray-50">
                    <p className="font-heading font-bold text-[15px] text-brand-600">{formatRupiah(p.gmvLast30d, true)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">GMV 30H</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <p className={`font-heading font-bold text-[15px] flex items-center justify-center gap-0.5
                      ${p.wowGrowth > 5 ? 'text-green-600' : p.wowGrowth < -5 ? 'text-red-500' : 'text-gray-600'}`}>
                      {p.wowGrowth > 5  ? <TrendingUp  size={12} /> :
                       p.wowGrowth < -5 ? <TrendingDown size={12} /> :
                                          <Minus        size={12} />}
                      {p.wowGrowth > 0 ? '+' : ''}{p.wowGrowth.toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">WoW</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-[#FAFAFA] border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Stock */}
                    <div className="flex items-center gap-1">
                      {isLow && <AlertTriangle size={11} className="text-red-500" />}
                      <span className={`text-[11px] font-medium ${isLow ? 'text-red-600' : 'text-gray-500'}`}>
                        {formatNumber(p.currentStock)} unit
                      </span>
                    </div>
                    {/* Rating */}
                    {p.avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span className="text-[11px] font-medium text-gray-500">{p.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {p.status === 'fast_move' && (
                      <Link href="/dashboard/ads"
                        className="flex items-center gap-1 text-[11px] bg-brand-500 text-white px-2 py-1 rounded-lg font-semibold hover:bg-brand-600 transition">
                        <Megaphone size={10} /> Iklan
                      </Link>
                    )}
                    <Link href={`/dashboard/products/${p.id}`}
                      className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-brand-600 px-2 py-1 rounded-lg hover:bg-brand-50 transition">
                      Detail <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
