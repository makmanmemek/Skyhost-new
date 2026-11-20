# SkyHost — website + backend integration scaffold

## Teknologi
- Next.js 14
- Supabase Auth + PostgreSQL
- Midtrans Snap (sandbox awal)
- Vercel

## 1. Persiapan Supabase
1. Buat project di Supabase.
2. Buka SQL Editor dan jalankan `supabase/schema.sql`.
3. Buat akun admin di Authentication > Users.
4. Jalankan query SQL untuk menaikkan role akun tersebut menjadi `admin` (contohnya ada di bagian bawah schema.sql).
5. Ambil Project URL, anon key, dan service role key dari Project Settings > API.

## 2. Konfigurasi lokal dan Vercel
Salin `.env.example` menjadi `.env.local` untuk lokal. Masukkan nilai rahasia hanya ke environment variables Vercel (Settings > Environment Variables), jangan commit `.env.local` dan jangan kirim secret ke chat.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (rahasia server, jangan pernah pakai prefix NEXT_PUBLIC)
- `MIDTRANS_SERVER_KEY` (rahasia server)
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION=false` untuk sandbox
- `NEXT_PUBLIC_SITE_URL`

Setelah mengubah environment variables, lakukan redeploy.

## 3. Login
Buat user melalui Supabase Authentication. Halaman daftar pelanggan ada di `/daftar`, halaman login ada di `/login`. Dashboard `/admin` hanya bisa dibuka oleh akun ber-role admin. Untuk menjadikan user sebagai admin, jalankan query update role yang tersedia di `supabase/schema.sql`. Route `/admin` dilindungi agar pengguna yang belum login diarahkan ke login. API admin juga memeriksa role admin.

## 4. Pemesanan dan pembayaran
Pemesanan tersedia di `/pesan`. User harus login dengan akun Supabase. Atur Midtrans ke sandbox dan daftarkan URL notifikasi:
`https://DOMAIN-KAMU/api/midtrans/webhook`
Aktifkan metode pembayaran QRIS dan transfer bank di dashboard Midtrans sesuai ketentuan akun. Uji transaksi sandbox sebelum production.

## 5. Aktivasi layanan
Pembayaran yang sukses akan mengubah `payment_status` menjadi `paid` melalui webhook tervalidasi. Admin dapat mengubah `service_status` menjadi `active` melalui API setelah proses provisioning dilakukan. Integrasi provisioning otomatis ke penyedia server/hosting belum dipasang karena memerlukan akun dan API provider hosting. Untuk sekarang aktivasi layanan adalah proses admin/manual.

## Catatan keamanan dan operasional
- Ini scaffold integrasi; belum dapat dipakai menerima uang sungguhan sebelum semua akun, environment variables, webhook, dan uji sandbox selesai.
- Jangan pernah menaruh service role key atau Midtrans server key di kode frontend, GitHub, atau chat.
- Jangan menyatakan uptime, kapasitas, atau paket sebagai layanan aktif sebelum infrastruktur hosting benar-benar tersedia.
- Pendaftaran merchant/pembayaran dapat mensyaratkan verifikasi identitas dan ketentuan usia. Jika belum memenuhi syarat, minta orang tua/wali atau pengelola usaha yang sah membantu membuat dan mengelola akun merchant.
