# Versi v0.2.0 - Making KelanaAI Smarter

## Requirements

### 1. Modularisasi Arsitektur (`backend/services/trip_service.py`)

- Pindahkan atau buat fungsi logika bisnis ke dalam file terpisah `services/trip_service.py`:
- Kategori Perjalanan (`get_trip_category`) -> tentukan kategori berdasarkan anggaran (budget):

```text
  < 1000 → "Backpacker"
  1000 - 3000 →"Standard"
  > 3000 → "Luxury"
```

- Kategori Season (`get_travel_season`) -> tentukan kategori berdasarkan bulan (month):

```text
December → "Peak Season"
June → "Holiday Season"
Other Months → "Regular Season"
```

- Kalkulasi Anggaran Harian (`calculate_daily_budget`) -> hitung pembagian anggaran dengan hari (budget / days).

- Rekomendasi Tempat: Gunakan tipe data `list` untuk menyimpan daftar tempat tujuan dan iterasi menggunakan loop `for`.

### 2. Implementasi Presentation Layer (`backend/main.py`)

Impor fungsi logika bisnis yang telah dibuat dari modul `services.trip_service`. Tangani interaksi pengguna (I/O), seperti menerima masukan (input) dan menampilkan hasil akhir menggunakan f-strings.

## Example Output

```text
==================================

KelanaAI

==================================

Destination  : Japan
Days         : 5
Budget       : 1500 USD
Category     : Standard
Daily Budget : 300 USD/Day
Travel Month : December
Season       : Peak Season

Recommended Places

- Tokyo Tower
- Shibuya
- Mount Fuji
```

## Finished Output

```text
==================================================
                   KelanaAI
==================================================
Destination 1   = Japan
Destination 2   = Korea
Currency        = USD
Budget          = USD 500
Days            = 14
Travel Month    = June

==================================================
                     Summary
==================================================

Destination(s)  = Japan and Korea
Budget          = USD 500.0
Days            = 14
Travel Month    = June
Travel Season   = Holiday Season
Daily Budget    = USD 35.714285714285715
Category        = Backpacker
Transport       = Bus

Recommended Places to visit in Japan
- Tokyo Tower
- Shibuya
- Mt. Fuji

Recommended Places to visit in Korea
- Seoul
- Busan
- Jeju Island

==================================================

Repeat order (Y/n)? n

Enjoy your trip to Japan and Korea!
```
