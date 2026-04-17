# FASE 1 — Strategy & Planning
## FoodStocks.id Supplier Dashboard

**Versi:** 1.0  
**Tanggal:** 16 April 2026  
**Status:** Draft — Menunggu Review & Approval

---

## 1.1 Problem Statement

### Situasi Saat Ini

FoodStocks.id telah berkembang dari reseller menjadi distributor terkemuka camilan kekinian. Mereka mengelola puluhan produk dari berbagai supplier/brand lokal yang dijual melalui Shopee, TikTok Shop, website, live selling, dan jaringan reseller. Namun dalam model bisnis ini, **supplier berada dalam kegelapan informasi**.

### Pain Points Supplier

**1. Zero Visibility terhadap Performa Produk**
- Supplier tidak tahu berapa unit produk mereka terjual hari ini, minggu ini, atau bulan ini
- Tidak tahu apakah produk mereka berkontribusi besar atau kecil terhadap penjualan FoodStocks
- Hanya mengetahui "produk saya dipesan X unit oleh FoodStocks" — tanpa tahu apakah itu sudah habis terjual atau masih numpuk di gudang

**2. Blind Pricing & Restock Decision**
- Keputusan menaikkan/menurunkan harga grosir dilakukan tanpa data sell-through rate
- Timing restock ditebak-tebak — sering terlambat (stok kosong = lost sales) atau terlalu cepat (overstock = cash trapped)
- Tidak ada sinyal apakah konsumen puas (rating, review) terhadap produk mereka

**3. Tidak Bisa Memanfaatkan Momen Puncak**
- Supplier tidak tahu bahwa produk mereka sedang viral atau trending
- Tidak bisa merespons peluang (event 9.9, 10.10, Ramadan) dengan proaktif karena tidak punya datanya
- FoodStocks juga kehilangan peluang: supplier yang tahu produknya fast-move mau bayar lebih untuk di-boost, tapi tidak ada mekanismenya

**4. Hubungan Transaksional, Bukan Strategis**
- Tanpa data bersama, komunikasi supplier-FoodStocks cenderung reaktif dan transaksional
- Supplier tidak merasa jadi "mitra" — mudah berpindah ke distributor lain yang menawarkan transparansi lebih

### Pain Points FoodStocks (Internal)

- **Revenue yang Terlewat:** Tidak ada mekanisme untuk memonetisasi data performa ke supplier yang mau bayar untuk boost penjualan
- **Negosiasi Lemah:** Ketika ingin minta supplier turunkan harga atau tingkatkan produksi, FoodStocks tidak punya data yang bisa dibagi sebagai landasan
- **Churn Supplier:** Supplier besar dan potensial bisa meninggalkan FoodStocks jika tidak merasa diuntungkan dari kemitraan
- **Operasional Manual:** Tim FoodStocks harus menjawab pertanyaan supplier ("produk saya laku berapa?") secara manual via WA/telepon

### Opportunity yang Terlewat

| Opportunity | Nilai Potensi |
|---|---|
| Supplier mau bayar untuk iklan jika tahu produknya fast-move | Rp 5-50jt/bulan per supplier aktif |
| Supplier mau restock lebih cepat jika tahu stok menipis | +15-25% GMV dari stock-out prevention |
| Supplier mau kasih harga lebih baik jika tahu sell-through rate bagus | Peningkatan margin FoodStocks |
| Supplier baru mau masuk jika ada transparansi data | Akuisisi supplier berkualitas lebih mudah |

---

## 1.2 User Persona

---

### Persona 1: Budi — Supplier Kecil (Brand Baru)

**Profil:**
- Nama: Budi Santoso, 28 tahun
- Asal: Bandung
- Brand: "Keripik Mimin" (keripik singkong pedas homemade)
- SKU di FoodStocks: 2 produk (original & pedas level 3)
- Sudah 4 bulan kerjasama dengan FoodStocks
- Pekerjaan sampingan — masih karyawan pabrik

**Goals:**
- Tahu apakah produknya benar-benar laku atau tidak
- Validasi apakah worth it untuk resign dan fokus ke bisnis ini
- Dapat feedback dari konsumen untuk perbaiki produk
- Kalau laku, mau tambah varian baru

