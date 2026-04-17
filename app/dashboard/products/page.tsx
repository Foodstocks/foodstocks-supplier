import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { getProductsBySupplier, getProductWithStatus } from '@/lib/mock-data'
import Link from 'next/link'
import { Megaphone } from 'lucide-react'
import ProductsView from '@/components/ui/products-view'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const user = await getAuthUser()
  if (!user || !user.supplierId) redirect('/login')

  const products  = getProductsBySupplier(user.supplierId).map(getProductWithStatus)
  const fastMoves = products.filter((p) => p.status === 'fast_move').length
  const slowMoves = products.filter((p) => p.status === 'slow_move').length

  return (
    <div className="space-y-5 max-w-[1280px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-[22px] text-gray-900">Produk Saya</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {products.length} produk aktif · {fastMoves} fast-move · {slowMoves} slow-move
          </p>
        </div>
        <Link
          href="/dashboard/ads"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-brand"
        >
          <Megaphone size={15} /> Ajukan Iklan
        </Link>
      </div>

      <ProductsView products={products} />
    </div>
  )
}
