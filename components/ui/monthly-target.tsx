'use client'

import { useState, useEffect } from 'react'
import { Target, Edit3, Check, X } from 'lucide-react'

interface MonthlyTargetProps {
  currentGmv: number
  supplierId: string
}

function formatRupiahCompact(v: number) {
  if (v >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toFixed(1)}M`
  if (v >= 1_000_000)     return `Rp ${(v / 1_000_000).toFixed(1)}Jt`
  if (v >= 1_000)         return `Rp ${(v / 1_000).toFixed(0)}K`
  return `Rp ${v}`
}

export default function MonthlyTarget({ currentGmv, supplierId }: MonthlyTargetProps) {
  const storageKey = `gmv-target-${supplierId}`
  const [target,  setTarget]  = useState<number | null>(null)
  const [editing, setEditing] = useState(false)
  const [input,   setInput]   = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setTarget(Number(saved))
  }, [storageKey])

  function saveTarget() {
    const val = Number(input.replace(/\D/g, ''))
    if (val > 0) {
      setTarget(val)
      localStorage.setItem(storageKey, String(val))
    }
    setEditing(false)
  }

  function clearTarget() {
    setTarget(null)
    localStorage.removeItem(storageKey)
    setEditing(false)
  }

  const pct     = target ? Math.min(100, Math.round((currentGmv / target) * 100)) : 0
  const achieved = target !== null && currentGmv >= target

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center">
            <Target size={16} className="text-brand-500" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-800">Target GMV Bulan Ini</p>
          </div>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => { setInput(target ? String(target) : ''); setEditing(true) }}
            className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition"
          >
            <Edit3 size={14} />
          </button>
        ) : (
          <div className="flex gap-1">
            <button type="button" onClick={saveTarget} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"><Check size={14} /></button>
            <button type="button" onClick={() => setEditing(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition"><X size={14} /></button>
          </div>
        )}
      </div>

      {editing ? (
        <div>
          <label className="text-[11px] text-gray-400 font-medium mb-1.5 block">Set target GMV (Rp)</label>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Contoh: 10000000"
            autoFocus
            className="w-full h-10 px-3 border border-gray-200 rounded-xl text-sm bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
            onKeyDown={(e) => e.key === 'Enter' && saveTarget()}
          />
          {target && (
            <button type="button" onClick={clearTarget} className="text-[11px] text-red-400 hover:text-red-600 mt-2 transition">
              Hapus target
            </button>
          )}
        </div>
      ) : target === null ? (
        <div className="text-center py-3">
          <p className="text-[12px] text-gray-400 mb-2">Belum ada target. Set target untuk tracking progress.</p>
          <button
            type="button"
            onClick={() => { setInput(''); setEditing(true) }}
            className="text-[12px] font-semibold text-brand-500 hover:text-brand-600 transition"
          >
            + Set Target Sekarang
          </button>
        </div>
      ) : (
        <div>
          {/* Numbers */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[11px] text-gray-400">Tercapai</p>
              <p className="font-heading font-bold text-xl text-gray-900">{formatRupiahCompact(currentGmv)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-400">Target</p>
              <p className="text-[13px] font-semibold text-gray-500">{formatRupiahCompact(target)}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${achieved ? 'bg-green-500' : 'bg-brand-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-[12px] font-bold ${achieved ? 'text-green-600' : 'text-brand-600'}`}>
              {pct}% {achieved ? '✓ Target Tercapai!' : 'tercapai'}
            </span>
            {!achieved && (
              <span className="text-[11px] text-gray-400">
                Kurang {formatRupiahCompact(target - currentGmv)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
