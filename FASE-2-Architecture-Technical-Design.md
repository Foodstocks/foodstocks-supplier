# FASE 2 — Architecture & Technical Design
## FoodStocks.id Supplier Dashboard

**Versi:** 2.0 (Updated — Deployment-Ready Stack)
**Tanggal:** 16 April 2026  
**Status:** Updated ✅

> **Perubahan dari v1.0:** Stack dikonsolidasi menjadi full-stack Next.js (tidak ada backend Express terpisah).
> Tujuan: **satu codebase, satu service, deploy dalam hitungan menit** — tanpa konfigurasi server manual.

---

## 2.1 System Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENTS (Users)                               │
│                                                                        │
│   ┌──────────────────┐          ┌───────────────────────────────┐    │
│   │  Supplier (HP)   │          │  Admin FoodStocks (Laptop)    │    │
│   │  Mobile Browser  │          │  Desktop Browser              │    │
│   └────────┬─────────┘          └──────────────┬────────────────┘    │
└────────────┼────────────────────────────────────┼────────────────────┘
             │                                    │
             ▼                HTTPS               ▼
┌──────────────────────────────────────────────────────────────────────┐
│               NEXT.JS 14 APP  (Full-Stack, Single Service)            │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  App Router (Frontend Pages)                                    │  │
│  │  /login  /dashboard  /products  /ads  /notifications  /admin   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │  API Routes (Backend — /app/api/*)                              │  │
│  │  /api/auth  /api/supplier/*  /api/admin/*  /api/data/import    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │  Auth (jose JWT) │  │  Prisma ORM    │  │  Server Actions      │  │
│  │  + Middleware    │  │  (Type-safe DB)│  │  (form submit, etc.) │  │
│  └──────────────────┘  └────────────────┘  └──────────────────────┘  │
└───────────────────────────────────┬──────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
     ┌──────────────────────────┐    ┌─────────────────────────────┐
     │  Neon PostgreSQL         │    │  External Services           │
     │  (Serverless, free tier) │    │                             │
     │                          │    │  ┌─────────────────────┐   │
     │  - suppliers             │    │  │  Fonnte WA API       │   │
     │  - products              │    │  │  (Notif WA)          │   │
     │  - daily_sales           │    │  └─────────────────────┘   │
     │  - ads_requests          │    │                             │
     │  - campaigns             │    │  ┌─────────────────────┐   │
     │  - notifications         │    │  │  Shopee Open API     │   │
     │  - users                 │    │  │  (v2.0 — future)     │   │
     └──────────────────────────┘    │  └─────────────────────┘   │
                                     └─────────────────────────────┘
```

**Kenapa satu service saja?**
- Tidak perlu manage dua deployment (frontend + backend terpisah)
- Next.js App Router + API Routes = full-stack dalam satu `npm run build`
- Deploy ke Vercel/Railway: **push ke GitHub → otomatis live**
- Environment variables cukup satu tempat

---

### Deployment Architecture

```
Developer (lokal)
    │  git push
    ▼
GitHub Repository
    │  auto-trigger CI/CD
    ▼
Vercel (Primary) ATAU Railway (Alternative)
    │  build: next build
    │  env vars: DATABASE_URL, JWT_SECRET, dll
    ▼
Production URL: supplier.foodstocks.id

Database: Neon PostgreSQL (serverless)
    - Free tier: 0.5 GB storage, cukup untuk ratusan supplier
    - Branching support: dev / staging / production DB terpisah
    - Serverless: tidak ada idle cost
    - Connect string: postgresql://user:pass@ep-xxx.neon.tech/foodstocks
```

---

### Data Flow: Import → Dashboard → Notifikasi

```
MVP (Manual Daily Import):
──────────────────────────
Admin export CSV dari Shopee Seller Center (jam 06:00)
    │
    ▼
Upload ke /admin/data/import (Next.js API Route)
    │  Validasi format CSV
    │  Upsert ke daily_sales via Prisma
    │
    ▼
Server Action: recalculate product status
    │  Hitung units_7d, units_30d, wow_growth
    │  Update product_status_cache
    │
    ▼
Cron job (Vercel Cron / Railway Cron)
    │  Setiap hari jam 06:30
    │  Cek produk yang baru masuk fast-move
    │
    ▼
Notifikasi WA via Fonnte API → Supplier terkait


v2.0 (Shopee API Real-time):
─────────────────────────────
Shopee Open Platform API
    │  OAuth + webhook / polling per jam
    ▼
API Route /api/internal/sync (cron trigger)
    │  Normalize → Upsert daily_sales
    ▼
Auto-recalculate status → notifikasi otomatis
```

---

### API Routes Design

**Base:** Next.js API Routes di `/app/api/`

#### Auth
| Method | Path | Deskripsi |
|--------|------|-----------|
| POST | `/api/auth/login` | Login, return JWT cookie |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/auth/me` | Data user yang sedang login |

#### Supplier (middleware: role = supplier, scope ke supplierId sendiri)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/supplier/overview` | Summary cards dashboard |
| GET | `/api/supplier/products` | Daftar produk + status |
| GET | `/api/supplier/products/[id]` | Detail + grafik 30 hari |
| GET | `/api/supplier/ads/eligible` | Produk eligible iklan |
| GET | `/api/supplier/ads/requests` | Riwayat request iklan |
| POST | `/api/supplier/ads/requests` | Submit request iklan baru |
| GET | `/api/supplier/notifications` | Notifikasi |
| PATCH | `/api/supplier/notifications/[id]/read` | Tandai sudah dibaca |

#### Admin (middleware: role = admin)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/admin/overview` | Overview semua supplier |
| GET | `/api/admin/suppliers` | Daftar supplier + GMV |
| GET | `/api/admin/ads/requests` | Semua pending request |
| PATCH | `/api/admin/ads/requests/[id]` | Approve / Reject |
| POST | `/api/admin/data/import` | Upload CSV sales data |

---

## 2.2 Data Model / Database Schema

*(Tidak berubah dari v1.0 — schema tetap sama)*

### Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // untuk Neon serverless
}

model User {
  id         String    @id @default(cuid())
  email      String    @unique
  password   String
  role       Role      @default(SUPPLIER)
  name       String
  phone      String?
  isActive   Boolean   @default(true)
  lastLogin  DateTime?
  createdAt  DateTime  @default(now())
  supplier   Supplier?

  @@map("users")
}

model Supplier {
  id           String        @id @default(cuid())
  userId       String        @unique
  user         User          @relation(fields: [userId], references: [id])
  brandName    String
  logoUrl      String?
  description  String?
  city         String?
  contactName  String?
  contactPhone String?
  contactWa    String?
  tier         SupplierTier  @default(SMALL)
  joinedAt     DateTime      @default(now())
  isActive     Boolean       @default(true)
  products     Product[]
  adsRequests  AdsRequest[]
  campaigns    AdsCampaign[]
  notifications Notification[]

  @@map("suppliers")
}

model Product {
  id             String               @id @default(cuid())
  supplierId     String
  supplier       Supplier             @relation(fields: [supplierId], references: [id])
  sku            String               @unique
  name           String
  description    String?
  imageUrl       String?
  category       String?
  priceSupplier  Decimal
  priceSell      Decimal?
  weightGram     Int?
  currentStock   Int                  @default(0)
  stockThreshold Int                  @default(50)
  isActive       Boolean              @default(true)
  listedAt       DateTime             @default(now())
  dailySales     DailySale[]
  reviews        Review[]
  statusCache    ProductStatusCache?
  adsRequests    AdsRequest[]

  @@map("products")
}

model DailySale {
  id            String      @id @default(cuid())
  productId     String
  product       Product     @relation(fields: [productId], references: [id])
  saleDate      DateTime    @db.Date
  channel       Channel
  unitsSold     Int         @default(0)
  grossRevenue  Decimal     @default(0)
  netRevenue    Decimal?
  unitsReturned Int         @default(0)
  createdAt     DateTime    @default(now())

  @@unique([productId, saleDate, channel])
  @@index([productId, saleDate(sort: Desc)])
  @@map("daily_sales")
}

model ProductStatusCache {
  productId        String    @id
  product          Product   @relation(fields: [productId], references: [id])
  status           ProductStatus
  unitsLast7d      Int       @default(0)
  unitsLast30d     Int       @default(0)
  gmvLast30d       Decimal   @default(0)
  wowGrowth        Float?
  momGrowth        Float?
  percentileRank   Float?
  avgRating        Float?
  totalReviews     Int       @default(0)
  lastCalculatedAt DateTime  @default(now())

  @@map("product_status_cache")
}

model Review {
  id           String    @id @default(cuid())
  productId    String
  product      Product   @relation(fields: [productId], references: [id])
  channel      Channel
  rating       Int
  reviewText   String?
  reviewerName String?
  reviewDate   DateTime  @db.Date
  isVerified   Boolean   @default(false)
  createdAt    DateTime  @default(now())

  @@map("reviews")
}

model AdsRequest {
  id              String        @id @default(cuid())
  supplierId      String
  supplier        Supplier      @relation(fields: [supplierId], references: [id])
  productId       String
  product         Product       @relation(fields: [productId], references: [id])
  packageTier     AdsTier
  notes           String?
  preferredStart  DateTime?     @db.Date
  status          AdsRequestStatus @default(PENDING)
  rejectionReason String?
  reviewedAt      DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  campaign        AdsCampaign?

  @@map("ads_requests")
}

model AdsCampaign {
  id           String          @id @default(cuid())
  requestId    String          @unique
  request      AdsRequest      @relation(fields: [requestId], references: [id])
  supplierId   String
  supplier     Supplier        @relation(fields: [supplierId], references: [id])
  packageTier  AdsTier
  priceCharged Decimal
  startDate    DateTime        @db.Date
  endDate      DateTime        @db.Date
  status       CampaignStatus  @default(SCHEDULED)
  channels     String[]
  createdAt    DateTime        @default(now())

  @@map("ads_campaigns")
}

model Notification {
  id         String           @id @default(cuid())
  supplierId String
  supplier   Supplier         @relation(fields: [supplierId], references: [id])
  type       NotificationType
  title      String
  body       String
  data       Json?
  isRead     Boolean          @default(false)
  waSent     Boolean          @default(false)
  waSentAt   DateTime?
  createdAt  DateTime         @default(now())

  @@index([supplierId, createdAt(sort: Desc)])
  @@map("notifications")
}

// ─── Enums ────────────────────────────────────────────────────────────

enum Role {
  SUPPLIER
  ADMIN
}

enum SupplierTier {
  SMALL
  MEDIUM
  LARGE
}

enum Channel {
  SHOPEE
  TIKTOK
  WEBSITE
  LIVE_SHOPEE
  LIVE_TIKTOK
  RESELLER
}

enum ProductStatus {
  FAST_MOVE
  NORMAL
  SLOW_MOVE
}

enum AdsTier {
  STARTER
  BOOSTER
  PREMIUM
}

enum AdsRequestStatus {
  PENDING
  REVIEWING
  APPROVED
  REJECTED
  CANCELLED
}

enum CampaignStatus {
  SCHEDULED
  ACTIVE
  COMPLETED
  CANCELLED
}

enum NotificationType {
  STOCK_LOW
  FAST_MOVE
  ADS_APPROVED
  ADS_REJECTED
  ADS_STARTED
  ADS_COMPLETED
  REVIEW_NEW
  SYSTEM
}
```

---

## 2.3 Integration Architecture

*(Tidak berubah dari v1.0 — tetap sama)*

- **MVP:** Manual CSV import dari Shopee Seller Center
- **v2.0:** Shopee Open Platform API (OAuth 2.0, polling per jam)
- **Notifikasi WA:** Fonnte API

---

## 2.4 Tech Stack Decision (Updated v2.0)

### Perubahan Utama dari v1.0

| Komponen | v1.0 (Lama) | v2.0 (Baru) | Alasan Perubahan |
|---|---|---|---|
| Frontend | Next.js 14 | Next.js 14 ✅ sama | — |
| Backend | Express.js terpisah | **Next.js API Routes** | Satu service, lebih mudah deploy |
| Database | PostgreSQL + Railway | **Neon PostgreSQL** | Serverless, free tier, integrates Vercel |
| Cache | Redis | **Tidak ada (MVP)** | Kurangi complexity, cukup DB untuk MVP |
| Auth | Custom JWT | **jose + httpOnly cookie** | Lightweight, tidak perlu library besar |
| Hosting | Railway | **Vercel (primary)** | Zero-config untuk Next.js, auto CI/CD |
| ORM | Prisma | **Prisma** ✅ sama | — |

---

### Frontend & Backend — Next.js 14 (Full-Stack)

**Kenapa dikonsolidasi ke Next.js saja?**
- **Satu codebase, satu deploy** — tidak perlu manage dua service berbeda
- **API Routes** di Next.js sudah cukup powerful untuk kebutuhan dashboard ini
- **Server Actions** untuk form submission (lebih simpel dari fetch + API route terpisah)
- **Type sharing** — satu TypeScript type untuk frontend dan backend, tidak ada desync

---

### Database — Neon PostgreSQL (Serverless)

**Kenapa Neon, bukan Railway PostgreSQL?**
- **Free tier** yang generous: 0.5 GB storage, 190 jam compute/bulan
- **Serverless connection pooling** built-in — cocok untuk Next.js di Vercel (setiap API route adalah serverless function)
- **Branching** — bisa buat branch database untuk dev/staging tanpa duplikasi data
- **One-click integration** dengan Vercel (otomatis inject `DATABASE_URL`)
- Railway PostgreSQL tetap bisa dipakai jika prefer self-hosted

**Kenapa tidak MySQL?**
PostgreSQL unggul di window functions (dibutuhkan untuk percentile rank produk) dan JSON column.

---

### Auth — jose + httpOnly Cookie

**Kenapa jose, bukan NextAuth?**
- **NextAuth** powerful untuk OAuth (Google, GitHub login) tapi over-engineered untuk use case ini (email + password saja, dua role)
- **jose** adalah lightweight JWT library, dipakai langsung di Next.js Middleware untuk proteksi route
- Cookie httpOnly: aman dari XSS, tidak perlu localStorage

**Flow:**
```
POST /api/auth/login
  → verify email + bcrypt password
  → sign JWT (payload: userId, role, supplierId)
  → set httpOnly cookie (maxAge 7 hari)
  → return user data

Next.js Middleware (middleware.ts)
  → intercept semua request ke /dashboard/* dan /admin/*
  → verify JWT dari cookie
  → jika invalid → redirect ke /login
  → jika role tidak cocok → redirect ke halaman yang benar
```

---

### Cache — Dihapus untuk MVP

**Kenapa Redis dihapus dari MVP?**
- Neon PostgreSQL dengan Prisma sudah cepat untuk jumlah data MVP (< 1000 produk, < 100 supplier)
- Redis menambah satu service lagi = satu lagi yang bisa gagal, satu lagi yang perlu dikonfigurasi
- Next.js memiliki built-in `unstable_cache` dan `revalidatePath` yang bisa dipakai untuk caching ringan
- Redis bisa ditambahkan kembali di v1.1 jika performa mulai menjadi masalah

**Caching Next.js built-in yang dipakai:**
```typescript
// Cache hasil query selama 5 menit, revalidate saat data import baru
const overview = await unstable_cache(
  () => getSupplierOverview(supplierId),
  [`overview-${supplierId}`],
  { revalidate: 300 }
)();
```

---

### Hosting — Vercel

**Kenapa Vercel?**
- **Zero-config** untuk Next.js — push ke GitHub, otomatis build dan deploy
- **Preview deployments** — setiap PR dapat URL preview otomatis
- **Vercel Cron Jobs** — untuk daily recalculation status produk (gantikan cron server manual)
- **Edge Middleware** — Next.js middleware jalan di edge, auth check sangat cepat
- **Free tier** untuk project kecil, $20/bulan untuk production

**Setup deployment (3 langkah):**
```
1. Push kode ke GitHub
2. Connect repo di vercel.com
3. Tambah environment variables:
   DATABASE_URL=postgresql://...@neon.tech/foodstocks
   DIRECT_URL=postgresql://...@neon.tech/foodstocks
   JWT_SECRET=random-string-panjang
   FONNTE_TOKEN=xxx (opsional untuk MVP)
```

**Railway sebagai alternatif** (jika prefer self-hosted):
- Tetap bisa deploy dengan `railway up`
- Tambah PostgreSQL addon di Railway (gantikan Neon)
- Sedikit lebih banyak konfigurasi, tapi lebih banyak kontrol

---

### Charting — Recharts ✅ (Tidak berubah)

---

### Styling — Tailwind CSS + shadcn/ui

**Kenapa shadcn/ui ditambahkan?**
- Komponen siap pakai (Table, Dialog, Dropdown, Badge, Card, dll) yang sudah styled dengan Tailwind
- Bukan library eksternal — kode komponen di-copy ke project, jadi fully customizable
- Konsistensi desain tanpa harus build dari scratch

---

## 2.5 Security Considerations

*(Tidak berubah dari v1.0)*

### Tambahan untuk deployment:

**Environment Variables yang wajib diset di Vercel/Railway:**
```env
# Database
DATABASE_URL=           # Neon connection string (pooled)
DIRECT_URL=             # Neon direct connection string (untuk migrations)

# Auth
JWT_SECRET=             # Min 32 karakter random string

# App
NEXT_PUBLIC_APP_URL=    # https://supplier.foodstocks.id

# Notifikasi (opsional MVP)
FONNTE_TOKEN=           # API token dari fonnte.com
```

**Yang TIDAK boleh ada di .env yang di-commit ke GitHub:**
- Semua nilai di atas harus di `.gitignore` dan di-set via Vercel dashboard

---

## 2.6 Scalability Plan

*(Tidak berubah dari v1.0, dengan catatan tambahan)*

**Dengan stack baru ini, upgrade path lebih mudah:**
- **Scale up:** Vercel otomatis scale serverless functions berdasarkan traffic
- **Tambah Redis:** Cukup tambah Upstash Redis (serverless Redis yang compatible dengan Vercel) dan ganti `unstable_cache` dengan Redis
- **Pisah backend:** Jika API logic terlalu kompleks, bisa migrasi API routes ke Express/Hono terpisah tanpa ubah frontend — interface (endpoint) tetap sama

---

## Ringkasan Tech Stack Final

| Layer | Teknologi | Kenapa |
|---|---|---|
| Full-stack framework | **Next.js 14** (App Router) | SSR + API Routes dalam satu service |
| Language | **TypeScript** | Type safety frontend & backend |
| Database | **Neon PostgreSQL** (Serverless) | Free tier, serverless-friendly, Vercel integration |
| ORM | **Prisma** | Type-safe queries, auto-migration |
| Auth | **jose** (JWT) + httpOnly cookie | Lightweight, secure, no external dependency |
| Styling | **Tailwind CSS** + **shadcn/ui** | Cepat, konsisten, customizable |
| Charts | **Recharts** | React-native, responsive |
| Notification | **Fonnte** (WA Business API) | WA open rate 98%, provider lokal |
| Hosting | **Vercel** (primary) | Zero-config, auto CI/CD, edge middleware |
| DB Hosting | **Neon** | Serverless PostgreSQL, gratis untuk MVP |
| Cron Jobs | **Vercel Cron** | Built-in, tidak perlu server tambahan |
| Validation | **Zod** | Schema validation frontend & backend |
| Error Tracking | **Sentry** (v1.1) | Catch production errors |

### Deploy Checklist (saat FASE 4 selesai)
```
[ ] Push kode ke GitHub (repo public/private)
[ ] Connect repo ke Vercel (vercel.com/new)
[ ] Set environment variables di Vercel dashboard
[ ] Run: npx prisma db push (untuk create tables di Neon)
[ ] Run: npx prisma db seed (untuk isi mock data)
[ ] Done — app live di https://[project].vercel.app
[ ] (Opsional) Connect custom domain: supplier.foodstocks.id
```

---

*Dokumen FASE 2 diperbarui ke v2.0. Stack sekarang deployment-ready: satu service, zero DevOps, deploy dalam hitungan menit via Vercel + Neon.*

*Lanjut ke FASE 3 — UI/UX Wireframe & Design System.*
