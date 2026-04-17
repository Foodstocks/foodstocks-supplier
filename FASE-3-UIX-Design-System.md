# FASE 3 — UI/UX Wireframe & Design System
## FoodStocks.id Supplier Dashboard

**Versi:** 1.0  
**Tanggal:** 16 April 2026  
**Status:** Draft — Menunggu Review & Approval

> **Skills digunakan:**
> - `style-tile` (Branding & Design) — visual direction, color, typography, component specs
> - `data-dashboard-design` (Analytics & Data) — dashboard layout, metric hierarchy, visualization
> - `kpi-dashboard` (Analytics & Data) — KPI structure dan status indicators

---

## 3.1 Style Tile — Visual Direction

### Brand Adjectives (FoodStocks.id)
`Energik` · `Terpercaya` · `Modern` · `Playful tapi Profesional` · `Indonesia Banget`

### Mood Reference
FoodStocks adalah brand camilan kekinian yang menyasar milenial & Gen-Z. Dashboard-nya harus terasa seperti app modern Indonesia — tidak kaku seperti enterprise software, tapi tetap data-driven dan profesional. Bayangkan perpaduan antara **Tokopedia Seller Center** (familiar, fungsional) dengan sentuhan **Notion** (clean, modern) dan warna semangat **Shopee** (orange, energik).

---

### Color Palette

```
PRIMARY BRAND
─────────────────────────────────────────────────────────
  Orange 500     #F97316   ← CTA utama, highlight, badge fast-move
  Orange 600     #EA6C0A   ← Hover state CTA
  Orange 100     #FFEDD5   ← Background subtle, alert ringan
  Orange 50      #FFF7ED   ← Background card accent

NEUTRAL / BASE
─────────────────────────────────────────────────────────
  Gray 950       #0A0A0A   ← Sidebar background
  Gray 900       #111827   ← Text headings utama
  Gray 700       #374151   ← Text body
  Gray 500       #6B7280   ← Text muted / label
  Gray 300       #D1D5DB   ← Border, divider
  Gray 100       #F3F4F6   ← Background halaman
  White          #FFFFFF   ← Background card

STATUS COLORS
─────────────────────────────────────────────────────────
  Green 500      #22C55E   ← Fast-Move badge background
  Green 100      #DCFCE7   ← Fast-Move badge background subtle
  Green 700      #15803D   ← Fast-Move badge text

  Yellow 500     #EAB308   ← Normal badge
  Yellow 100     #FEF9C3   ← Normal badge background subtle
  Yellow 700     #A16207   ← Normal badge text

  Red 500        #EF4444   ← Slow-Move badge / alert
  Red 100        #FEE2E2   ← Slow-Move badge background subtle
  Red 700        #B91C1C   ← Slow-Move badge text

  Blue 500       #3B82F6   ← Info / link / Shopee channel
  Purple 500     #A855F7   ← TikTok channel indicator
  Teal 500       #14B8A6   ← Live Selling channel indicator
  Indigo 500     #6366F1   ← Reseller channel indicator
```

---

### Typography

```
FONT FAMILIES
─────────────────────────────────────────────────────────
  Heading    Plus Jakarta Sans   — Bold, modern, Indonesian tech feel
  Body       Inter               — Readable, neutral, web standard
  Number     Inter (tabular)     — Konsisten untuk angka di tabel & chart

  (Google Fonts — gratis, fast CDN)

TYPE SCALE
─────────────────────────────────────────────────────────
  Display    36px / Bold      line-height: 1.15   ← Angka besar summary card
  H1         28px / SemiBold  line-height: 1.2    ← Judul halaman
  H2         22px / SemiBold  line-height: 1.3    ← Judul section
  H3         18px / Medium    line-height: 1.4    ← Judul card/widget
  Body L     16px / Regular   line-height: 1.6    ← Body teks utama
  Body S     14px / Regular   line-height: 1.5    ← Label, metadata
  Caption    12px / Regular   line-height: 1.4    ← Timestamp, tooltip
  Badge      11px / SemiBold  line-height: 1     ← Status badge
```

---

### Component Specs