**Frustrations:**
- "FoodStocks pesan 200 pcs, tapi saya nggak tau itu beneran laku atau cuma numpuk di gudang mereka"
- Takut terlalu banyak produksi kalau ternyata produk slow-move
- Tidak tahu kapan harus kirim restock
- Sering tanya ke contact person FoodStocks via WA tapi balasnya lama

**Tech-savviness:** Medium-Low
- Aktif di Instagram & TikTok sebagai consumer
- Jarang pakai laptop — lebih sering HP
- Pertama kali pakai dashboard bisnis

**Device preference:** Mobile (Android, Samsung mid-range)

**Perilaku akses:** Cek malam hari setelah pulang kerja, atau weekend pagi

**Kutipan khas:** *"Kalau produk saya masuk kategori 'fast-move', saya mau langsung tambah kapasitas produksi."*

---

### Persona 2: Dian — Supplier Menengah (Brand Established)

**Profil:**
- Nama: Dian Rahayu, 35 tahun
- Asal: Jakarta
- Brand: "Raftels" (fish skin snack)
- SKU di FoodStocks: 8 produk (berbagai rasa & ukuran)
- Sudah 1.5 tahun kerjasama dengan FoodStocks
- Full-time entrepreneur dengan 3 karyawan

**Goals:**
- Pahami performa tiap SKU di setiap channel (Shopee vs TikTok vs Reseller)
- Identifikasi SKU mana yang underperform untuk di-discontinue atau reformulasi
- Investasi iklan yang tepat sasaran — tidak mau buang-buang budget
- Negosiasi harga & term yang lebih baik dengan FoodStocks berdasarkan data
- Ekspansi ke FoodStocks untuk SKU baru

**Frustrations:**
- Harus kontak Account Manager FoodStocks tiap mau minta laporan — prosesnya lambat
- Laporan yang diterima hanya rekap bulanan via Excel, tidak real-time
- Tidak bisa bedakan apakah penurunan penjualan karena demand lemah atau karena stok FoodStocks habis
- Budget iklan di Shopee Ads dikelola FoodStocks, tapi Dian tidak tahu efektivitasnya

**Tech-savviness:** Medium-High
- Familiar dengan Shopee Seller Center, dashboard TikTok Shop
- Terbiasa baca laporan Excel/Google Sheets
- Tapi tidak bisa coding sama sekali — butuh UX yang intuitif

**Device preference:** Mix — HP untuk cek cepat, laptop untuk analisis mendalam

**Perilaku akses:** Pagi hari (8-9am), kadang sore setelah makan siang

**Kutipan khas:** *"Saya butuh data per-SKU per-channel. Kalau Raftels Balado lebih laku di TikTok tapi biasa aja di Shopee, strategi marketing-nya harus beda."*

---

### Persona 3: Rizky — Admin FoodStocks (Tim Internal)

**Profil:**
- Nama: Rizky Pratama, 26 tahun
- Role: Supplier Relations & Ads Manager, FoodStocks.id
- Handle: 15-25 supplier aktif
- Bertanggung jawab atas program iklan supplier dan koordinasi restock

**Goals:**
- Satu tempat untuk monitor semua supplier tanpa harus buka-tutup banyak sistem
- Efisiensi: tidak perlu buat laporan manual per supplier setiap bulan
- Dorong supplier untuk adopt program iklan (target: 30% supplier aktif ikut ads)
- Identifikasi supplier mana yang perlu "dibantu" (slow-move → konsultasi) atau "di-pitch" (fast-move → tawarkan ads)
- Track pipeline & revenue dari program ads

**Frustrations:**
- Sekarang harus pull data dari Shopee Seller Center, TikTok Shop, Google Sheets, dan WhatsApp — sangat manual
- Sering salah kirim data ke supplier karena human error
- Tidak ada visibility progress request iklan yang masuk
- Susah tracking apakah campaign iklan yang sudah jalan efektif atau tidak

**Tech-savviness:** High
- Familiar dengan tools bisnis (Notion, Google Workspace, Shopee Seller Center)
- Bisa baca SQL query dasar
- Mobile & desktop sama nyamannya

**Device preference:** Laptop (primary), HP untuk notifikasi

**Perilaku akses:** Full working hours, intensive pagi hari untuk planning dan sore untuk review

**Kutipan khas:** *"Kalau ada dashboard yang bisa otomatis highlight siapa aja supplier dengan produk fast-move, saya bisa langsung pitch ads ke mereka tanpa riset manual."*

---

