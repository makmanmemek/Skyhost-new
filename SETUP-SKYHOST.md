# Setup SkyHost Full Stack

Branch ini menyiapkan alur akun pelanggan, login admin, database pesanan, dan pembayaran sandbox.

## A. Supabase
1. Buat project Supabase.
2. Buka SQL Editor, jalankan seluruh isi `supabase/schema.sql`.
3. Di Authentication, buat akun admin memakai email yang kamu kendalikan.
4. Jalankan query untuk mengubah role akun itu:
   `update public.profiles set role='admin' where email='EMAIL_ADMIN_KAMU';`
5. Dari Project Settings > API, ambil Project URL, anon/public key, dan service_role key.

## B. Vercel environment variables
Tambahkan di Project > Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_IS_PRODUCTION=false`

Salin nilai yang sesuai dari Supabase dan Midtrans. Jangan commit file .env.local, jangan letakkan service role key atau Midtrans server key di kode browser, dan jangan kirim secret ke chat. Setelah disimpan, redeploy.

## C. Uji akun
- Daftar pelanggan: `/daftar`
- Login: `/login`
- Pesan hosting: `/pesan`
- Admin: `/admin` (hanya role admin)

## D. Midtrans sandbox
Gunakan akun merchant yang sah dan mode Sandbox. Atur URL notifikasi ke:
`https://skyhost-new.vercel.app/api/midtrans/webhook`
Aktifkan metode QRIS dan transfer bank di dashboard merchant bila tersedia untuk akunmu. Uji transaksi sandbox sebelum berpindah ke produksi.

## E. Batasan penting
Integrasi ini belum otomatis menyediakan server/akun hosting. Status layanan hanya bisa diubah admin setelah pembayaran tervalidasi dan infrastruktur penyedia hosting benar-benar tersedia. Harga pada halaman paket adalah contoh, pastikan biaya, kapasitas, syarat layanan, dukungan, dan uptime sesuai infrastruktur nyata sebelum menawarkan ke pelanggan.

Akun merchant/payment dapat mensyaratkan verifikasi identitas dan usia. Bila belum memenuhi syarat, minta bantuan orang tua/wali atau pengelola usaha yang sah.
