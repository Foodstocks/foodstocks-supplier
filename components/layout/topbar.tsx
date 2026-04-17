'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell, Menu, LogOut, LayoutDashboard, Package, Megaphone, Users, BarChart3 } from 'lucide-react'
import type { AuthUser } from '@/lib/types'
import { useState } from 'react'
import { cn } from '@/lib/utils'

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
      <header className="h-14 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
        {/* Left: mobile menu trigger */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <Image src="/logo.png" alt="Foodstocks" width={24} height={24} className="object-contain" />
            <span className="font-heading font-bold text-gray-900 text-sm">FoodStocks.id</span>
          </div>
        </div>

        {/* Right: actions + avatar */}
        <div className="flex items-center gap-1.5">
          {user.role === 'supplier' && (
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <div className="flex items-center gap-2.5 pl-2 ml-1 border-l border-gray-100">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center ring-2 ring-brand-100 shadow-sm">
              <span className="text-white text-xs font-bold leading-none">{user.name.charAt(0)}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-medium text-gray-700 leading-tight">{user.name}</p>
              <p className="text-[11px] text-gray-400 leading-tight capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F1117] flex flex-col shadow-2xl">
            <div className="px-5 pt-6 pb-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="Foodstocks" width={32} height={32} className="object-contain" />
                <div>
                  <p className="font-heading font-bold text-white text-sm leading-none">FoodStocks.id</p>
                  <p className="text-white/35 text-xs mt-0.5">{user.role === 'admin' ? 'Admin Panel' : 'Supplier Hub'}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {user.role === 'supplier' ? (
                <>
                  <MobileNavItem href="/dashboard"               icon={<LayoutDashboard size={16}/>} label="Dashboard"      onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/products"      icon={<Package size={16}/>}         label="Produk Saya"    onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/ads"           icon={<Megaphone size={16}/>}       label="Peluang Iklan"  onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/dashboard/notifications" icon={<Bell size={16}/>}            label="Notifikasi"     onClick={() => setMobileOpen(false)} />
                </>
              ) : (
                <>
                  <MobileNavItem href="/admin"             icon={<BarChart3 size={16}/>}  label="Overview"     onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/admin/suppliers"   icon={<Users size={16}/>}      label="Supplier"     onClick={() => setMobileOpen(false)} />
                  <MobileNavItem href="/admin/ads"         icon={<Megaphone size={16}/>}  label="Ads Pipeline" onClick={() => setMobileOpen(false)} />
                </>
              )}
            </nav>
            <div className="px-3 py-4 border-t border-white/[0.07]">
              <div className="flex items-center gap-2.5 px-2.5 py-2.5 mb-2 rounded-lg bg-white/[0.05]">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{user.name}</p>
                  <p className="text-white/35 text-[11px] truncate">{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2.5 px-2.5 h-9 w-full text-white/50 hover:text-white/80 text-[13px] font-medium transition rounded-lg hover:bg-white/[0.06]">
                <LogOut size={15}/> Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav for mobile */}
      {user.role === 'supplier' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex">
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
    <Link href={href} onClick={onClick} className="flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-white/55 hover:bg-white/[0.06] hover:text-white/90 text-[13px] font-medium transition">
      {icon} {label}
    </Link>
  )
}

function BottomNavItem({ href, icon, label, badge = 0 }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center gap-1 py-2.5 text-gray-400 hover:text-brand-500 transition-colors relative">
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
      {badge > 0 && (
        <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  )
}
