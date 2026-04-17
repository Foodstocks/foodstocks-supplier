'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, Megaphone, Bell,
  Users, BarChart3, LogOut, HelpCircle, Settings, ShieldCheck,
  BarChart2, FileText,
} from 'lucide-react'
import type { AuthUser } from '@/lib/types'

interface SidebarProps { user: AuthUser }

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

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const isAdmin  = user.role === 'admin'
  const navItems = isAdmin ? ADMIN_NAV : SUPPLIER_NAV

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-white border-r border-gray-100 flex-shrink-0">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Foodstocks" width={32} height={32} className="object-contain" />
          <div>
            <p className="font-heading font-bold text-[13.5px] text-gray-900 leading-none">FoodStocks.id</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {isAdmin ? 'Admin Panel' : 'Supplier Hub'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.08em] px-3 mb-2">
          {isAdmin ? 'Admin' : 'Menu'}
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
              || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 h-10 rounded-xl text-[13.5px] font-medium transition-all',
                  active
                    ? 'bg-brand-500 text-white shadow-brand'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                )}
              >
                <Icon size={17} className={active ? 'text-white' : 'text-gray-400'} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom utilities */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-0.5">
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 mb-1">
            <ShieldCheck size={13} className="text-brand-500" />
            <span className="text-[11px] font-semibold text-brand-500">Admin Access</span>
          </div>
        )}

        <Link href="#" className="flex items-center gap-3 px-3 h-9 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition">
          <HelpCircle size={16} className="text-gray-400" />
          Bantuan
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 h-9 rounded-xl text-[13px] font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition">
          <Settings size={16} className="text-gray-400" />
          Pengaturan
        </Link>

        {/* User row */}
        <div className="pt-2 mt-1 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 ring-2 ring-brand-100">
              <span className="text-white text-xs font-bold leading-none">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-800 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
              title="Keluar"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