#### Buttons
```
PRIMARY (CTA utama)
  Background : #F97316 (Orange 500)
  Text       : #FFFFFF, 14px SemiBold
  Padding    : 10px 20px
  Radius     : 8px
  Hover      : #EA6C0A (Orange 600)
  Shadow     : 0 1px 2px rgba(249,115,22,0.3)

SECONDARY
  Background : #FFFFFF
  Border     : 1.5px solid #D1D5DB
  Text       : #374151, 14px Medium
  Hover      : background #F3F4F6

GHOST/DANGER
  Background : transparent
  Text       : #EF4444
  Hover      : background #FEE2E2

ICON BUTTON (sidebar, action)
  Size       : 36x36px
  Radius     : 8px
  Hover      : background #F3F4F6
```

#### Cards
```
DEFAULT CARD
  Background : #FFFFFF
  Border     : 1px solid #E5E7EB
  Radius     : 12px
  Padding    : 20px 24px
  Shadow     : 0 1px 3px rgba(0,0,0,0.08)

HIGHLIGHT CARD (fast-move alert, ads CTA)
  Background : #FFF7ED (Orange 50)
  Border     : 1px solid #FDBA74 (Orange 300)
  Radius     : 12px
  Left strip : 4px solid #F97316

METRIC CARD (summary)
  Background : #FFFFFF
  Radius     : 12px
  Padding    : 20px
  Icon area  : 40x40px, radius 10px, bg Orange 100
```

#### Status Badges
```
🟢 FAST-MOVE
  Background : #DCFCE7
  Text       : #15803D, 11px SemiBold
  Border     : 1px solid #86EFAC
  Radius     : 999px (pill)
  Padding    : 3px 10px
  Prefix icon: ↑ atau 🔥

🟡 NORMAL
  Background : #FEF9C3
  Text       : #A16207
  Border     : 1px solid #FDE047

🔴 SLOW-MOVE
  Background : #FEE2E2
  Text       : #B91C1C
  Border     : 1px solid #FCA5A5
  Prefix icon: ↓
```

#### Form Inputs
```
INPUT FIELD
  Height     : 40px
  Border     : 1.5px solid #D1D5DB
  Radius     : 8px
  Padding    : 0 12px
  Font       : 14px Regular #111827
  Focus      : border #F97316, ring 3px rgba(249,115,22,0.15)
  Error      : border #EF4444, text error #B91C1C 12px

SELECT / DROPDOWN
  Sama seperti input + chevron icon kanan

TEXTAREA
  Min-height : 80px
  Resize     : vertical only
```

#### Tables
```
TABLE HEADER
  Background : #F9FAFB
  Text       : #6B7280, 12px SemiBold uppercase, letter-spacing 0.5px
  Border-b   : 1px solid #E5E7EB

TABLE ROW
  Height     : 56px
  Hover      : background #F9FAFB
  Border-b   : 1px solid #F3F4F6
  Text       : #111827, 14px

CELL — NUMBER/METRIC
  Font       : Inter tabular, 14px Medium
  Text-align : right
```

#### Sidebar Navigation
```
SIDEBAR
  Width      : 240px (desktop), 0px collapsed (mobile)
  Background : #0A0A0A
  Padding    : 16px

LOGO AREA
  Height     : 64px
  Logo text  : White, Plus Jakarta Sans Bold

NAV ITEM
  Height     : 40px
  Padding    : 0 12px
  Radius     : 8px
  Text       : #9CA3AF, 14px Medium
  Icon       : 20px, same color
  Hover      : background #1F2937, text #FFFFFF
  ACTIVE     : background #F97316, text #FFFFFF, icon #FFFFFF

SECTION LABEL
  Text       : #4B5563, 11px SemiBold uppercase
  Margin-top : 24px
```

---

### CSS Design Tokens

