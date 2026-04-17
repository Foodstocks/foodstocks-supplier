'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDateShort, formatNumber } from '@/lib/utils'
import type { SalesTrendPoint } from '@/lib/types'

interface Props { data: SalesTrendPoint[] }

export default function SalesTrendChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-48 animate-pulse bg-gray-100 rounded-lg" />

  const chartData = data.map((d) => ({ ...d, dateLabel: formatDateShort(d.date) }))

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F97316" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                  <p className="text-gray-400 mb-1">{label}</p>
                  <p className="font-semibold">{formatNumber(payload[0]?.value as number)} unit</p>
                </div>
              )
            }}
          />
          <Area type="monotone" dataKey="units" stroke="#F97316" strokeWidth={2} fill="url(#gradOrange)" dot={false} activeDot={{ r: 4, fill: '#F97316' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
