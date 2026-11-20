# SkyHost — Website + Admin Demo

Proyek Next.js untuk website utama SkyHost dan dashboard demo di `/admin`.

## Jalankan lokal
- `npm install`
- `npm run dev`
- Buka `http://localhost:3000`

## Deploy
Import repository ini ke Vercel. Framework akan terdeteksi sebagai Next.js.

## Catatan penting
Dashboard admin saat ini hanya demo antarmuka. Data pesanan tersimpan sementara di state halaman dan tidak memakai database. Belum ada autentikasi admin, integrasi pembayaran QRIS/transfer, verifikasi pembayaran, maupun provisioning hosting. Jangan gunakan untuk transaksi nyata sebelum backend, database, autentikasi, dan integrasi pembayaran resmi dibuat.