```css
/* ─── Color Tokens ──────────────────────────────────────── */
--color-primary:          #F97316;
--color-primary-hover:    #EA6C0A;
--color-primary-subtle:   #FFF7ED;
--color-primary-light:    #FFEDD5;

--color-bg-page:          #F3F4F6;
--color-bg-card:          #FFFFFF;
--color-bg-sidebar:       #0A0A0A;

--color-text-primary:     #111827;
--color-text-secondary:   #374151;
--color-text-muted:       #6B7280;
--color-text-disabled:    #9CA3AF;

--color-border:           #E5E7EB;
--color-border-subtle:    #F3F4F6;

--color-fast-move-bg:     #DCFCE7;
--color-fast-move-text:   #15803D;
--color-fast-move-border: #86EFAC;

--color-normal-bg:        #FEF9C3;
--color-normal-text:      #A16207;
--color-normal-border:    #FDE047;

--color-slow-move-bg:     #FEE2E2;
--color-slow-move-text:   #B91C1C;
--color-slow-move-border: #FCA5A5;

--color-channel-shopee:   #3B82F6;
--color-channel-tiktok:   #A855F7;
--color-channel-live:     #14B8A6;
--color-channel-reseller: #6366F1;
--color-channel-website:  #F59E0B;

/* ─── Typography Tokens ─────────────────────────────────── */
--font-heading:    'Plus Jakarta Sans', sans-serif;
--font-body:       'Inter', sans-serif;

--text-display:    2.25rem;   /* 36px */
--text-h1:         1.75rem;   /* 28px */
--text-h2:         1.375rem;  /* 22px */
--text-h3:         1.125rem;  /* 18px */
--text-body-l:     1rem;      /* 16px */
--text-body-s:     0.875rem;  /* 14px */
--text-caption:    0.75rem;   /* 12px */
--text-badge:      0.6875rem; /* 11px */

/* ─── Spacing Tokens ────────────────────────────────────── */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;

/* ─── Radius Tokens ─────────────────────────────────────── */
--radius-sm:   6px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-pill: 999px;

/* ─── Shadow Tokens ─────────────────────────────────────── */
--shadow-xs:   0 1px 2px rgba(0,0,0,0.05);
--shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
--shadow-md:   0 4px 12px rgba(0,0,0,0.1);
--shadow-lg:   0 8px 24px rgba(0,0,0,0.12);
```

---

## 3.2 Dashboard Layout — Data Dashboard Design

> Menggunakan prinsip dari skill `data-dashboard-design`:
> *"A dashboard that requires explanation has failed — every metric should answer a question the viewer already has in 5 seconds or less."*

### Dashboard Hierarchy

```
LEVEL 1 — EXECUTIVE GLANCE (dalam 5 detik)
  → Summary cards: berapa yang terjual, berapa pendapatannya, oke atau tidak?

LEVEL 2 — TREND CONTEXT (dalam 30 detik)
  → Grafik tren 30 hari, perbandingan bulan lalu, distribusi status produk

LEVEL 3 — DRILL-DOWN (kapanpun dibutuhkan)
  → Tabel produk detail, grafik per-produk, breakdown per channel
```

---

## 3.3 Wireframe Halaman

### Layout Global

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (240px, dark)        │  MAIN CONTENT AREA        │
│                              │                           │
│ [Logo FoodStocks]            │  [Top Bar: breadcrumb     │
│                              │   + notif bell + avatar]  │
│ MENU                         │                           │
│  ▶ Dashboard Overview        │  [Page Content]           │
│    Produk Saya               │                           │
│    Peluang Iklan             │                           │
│    Notifikasi                │                           │
│                              │                           │
│ ─────────────────────        │                           │
│ AKUN                         │                           │
│    Profil                    │                           │
│    Keluar                    │                           │
│                              │                           │
│ [Supplier badge:             │                           │
│  nama brand + tier]          │                           │
└─────────────────────────────────────────────────────────┘

MOBILE (< 768px):
  Sidebar collapsed → hamburger menu
  Bottom nav bar: Dashboard / Produk / Iklan / Notif
```

---

### A. Login Page

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│         [Logo FoodStocks.id + tagline]                 │
│         "Gudangnya Camilan"                            │
│                                                        │
│   ┌──────────────────────────────────────────────┐    │
│   │          Selamat Datang, Supplier!            │    │
│   │    Masuk ke dashboard performa produkmu       │    │
│   │                                               │    │
│   │  Email                                        │    │
│   │  [________________________]                   │    │
│   │                                               │    │
│   │  Password                          [Lupa?]   │    │
│   │  [________________________]                   │    │
│   │                                               │    │
│   │  [    Masuk ke Dashboard     ] ← CTA orange   │    │
│   │                                               │    │
│   │  ─────── atau ───────                        │    │
│   │                                               │    │
│   │  Demo: supplier@demo.com / admin@demo.com     │    │
│   │  (untuk akses demo tanpa registrasi)          │    │
│   └──────────────────────────────────────────────┘    │
│                                                        │
│  Background: subtle pattern orange/cream               │
└────────────────────────────────────────────────────────┘
```