## 1.3 User Journey Map

### Journey A: Supplier — Login Pertama & Temukan Fast-Move Product

```
TAHAP         | TINDAKAN                          | PIKIRAN & PERASAAN               | PAIN POINT              | OPPORTUNITY
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
1. Trigger    | Dapat WA dari FoodStocks:         | "Wah ada dashboard ya? Coba      | Mungkin ragu apakah     | Pesan WA yang warm &
              | "Dashboard supplier FoodStocks    | deh..."                           | berguna atau tidak      | personal meningkatkan
              | sudah live! Cek performa          |                                   |                         | CTR onboarding
              | produkmu di [link]"               |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
2. Login      | Buka link di HP, masuk ke         | "Semoga gampang login-nya"        | Form login yang         | Magic link / OTP WA
              | halaman login. Masukkan           |                                   | terlalu rumit →         | lebih familiar untuk
              | email & password                  |                                   | drop-off tinggi         | supplier Indonesia
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
3. First View | Landing di Dashboard Overview.    | "Oh jadi ini penjualan saya?"     | Angka banyak, bingung   | Onboarding tooltip:
              | Lihat summary cards: 2 SKU,       | "Hmm 347 unit? Ini sebulan?"      | mana yang penting       | "Mulai dari sini →"
              | 347 unit terjual, Rp 2.1jt GMV    |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
4. Explore    | Scroll ke bawah. Lihat donut      | "Oh produk saya ada yang          | Tidak paham arti        | Label yang jelas:
  Products    | chart: 1 Fast-Move 🟢,            | fast-move? Yang mana ya?"         | Fast-Move vs Normal     | tooltip hover +
              | 1 Normal 🟡                       |                                   |                         | definisi singkat
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
5. See Alert  | Muncul banner kuning:             | "Oh serius? Produk saya           | Alert ini bisa bikin    | CTA yang jelas &
              | "Keripik Mimin Pedas Level 3      | trending?? Mau liat lebih lanjut" | excited atau skeptis    | non-pushy: "Lihat
              | sedang trending! Pertimbangkan    |                                   |                         | Data →" dulu sebelum
              | iklan untuk boost lebih jauh →"  |                                   |                         | "Iklan Sekarang"
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
6. Product    | Klik ke halaman detail produk.    | "Wah beneran naik terus!          | Grafik terlalu teknis   | Insight card dengan
   Detail     | Lihat grafik 30 hari: tren naik   | Rating 4.8 juga bagus."           | atau angka terlalu      | bahasa manusia:
              | +45%. Rating 4.8/5. 89 review     |                                   | kecil di mobile         | "Produk ini terjual
              |                                   |                                   |                         | 2x lebih cepat dari
              |                                   |                                   |                         | minggu lalu"
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
7. Ads Page   | Klik "Boost dengan Iklan →"       | "Paket iklan ada 3. Yang          | Harga terasa mahal      | Tampilkan ROI estimasi:
              | Masuk ke halaman Ads Opportunity. | Starter Rp 500K/minggu...         | jika tidak ada          | "Berdasarkan tren,
              | Lihat 3 paket, klik "Simulasi     | kalau balik modal nggak ya?"      | simulasi return         | Starter package bisa
              | Potensi" di Paket Starter         |                                   |                         | boost +40-60 unit/minggu"
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
8. Submit     | Isi form: pilih paket Starter,    | "Oke coba dulu yang paling        | Form terlalu panjang    | Form minimal: pilih
   Request    | masukkan notes, klik Submit.      | murah dulu. Mudah-mudahan         | → abandonment           | paket + 1 field notes
              | Lihat konfirmasi & status         | FoodStocks approve."              |                         | + submit. Done.
              | "Menunggu Review"                 |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
9. Follow-up  | 2 jam kemudian terima notif WA:  | "Approved! Oke semangat nih"      | Tidak ada update →      | Notif WA real-time
              | "Request iklan Anda disetujui.    |                                   | supplier lupa / tidak   | untuk setiap status
              | Kampanye mulai besok."            |                                   | percaya sistemnya       | change
```

---

### Journey B: Admin FoodStocks — Review & Manage Ads Campaign

