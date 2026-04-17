'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
      const res = await fetch('/api/auth/login', {
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
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">F</span>
            </div>
            <span className="font-heading font-bold text-2xl text-gray-900">FoodStocks.id</span>
          </div>
          <p className="text-gray-500 text-sm">Gudangnya Camilan</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">Selamat Datang!</h1>
          <p className="text-gray-500 text-sm mb-6">Masuk ke dashboard performa produk Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@supplier.com"
                required
                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs text-brand-500 hover:underline">Lupa password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center mb-3">Akses Demo (tanpa registrasi)</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillDemo('supplier')}
                className="flex-1 h-9 border border-gray-200 hover:border-brand-500 hover:text-brand-600 rounded-lg text-xs font-medium text-gray-600 transition-colors"
              >
                👤 Login Supplier
              </button>
              <button
                onClick={() => fillDemo('admin')}
                className="flex-1 h-9 border border-gray-200 hover:border-brand-500 hover:text-brand-600 rounded-lg text-xs font-medium text-gray-600 transition-colors"
              >
                🛡️ Login Admin
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">Password: <code className="bg-gray-100 px-1 rounded">demo123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
