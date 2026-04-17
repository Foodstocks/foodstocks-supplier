'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Package, Megaphone, Bell, LogOut,
  Users, BarChart3, ShieldCheck, Menu, X,
} from 'lucide-react'
import type { AuthUser } from '@/lib/types'
import { useState } from 'react'

interface NavbarProps {
  user: AuthUser
  unreadCount?: number
}

const SUPPLIER_NAV = [
  { href: '/dashboard',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/dashboard/products',      label: 'Produk Saya',   icon: Package         },
  { href: '/dashboard/ads',           label: 'Peluang Iklan', icon: Megaphone       },
  { href: '/dashboard/notifications', label: 'Notifikasi',    icon: Bell            },
]

const ADMIN_NAV = [
  { href: '/admin',           label: 'Overview',     icon: BarChart3 },
  { href: '/admin/suppliers', label: 'Supplier',     icon: Users     },
  { href: '/admin/ads',       label: 'Ads Pipeline', icon: Megaphone },
]

export default function Navbar({ user, unreadCount = 0 }: NavbarProps) {
  const pathname  = usePathname()
  const router    = useRouter()
  const isAdmin   = user.role === 'admin'
  const navItems  = isAdmin ? ADMIN_NAV : SUPPLIER_NAV
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 lg:px-8 gap-6 sticky top-0 z-40">

        {/* Logo */}
        <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 flex-shrink-0 mr-4">
          <Image src="/logo.png" alt="Foodstocks" width={28} height={28} className="object-contain" />
          <span className="font-heading font-bold text-[15px] text-gray-900 hidden sm:block">FoodStocks.id</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3.5 h-9 flex items-center text-[13.5px] font-medium rounded-lg transition-all',
                  active
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                )}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 rounded-lg mr-1">
              <ShieldCheck size={13} className="text-brand-500" />
              <span className="text-[11px] font-semibold text-brand-600">Admin</span>
            </div>
          )}

          {/* Bell (supplier only) */}
          {user.role === 'supplier' && (
            <Link href="/dashboard/notifications" className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* User */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 ml-1 border-l border-gray-100">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center ring-2 ring-brand-100 flex-shrink-0">
              <span className="text-white text-xs font-bold leading-none">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[11px] text-gray-400 leading-tight">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition ml-1"
              title="Keluar"
            >
              <LogOut size={15} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Foodstocks" width={28} height={28} className="object-contain" />
                <span className="font-heading font-bold text-sm text-gray-900">FoodStocks.id</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3.5 h-10 rounded-xl text-[13.5px] font-medium transition',
                      active
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon size={16} className={active ? 'text-brand-500' : ''} />
                    {label}
                  </Link>
                )
              })}
            </nav>

            <div className="px-3 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3 px-3.5 py-3 mb-1 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 h-10 w-full rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-800 text-[13.5px] font-medium transition"
              >
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav (supplier) */}
      {user.role === 'supplier' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex">
          {SUPPLIER_NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link key={href} href={href}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative',
                  active ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
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