```
TAHAP         | TINDAKAN                          | PIKIRAN & PERASAAN               | PAIN POINT              | OPPORTUNITY
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
1. Morning    | Login ke admin dashboard pagi.    | "Ada 3 request ads masuk          | Tidak ada notifikasi    | Daily digest via WA/
   Check      | Lihat notifikasi: 3 ads request   | semalam. Yang mana yang           | yang prioritized        | email: ringkasan
              | baru masuk                        | perlu di-approve duluan?"         |                         | pagi hari
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
2. Review     | Buka Ads Pipeline. Lihat list     | "Raftels Balado request Booster   | Harus manual cek data   | Auto-pull product data
   Request    | request dengan data produk:       | — masuk akal, rating-nya          | di sistem lain untuk    | langsung di review
              | nama produk, tren, rating,        | bagus dan trending."              | verifikasi kelayakan    | interface
              | paket yang dipilih                |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
3. Approve    | Klik Approve pada request         | "Tinggal set start date           | Proses approval yang    | One-click approve +
              | Raftels. Set campaign start       | dan budget. Gampang."             | panjang → bottleneck    | auto-notif ke supplier
              | date, konfirmasi budget.          |                                   |                         | langsung
              | Auto-notif ke supplier            |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
4. Monitor    | Seminggu kemudian, buka           | "GMV-nya naik 35% dari            | Data campaign tidak     | Campaign dashboard
   Campaign   | Campaign Dashboard. Lihat         | sebelum iklan. Bagus."            | terintegrasi →          | dengan before/after
              | performa kampanye yang aktif:     |                                   | susah ukur impact       | comparison otomatis
              | GMV before vs after, unit sold    |                                   |                         |
--------------|-----------------------------------|----------------------------------|-------------------------|----------------------------
5. Pitch New  | Lihat tab "Fast-Move Suppliers    | "Ada 4 supplier dengan produk     | Tidak ada sistem        | Smart suggestion:
   Campaigns  | without Active Ads". Ada 4        | fast-move tapi belum iklan.       | untuk identify ini      | "Supplier ini belum
              | supplier eligible                 | Perlu di-contact."                | secara proaktif         | iklan padahal produknya
              |                                   |                                   |                         | trending. Pitch sekarang?"
```

---

## 1.4 Feature Prioritization (MoSCoW)

### MUST HAVE — MVP (Fase 4 Build)

| # | Fitur | Alasan |
|---|---|---|
| M1 | Sistem Login Supplier & Admin | Gate seluruh platform |
| M2 | Dashboard Overview: summary cards (SKU, unit, GMV, rating) | Core value prop — pertama dilihat supplier |
| M3 | Tabel Daftar Produk dengan status Fast/Normal/Slow-Move | Inti dari transparansi data |
| M4 | Status badge + algoritma kategorisasi produk | Differentiator utama |
| M5 | Detail Produk: grafik 30 hari + channel breakdown | Validasi data lebih dalam |
| M6 | Halaman Ads Opportunity: 3 paket iklan + form request | Revenue generator utama |
| M7 | Status tracker request iklan (Pending → Approved → Active) | Kepercayaan supplier |
| M8 | Admin view: overview semua supplier + ads pipeline | Kebutuhan operasional internal |
| M9 | Notifikasi dasar: stok menipis + produk fast-move baru | Alert kritis yang mendorong aksi |
| M10 | Data isolation per supplier | Security non-negotiable |

### SHOULD HAVE — v1.1 (1-2 bulan setelah MVP)

| # | Fitur | Alasan |
|---|---|---|
| S1 | Notifikasi via WhatsApp (WA Business API) | Supplier Indonesia lebih responsif via WA |
| S2 | Grafik perbandingan bulan ini vs bulan lalu | Context untuk angka yang ditampilkan |
| S3 | Filter & sorting di tabel produk (by channel, periode, status) | Usability untuk supplier menengah |
| S4 | Report performa campaign ads (ROI, impressions, sales lift) | Bukti nilai program iklan |
| S5 | Seasonal calendar overlay (9.9, 10.10, Ramadan) di grafik | Bantu supplier plan restock & campaign |
| S6 | Reseller Insights: jumlah reseller aktif + kota | Nilai tambah data yang unik |
| S7 | Export data ke Excel/PDF | Kebutuhan supplier menengah untuk laporan internal |
| S8 | Onboarding tour (first-time user walkthrough) | Reduksi abandonment new supplier |

### COULD HAVE — v2.0 (3-6 bulan)