**Komponen:** Card centered, max-width 420px, shadow-lg, bg white, radius-xl.
**Mobile:** Full-screen card, keyboard-aware scroll.

---

### B. Dashboard Overview (Supplier View)

```
┌──── TOP BAR ────────────────────────────────────────────────┐
│  Dashboard  /  Overview          🔔3   [Raftels Avatar]     │
└─────────────────────────────────────────────────────────────┘

┌──── ADS CTA BANNER (conditional: jika ada fast-move) ───────┐
│  🔥  "Keripik Balado Raftels sedang TRENDING minggu ini!     │
│      Boost penjualan dengan program iklan FoodStocks →"      │
│                              [ Lihat Peluang Iklan → ]       │
│  Background: Orange 50, border-l: 4px Orange 500             │
└─────────────────────────────────────────────────────────────┘

┌──── SUMMARY CARDS (4 cards, grid 2x2 mobile / 4x1 desktop) ─┐
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  ┌────────┐ │
│  │ 📦 Total SKU│  │ 📈 Unit     │  │ 💰 GMV   │  │ ⭐ Rtg │ │
│  │             │  │  Terjual    │  │  30 Hari │  │ Rata2  │ │
│  │     8       │  │   1,247     │  │ Rp 18.5jt│  │  4.7   │ │
│  │  produk aktif│ │  bulan ini  │  │          │  │/5.0    │ │
│  │ +2 bulan ini│  │ ↑ +18% MoM  │  │↑+22% MoM │  │287 ulasan│
│  └─────────────┘  └─────────────┘  └──────────┘  └────────┘ │
│                                                               │
│  Card anatomy: icon in orange bg, Display number, trend arrow │
└───────────────────────────────────────────────────────────────┘

┌──── ROW 2: CHARTS ────────────────────────────────────────────┐
│                                                                │
│  ┌────────────────────────────┐  ┌──────────────────────────┐ │
│  │  Tren Penjualan 30 Hari    │  │  Status Produk           │ │
│  │                            │  │                          │ │
│  │   ╭──╮    ╭─────╮          │  │      Donut Chart         │ │
│  │  ╭╯  ╰╮  ╭╯     ╰╮         │  │                          │ │
│  │ ╭╯    ╰──╯       ╰╮        │  │   🟢 Fast-Move  3 (38%)  │ │
│  │ ╯                 ╰        │  │   🟡 Normal     4 (50%)  │ │
│  │ ─────────────────────      │  │   🔴 Slow-Move  1 (12%)  │ │
│  │ 18 Mar        16 Apr       │  │                          │ │
│  │                            │  │  Total: 8 produk aktif   │ │
│  │  [Bulan ini] [Bulan lalu]  │  │                          │ │
│  └────────────────────────────┘  └──────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

┌──── ROW 3: PRODUK TERBARU (Top 3 Fast-Move preview) ──────────┐
│  Produk Fast-Move Minggu Ini                  [Lihat Semua →] │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ [img] Raftels Balado 85g    🟢 FAST-MOVE   ↑+45% WoW    │ │
│  │       1,247 unit / 30 hari              [Ajukan Iklan]   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ [img] Raftels Original 85g  🟢 FAST-MOVE   ↑+32% WoW    │ │
│  │       892 unit / 30 hari                [Ajukan Iklan]   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ [img] Raftels Keju 50g      🟡 NORMAL       → stabil    │ │
│  │       341 unit / 30 hari                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

### C. Tabel Daftar Produk

```
┌──── HEADER ─────────────────────────────────────────────────┐
│  Produk Saya  (8 aktif)                                      │
│                                                              │
│  Filter: [Semua ▼] [Status ▼] [Kategori ▼]  [🔍 Cari...]   │
│  Sort: Terlaris ▼                                            │
└──────────────────────────────────────────────────────────────┘

