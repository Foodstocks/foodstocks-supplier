import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if already seeded
    const existingUser = await prisma.user.findFirst()
    if (existingUser) {
      return NextResponse.json({ ok: true, message: 'Database already seeded' })
    }

    const password = await bcrypt.hash('demo123', 10)

    // Suppliers
    const s1 = await prisma.supplier.create({ data: { brandName: 'Dapur Nusantara', slug: 'dapur-nusantara', description: 'Produk makanan tradisional Indonesia', city: 'Jakarta', contactPhone: '081234567890', tier: 'LARGE', isActive: true, joinedAt: new Date('2023-01-15') } })
    const s2 = await prisma.supplier.create({ data: { brandName: 'Bumbu Rempah Co', slug: 'bumbu-rempah-co', description: 'Spesialis bumbu dan rempah premium', city: 'Surabaya', contactPhone: '082345678901', tier: 'MEDIUM', isActive: true, joinedAt: new Date('2023-03-20') } })
    const s3 = await prisma.supplier.create({ data: { brandName: 'Snack Viral ID', slug: 'snack-viral-id', description: 'Camilan kekinian yang viral di media sosial', city: 'Bandung', contactPhone: '083456789012', tier: 'MEDIUM', isActive: true, joinedAt: new Date('2023-06-10') } })
    const s4 = await prisma.supplier.create({ data: { brandName: 'Frozen Fresh', slug: 'frozen-fresh', description: 'Makanan beku berkualitas tinggi', city: 'Medan', contactPhone: '084567890123', tier: 'SMALL', isActive: true, joinedAt: new Date('2023-09-05') } })
    const s5 = await prisma.supplier.create({ data: { brandName: 'Healthy Bites', slug: 'healthy-bites', description: 'Makanan sehat dan organik', city: 'Yogyakarta', contactPhone: '085678901234', tier: 'SMALL', isActive: false, joinedAt: new Date('2023-11-20') } })

    // Users
    await prisma.user.createMany({ data: [
      { email: 'supplier@demo.com', password, name: 'Demo Supplier', role: 'SUPPLIER', supplierId: s1.id },
      { email: 'supplier2@demo.com', password, name: 'Bumbu Supplier', role: 'SUPPLIER', supplierId: s2.id },
      { email: 'supplier3@demo.com', password, name: 'Snack Supplier', role: 'SUPPLIER', supplierId: s3.id },
      { email: 'supplier4@demo.com', password, name: 'Frozen Supplier', role: 'SUPPLIER', supplierId: s4.id },
      { email: 'supplier5@demo.com', password, name: 'Healthy Supplier', role: 'SUPPLIER', supplierId: s5.id },
      { email: 'admin@demo.com', password, name: 'Admin FoodStocks', role: 'ADMIN', supplierId: null },
    ]})

    // Products
    const products = await Promise.all([
      prisma.product.create({ data: { supplierId: s1.id, name: 'Rendang Sapi Premium', sku: 'DNS-001', category: 'Lauk Pauk', priceSupplier: 45000, priceSell: 65000, currentStock: 150, stockThreshold: 30 } }),
      prisma.product.create({ data: { supplierId: s1.id, name: 'Ayam Geprek Frozen', sku: 'DNS-002', category: 'Lauk Pauk', priceSupplier: 25000, priceSell: 38000, currentStock: 80, stockThreshold: 20 } }),
      prisma.product.create({ data: { supplierId: s1.id, name: 'Nasi Goreng Spesial', sku: 'DNS-003', category: 'Makanan Siap Saji', priceSupplier: 18000, priceSell: 28000, currentStock: 200, stockThreshold: 50 } }),
      prisma.product.create({ data: { supplierId: s1.id, name: 'Soto Betawi Pack', sku: 'DNS-004', category: 'Makanan Siap Saji', priceSupplier: 22000, priceSell: 35000, currentStock: 12, stockThreshold: 25 } }),
      prisma.product.create({ data: { supplierId: s2.id, name: 'Bumbu Rendang Sachet', sku: 'BRC-001', category: 'Bumbu & Rempah', priceSupplier: 8000, priceSell: 15000, currentStock: 500, stockThreshold: 100 } }),
      prisma.product.create({ data: { supplierId: s2.id, name: 'Bumbu Gulai Premium', sku: 'BRC-002', category: 'Bumbu & Rempah', priceSupplier: 9000, priceSell: 17000, currentStock: 350, stockThreshold: 80 } }),
      prisma.product.create({ data: { supplierId: s2.id, name: 'Kecap Manis Botol', sku: 'BRC-003', category: 'Saus & Kecap', priceSupplier: 12000, priceSell: 20000, currentStock: 250, stockThreshold: 60 } }),
      prisma.product.create({ data: { supplierId: s2.id, name: 'Sambal Terasi Homemade', sku: 'BRC-004', category: 'Sambal', priceSupplier: 15000, priceSell: 25000, currentStock: 18, stockThreshold: 30 } }),
      prisma.product.create({ data: { supplierId: s3.id, name: 'Keripik Pedas Level 10', sku: 'SVI-001', category: 'Camilan', priceSupplier: 10000, priceSell: 18000, currentStock: 400, stockThreshold: 80 } }),
      prisma.product.create({ data: { supplierId: s3.id, name: 'Makaroni Goreng Crispy', sku: 'SVI-002', category: 'Camilan', priceSupplier: 8000, priceSell: 14000, currentStock: 600, stockThreshold: 120 } }),
      prisma.product.create({ data: { supplierId: s3.id, name: 'Basreng Viral', sku: 'SVI-003', category: 'Camilan', priceSupplier: 12000, priceSell: 20000, currentStock: 300, stockThreshold: 60 } }),
      prisma.product.create({ data: { supplierId: s3.id, name: 'Cireng Bumbu Rujak', sku: 'SVI-004', category: 'Camilan', priceSupplier: 9000, priceSell: 16000, currentStock: 5, stockThreshold: 50 } }),
      prisma.product.create({ data: { supplierId: s4.id, name: 'Nugget Ayam 500gr', sku: 'FF-001', category: 'Frozen Food', priceSupplier: 28000, priceSell: 42000, currentStock: 120, stockThreshold: 24 } }),
      prisma.product.create({ data: { supplierId: s4.id, name: 'Dimsum Udang 20pcs', sku: 'FF-002', category: 'Frozen Food', priceSupplier: 35000, priceSell: 52000, currentStock: 80, stockThreshold: 20 } }),
      prisma.product.create({ data: { supplierId: s4.id, name: 'Bakso Sapi Premium', sku: 'FF-003', category: 'Frozen Food', priceSupplier: 32000, priceSell: 48000, currentStock: 90, stockThreshold: 18 } }),
      prisma.product.create({ data: { supplierId: s5.id, name: 'Granola Bar Oat', sku: 'HB-001', category: 'Makanan Sehat', priceSupplier: 18000, priceSell: 30000, currentStock: 200, stockThreshold: 40 } }),
      prisma.product.create({ data: { supplierId: s5.id, name: 'Smoothie Sayur Hijau', sku: 'HB-002', category: 'Minuman Sehat', priceSupplier: 20000, priceSell: 35000, currentStock: 150, stockThreshold: 30 } }),
    ])

    // Daily sales (last 30 days, simplified)
    const channels: Array<'SHOPEE' | 'TIKTOK' | 'WEBSITE' | 'RESELLER'> = ['SHOPEE', 'TIKTOK', 'WEBSITE', 'RESELLER']
    const salesData: Array<{ productId: string; saleDate: Date; channel: 'SHOPEE' | 'TIKTOK' | 'WEBSITE' | 'RESELLER'; unitsSold: number; grossRevenue: number }> = []

    for (const product of products) {
      for (let d = 0; d < 30; d++) {
        const date = new Date()
        date.setDate(date.getDate() - d)
        date.setHours(0, 0, 0, 0)
        const units = Math.floor(Math.random() * 20) + 1
        const channel = channels[Math.floor(Math.random() * channels.length)]
        salesData.push({
          productId: product.id,
          saleDate: date,
          channel,
          unitsSold: units,
          grossRevenue: units * product.priceSell,
        })
      }
    }

    // Insert in batches
    for (let i = 0; i < salesData.length; i += 100) {
      await prisma.dailySale.createMany({ data: salesData.slice(i, i + 100), skipDuplicates: true })
    }

    // Notifications
    await prisma.notification.createMany({ data: [
      { supplierId: s1.id, type: 'FAST_MOVE', title: 'Produk Fast-Move!', message: 'Rendang Sapi Premium masuk kategori fast-move minggu ini.', isRead: false },
      { supplierId: s1.id, type: 'STOCK_LOW', title: 'Stok Menipis', message: 'Soto Betawi Pack stok tinggal 12 unit. Segera restock!', isRead: false },
      { supplierId: s2.id, type: 'ADS_APPROVED', title: 'Iklan Disetujui', message: 'Request iklan Bumbu Rendang Sachet telah disetujui.', isRead: true },
      { supplierId: s3.id, type: 'STOCK_LOW', title: 'Stok Menipis', message: 'Cireng Bumbu Rujak stok tinggal 5 unit.', isRead: false },
    ]})

    // Ads requests
    await prisma.adsRequest.createMany({ data: [
      { supplierId: s1.id, productId: products[0].id, packageTier: 'BOOSTER', durationDays: 30, message: 'Rendang kami lagi viral, mau boost lebih lagi', status: 'PENDING' },
      { supplierId: s2.id, productId: products[4].id, packageTier: 'STARTER', durationDays: 14, message: 'Mau coba program iklan pertama kali', status: 'APPROVED' },
      { supplierId: s3.id, productId: products[8].id, packageTier: 'PREMIUM', durationDays: 60, message: 'Keripik kami sudah viral, mau maksimalkan', status: 'REVIEWING' },
    ]})

    // Compute and insert status cache
    for (const product of products) {
      const sales = salesData.filter(s => s.productId === product.id)
      const last30 = sales.reduce((a, b) => a + b.unitsSold, 0)
      const last7 = sales.filter(s => {
        const diff = (new Date().getTime() - s.saleDate.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
      }).reduce((a, b) => a + b.unitsSold, 0)

      let status: 'FAST_MOVE' | 'NORMAL' | 'SLOW_MOVE' = 'NORMAL'
      const avgPerDay = last30 / 30
      if (avgPerDay >= 10) status = 'FAST_MOVE'
      else if (avgPerDay < 3) status = 'SLOW_MOVE'

      await prisma.productStatusCache.upsert({
        where: { productId: product.id },
        update: { status, unitsLast7d: last7, unitsLast30d: last30, gmvLast30d: last30 * product.priceSell, computedAt: new Date() },
        create: { productId: product.id, status, unitsLast7d: last7, unitsLast30d: last30, gmvLast30d: last30 * product.priceSell, computedAt: new Date() },
      })
    }

    return NextResponse.json({
      ok: true,
      message: 'Database seeded successfully',
      data: { suppliers: 5, products: products.length, sales: salesData.length }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
