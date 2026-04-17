# FoodStocks.id — Supplier Dashboard

Portal supplier FoodStocks.id untuk memantau performa produk dan mengelola program iklan.

## Tech Stack
- **Framework:** Next.js 14 (App Router, Full-stack)
- **Database:** Neon PostgreSQL + Prisma ORM
- **Auth:** JWT + httpOnly Cookie (jose)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Deploy:** Vercel + Neon

---

## Cara Jalankan (Demo Mode — tanpa database)

```bash
# 1. Install dependencies
npm install

# 2. Buat file .env.local (sudah ada, tinggal pakai)
# USE_MOCK_DATA=true sudah di-set

# 3. Jalankan development server
npm run dev

# 4. Buka http://localhost:3000
```

### Akun Demo
| Role     | Email                  | Password  |
|----------|------------------------|-----------|
| Supplier | supplier@demo.com      | demo123   |
| Admin    | admin@demo.com         | demo123   |

---

## Deploy ke Vercel + Neon (Production)

### 1. Setup Database (Neon)
1. Daftar di [neon.tech](https://neon.tech)
2. Buat project baru: `foodstocks-supplier`
3. Copy **connection string** (ada dua: pooled & direct)

### 2. Deploy ke Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login & deploy
vercel

# Atau: push ke GitHub → connect di vercel.com → auto deploy
```

### 3. Set Environment Variables di Vercel
```
DATABASE_URL      = postgresql://...@ep-xxx.neon.tech/foodstocks?sslmode=require
DIRECT_URL        = postgresql://...@ep-xxx.neon.tech/foodstocks?sslmode=require
JWT_SECRET        = [random string 32+ karakter]
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push

# Seed data demo
npm run db:seed
```

### 5. Selesai!
App live di `https://your-app.vercel.app`

---

## Struktur Project
```
├── app/
│   ├── login/              # Halaman login
│   ├── dashboard/          # Supplier pages
│   │   ├── page.tsx         # Dashboard overview
│   │   ├── products/        # Daftar & detail produk
│   │   ├── ads/             # Peluang iklan
│   │   └── notifications/   # Notifikasi
│   ├── admin/              # Admin pages
│   │   ├── page.tsx         # Overview semua supplier
│   │   └── ads/             # Ads pipeline
│   └── api/                # API Routes (backend)
│       ├── auth/
│       ├── supplier/
│       └── admin/
├── components/
│   ├── charts/             # Recharts components
│   ├── layout/             # Sidebar, Topbar
│   └── admin/              # Admin-specific components
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── utils.ts            # Helpers & formatters
│   ├── auth.ts             # JWT helpers
│   └── mock-data.ts        # Demo data (22 produk, 5 supplier)
├── prisma/
│   └── schema.prisma       # Database schema
├── middleware.ts            # Auth middleware (route protection)
└── vercel.json             # Deployment config
```

---

## Fitur MVP
- ✅ Login supplier & admin (demo tanpa DB)
- ✅ Dashboard overview: summary cards, tren chart, donut status
- ✅ Tabel produk: Fast-Move/Normal/Slow-Move badge, channel breakdown
- ✅ Detail produk: grafik 30 hari, stok velocity, channel pie, rating
- ✅ Peluang Iklan: eligible products, 3 paket, form request, status tracker
- ✅ Notifikasi: list dengan type indicator & unread badge
- ✅ Admin: ranking supplier, ads pipeline approve/reject, data import
- ✅ Mobile-first: responsive + bottom nav bar
- ✅ Data isolation per supplier (middleware + scoped queries)