┌──── TABLE ────────────────────────────────────────────────────┐
│  PRODUK          │ STOK   │ 7H  │ 30H  │ RATING │ STATUS│ 💰 │
├──────────────────┼────────┼─────┼──────┼────────┼───────┼────┤
│ [img] Raftels    │        │     │      │        │       │    │
│       Balado 85g │  214   │ 312 │ 1,247│ 4.8⭐  │🟢FAST │[→] │
│ SKU: RFT-BAL-85  │ unit   │unit │ unit │ 128ulasan MOVE │    │
│                  │        │     │      │        │       │    │
│ Channel mini-bar:│████░░░ Shopee 68% │ TikTok 22% │ Reseller 10%│
├──────────────────┼────────┼─────┼──────┼────────┼───────┼────┤
│ [img] Raftels    │        │     │      │        │       │    │
│       Original   │  89    │ 201 │  892 │ 4.6⭐  │🟢FAST │[→] │
│ SKU: RFT-ORI-85  │ ⚠️ LOW │unit │ unit │  87ulasan MOVE │    │
├──────────────────┼────────┼─────┼──────┼────────┼───────┼────┤
│ [img] Raftels    │        │     │      │        │       │    │
│       Keju 50g   │  456   │  87 │  341 │ 4.5⭐  │🟡NORMAL    │
├──────────────────┼────────┼─────┼──────┼────────┼───────┼────┤
│ [img] Raftels    │        │     │      │        │       │    │
│       Pedas 100g │  12    │  11 │   48 │ 3.9⭐  │🔴SLOW │    │
│                  │ ⚠️ LOW │     │      │        │  MOVE │    │
└──────────────────┴────────┴─────┴──────┴────────┴───────┴────┘

Row CTA: [→] = "Ajukan Iklan" button (hanya muncul di status FAST-MOVE)
Stok LOW indicator: badge merah kecil, tooltip "Segera hubungi FoodStocks untuk restock"
Channel mini-bar: colored progress bar mini di bawah nama produk
```

---

### D. Detail Produk

```
┌──── BREADCRUMB ──────────────────────────────────────────────┐
│  Produk  /  Raftels Balado 85g                               │
│                                                    [← Kembali] │
└──────────────────────────────────────────────────────────────┘

┌──── PRODUCT HEADER ──────────────────────────────────────────┐
│  [img 80x80px]  Raftels Balado 85g          🟢 FAST-MOVE     │
│                 SKU: RFT-BAL-85             ↑ +45% WoW       │
│                 Kategori: Fish Skin Snack                     │
│                 Harga: Rp 18.500           [Ajukan Iklan →]  │
└──────────────────────────────────────────────────────────────┘

┌──── ROW 1: GRAFIK + STOK ────────────────────────────────────┐
│                                                               │
│  ┌───────────────────────────────┐  ┌─────────────────────┐  │
│  │  Tren Penjualan               │  │  Stok & Velocity    │  │
│  │  [7 Hari] [30 Hari] [90 Hari] │  │                     │  │
│  │                               │  │  Stok saat ini      │  │
│  │  Area chart, filled orange    │  │  ████████░░░░  214  │  │
│  │  with tooltip on hover        │  │  Threshold: 50 unit  │  │
│  │                               │  │                     │  │
│  │  Avg 41 unit/hari             │  │  Estimasi habis:    │  │
│  │  Peak: 68 unit (12 Apr)       │  │  ~5 hari            │  │
│  └───────────────────────────────┘  │  ⚠️ Segera restock! │  │
│                                     └─────────────────────┘  │
└───────────────────────────────────────────────────────────────┘

┌──── ROW 2: CHANNEL + RATING ─────────────────────────────────┐
│                                                               │
│  ┌───────────────────────────────┐  ┌─────────────────────┐  │
│  │  Penjualan per Channel        │  │  Rating & Ulasan    │  │
│  │  (30 hari)                    │  │                     │  │
│  │                               │  │  4.8 / 5.0 ⭐⭐⭐⭐⭐  │  │
│  │  Pie chart:                   │  │  128 total ulasan   │  │
│  │  🔵 Shopee    68% — 848 unit  │  │                     │  │
│  │  🟣 TikTok    22% — 274 unit  │  │  5⭐ ████████ 78%  │  │
│  │  🟠 Reseller  10% — 125 unit  │  │  4⭐ ████░   15%   │  │
│  │                               │  │  3⭐ ██░░░    5%   │  │
│  └───────────────────────────────┘  │  2⭐ █░░░░    2%   │  │
│                                     │                     │  │
│                                     │  Ulasan terbaru:    │  │
│                                     │  "Enak banget!.."   │  │
│                                     └─────────────────────┘  │
└───────────────────────────────────────────────────────────────┘

