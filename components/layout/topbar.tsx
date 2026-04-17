'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Menu, LogOut, LayoutDashboard, Package, Megaphone } from 'lucide-react'
import type { AuthUser } from '@/lib/types'
import { useState } from 'react'

interface TopbarProps {
  user: AuthUser
  title: string
  unreadCount?: number
}

export default function Topbar({ user, title, unreadCount = 0 }: TopbarProps) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
        {/* Left: mobile menu + title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="font-heading font-semibold text-lg text-gray-900">{title}</h1>
        </div>

        {/* Right: bell + avatar */}
        <div className="flex items-center gap-2">
          {user.role === 'supplier' && (
            <Link href="/dashboard/notifications" className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar flex flex-col">
            <div className="px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <p className="font-heading font-bold text-white text-sm">FoodStocks.id</p>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {user.role === 'supplier' ? (
                <>
                  <MobileNavItem href="/dashboard"               icon={<LayoutDashboard size={18}/>} label="Dashboard"      onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/products"      icon={<Package size={18}/>}         label="Produk Saya"    onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/ads"           icon={<Megaphone size={18}/>}       label="Peluang Iklan"  onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/notifications" icon={<Bell size={18}/>}            label="Notifikasi"     onClick={() => setMobileOpen(false)} />
                </>
              ) : (
                <>
                  <MobileNavItem href="/admin"            icon={<LayoutDashboard size={18}/>} label="Overview"     onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/admin/ads"        icon={<Megaphone size={18}/>}       label="Ads Pipeline" onClick={() => setMobileOpen(false)} />
                </>
              )}
            </nav>
            <div className="px-3 py-4 border-t border-white/10">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 h-10 w-full text-white/60 hover:text-white text-sm">
                <LogOut size={16}/> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav for mobile */}
      {user.role === 'supplier' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
          <BottomNavItem href="/dashboard"               icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <BottomNavItem href="/dashboard/products"      icon={<Package size={20}/>}         label="Produk" />
          <BottomNavItem href="/dashboard/ads"           icon={<Megaphone size={20}/>}       label="Iklan" />
          <BottomNavItem href="/dashboard/notifications" icon={<Bell size={20}/>}            label="Notif" badge={unreadCount} />
        </nav>
      )}
    </>
  )
}

function MobileNavItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-3 px-3 h-10 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium transition">
      {icon} {label}
    </Link>
  )
}

function BottomNavItem({ href, icon, label, badge = 0 }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-brand-500 transition relative">
      {icon}
      <span className="text-[10px]">{label}</span>
      {badge > 0 && (
        <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}
