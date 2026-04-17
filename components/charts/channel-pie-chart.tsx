'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CHANNEL_CONFIG, formatNumber } from '@/lib/utils'
import type { ChannelBreakdown } from '@/lib/types'

export default function ChannelPieChart({ data }: { data: ChannelBreakdown[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-36 animate-pulse bg-gray-100 rounded-lg" />

  return (
    <div className="flex flex-col gap-3">
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="units">
              {data.map((entry, i) => (
                <Cell key={i} fill={CHANNEL_CONFIG[entry.channel]?.hex ?? '#94A3B8'} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload as ChannelBreakdown
                return (
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg">
                    <p className="font-semibold">{CHANNEL_CONFIG[item.channel]?.label ?? item.channel}</p>
                    <p>{formatNumber(item.units)} unit ({item.percentage}%)</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {data.map((item) => {
          const cfg = CHANNEL_CONFIG[item.channel]
          return (
            <div key={item.channel} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg?.hex ?? '#94A3B8' }} />
                <span className="text-gray-600 text-xs">{cfg?.label ?? item.channel}</span>
              </div>
              <span className="text-xs font-medium text-gray-700">{formatNumber(item.units)} ({item.percentage}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
