'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface SparklineCardProps {
  label: string
  sublabel?: string
  value: string
  growth?: number | null
  data?: number[]
  accentColor: string
  bgColor: string
  textColor?: string
  icon?: React.ReactNode
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = useMemo(() => {
    if (data.length < 2) return { path: '', area: '' }
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const w = 200
    const h = 52
    const pad = 3
    const pts = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - pad - ((v - min) / range) * (h - pad * 2),
    }))
    // Smooth curve using cardinal spline simplified
    const path = pts
      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
      .join(' ')
    const area = `${path} L ${w},${h} L 0,${h} Z`
    return { path, area }
  }, [data])

  if (!points.path) return null

  const gradId = `spark-${color.replace('#', '')}`

  return (
    <svg
      viewBox="0 0 200 52"
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={points.area} fill={`url(#${gradId})`} />
      <path d={points.path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SparklineCard({
  label, sublabel, value, growth, data = [], accentColor, bgColor, textColor = '#111827', icon,
}: SparklineCardProps) {
  const hasGrowth = growth !== null && growth !== undefined
  const isUp = hasGrowth && growth! > 0
  const isDown = hasGrowth && growth! < 0

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between h-44"
      style={{ backgroundColor: bgColor }}
    >
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          {sublabel && <p className="text-[11px] text-gray-400 mt-0.5">{sublabel}</p>}
        </div>
        {hasGrowth && (
          <span
            className="flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: isUp ? '#DCFCE7' : isDown ? '#FEE2E2' : '#F3F4F6',
              color: isUp ? '#15803D' : isDown ? '#B91C1C' : '#6B7280',
            }}
          >
            {isUp   ? <TrendingUp  size={11} /> :
             isDown ? <TrendingDown size={11} /> :
                      <Minus        size={11} />}
            {isUp ? '+' : ''}{growth!.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mt-1">
        <p className="font-heading font-bold text-3xl leading-none" style={{ color: textColor }}>
          {value}
        </p>
      </div>

      {/* Sparkline */}
      {data.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-14 opacity-80">
          <Sparkline data={data} color={accentColor} />
        </div>
      )}
    </div>
  )
}
