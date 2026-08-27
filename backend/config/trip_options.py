from typing import TypedDict


class LabeledOption(TypedDict):
  value: str  # English — stored in DB, embedded in AI prompt
  label: str  # Indonesian — displayed in UI


currencies: list[str] = [
  "EUR",
  "IDR",
  "JPY",
  "RUB",
  "SGD",
  "USD",
]

travel_styles: list[LabeledOption] = [
  {"value": "Solo",                              "label": "Sendiri"},
  {"value": "Solo (budget)",                     "label": "Sendiri (paling hemat)"},
  {"value": "Solo (best experience)",            "label": "Sendiri (pengalaman terbaik)"},
  {"value": "Couple",                            "label": "Bersama pasangan"},
  {"value": "Couple (budget)",                   "label": "Bersama pasangan (paling hemat)"},
  {"value": "Couple (best experience)",          "label": "Bersama pasangan (pengalaman terbaik)"},
  {"value": "Family",                            "label": "Keluarga"},
  {"value": "Family (budget)",                   "label": "Keluarga (paling hemat)"},
  {"value": "Family (best experience)",          "label": "Keluarga (pengalaman terbaik)"},
  {"value": "Surprise me with something unique!", "label": "Beri aku rekomendasi yang unik!"},
]

months: list[LabeledOption] = [
  {"value": "January",   "label": "Januari"},
  {"value": "February",  "label": "Februari"},
  {"value": "March",     "label": "Maret"},
  {"value": "April",     "label": "April"},
  {"value": "May",       "label": "Mei"},
  {"value": "June",      "label": "Juni"},
  {"value": "July",      "label": "Juli"},
  {"value": "August",    "label": "Agustus"},
  {"value": "September", "label": "September"},
  {"value": "October",   "label": "Oktober"},
  {"value": "November",  "label": "November"},
  {"value": "December",  "label": "Desember"},
]

# Order matters: index 0 = Backpacker, 1 = Standard, 2 = Luxury
categories: list[str] = [
  "Backpacker",
  "Standard",
  "Luxury",
]

# Order matters: index 0 = Flight (Luxury), 1 = Train (Standard), 2 = Bus (Backpacker)
transportations: list[str] = [
  "Flight",
  "Train",
  "Bus",
]

# Season labels used by get_travel_season()
season_peak: str    = "Peak Season"
season_holiday: str = "Holiday Season"
season_regular: str = "Regular Season"
