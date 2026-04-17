'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props { fastMove: number; normal: number; slowMove: number }

export default function StatusDonutChart({ fastMove, normal, slowMove }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="h-44 animate-pulse bg-gray-100 rounded-lg" />

  const data = [
    { name: 'Fast-Move', value: fastMove,  color: '#22C55E' },
    { name: 'Normal',    value: normal,     color: '#EAB308' },
    { name: 'Slow-Move', value: slowMove,   color: '#EF4444' },
  ].filter((d) => d.value > 0)

  const total = fastMove + normal + slowMove

  return (
    <div className="flex flex-col items-center">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const item = payload[0].payload
                return (
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-300">{item.value} produk ({Math.round((item.value / total) * 100)}%)</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 w-full">
        {[
          { label: 'Fast-Move',  count: fastMove,  color: 'bg-green-500',  text: 'text-green-700'  },
          { label: 'Normal',     count: normal,     color: 'bg-yellow-500', text: 'text-yellow-700' },
          { label: 'Slow-Move',  count: slowMove,   color: 'bg-red-500',    text: 'text-red-700'    },
        ].map(({ label, count, color, text }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-gray-600 text-xs">{label}</span>
            </div>
            <span className={`font-semibold text-xs ${text}`}>{count} SKU</span>
          </div>
        ))}
      </div>
    </div>
  )
}