| # | Fitur | Alasan |
|---|---|---|
| C1 | Integrasi langsung Shopee Open Platform API (real-time) | Saat ini pakai mock/sync manual |
| C2 | Integrasi TikTok Shop API | Expand data source |
| C3 | AI Insight & Rekomendasi (restock prediction, pricing suggestion) | High value, high effort |
| C4 | Chat/messaging supplier ↔ admin langsung di dashboard | Kurangi WA manual |
| C5 | Simulasi ROI ads yang lebih canggih (ML-based) | Tingkatkan konversi ads request |
| C6 | Supplier self-service: upload produk baru, request penambahan SKU | Kurangi bottleneck operasional |
| C7 | Multi-bahasa (EN support) | Jika ada supplier brand internasional |
| C8 | Leaderboard supplier (opsional, opt-in) | Gamifikasi & engagement |
| C9 | API publik untuk supplier integrate ke sistem mereka | Untuk supplier enterprise |

### WON'T HAVE — Out of Scope

| # | Fitur | Alasan |
|---|---|---|
| W1 | Marketplace sendiri (supplier jual langsung ke konsumen) | Bukan model bisnis FoodStocks |
| W2 | Sistem pembayaran / billing terintegrasi | Complexity tinggi, di luar MVP |
| W3 | Inventory management untuk supplier (stok di gudang mereka) | Di luar kendali FoodStocks |
| W4 | CRM lengkap untuk supplier | Scope terlalu luas |
| W5 | Mobile app native (iOS/Android) | Web responsive cukup untuk tahap awal |

---

## 1.5 Monetization Strategy

### Paket Iklan Supplier

#### Tier 1 — Starter Pack
**Harga: Rp 500.000/minggu**

| Benefit | Detail |
|---|---|
| Shopee Ads Boost | FoodStocks menggunakan budget Shopee Ads untuk boost listing produk supplier |
| Reseller Network Push | Produk di-highlight ke 500+ reseller aktif via newsletter/blast WA reseller |
| Dashboard Priority | Produk muncul di urutan atas di internal browsing FoodStocks |

**Target:** Supplier kecil yang baru mau coba, produk sudah fast-move organik

---

#### Tier 2 — Booster Pack
**Harga: Rp 1.500.000/minggu**

| Benefit | Detail |
|---|---|
| Semua benefit Starter | + |
| Live Selling Slot | Produk masuk ke 1x jadwal Shopee Live atau TikTok Live FoodStocks |
| TikTok Shop Highlight | Produk di-feature di konten TikTok FoodStocks (organic atau boosted) |
| Prioritas Bundling | Produk dimasukkan ke paket bundling (Family Package, dll) |

**Target:** Supplier menengah yang ingin scale up secara signifikan

---

#### Tier 3 — Premium Pack
**Harga: Rp 3.000.000/minggu**

| Benefit | Detail |
|---|---|
| Semua benefit Booster | + |
| Konten Kreator Review | FoodStocks arrange review dari micro-influencer / kreator yang sudah ada |
| Banner Website | Slot banner di homepage atau product category page foodstocks.id |
| Prioritas Restock | FoodStocks commit order minimum untuk periode campaign |
| Campaign Report | Laporan detail performa campaign dengan before/after comparison |

**Target:** Brand established yang mau spike penjualan di event tertentu

---

### Proyeksi Revenue

**Asumsi:**
- Saat ini FoodStocks punya ~20 supplier aktif
- Pertumbuhan ke 50 supplier dalam 6 bulan, 100 supplier dalam 12 bulan
- Conversion rate: 20% supplier melihat fast-move → request ads (target awal konservatif)

| Scenario | Supplier | Ads Conversion | Avg. Paket | Revenue/Bulan |
|---|---|---|---|---|
| Conservative (bulan 3) | 20 supplier | 15% = 3 supplier | Starter (Rp 2jt/bulan) | Rp 6.000.000 |
| Moderate (bulan 6) | 50 supplier | 20% = 10 supplier | Mix (avg Rp 3jt/bulan) | Rp 30.000.000 |
| Optimistic (bulan 12) | 100 supplier | 25% = 25 supplier | Mix (avg Rp 4jt/bulan) | Rp 100.000.000 |

*Catatan: Revenue ini murni dari program ads supplier — di luar GMV FoodStocks itu sendiri.*

---

### Dynamic Pricing Berdasarkan Performa

