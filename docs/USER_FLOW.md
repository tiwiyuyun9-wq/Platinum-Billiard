# User Flow Documentation

## 1. Alur Booking & Pembayaran (Customer)

```mermaid
graph TD
    A[Start: Landing Page] --> B{Sudah Login?}
    B -- Tidak --> C[Halaman Login/Register]
    C --> B
    B -- Ya --> D[Pilih Meja & Durasi]
    D --> E{Cek Ketersediaan}
    E -- Penuh --> D
    E -- Tersedia --> F[Halaman Checkout]
    F --> G[Tampilkan QRIS & Total Bayar]
    G --> H[User Transfer & Upload Bukti]
    H --> I[Status: Menunggu Konfirmasi]
    I --> J{Staff Verifikasi}
    J -- Reject --> K[Status: Ditolak + Alasan]
    J -- Approve --> L[Status: Confirmed]
    L --> M[Kirim Tiket/QR Code Booking]
```

## 2. Alur Pembatalan (Policy)
- **< 24 Jam:** Tidak ada refund.
- **> 24 Jam:** Refund berupa kredit poin (bukan uang tunai).

## 3. Alur Check-in (On-Site)
1. Customer datang tunjukkan Kode Booking.
2. Staff scan/input kode di Dashboard.
3. Status Meja berubah menjadi `Occupied`.
4. Lampu Meja Menyala (Manual/IoT Future).
