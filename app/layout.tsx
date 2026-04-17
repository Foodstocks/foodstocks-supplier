import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'Supplier Dashboard — FoodStocks.id',
  description: 'Portal supplier FoodStocks.id — pantau performa produk & kelola program iklan',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  )
}
