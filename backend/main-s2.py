from services.trip_service import *

in_progress = True

print("\n==================================================")
print("                   KelanaAI")
print("==================================================")

while in_progress:

  destinations, currency, budget, days, travel_month = ask_questions()

  travel_season: str       = get_travel_season(travel_month)
  daily_budget: float      = calculate_daily_budget(budget, days)
  trip_category: str       = get_trip_category(budget)
  trip_transportation: str = get_transportation(trip_category)

  print("\n==================================================")
  print("                     Summary")
  print("==================================================\n")

  give_answers(destinations, currency, budget, days, travel_month, travel_season, daily_budget, trip_category, trip_transportation)

  print("\n==================================================\n")

  repeat_order = input("Repeat order (Y/n)? ")

  if (repeat_order.casefold() == "n"):
    in_progress = False
    print(f"\nEnjoy your trip to {" and ".join(destinations)}!\n")
