'use client'

import { useState } from 'react'
import { CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react'

interface ProductOption { id: string; name: string; sku: string; currentStock: number; threshold: number }

export default function RestockForm({ products }: { products: ProductOption[] }) {
  const [productId,  setProductId]  = useState(products[0]?.id ?? '')
  const [quantity,   setQuantity]   = useState('')
  const [urgency,    setUrgency]    = useState<'normal' | 'urgent' | 'critical'>('normal')
  const [notes,      setNotes]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const selected = products.find((p) => p.id === productId)
  const isLow    = selected && selected.currentStock < selected.threshold

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!quantity || Number(quantity) <= 0) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900)) // simulate API
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Request Terkirim!</h2>
        <p className="text-gray-500 text-sm mb-1">
          Restock request untuk <strong>{selected?.name}</strong> sebanyak{' '}
          <strong>{Number(quantity).toLocaleString('id-ID')} unit</strong> sudah diterima.
        </p>
        <p className="text-gray-400 text-xs mb-6">Tim FoodStocks akan menghubungi Anda dalam 1×24 jam</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => { setSubmitted(false); setQuantity(''); setNotes('') }}
            className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 text-sm font-semibold rounded-xl transition"
          >
            Buat Request Lain
          </button>
          <a
            href="/dashboard/products"
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition shadow-brand"
          >
            Lihat Produk
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">

      {/* Produk selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Produk</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm text-gray-800 bg-gray-50
                     focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all appearance-none"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) — Stok: {p.currentStock.toLocaleString('id-ID')} unit
            </option>
          ))}
        </select>

        {isLow && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-xs font-medium">
            <AlertTriangle size={13} />
            Stok produk ini sudah di bawah threshold ({selected?.threshold} unit)
          </div>
        )}
      </div>

      {/* Jumlah */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Restock (unit)</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Contoh: 500"
          required
          className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-300
                     focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
        />
        {quantity && Number(quantity) > 0 && (
          <p className="text-[11px] text-gray-400 mt-1.5">
            Estimasi stok setelah restock: {((selected?.currentStock ?? 0) + Number(quantity)).toLocaleString('id-ID')} unit
          </p>
        )}
      </div>

      {/* Urgensi */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tingkat Urgensi</label>
        <div className="flex gap-2">
          {([
            { value: 'normal',   label: 'Normal',   desc: '5–7 hari kerja', color: 'border-gray-200 text-gray-600' },
            { value: 'urgent',   label: 'Urgent',   desc: '2–3 hari kerja', color: 'border-amber-300 text-amber-700' },
            { value: 'critical', label: 'Kritis',   desc: 'Secepatnya',     color: 'border-red-300 text-red-600'   },
          ] as const).map(({ value, label, desc, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setUrgency(value)}
              className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all ${
                urgency === value
                  ? value === 'critical' ? 'bg-red-50 border-red-400 text-red-700'
                  : value === 'urgent'   ? 'bg-amber-50 border-amber-400 text-amber-700'
                  : 'bg-brand-50 border-brand-400 text-brand-700'
                  : `bg-white ${color} hover:bg-gray-50`
              }`}
            >
              <p className="text-[13px] font-bold">{label}</p>
              <p className="text-[10px] mt-0.5 opacity-70">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Catatan */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan Tambahan <span className="text-gray-400 font-normal">(opsional)</span></label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Contoh: mohon prioritaskan varian Balado, ada event promo minggu depan..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-300 resize-none
                     focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !quantity || Number(quantity) <= 0}
        className="w-full h-12 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed
                   text-white font-semibold rounded-xl transition shadow-brand flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Mengirim Request...
          </>
        ) : (
          <>
            <RefreshCw size={16} />
            Kirim Request Restock
          </>
        )}
      </button>
    </form>
  )
}
