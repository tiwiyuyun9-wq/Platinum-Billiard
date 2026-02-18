# Security Policies (RLS)

## 1. Overview
Row Level Security (RLS) di PostgreSQL/Supabase memastikan bahwa data hanya bisa diakses oleh pengguna yang berhak.

## 2. Table Policies

### `profiles`
- **SELECT:**
  - `Authenticated`: Boleh melihat profil sendiri.
  - `Staff/Owner`: Boleh melihat semua profil.
- **UPDATE:**
  - `Authenticated`: Boleh update profil sendiri.
  - `Owner`: Boleh update role user lain.

### `tables` (Meja Billiard)
- **SELECT:** `Public` (Semua orang boleh melihat status meja).
- **INSERT/UPDATE/DELETE:** `Staff/Owner` ONLY.

### `bookings`
- **SELECT:**
  - `Owner`: Boleh melihat semua booking.
  - `Staff`: Boleh melihat semua booking.
  - `Authenticated`: Hanya boleh melihat booking milik sendiri (`auth.uid() == user_id`).
- **INSERT:** `Authenticated` (Member boleh membuat booking).
- **UPDATE:**
  - `Owner/Staff`: Boleh update status (Approve/Reject).
  - `Authenticated`: Boleh cancel booking sendiri (jika status masih pending).

## 3. Storage Policies (Supabase Storage)

### Bucket: `payment-proofs` (Private)
- **INSERT:** `Authenticated` (Member upload bukti bayar).
- **SELECT:** `Owner/Staff` ONLY (Member tidak boleh melihat bukti bayar orang lain).

### Bucket: `public-assets` (Public)
- **SELECT:** `Public` (Gambar meja, banner promo).
- **INSERT:** `Owner/Staff` ONLY.