**Prinsip:** Harga ads lebih mahal ketika demand tinggi (event), lebih terjangkau di low season → menciptakan urgensi dan memaksimalkan yield.

| Kondisi | Multiplier Harga |
|---|---|
| Normal season | 1x (base price) |
| Menjelang tanggal kembar (9.9, 10.10, dll) | 1.5x — 2 minggu sebelum event |
| Peak event (H-3 sampai H event) | 2x — slot terbatas, sold by priority |
| Ramadan / Lebaran | 1.75x |
| Post-event (setelah tanggal kembar) | 0.8x — promo untuk clear jadwal |

**Mekanisme:** Dashboard menampilkan "Slot Iklan Segera Habis" saat mendekati event — ciptakan urgency berbasis data nyata.

---

### Upsell Path

```
Supplier baru masuk FoodStocks
        ↓
[D+7] Kirim WA: "Dashboard sudah aktif, cek performa produkmu →"
        ↓
[D+14] Jika ada produk fast-move → notif + banner "Boost produkmu"
        ↓
Mulai dengan Starter Pack (low commitment)
        ↓
Setelah campaign: tunjukkan hasil (ROI report)
        ↓
Upsell ke Booster atau Premium untuk event berikutnya
```

---

## 1.6 KPI & Success Metrics

### Adoption Metrics

| KPI | Target Bulan 1 | Target Bulan 3 | Target Bulan 6 |
|---|---|---|---|
| % Supplier aktif login (weekly) | 30% | 50% | 70% |
| % Supplier yang explore Ads Opportunity page | 40% | 60% | 75% |
| Avg. session duration | > 3 menit | > 5 menit | > 7 menit |
| DAU/MAU ratio (stickiness) | 0.15 | 0.25 | 0.35 |

### Monetization Metrics

| KPI | Target Bulan 1 | Target Bulan 3 | Target Bulan 6 |
|---|---|---|---|
| Conversion: Ads Opportunity viewed → Request submitted | 5% | 15% | 25% |
| Supplier dengan setidaknya 1 campaign aktif | 1-2 | 5 | 15 |
| Revenue dari program ads | Rp 3jt | Rp 15jt | Rp 50jt |
| Average campaign value (per supplier per bulan) | Rp 500K | Rp 1.5jt | Rp 3jt |

### Business Impact Metrics

| KPI | Cara Ukur | Target |
|---|---|---|
| Reduksi pertanyaan manual supplier via WA | Bandingkan volume WA sebelum & sesudah | -40% dalam 3 bulan |
| Supplier retention rate | % supplier yang masih aktif di FoodStocks 6 bulan setelah onboarding | > 80% |
| Time-to-restock (supplier lebih cepat restock) | Rata-rata hari antara stok < threshold hingga supplier kirim restock | -30% dalam 3 bulan |
| Supplier NPS | Survey bulanan | > 40 dalam 6 bulan |

### Product Health Metrics

| KPI | Target |
|---|---|
| Dashboard load time (P95) | < 2 detik |
| Uptime | > 99.5% |
| Data freshness (max lag dari actual sales) | < 24 jam (MVP), < 1 jam (v2.0) |
| Mobile usability score | > 85/100 |

---

## 1.7 Risk Assessment

### Risiko Teknis

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| **Shopee API rate limiting** — Shopee Open Platform membatasi jumlah request per hari, data tidak bisa di-sync real-time | Tinggi | Tinggi | (1) MVP pakai manual data import / daily batch sync. (2) Cache aggressively. (3) Design dengan assumption data lag 1-24 jam. Komunikasikan ke supplier bahwa data diupdate setiap hari, bukan real-time. |
| **Akurasi data** — Data dari Shopee API tidak selalu match dengan sistem internal FoodStocks (retur, cancel, dll) | Medium | Tinggi | (1) Tambahkan disclaimer "Data diperbarui harian, mungkin berbeda ±5% dengan laporan resmi". (2) Bangun reconciliation layer. (3) Tunjukkan sumber data di tooltip. |
| **Downtime Shopee/TikTok API** — API pihak ketiga tidak tersedia | Medium | Medium | Tampilkan data dari cache terakhir dengan label "Data per [tanggal]". Jangan fail tanpa informasi. |
| **Skalabilitas database** — Ketika data historis penjualan harian tumbuh | Low (jangka pendek) | Medium | (1) Gunakan proper indexing dari awal. (2) Rancang partitioning strategy untuk tabel daily_sales. (3) Archive data > 1 tahun. |

