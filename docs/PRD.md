# Product Requirements Document (PRD)
**Project Name:** Billiard Enterprise Website
**Language:** Bahasa Indonesia
**Target Audience:** Pelanggan Billiard (Booking) & Staff/Owner (Management)

## 1. Overview
Platform manajemen reservasi dan operasional billiard modern yang memungkinkan pelanggan melihat ketersediaan meja secara realtime, melakukan booking online, dan mendapatkan reward loyalitas. Sistem ini dirancang untuk menggantikan sistem pencatatan manual dengan solusi digital yang efisien dan "Enterprise Grade".

## 2. Fitur Utama (Core Features)

### 2.1 Live Table View (Peta Meja Realtime)
- **Deskripsi:** Visualisasi layout meja billiard yang menunjukkan status terkini.
- **Status:**
  - `Available` (Hijau): Bisa dibooking.
  - `Occupied` (Merah): Sedang digunakan.
  - `Booked` (Kuning): Akan digunakan dalam waktu dekat (<15 menit).
- **Teknis:** Menggunakan WebSocket (Supabase Realtime) untuk update instan tanpa refresh halaman.

### 2.2 Booking Engine & Pembayaran (BYOP - Manual Transfer)
- **Deskripsi:** Sistem reservasi mandiri oleh pelanggan.
- **Metode Pembayaran:** Direct Transfer / QRIS Statis.
- **Alur:** User Booking -> Upload Bukti Bayar -> Staff Verifikasi -> Booking Confirmed.
- **Aturan:**
  - Wajib Login.
  - Minimal durasi 1 Jam.
  - Buffer 15 menit antar sesi (untuk pembersihan).

### 2.3 Membership & Loyalty System
- **Deskripsi:** Sistem reward untuk retensi pelanggan.
- **Mekanisme:** Poin per transaksi (Rp 10.000 = 1 Poin).
- **Tier:** Bronze, Silver, Gold (berdasarkan akumulasi poin/jam main).

### 2.4 Admin Dashboard (Role-Based)
- **Owner:** Melihat Laporan Keuangan, Analytics Okupansi.
- **Staff:** Mengelola Status Meja (Check-in/out), Verifikasi Pembayaran, Mengelola Booking.

## 3. Tech Stack & Architecture
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Zustand.
- **Backend:** Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions).
- **Deployment:** Vercel (Frontend).

## 4. Non-Functional Requirements
- **Performance:** Load time < 2 detik.
- **Security:** RLS (Row Level Security) untuk proteksi data user.
- **Scalability:** Mampu menangani 100+ user konkuren.
- **Design:** Tampilan Premium/Enterprise (Dark Mode option, smooth animations).
