import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { NOTIFICATIONS } from '@/lib/mock-data'
import { formatRelativeTime } from '@/lib/utils'
import { Bell, TrendingUp, AlertTriangle, CheckCircle, Star, Info, Package } from 'lucide-react'

const TYPE_CONFIG = {
  fast_move:    { icon: TrendingUp,    color: 'text-brand-500',  bg: 'bg-brand-100',  label: 'Fast-Move'  },
  stock_low:    { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-100',    label: 'Stok'       },
  ads_approved: { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-100',  label: 'Iklan'      },
  ads_rejected: { icon: CheckCircle,   color: 'text-red-500',    bg: 'bg-red-100',    label: 'Iklan'      },
  ads_started:  { icon: Package,       color: 'text-blue-600',   bg: 'bg-blue-100',   label: 'Iklan'      },
  ads_completed:{ icon: CheckCircle,   color: 'text-purple-600', bg: 'bg-purple-100', label: 'Iklan'      },
  review_new:   { icon: Star,          color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Ulasan'     },
  system:       { icon: Info,          color: 'text-gray-500',   bg: 'bg-gray-100',   label: 'Sistem'     },
}

export default async function NotificationsPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const notifications = NOTIFICATIONS
    .filter((n) => n.supplierId === user.supplierId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Notifikasi</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="text-sm text-brand-500 hover:underline font-medium">Tandai Semua Dibaca</button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['Semua', 'Stok', 'Iklan', 'Produk', 'Sistem'].map((tab) => (
          <button key={tab} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === 'Semua' ? 'bg-brand-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Belum ada notifikasi</p>
          </div>
        )}
        {notifications.map((n) => {
          const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system
          const Icon = cfg.icon
          return (
            <div key={n.id} className={`bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 transition hover:shadow-sm ${!n.isRead ? 'border-l-4 border-l-brand-500' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                <Icon size={18} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(n.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
