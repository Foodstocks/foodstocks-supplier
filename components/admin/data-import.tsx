'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminDataImport() {
  const [dragging, setDragging]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [status, setStatus]       = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage]     = useState('')

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImport(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleImport(file)
    e.target.value = ''
  }

  async function handleImport(file: File) {
    setLoading(true)
    setStatus('idle')
    setMessage('Mengupload dan memproses...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch('/api/admin/data/import', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(`${file.name} berhasil diimport. ${data.inserted} records diproses, ${data.skipped} di-skip (duplikat).`)
      } else {
        setStatus('error')
        setMessage(data.error || 'Import gagal. Periksa format file CSV.')
      }
    } catch {
      setStatus('error')
      setMessage('Gagal menghubungi server. Periksa koneksi internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-base text-gray-900 mb-1">Import Data Penjualan Harian</h2>
      <p className="text-xs text-gray-500 mb-4">Format: CSV export dari Shopee Seller Center · Max 10MB</p>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${loading ? 'opacity-50 pointer-events-none' : ''} ${dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'}`}
      >
        <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} disabled={loading} />
        {loading
          ? <Loader2 size={28} className="text-brand-500 mx-auto mb-2 animate-spin" />
          : <Upload size={28} className="text-gray-400 mx-auto mb-2" />
        }
        <p className="text-sm font-medium text-gray-700">
          {loading ? 'Memproses...' : 'Drag & drop file CSV di sini'}
        </p>
        {!loading && <p className="text-xs text-gray-400 mt-1">atau klik untuk pilih file</p>}
      </label>

      {message && (
        <div className={`mt-3 flex items-center gap-2 text-sm p-3 rounded-lg ${
          loading         ? 'bg-blue-50 text-blue-700'  :
          status === 'success' ? 'bg-green-50 text-green-700' :
                                 'bg-red-50 text-red-700'
        }`}>
          {loading
            ? <Loader2 size={16} className="animate-spin flex-shrink-0" />
            : status === 'success'
            ? <CheckCircle size={16} className="flex-shrink-0" />
            : <AlertCircle size={16} className="flex-shrink-0" />
          }
          {message}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        Format: CSV dengan kolom <code className="bg-gray-100 px-1 rounded">product_sku, sale_date, channel, units_sold, gross_revenue</code>
      </p>
    </div>
  )
}
