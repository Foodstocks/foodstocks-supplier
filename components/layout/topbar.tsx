'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, LogOut, LayoutDashboard, Package, Megaphone, Users, BarChart3, CalendarDays, BarChart2, FileText } from 'lucide-react'
import type { AuthUser } from '@/lib/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface TopbarProps {
  user: AuthUser
  unreadCount?: number
}

const SUPPLIER_NAV = [
  { href: '/dashboard',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/dashboard/products',      label: 'Produk',        icon: Package         },
  { href: '/dashboard/analytics',     label: 'Analitik',      icon: BarChart2       },
  { href: '/dashboard/reports',       label: 'Laporan',       icon: FileText        },
  { href: '/dashboard/ads',           label: 'Peluang Iklan', icon: Megaphone       },
  { href: '/dashboard/notifications', label: 'Notifikasi',    icon: Bell            },
]

const ADMIN_NAV = [
  { href: '/admin',           label: 'Overview',     icon: BarChart3 },
  { href: '/admin/suppliers', label: 'Supplier',     icon: Users     },
  { href: '/admin/ads',       label: 'Ads Pipeline', icon: Megaphone },
]

export default function Topbar({ user, unreadCount = 0 }: TopbarProps) {
  const pathname    = usePathname()
  const router      = useRouter()
  const [open, setOpen] = useState(false)
  const isAdmin     = user.role === 'admin'
  const navItems    = isAdmin ? ADMIN_NAV : SUPPLIER_NAV

  // Format today's date
  const today = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 lg:px-7 flex-shrink-0 sticky top-0 z-30">

        {/* Left: mobile only — hamburger + logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <Image src="/logo.png" alt="Foodstocks" width={26} height={26} className="object-contain" />
          <span className="font-heading font-bold text-sm text-gray-900">FoodStocks.id</span>
        </div>

        {/* Right: date + bell + user */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Date badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[12px] text-gray-500 font-medium">
            <CalendarDays size={13} className="text-gray-400" />
            {today}
          </div>

          {/* Bell */}
          {user.role === 'supplier' && (
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* User avatar + name */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2.5 ml-0.5 border-l border-gray-100">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center ring-2 ring-brand-100 flex-shrink-0">
              <span className="text-white text-xs font-bold leading-none">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[11px] text-gray-400 leading-tight capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[220px] bg-white shadow-2xl flex flex-col">
            <div className="px-5 pt-6 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Foodstocks" width={30} height={30} className="object-contain" />
                <div>
                  <p className="font-heading font-bold text-[13px] text-gray-900 leading-none">FoodStocks.id</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{isAdmin ? 'Admin' : 'Supplier'}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                  || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 h-10 rounded-xl text-[13.5px] font-medium transition',
                      active
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <Icon size={16} className={active ? 'text-white' : 'text-gray-400'} />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="px-3 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 h-9 w-full rounded-xl text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut size={15} /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav (supplier) */}
      {user.role === 'supplier' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex">
          {SUPPLIER_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative',
                  active ? 'text-brand-500' : 'text-gray-400'
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
                {href === '/dashboard/notifications' && unreadCount > 0 && (
                  <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      )}
    </>
  )
}
