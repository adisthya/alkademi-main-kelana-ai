# Versi v0.1.0 - Building the First Feature of KelanaAI

## Requirements

1. Input Interaktif: Minta input dari pengguna untuk variabel berikut:

- `destination` (String)
- `country` (String)
- `days` (Integer — pastikan melakukan konversi tipe data int())
- `budget` (Float — lakukan konversi tipe data float())
- `currency` (String)
- `travel_month` (String)

2. Fungsi & Formatting:

- Buat fungsi `print_trip_summary(...)` untuk membungkus logika pencetakan.
- Gunakan `f-strings` agar tampilan output rapi, terstruktur, dan mudah dibaca.

3. Challenges:

- Tambahkan total estimasi biaya melalui input Hotel, Food, Transport, dan Miscellaneous.
- Tambahkan pencetakan `Budget exceeded` jika total estimasi biaya melebihi budget.

## Example Output

```bash
========================

KelanaAI

========================

Destination : Japan

Country   : Japan

Days     : 5

Budget    : 1500 USD

Currency   : USD

Travel Month : December
```

## Finished Output

### 1. Budget Match

```bash
==================================================
                  Trip Planner
==================================================
Enter destination city   : Raja Ampat
Enter destination country: Indonesia
Enter trip month         : August
Enter duration (days)    : 20
Enter your travel style  : Luxurious
Enter budget currency    : USD

==================================================
             Trip Cost Estimation
==================================================
Enter your trip budget : USD 3000
Hotel cost             : USD 1000
Food cost              : USD 500
Transport cost         : USD 1000
Misc. cost             : USD 500

==================================================
                   KelanaAI
==================================================
Destination    : Raja Ampat
Country        : Indonesia
Trip Month     : August
Duration       : 20 days
Travel Style   : Luxurious

Hotel Cost     : USD 1000.0
Food Cost      : USD 500.0
Transport Cost : USD 1000.0
Misc. Cost     : USD 500.0

Total Cost     : USD 3000.0
Budget         : USD 3000.0
```

### 2. Over Budget

```bash
==================================================
                  Trip Planner
==================================================
Enter destination city   : Raja Ampat
Enter destination country: Indonesia
Enter trip month         : August
Enter duration (days)    : 20
Enter your travel style  : Luxurious
Enter budget currency    : USD

==================================================
             Trip Cost Estimation
==================================================
Enter your trip budget : USD 3000
Hotel cost             : USD 1000
Food cost              : USD 1000
Transport cost         : USD 1000
Misc. cost             : USD 500

==================================================
                   KelanaAI
==================================================
Destination    : Raja Ampat
Country        : Indonesia
Trip Month     : August
Duration       : 20 days
Travel Style   : Luxurious

Hotel Cost     : USD 1000.0
Food Cost      : USD 1000.0
Transport Cost : USD 1000.0
Misc. Cost     : USD 500.0

Total Cost     : USD 3500.0
Budget         : USD 3000.0

Budget exceeded.
```