┌──── INSIGHT CARD ────────────────────────────────────────────┐
│  💡 Insight FoodStocks                                        │
│                                                               │
│  Produk ini terjual 2.3x lebih cepat dari rata-rata produk   │
│  di kategori yang sama. Stok diperkirakan habis dalam 5 hari. │
│  Pertimbangkan restock segera dan manfaatkan momentum dengan   │
│  program iklan untuk memaksimalkan penjualan.                 │
│                                                               │
│  [📦 Request Restock]          [📢 Ajukan Iklan →]          │
└──────────────────────────────────────────────────────────────┘
```

---

### E. Halaman Peluang Iklan (Ads Opportunity)

```
┌──── HEADER ──────────────────────────────────────────────────┐
│  Peluang Iklan                                               │
│  Produk yang siap di-boost untuk hasil maksimal              │
└──────────────────────────────────────────────────────────────┘

┌──── ELIGIBLE PRODUCTS ───────────────────────────────────────┐
│  2 produk siap iklan berdasarkan performa terkini:            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  [img] Raftels Balado 85g         🟢 Trending ↑+45%   │  │
│  │        1.247 unit / 30 hari  ·  Rating 4.8  ·  Rp18.5K │  │
│  │  ──────────────────────────────────────────────────── │  │
│  │  Mengapa eligible: Penjualan naik 3 minggu berturut,   │  │
│  │  masuk top 20% produk FoodStocks, rating di atas 4.5   │  │
│  │                          [Pilih Produk Ini ✓]          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  [img] Raftels Original 85g       🟢 Trending ↑+32%   │  │
│  │        892 unit / 30 hari  ·  Rating 4.6               │  │
│  │                          [Pilih Produk Ini ✓]          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

┌──── PAKET IKLAN ─────────────────────────────────────────────┐
│  Pilih Paket Iklan                                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   STARTER    │  │   BOOSTER    │  │    PREMIUM       │   │
│  │              │  │ ✨ POPULER   │  │                  │   │
│  │  Rp 500K     │  │  Rp 1.5Jt   │  │   Rp 3Jt         │   │
│  │  /minggu     │  │  /minggu     │  │   /minggu        │   │
│  │              │  │              │  │                  │   │
│  │ ✓ Shopee Ads │  │ ✓ Semua      │  │ ✓ Semua Booster  │   │
│  │ ✓ Reseller   │  │   Starter    │  │ ✓ Konten Kreator │   │
│  │   Network    │  │ ✓ Live Sell  │  │ ✓ Banner Website │   │
│  │              │  │ ✓ TikTok     │  │ ✓ Prioritas      │   │
│  │ Est. +40-60  │  │   Shop       │  │   Restock        │   │
│  │ unit/minggu  │  │              │  │ ✓ Campaign Report│   │
│  │              │  │ Est. +120-   │  │                  │   │
│  │ [Pilih]      │  │ 180 unit/mg  │  │ Est. +250-350    │   │
│  │              │  │              │  │ unit/minggu      │   │
│  │              │  │ [Pilih]      │  │                  │   │
│  │              │  │              │  │ [Pilih]          │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────┘

┌──── FORM REQUEST ────────────────────────────────────────────┐
│  Ajukan Request Iklan                                        │
│                                                              │
│  Produk yang dipilih: [Raftels Balado 85g ▼]               │
│  Paket: [Starter — Rp 500K/minggu ▼]                       │
│  Tanggal mulai yang diinginkan: [DD/MM/YYYY]               │
│  Catatan (opsional):                                        │
│  [_________________________________________________]       │
│                                                              │
│  [   Kirim Request   ]    [Batal]                          │
└──────────────────────────────────────────────────────────────┘

┌──── STATUS TRACKER ──────────────────────────────────────────┐
│  Riwayat Request Iklan                                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Raftels Balado · Starter · Rp 500K           Apr 10   │  │
│  │  ●━━━━●━━━━●━━━━○━━━━○                                 │  │
│  │  Kirim  Review  Approved  Aktif  Selesai               │  │
│  │  Status: ● APPROVED — Mulai 17 April                   │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

