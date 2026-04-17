'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, Megaphone, Bell, Settings, LogOut,
  Users, BarChart3, ChevronRight, ShieldCheck,
} from 'lucide-react'
import type { AuthUser } from '@/lib/types'

interface SidebarProps {
  user: AuthUser
}

const SUPPLIER_NAV = [
  { href: '/dashboard',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/dashboard/products',      label: 'Produk Saya',   icon: Package         },
  { href: '/dashboard/ads',           label: 'Peluang Iklan', icon: Megaphone       },
  { href: '/dashboard/notifications', label: 'Notifikasi',    icon: Bell            },
]

const ADMIN_NAV = [
  { href: '/admin',          label: 'Overview',     icon: BarChart3 },
  { href: '/admin/suppliers',label: 'Supplier',     icon: Users     },
  { href: '/admin/ads',      label: 'Ads Pipeline', icon: Megaphone },
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
    <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-[#0F1117] flex-shrink-0 border-r border-white/[0.06]">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
            <Image src="/logo.png" alt="Foodstocks" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-[13px] leading-none tracking-tight">FoodStocks.id</p>
            <p className="text-white/35 text-[11px] mt-0.5 tracking-wide">
              {isAdmin ? 'Admin Panel' : 'Supplier Hub'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-white/25 text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 mb-2">
          {isAdmin ? 'Admin' : 'Menu'}
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] font-medium transition-all relative',
                  active
                    ? 'bg-brand-500/15 text-white'
                    : 'text-white/50 hover:bg-white/[0.06] hover:text-white/90'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-500 rounded-full" />
                )}
                <Icon size={16} className={active ? 'text-brand-400' : ''} />
                <span>{label}</span>
                {active && <ChevronRight size={12} className="ml-auto text-brand-400/70" />}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
        {isAdmin && (
          <div className="flex items-center gap-2 px-2.5 py-2 mb-1">
            <ShieldCheck size={13} className="text-brand-400" />
            <span className="text-[11px] text-brand-400 font-semibold tracking-wide">Admin Access</span>
          </div>
        )}

        {/* User card */}
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-white/[0.05] mb-1">
          <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 ring-2 ring-brand-500/30">
            <span className="text-white text-xs font-bold leading-none">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[12px] font-medium truncate leading-tight">{user.name}</p>
            <p className="text-white/35 text-[11px] truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-2.5 h-9 w-full rounded-lg text-white/40 hover:bg-white/[0.06] hover:text-white/80 text-[13px] font-medium transition-all"
        >
          <LogOut size={15} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
