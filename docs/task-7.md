# Versi v0.7.0 - Connecting KelanaAI's Brain and Face

## Requirements

1. Meningkatkan Tampilan Kartu Perjalanan (`frontend/components/TripCard.tsx`). Perbarui komponen TripCard agar menampilkan elemen-elemen informasi tambahan berikut:

2. Destination Icon/Flag: Tambahkan ikon flag atau landmark visual untuk setiap destinasi perjalanan.
   - Currency & Budget Formatting: Ubah format tampilan angka anggaran (budget), contohnya menampilkan USD 2,000 alih-alih angka polos 2000.
   - Category Badge: Tampilkan badge dengan warna berbeda (color-coded) berdasarkan kategori anggaran:
     - Backpacker
     - Standard
     - Luxury

3. Travel Style Badge: Tampilkan badge gaya perjalanan pada setiap kartu:
   - Family
   - Solo
   - Couple

4. Fitur Bonus (Opsional)
   Pagination: Tambahkan logika/komponen paginasi jika daftar riwayat perjalanan pada dashboard melebihi 10 items.

## Pengujian Output Visual

1. **Tampilan Desktop**: Halaman memiliki hero image besar yang menarik perhatian, teks dan spasi terlihat proporsional (berkat Tailwind), formulir pencarian/input sejajar dengan rapi, dan diakhiri dengan footer informatif di bagian paling bawah.
2. **Tampilan Mobile**: Saat layar dipersempit seukuran ponsel, hero image menyesuaikan proporsi, dan kolom-kolom pada formulir tidak terpotong melainkan turun dan menyusun secara vertikal ke bawah, sehingga memudahkan pengguna untuk mengisi data.

## Finished Output

> Finished output dapat diakses langsung dengan menjalankan aplikasi frontend dan backend.
