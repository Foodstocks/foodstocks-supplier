'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login gagal'); return }
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(role: 'supplier' | 'admin') {
    setEmail(role === 'admin' ? 'admin@demo.com' : 'supplier@demo.com')
    setPassword('demo123')
    setError('')
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel: brand ── */}
      <div className="hidden lg:flex flex-col w-[480px] flex-shrink-0 bg-[#0F1117] relative overflow-hidden px-14 py-14">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        {/* Red glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <Image src="/logo.png" alt="Foodstocks" width={40} height={40} className="object-contain" />
            <div>
              <p className="font-heading font-bold text-white text-lg leading-none">FoodStocks.id</p>
              <p className="text-white/40 text-xs mt-0.5">Gudangnya Camilan</p>
            </div>
          </div>

          <div className="mt-auto">
            <h2 className="font-heading font-bold text-white text-4xl leading-tight mb-4">
              Kelola bisnis<br />snack Anda<br />lebih cerdas.
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-12">
              Dashboard performa real-time, analitik penjualan, dan peluang iklan dalam satu platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-auto">
            {[
              { value: '500+', label: 'Supplier Aktif' },
              { value: '10K+', label: 'SKU Terdaftar' },
              { value: '98%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3.5">
                <p className="font-heading font-bold text-white text-xl leading-none">{value}</p>
                <p className="text-white/40 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center bg-[#F4F5F8] px-6 py-10">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
            <Image src="/logo.png" alt="Foodstocks" width={36} height={36} className="object-contain" />
            <span className="font-heading font-bold text-gray-900 text-xl">FoodStocks.id</span>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
            <div className="mb-7">
              <h1 className="font-heading font-bold text-2xl text-gray-900 leading-tight">Selamat Datang</h1>
              <p className="text-gray-400 text-sm mt-1.5">Masuk ke dashboard performa produk Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@supplier.com"
                  required
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-300
                             focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" className="text-xs text-brand-500 hover:text-brand-600 font-medium transition">
                    Lupa password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder-gray-300
                             focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-xl
                           transition-all shadow-brand hover:shadow-lg active:scale-[0.98] text-sm mt-1"
              >
                {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-6 border-t border-gray-50">
              <p className="text-xs text-gray-400 text-center mb-3 font-medium">Coba tanpa registrasi</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fillDemo('supplier')}
                  className="flex-1 h-10 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600
                             rounded-xl text-xs font-semibold text-gray-500 transition-all"
                >
                  👤 Supplier Demo
                </button>
                <button
                  onClick={() => fillDemo('admin')}
                  className="flex-1 h-10 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600
                             rounded-xl text-xs font-semibold text-gray-500 transition-all"
                >
                  🛡️ Admin Demo
                </button>
              </div>
              <p className="text-center text-xs text-gray-300 mt-2.5">
                Password: <code className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md font-mono">demo123</code>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-300 mt-6">
            © 2025 FoodStocks.id · Semua hak dilindungi
          </p>
        </div>
      </div>
    </div>
  )
}
