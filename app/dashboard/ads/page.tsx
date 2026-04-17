'use client'

import { useEffect, useState } from 'react'
import { formatRupiah, formatNumber, formatRelativeTime, STATUS_CONFIG } from '@/lib/utils'
import { ADS_PACKAGES } from '@/lib/types'
import type { ProductWithStatus, AdsRequest, AdsTier } from '@/lib/types'
import { Megaphone, CheckCircle, Clock, XCircle, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const STATUS_STEPS = ['Kirim', 'Review', 'Approved', 'Aktif', 'Selesai']
const STATUS_STEP_MAP: Record<string, number> = { pending: 1, reviewing: 2, approved: 3, active: 4, completed: 5, cancelled: 0, rejected: 0 }

export default function AdsPage() {
  const [eligible, setEligible]       = useState<ProductWithStatus[]>([])
  const [requests, setRequests]       = useState<(AdsRequest & { product?: ProductWithStatus })[]>([])
  const [loading, setLoading]         = useState(true)
  const [selectedProduct, setSelected] = useState<string>('')
  const [selectedPkg, setPkg]         = useState<AdsTier>('starter')
  const [notes, setNotes]             = useState('')
  const [preferredStart, setStart]    = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [success, setSuccess]         = useState(false)
  const [formError, setFormError]     = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/supplier/ads/eligible').then((r) => r.json()),
      fetch('/api/supplier/ads/requests').then((r) => r.json()),
    ]).then(([eligibleData, requestData]) => {
      setEligible(eligibleData.products ?? [])
      setRequests(requestData.requests ?? [])
      setLoading(false)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProduct) { setFormError('Pilih produk terlebih dahulu'); return }
    setSubmitting(true); setFormError('')
    const res = await fetch('/api/supplier/ads/requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: selectedProduct, packageTier: selectedPkg, notes, preferredStart }),
    })
    if (res.ok) {
      const data = await res.json()
      setRequests((prev) => [{ ...data.request, product: eligible.find((p) => p.id === selectedProduct) }, ...prev])
      setSuccess(true); setSelected(''); setNotes(''); setStart('')
      setTimeout(() => setSuccess(false), 4000)
    } else {
      setFormError('Gagal mengirim request. Coba lagi.')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="space-y-4 max-w-5xl">
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-skeleton" />)}
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Peluang Iklan</h1>
        <p className="text-gray-500 text-sm mt-0.5">Boost produk fast-move untuk hasil penjualan maksimal</p>
      </div>

      {/* Eligible products */}
      {eligible.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-base text-gray-900">Produk Siap Di-Boost ({eligible.length})</h2>
          {eligible.map((p) => {
            const cfg = STATUS_CONFIG[p.status]
            return (
              <div key={p.id} className={`bg-white rounded-xl border-2 ${selectedProduct === p.id ? 'border-brand-500' : 'border-gray-200'} p-4 cursor-pointer transition`}
                onClick={() => setSelected(selectedProduct === p.id ? '' : p.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-100 flex-shrink-0 overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatNumber(p.unitsLast30d)} unit / 30 hari · ⭐ {p.avgRating.toFixed(1)} ·
                      <span className="text-green-600 font-medium"> ↑{p.wowGrowth.toFixed(0)}% WoW</span>
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${selectedProduct === p.id ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                    {selectedProduct === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {eligible.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          <TrendingUp size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Belum ada produk yang memenuhi syarat iklan saat ini.</p>
          <p className="text-gray-400 text-xs mt-1">Produk perlu mencapai 50+ unit/bulan atau masuk kategori Fast-Move.</p>
        </div>
      )}

      {/* Package cards */}
      <div>
        <h2 className="font-heading font-semibold text-base text-gray-900 mb-3">Pilih Paket Iklan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.entries(ADS_PACKAGES) as [AdsTier, typeof ADS_PACKAGES[AdsTier]][]).map(([tier, pkg]) => (
            <div key={tier}
              onClick={() => setPkg(tier)}
              className={`relative bg-white rounded-xl border-2 p-5 cursor-pointer transition ${selectedPkg === tier ? 'border-brand-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
              {tier === 'booster' && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                  POPULER
                </span>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="font-heading font-bold text-base text-gray-900">{pkg.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPkg === tier ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                  {selectedPkg === tier && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
              <p className="font-heading font-bold text-2xl text-brand-500 mb-1">{pkg.priceLabel}</p>
              <p className="text-xs text-gray-400 mb-3">per minggu</p>
              <ul className="space-y-1.5 mb-3">
                {pkg.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" /> {b}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-semibold text-brand-600 bg-brand-50 rounded-lg px-2 py-1.5">
                <Zap size={11} className="inline mr-1" />Est. {pkg.estimate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit form */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Ajukan Request Iklan</h2>
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
            <CheckCircle size={16} /> Request berhasil dikirim! Tim FoodStocks akan meninjau dalam 1×24 jam.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="select-product" className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
              <select id="select-product" title="Pilih produk" value={selectedProduct} onChange={(e) => setSelected(e.target.value)} required
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Pilih produk...</option>
                {eligible.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="select-package" className="block text-sm font-medium text-gray-700 mb-1">Paket *</label>
              <select id="select-package" title="Pilih paket iklan" value={selectedPkg} onChange={(e) => setPkg(e.target.value as AdsTier)}
                className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                {(Object.entries(ADS_PACKAGES) as [AdsTier, typeof ADS_PACKAGES[AdsTier]][]).map(([tier, pkg]) => (
                  <option key={tier} value={tier}>{pkg.label} — {pkg.priceLabel}/minggu</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="preferred-start" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai yang Diinginkan</label>
            <input id="preferred-start" type="date" title="Tanggal mulai yang diinginkan" value={preferredStart} onChange={(e) => setStart(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (opsional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Contoh: produk lagi trending, mau boost sebelum weekend..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <button type="submit" disabled={submitting || eligible.length === 0}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
            <Megaphone size={16} /> {submitting ? 'Mengirim...' : 'Kirim Request Iklan'}
          </button>
        </form>
      </div>

      {/* Request history */}
      {requests.length > 0 && (
        <div>
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-3">Riwayat Request Iklan</h2>
          <div className="space-y-3">
            {requests.map((r) => {
              const step = STATUS_STEP_MAP[r.status] ?? 0
              const statusColors: Record<string, string> = {
                pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                reviewing: 'text-blue-600 bg-blue-50 border-blue-200',
                approved: 'text-green-600 bg-green-50 border-green-200',
                rejected: 'text-red-600 bg-red-50 border-red-200',
                cancelled: 'text-gray-500 bg-gray-50 border-gray-200',
                completed: 'text-purple-600 bg-purple-50 border-purple-200',
              }
              const StatusIcon = ({ s }: { s: string }) => {
                if (s === 'approved') return <CheckCircle size={14} />
                if (s === 'rejected') return <XCircle size={14} />
                return <Clock size={14} />
              }

              return (
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{r.product?.name ?? 'Produk'}</p>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs font-medium text-gray-600">{ADS_PACKAGES[r.packageTier].label}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">{formatRupiah(ADS_PACKAGES[r.packageTier].price, true)}/minggu</span>
                      </div>
                      {r.notes && <p className="text-xs text-gray-500 mt-1">"{r.notes}"</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(r.createdAt)}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[r.status] ?? ''}`}>
                      <StatusIcon s={r.status} />
                      {r.status === 'pending' ? 'Menunggu' : r.status === 'reviewing' ? 'Ditinjau' : r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : r.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </span>
                  </div>
                  {r.status !== 'rejected' && r.status !== 'cancelled' && (
                    <div className="mt-3 flex items-center gap-0">
                      {STATUS_STEPS.map((s, i) => {
                        const done = step > i; const active = step === i + 1
                        return (
                          <div key={s} className="flex items-center flex-1">
                            <div className={`flex flex-col items-center flex-shrink-0`}>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${done ? 'bg-brand-500 text-white' : active ? 'bg-brand-200 border-2 border-brand-500' : 'bg-gray-200 text-gray-400'}`}>
                                {done ? '✓' : i + 1}
                              </div>
                              <span className="text-[9px] text-gray-400 mt-0.5 hidden sm:block">{s}</span>
                            </div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-1 ${step > i + 1 ? 'bg-brand-500' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {r.rejectionReason && (
                    <p className="text-xs text-red-600 mt-2">Alasan ditolak: {r.rejectionReason}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
