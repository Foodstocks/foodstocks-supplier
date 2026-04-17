import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, subDays } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import type { ProductStatus, Channel } from './types'

// ─── Tailwind class merger ──────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Formatters ────────────────────────────────────────────────────────────

export function formatRupiah(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`
    if (amount >= 1_000_000)     return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`
    if (amount >= 1_000)         return `Rp ${(amount / 1_000).toFixed(0)}K`
    return `Rp ${amount}`
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('id-ID').format(n)
}

export function formatDate(dateStr: string, fmt = 'd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt, { locale: idLocale })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, 'd MMM')
}

export function formatRelativeTime(dateStr: string): string {
  const date = parseISO(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1)    return 'Baru saja'
  if (diffMins < 60)   return `${diffMins} menit yang lalu`
  if (diffHours < 24)  return `${diffHours} jam yang lalu`
  if (diffDays < 7)    return `${diffDays} hari yang lalu`
  return formatDate(dateStr)
}

export function formatGrowth(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(0)}%`
}

// ─── Status helpers ────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<ProductStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  fast_move: {
    label: 'Fast-Move',
    bg:     'bg-green-100',
    text:   'text-green-700',
    border: 'border-green-300',
    dot:    'bg-green-500',
  },
  normal: {
    label: 'Normal',
    bg:     'bg-yellow-100',
    text:   'text-yellow-700',
    border: 'border-yellow-300',
    dot:    'bg-yellow-500',
  },
  slow_move: {
    label: 'Slow-Move',
    bg:     'bg-red-100',
    text:   'text-red-700',
    border: 'border-red-300',
    dot:    'bg-red-500',
  },
}

export const CHANNEL_CONFIG: Record<Channel, { label: string; color: string; hex: string }> = {
  shopee:      { label: 'Shopee',      color: 'text-blue-600',   hex: '#3B82F6' },
  tiktok:      { label: 'TikTok',      color: 'text-purple-600', hex: '#A855F7' },
  website:     { label: 'Website',     color: 'text-amber-600',  hex: '#F59E0B' },
  live_shopee: { label: 'Live Shopee', color: 'text-teal-600',   hex: '#14B8A6' },
  live_tiktok: { label: 'Live TikTok', color: 'text-pink-600',   hex: '#EC4899' },
  reseller:    { label: 'Reseller',    color: 'text-indigo-600', hex: '#6366F1' },
}

// ─── Date helpers ──────────────────────────────────────────────────────────

export function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'))
  }
  return days
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'))
  }
  return days
}

// ─── Product status calculator ─────────────────────────────────────────────

export function calculateProductStatus(units7d: number, wowGrowth: number, percentileRank: number): ProductStatus {
  if (units7d > 100 || percentileRank >= 80 || wowGrowth > 30) return 'fast_move'
  if (units7d < 20 || wowGrowth < -20) return 'slow_move'
  return 'normal'
}

// ─── Random seed generator (deterministic mock data) ──────────────────────

export function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}
