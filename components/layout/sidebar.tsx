'use client'

import Link from 'next/link'
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
  { href: '/dashboard',              label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/dashboard/products',     label: 'Produk Saya',    icon: Package         },
  { href: '/dashboard/ads',          label: 'Peluang Iklan',  icon: Megaphone       },
  { href: '/dashboard/notifications',label: 'Notifikasi',     icon: Bell            },
]

const ADMIN_NAV = [
  { href: '/admin',         label: 'Overview',       icon: BarChart3    },
  { href: '/admin/suppliers',label: 'Supplier',      icon: Users        },
  { href: '/admin/ads',     label: 'Ads Pipeline',   icon: Megaphone    },
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
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-sidebar text-white flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-heading font-bold text-sm">F</span>
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm leading-none">FoodStocks.id</p>
            <p className="text-white/40 text-xs mt-0.5">Supplier Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {!isAdmin && (
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">Menu</p>
        )}
        {isAdmin && (
          <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">Admin</p>
        )}
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-brand-500 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <ShieldCheck size={16} className="text-brand-400" />
            <span className="text-xs text-brand-400 font-semibold">Admin Access</span>
          </div>
        )}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
          <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user.name}</p>
            <p className="text-white/40 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 h-9 w-full rounded-lg text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  )
}
