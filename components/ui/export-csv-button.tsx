'use client'

import { Download } from 'lucide-react'

interface Row { [key: string]: string | number }

interface ExportCsvButtonProps {
  data: Row[]
  filename?: string
  label?: string
}

export default function ExportCsvButton({ data, filename = 'laporan', label = 'Export CSV' }: ExportCsvButtonProps) {
  function handleExport() {
    if (!data.length) return
    const headers = Object.keys(data[0])
    const rows    = data.map((row) =>
      headers.map((h) => {
        const val = row[h]
        const str = String(val ?? '')
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str
      }).join(',')
    )
    const csv     = [headers.join(','), ...rows].join('\n')
    const blob    = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href        = url
    a.download    = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-brand-400 hover:text-brand-600 text-gray-600 text-sm font-semibold rounded-xl transition shadow-sm"
    >
      <Download size={15} />
      {label}
    </button>
  )
}