### F. Notifikasi Center

```
┌──── HEADER ──────────────────────────────────────────────────┐
│  Notifikasi                                     Tandai Semua  │
│                                                              │
│  [Semua] [Stok] [Iklan] [Produk] [Sistem]                  │
└──────────────────────────────────────────────────────────────┘

┌──── NOTIF LIST ──────────────────────────────────────────────┐
│                                                              │
│  ● [🔥 ORANGE] Raftels Balado masuk kategori Fast-Move!     │
│    Produk Anda naik 45% week-over-week. Cek peluang iklan.  │
│    2 jam yang lalu                          [→ Lihat Produk]│
│  ─────────────────────────────────────────────────────────  │
│  ● [✅ GREEN]  Request iklan Anda disetujui!                 │
│    Starter Pack untuk Raftels Balado mulai 17 April.        │
│    5 jam yang lalu                          [→ Lihat Detail]│
│  ─────────────────────────────────────────────────────────  │
│  ○ [⚠️ RED]   Stok Raftels Original hampir habis            │
│    Tersisa 89 unit. Estimasi habis dalam 4 hari.            │
│    1 hari yang lalu                                         │
│  ─────────────────────────────────────────────────────────  │
│  ○ [💬 BLUE]  3 ulasan baru untuk Raftels Keju             │
│    Rating rata-rata: 4.5/5.0                                │
│    2 hari yang lalu                          [→ Lihat Ulasan]│
│                                                              │
│  ● = belum dibaca (dot indicator kiri)                       │
│  ○ = sudah dibaca                                            │
└──────────────────────────────────────────────────────────────┘
```

---

### G. Admin Dashboard

```
┌──── ADMIN TOP BAR ───────────────────────────────────────────┐
│  ADMIN  FoodStocks.id             [Import Data] [Ekspor PDF] │
│  Overview  /  Supplier  /  Iklan  /  Campaign                │
└──────────────────────────────────────────────────────────────┘

┌──── SUMMARY ADMIN ───────────────────────────────────────────┐
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────┐ │
│  │  5 Supplier  │ │ Total GMV    │ │ Pending Ads │ │ Rev  │ │
│  │  Aktif       │ │ Rp 84.2 Jt  │ │  Requests   │ │ Iklan│ │
│  │              │ │ bulan ini   │ │     3       │ │Rp 4.5│ │
│  └──────────────┘ └──────────────┘ └─────────────┘ └──────┘ │
└──────────────────────────────────────────────────────────────┘

┌──── SUPPLIER RANKING ────────────────────────────────────────┐
│  Supplier  │ SKU  │  GMV 30H   │  Fast-Move  │  Ads         │
├────────────┼──────┼────────────┼─────────────┼──────────────┤
│ 1. Raftels │  8   │ Rp 18.5jt  │   3/8 SKU   │ 🟢 Aktif     │
│ 2. BasoAci │  4   │ Rp 14.2jt  │   2/4 SKU   │ ⏳ Pending   │
│ 3. DeepTalk│  6   │ Rp 11.7jt  │   2/6 SKU   │ — Tidak Ada  │
│ 4. MeTime  │  3   │  Rp 9.1jt  │   1/3 SKU   │ — Tidak Ada  │
│ 5. Shanty  │  5   │  Rp 6.8jt  │   0/5 SKU   │ — Tidak Ada  │
└────────────┴──────┴────────────┴─────────────┴──────────────┘

┌──── ADS PIPELINE ────────────────────────────────────────────┐
│  Request Iklan Masuk (3 pending)                             │
│                                                              │
│  Raftels Balado · Starter · Rp 500K     Apr 12  [Review →]  │
│  BasoAci Bestie · Booster · Rp 1.5jt   Apr 13  [Review →]  │
│  Raftels Ori    · Starter · Rp 500K    Apr 15  [Review →]  │
└──────────────────────────────────────────────────────────────┘

┌──── DATA IMPORT ─────────────────────────────────────────────┐
│  Import Data Penjualan Harian                                │
│                                                              │
│  Format: CSV (export dari Shopee Seller Center)             │
│  [  Drag & drop file CSV di sini, atau klik untuk upload  ] │
│                                                              │
│  Terakhir import: 16 Apr 2026, 06:23 WIB  ✅ Berhasil       │
│  1.247 records diimport  ·  3 records di-skip (duplikat)    │
└──────────────────────────────────────────────────────────────┘
```

