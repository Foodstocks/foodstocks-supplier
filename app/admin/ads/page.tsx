'use client'

import { useEffect, useState } from 'react'
import { formatRupiah, formatRelativeTime } from '@/lib/utils'
import { ADS_PACKAGES } from '@/lib/types'
import type { AdsRequest, ProductWithStatus, AdsTier } from '@/lib/types'
import { CheckCircle, XCircle, Clock, Megaphone, ChevronDown } from 'lucide-react'

interface RequestWithDetails extends AdsRequest {
  supplier?: { brandName: string; city?: string }
  product?: ProductWithStatus
}

export default function AdminAdsPage() {
  const [requests, setRequests]   = useState<RequestWithDetails[]>([])
  const [loading, setLoading]     = useState(true)
  const [updating, setUpdating]   = useState<string | null>(null)
  const [rejectId, setRejectId]   = useState<string | null>(null)
  const [rejectReason, setReason] = useState('')

  useEffect(() => {
    fetch('/api/admin/ads/requests')
      .then((r) => r.json())
      .then((data) => { setRequests(data.requests ?? []); setLoading(false) })
  }, [])

  async function updateStatus(id: string, status: string, rejectionReason?: string) {
    setUpdating(id)
    const res = await fetch('/api/admin/ads/requests', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, rejectionReason }),
    })
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: status as AdsRequest['status'], rejectionReason } : r))
      setRejectId(null); setReason('')
    }
    setUpdating(null)
  }

  const pending   = requests.filter((r) => r.status === 'pending' || r.status === 'reviewing')
  const completed = requests.filter((r) => r.status === 'approved' || r.status === 'rejected' || r.status === 'completed')

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending:   'bg-yellow-100 text-yellow-700 border-yellow-300',
      reviewing: 'bg-blue-100 text-blue-700 border-blue-300',
      approved:  'bg-green-100 text-green-700 border-green-300',
      rejected:  'bg-red-100 text-red-700 border-red-300',
      completed: 'bg-purple-100 text-purple-700 border-purple-300',
    }
    const labels: Record<string, string> = {
      pending:'Menunggu', reviewing:'Ditinjau', approved:'Disetujui', rejected:'Ditolak', completed:'Selesai'
    }
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status] ?? ''}`}>{labels[status] ?? status}</span>
  }

  if (loading) return (
    <div className="space-y-4 max-w-5xl">
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-skeleton" />)}
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-heading font-bold text-2xl text-gray-900">Ads Pipeline</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review dan kelola request iklan dari supplier</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: pending.length, color: 'text-yellow-600' },
          { label: 'Approved',       value: requests.filter(r=>r.status==='approved').length, color: 'text-green-600' },
          { label: 'Total Revenue',  value: formatRupiah(requests.filter(r=>r.status==='approved'||r.status==='completed').reduce((s,r) => s+({starter:500000,booster:1500000,premium:3000000}[r.packageTier]??0),0), true), color: 'text-brand-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className={`font-heading font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-yellow-500" /> Menunggu Review ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border-2 border-yellow-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-gray-900">{r.supplier?.brandName}</p>
                      <span className="text-gray-400 text-xs">·</span>
                      <p className="text-sm font-medium text-gray-700">{r.product?.name}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {ADS_PACKAGES[r.packageTier as AdsTier]?.label} — {ADS_PACKAGES[r.packageTier as AdsTier]?.priceLabel}/minggu
                      </span>
                      {r.product && (
                        <span className="text-xs text-green-600 font-medium">
                          ↑{r.product.wowGrowth.toFixed(0)}% WoW · ⭐{r.product.avgRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {r.notes && <p className="text-xs text-gray-500 mt-1.5 italic">"{r.notes}"</p>}
                    <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(r.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button disabled={updating === r.id} onClick={() => updateStatus(r.id, 'approved')}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button disabled={updating === r.id} onClick={() => setRejectId(r.id)}
                      className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-lg transition">
                      <XCircle size={14} /> Tolak
                    </button>
                  </div>
                </div>
                {rejectId === r.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <input value={rejectReason} onChange={(e) => setReason(e.target.value)} placeholder="Alasan penolakan..."
                      className="flex-1 h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    <button onClick={() => updateStatus(r.id, 'rejected', rejectReason)}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">Konfirmasi</button>
                    <button onClick={() => { setRejectId(null); setReason('') }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200">Batal</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed requests */}
      {completed.length > 0 && (
        <div>
          <h2 className="font-heading font-semibold text-base text-gray-900 mb-3">Riwayat ({completed.length})</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {completed.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{r.supplier?.brandName}</p>
                    <span className="text-gray-400 text-xs">·</span>
                    <p className="text-xs text-gray-600">{r.product?.name}</p>
                    <span className="text-xs text-gray-400">· {ADS_PACKAGES[r.packageTier as AdsTier]?.priceLabel}/minggu</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(r.createdAt)}</p>
                  {r.rejectionReason && <p className="text-xs text-red-500 mt-0.5">Ditolak: {r.rejectionReason}</p>}
                </div>
                {statusBadge(r.status)}
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Megaphone size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Belum ada request iklan masuk</p>
        </div>
      )}
    </div>
  )
}
