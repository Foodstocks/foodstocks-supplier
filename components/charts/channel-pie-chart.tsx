'use client'

import { useState, useEffect } from 'react'
import { CHANNEL_CONFIG, formatNumber } from '@/lib/utils'
import type { ChannelBreakdown } from '@/lib/types'

export default function ChannelPieChart({ data }: { data: ChannelBreakdown[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-40 animate-skeleton rounded-xl" />

  const total = data.reduce((s, d) => s + d.units, 0)
  const sorted = [...data].sort((a, b) => b.units - a.units)

  return (
    <div className="space-y-1">
      {/* Stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-5">
        {sorted.map((item) => {
          const pct = total > 0 ? (item.units / total) * 100 : 0
          const color = CHANNEL_CONFIG[item.channel]?.hex ?? '#94A3B8'
          return (
            <div
              key={item.channel}
              style={{ width: `${pct}%`, backgroundColor: color }}
              className="rounded-full"
            />
          )
        })}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {sorted.map((item) => {
          const cfg  = CHANNEL_CONFIG[item.channel]
          const color = cfg?.hex ?? '#94A3B8'
          const pct  = item.percentage

          return (
            <div key={item.channel}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-medium text-gray-600">{cfg?.label ?? item.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{formatNumber(item.units)}</span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500"
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
