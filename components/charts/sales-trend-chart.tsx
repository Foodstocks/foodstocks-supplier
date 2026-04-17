'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatDateShort, formatNumber } from '@/lib/utils'
import type { SalesTrendPoint } from '@/lib/types'

interface Props { data: SalesTrendPoint[] }

export default function SalesTrendChart({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-56 animate-skeleton rounded-xl" />

  const chartData = data.map((d) => ({ ...d, dateLabel: formatDateShort(d.date) }))
  const maxVal = Math.max(...chartData.map((d) => d.units))

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#E8161A" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#E8161A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="0"
            horizontal={true}
            vertical={false}
            stroke="#F1F1F1"
          />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10, fill: '#C4C9D4', fontFamily: 'Inter, sans-serif' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#C4C9D4', fontFamily: 'Inter, sans-serif' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ stroke: '#E8161A', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              return (
                <div style={{
                  background: '#0F1117',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}>
                  <p style={{ color: '#6B7280', fontSize: 11, marginBottom: 4 }}>{label}</p>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
                    {formatNumber(payload[0]?.value as number)} unit
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="basis"
            dataKey="units"
            stroke="#E8161A"
            strokeWidth={2}
            fill="url(#gradRed)"
            dot={false}
            activeDot={{ r: 5, fill: '#E8161A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