### Risiko Bisnis

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| **Supplier tidak mau bayar ads** — Nilai program tidak dipercaya | Medium | Tinggi | (1) Tampilkan case study / simulasi ROI yang realistis. (2) Mulai dengan free trial 1 minggu untuk 5 supplier pertama. (3) Bangun trust dulu dengan data yang akurat sebelum push ads. |
| **Data sensitivity** — Supplier tidak mau data penjualan mereka ada di sistem yang bisa "bocor" | Medium | Tinggi | (1) Komunikasikan data isolation yang ketat: supplier A tidak bisa lihat data supplier B. (2) Buat Terms of Service yang jelas tentang penggunaan data. (3) Jangan tampilkan data kompetitor. |
| **Kompetitor** — Distributor lain juga mulai buat dashboard serupa | Low (saat ini) | Medium | First-mover advantage penting. Launch cepat, iterasi cepat. Fokus pada kualitas data dan UX yang superior. |
| **Supplier terlalu bergantung pada FoodStocks** — Jika FoodStocks underperform, dashboard memperlihatkan ini | Low | Medium | Frame dashboard sebagai partnership tool, bukan control tool. Sertakan context dan benchmark yang fair. |

### Risiko UX & Adoption

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| **Supplier tidak tech-savvy** — Bingung menggunakan dashboard | Tinggi | Tinggi | (1) Mobile-first design dengan UI yang sangat simpel. (2) Onboarding WA guided (kirim instruksi step-by-step via WA saat pertama kali). (3) Video tutorial 2 menit di dalam dashboard. (4) Bahasa Indonesia yang mudah dipahami, hindari jargon. |
| **Abandoned dashboard** — Supplier login sekali, tidak pernah kembali | Tinggi | Tinggi | (1) Notifikasi WA mingguan dengan highlights: "Produk Anda terjual X unit minggu ini". (2) Buat konten pertama yang dilihat selalu menarik dan relevan (personalized). |
| **Data tidak dipercaya** — Supplier skeptis apakah angka akurat | Medium | Tinggi | (1) Tunjukkan sumber data secara transparan. (2) Sediakan fitur "Laporkan Ketidaksesuaian Data". (3) Mulai dengan angka yang bisa diverifikasi (total unit yang FoodStocks order dari supplier). |
| **Mobile experience buruk** — Chart tidak readable di HP kecil | Medium | Tinggi | (1) Test di berbagai ukuran layar sejak awal. (2) Simplified mobile view vs desktop view. (3) Angka kunci selalu di atas, chart secondary. |

### Risiko Organisasional

| Risiko | Probabilitas | Dampak | Mitigasi |
|---|---|---|---|
| **Tim FoodStocks tidak punya bandwidth untuk manage** — Program ads butuh review manual dari admin | Medium | Medium | Buat review process yang se-efisien mungkin (satu klik approve). Buat auto-qualifying criteria: jika produk sudah terverifikasi fast-move, auto-approve Starter tier. |
| **Data tidak diupdate** — Kalau sistem sync manual, ada risiko data stale karena team lupa | Tinggi (jika manual) | Tinggi | Wajib bangun automated daily sync sejak hari pertama, bahkan untuk MVP. Jangan andalkan manual input. |

---

## Ringkasan Eksekutif

**Tesis utama:** FoodStocks.id duduk di posisi yang sangat unik — mereka punya data penjualan yang supplier tidak punya. Dashboard ini mengubah informasi asimetri tersebut menjadi **nilai tambah bagi supplier** dan **revenue baru bagi FoodStocks**.

**Proposisi nilai:**
- Untuk supplier: transparansi data → keputusan bisnis lebih cerdas
- Untuk FoodStocks: monetisasi data + supplier retention + efisiensi operasional

**Risiko terbesar yang harus dimitigasi sejak awal:** Akurasi data dan kepercayaan supplier. Jika supplier tidak percaya angkanya valid, seluruh program (termasuk ads) gagal.

**Critical path:** Data yang akurat → Supplier percaya → Supplier lihat fast-move → CTA ads visible → Revenue.

---

*Dokumen ini adalah output FASE 1. Minta review dan approval sebelum melanjutkan ke FASE 2 — Architecture & Technical Design.*