---

## 3.4 Responsive Breakpoints

```
Mobile-first approach:

xs    0–479px    HP kecil (iPhone SE, Android entry)
sm  480–767px    HP normal (mayoritas supplier)
md  768–1023px   Tablet / HP landscape
lg  1024–1279px  Laptop kecil
xl  1280px+      Desktop / Laptop besar

Komponen yang berubah di breakpoints:
- Sidebar: 240px (lg+) → hidden + bottom nav (sm dan bawah)
- Summary cards: 4 kolom (lg+) → 2 kolom (sm) → 1 kolom (xs)
- Tabel: full (lg+) → scroll horizontal (md ke bawah)
- Charts: 2 kolom (lg+) → 1 kolom full-width (sm ke bawah)
- Paket iklan: 3 kolom (lg+) → 1 kolom + scroll (sm ke bawah)
```

---

## 3.5 UX Principles & Micro-interactions

### Bahasa Indonesia — Panduan Penulisan

```
Gunakan    →  Hindari
─────────────────────────────────
"Produk Saya"      ←→  "My Products"
"Ajukan Iklan"     ←→  "Submit Ad Request"
"Terjual"          ←→  "Units Sold"
"Peluang Iklan"    ←→  "Advertisement Opportunity"
"Stok Menipis"     ←→  "Low Stock"
"Sedang Ditinjau"  ←→  "Under Review"
"Fast-Move"        ←→  Tetap English — sudah familiar di konteks bisnis
"GMV"              ←→  Tetap — tapi dengan tooltip penjelasan
```

### Empty States

| Kondisi | Pesan | Aksi |
|---|---|---|
| Belum ada produk | "Produk Anda belum terdaftar. Hubungi tim FoodStocks untuk memulai." | Tombol WA FoodStocks |
| Belum ada notifikasi | "Semua beres! Notifikasi penting akan muncul di sini." | — |
| Belum ada ads request | "Belum ada request iklan. Cek produk Fast-Move Anda!" | → Halaman Peluang Iklan |
| Data kosong pada grafik | "Data penjualan belum tersedia untuk periode ini." | — |

### Loading States

- Skeleton loading (bukan spinner) untuk cards dan tabel
- Skeleton berbentuk sama persis dengan konten yang akan muncul
- Durasi skeleton: min 300ms agar tidak flicker di koneksi cepat

### Onboarding First-Time (dari skill `saas-onboarding-flow`)

```
Aktivasi Milestones untuk Supplier Baru:

1. ✅ Login pertama kali
2. ✅ Melihat dashboard overview (>5 detik)
3. ✅ Membuka detail minimal 1 produk
4. ✅ Membuka halaman Peluang Iklan
5. ✅ Mengajukan 1 request iklan  ← "Aha moment"

Tooltip sequence (first-time only, dismissable):
Step 1: "Ini ringkasan performa semua produkmu →"
Step 2: "Produk dengan badge ini lagi laris! →"
Step 3: "Klik untuk lihat detail dan potensi iklan →"
```

---

## Ringkasan Design Decisions

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Primary color | Orange #F97316 | Match FoodStocks branding, energik |
| Sidebar | Dark (#0A0A0A) | Kontras tinggi, professional, familiar di dashboard app |
| Font heading | Plus Jakarta Sans | Indonesian tech feel, modern |
| Font body | Inter | Readability optimal untuk data |
| Status badges | Pill shape, color-coded | Scan cepat, tidak butuh label panjang |
| Mobile nav | Bottom tab bar | Thumb-friendly, familiar dari Shopee/Tokopedia |
| Charts | Area + Line (tren), Donut (proporsi), Bar (comparison) | Sesuai `data-dashboard-design` best practices |
| Empty states | Illustrated message + action | Hindari blank/broken feel |
| Bahasa | Indonesia utama | Sesuai target user (supplier UKM lokal) |

---

*Dokumen FASE 3 selesai. Minta review dan approval sebelum melanjutkan ke FASE 4 — Build MVP.*
