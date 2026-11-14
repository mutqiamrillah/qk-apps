# QK Notes (qk-apps) 📖✨

Aplikasi pencatat rangkuman kajian, ceramah, dan podcast (Islami & Umum) dengan desain elegan, mobile-first, tipografi teks Arab, sistem streak belajar, dan integrasi database cloud gratis (Supabase).

---

## 🌟 Fitur Utama (Sesuai Referensi Desain)

1. **Mobile-First Aesthetic**: Tampilan presisi sesuai referensi aplikasi (Forest Emerald palette `#134e43`, pastel card categories, warm greeting, dan du'a avatar 🤲).
2. **Study Streak Tracker**: Melacak konsistensi belajar harian dan jumlah rangkuman yang tersimpan.
3. **Kategori Belajar Lengkap**: Lectures, Parenting, Family, Faith, Character, Fiqh, Language, serta tombol untuk menambah kategori kustom.
4. **Pembaca & Editor Khusus Ayat/Ceramah**:
   - Format khusus teks Arab dengan font tradisional (*Amiri/Scheherazade*), alignment RTL yang rapi, dan garis aksen hijau emerald di sebelah kiri.
   - Blok terjemahan miring (*italics*).
   - Pengatur ukuran tulisan instan (**Aa**: Standar, Besar, Sangat Besar).
   - Tagging (#sabar, #tauhid, dsb) & info pemateri/ustadz.
5. **Dual-Mode Persistence (Database Fleksibel)**:
   - **Local-First / Offline Mode**: Otomatis aktif saat pertama kali dijalankan tanpa perlu setup database. Data tersimpan aman di browser.
   - **Supabase Cloud Mode**: Sinkronisasi cloud PostgreSQL dengan Row Level Security (RLS) dan autentikasi user.
6. **Ekspor & Cadangan**: Download seluruh rangkuman kajian ke format JSON kapan saja.

---

## 🚀 Cara Menjalankan di Lokal

### 1. Masuk ke direktori dan install dependensi:
```bash
cd qk-apps
npm install
```

### 2. Jalankan Dev Server:
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## 🗄️ Setup Database & Auth Gratis (Supabase)

Supabase menyediakan free tier selamanya (500MB PostgreSQL, 50k MAU auth).

1. Buka [https://supabase.com](https://supabase.com) dan buat akun gratis.
2. Buat project baru (misal: `qk-notes`).
3. Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` di proyek ini, copy seluruh kodenya dan klik **Run**.
4. Masuk ke **Project Settings -> API**, salin:
   - `Project URL`
   - `anon / public key`
5. Buat file `.env.local` di folder `qk-apps`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```
6. Restart dev server. Aplikasi Anda kini tersambung ke database cloud PostgreSQL!

---

## ☁️ Panduan Deploy Gratis

### Pilihan 1: Vercel (Sangat Direkomendasikan ⭐)
Vercel adalah platform pembuat Next.js dengan free tier tanpa batas untuk proyek pribadi/hobby:
1. Push folder `qk-apps` ke repository GitHub Anda.
2. Buka [vercel.com](https://vercel.com) dan hubungkan akun GitHub Anda.
3. Klik **Add New Project** -> Pilih repository `qk-apps`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik **Deploy**. Website Anda langsung live dalam 1-2 menit dengan SSL gratis!

### Pilihan 2: Netlify (Alternatif Gratis)
1. Buka [netlify.com](https://netlify.com) dan hubungkan ke repository GitHub Anda.
2. Build command: `next build`
3. Publish directory: `.next`
4. Masukkan Environment Variables yang sama di **Site Configuration -> Environment Variables**.
5. Klik **Deploy Site**.

---

## 🏗️ Struktur Arsitektur (SOLID + DRY + KISS)

```
qk-apps/
├── public/                 # Static assets & icons
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind & Arabic typography configuration
│   │   ├── layout.tsx      # Root responsive mobile shell
│   │   └── page.tsx        # Main view controller (Tabs: Home, Study, Search, Profile)
│   ├── components/
│   │   ├── Header.tsx           # Salam greeting & action icons
│   │   ├── StudyStreakCard.tsx  # Emerald streak tracker widget
│   │   ├── RecentNotes.tsx      # List recent notes cards
│   │   ├── CategoryGrid.tsx     # Study grid pastel cards & add category
│   │   ├── NoteReader.tsx       # Detail view with Arabic verse callout & Aa sizer
│   │   ├── NoteEditorModal.tsx  # Create / edit note with rapid Islamic snippets
│   │   ├── BottomNav.tsx        # 4 bottom navigation tabs & FAB (+)
│   │   ├── SearchModal.tsx      # Fast search filter
│   │   ├── ProfileModal.tsx     # User settings, backup JSON & database status
│   │   └── AuthModal.tsx        # Supabase / Local login & register
│   └── lib/
│       ├── types.ts        # TypeScript domain contracts
│       ├── initialData.ts  # Mock seed data persis gambar referensi
│       ├── storage.ts      # Storage Service (Dual-Engine: Local + Supabase)
│       └── supabase.ts     # Supabase client singleton
├── supabase/
│   └── schema.sql          # PostgreSQL DDL, RLS policies & triggers
├── package.json
└── tailwind.config.ts
```

