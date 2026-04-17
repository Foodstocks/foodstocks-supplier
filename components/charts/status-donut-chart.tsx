'use client'

import { useState, useEffect } from 'react'

interface Props { fastMove: number; normal: number; slowMove: number }

export default function StatusDonutChart({ fastMove, normal, slowMove }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-36 animate-skeleton rounded-xl" />

  const total = fastMove + normal + slowMove

  const items = [
    { label: 'Fast-Move',  count: fastMove, color: '#16A34A', bg: '#DCFCE7', text: '#15803D' },
    { label: 'Normal',     count: normal,   color: '#CA8A04', bg: '#FEF9C3', text: '#A16207' },
    { label: 'Slow-Move',  count: slowMove, color: '#DC2626', bg: '#FEE2E2', text: '#B91C1C' },
  ]

  return (
    <div className="space-y-1">
      {/* Total */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="font-heading font-bold text-3xl text-gray-900">{total}</span>
        <span className="text-sm text-gray-400 font-medium">total SKU</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5 mb-5">
        {items.map(({ label, count, color }) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          if (pct === 0) return null
          return (
            <div
              key={label}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="rounded-full"
            />
          )
        })}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {items.map(({ label, count, color, bg, text }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-gray-600">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{count} SKU</span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
