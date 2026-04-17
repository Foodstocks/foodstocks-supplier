'use client'

import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminDataImport() {
  const [dragging, setDragging] = useState(false)
  const [status, setStatus]     = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage]   = useState('')

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) simulateImport(file.name)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) simulateImport(file.name)
  }

  function simulateImport(filename: string) {
    setStatus('idle'); setMessage('Memproses...')
    setTimeout(() => {
      setStatus('success')
      setMessage(`✅ ${filename} berhasil diimport. 1,247 records diproses, 3 di-skip (duplikat).`)
    }, 1500)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-heading font-semibold text-base text-gray-900 mb-1">Import Data Penjualan Harian</h2>
      <p className="text-xs text-gray-500 mb-4">Format: CSV export dari Shopee Seller Center · Max 10MB</p>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'}`}
      >
        <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
        <Upload size={28} className="text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700">Drag & drop file CSV di sini</p>
        <p className="text-xs text-gray-400 mt-1">atau klik untuk pilih file</p>
      </label>

      {message && (
        <div className={`mt-3 flex items-center gap-2 text-sm p-3 rounded-lg ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {message}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3">
        Terakhir import: <strong>16 Apr 2026, 06:23 WIB</strong> · 1,247 records · <span className="text-green-600">Berhasil</span>
      </p>
    </div>
  )
}
