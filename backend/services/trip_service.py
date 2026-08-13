def calculate_daily_budget(budget: float, days: int):
  return budget/days

def get_trip_category(budget: float):
  if (budget < 1000):
    return "Backpacker"
  elif (budget <= 3000):
    return "Standard"
  else:
    return "Luxury"

def get_recommended_places(destination: str):
  if (destination.casefold() == "japan"):
    return [
    "Tokyo Tower",
    "Shibuya",
    "Mt. Fuji"
  ]
  elif (destination.casefold() == "korea"):
    return [
    "Seoul",
    "Busan",
    "Jeju Island"
  ]
  else:
    return []

def get_transportation(category: str):
  if (category.casefold() == "luxury"):
    return "Flight"
  elif (category.casefold() == "standard"):
    return "Train"
  else:
    return "Bus"

def get_travel_season(travel_month: str):
  if (travel_month.casefold() == "december"):
    return "Peak Season"
  elif (travel_month.casefold() == "june"):
    return "Holiday Season"
  else:
    return "Regular Season"

def ask_questions():
  destinations: list = []

  while len(destinations) < 2:
    destination = input(f"Destination {len(destinations)+1}   = ")
    destinations.append(destination)

  currency: str     = input("Currency        = ")
  budget: float     = float(input(f"Budget          = {currency} "))
  days: int         = int(input("Days            = "))
  travel_month: str = input("Travel Month    = ")

  return [destinations, currency, budget, days, travel_month]

def give_answers(
  destinations,
  currency,
  budget,
  days,
  travel_month,
  travel_season,
  daily_budget,
  trip_category,
  trip_transportation
):
    print(f"Destination(s)  = {" and ".join(destinations)}")
    print(f"Budget          = {currency} {budget}")
    print(f"Days            = {days}")
    print(f"Travel Month    = {travel_month}")
    print(f"Travel Season   = {travel_season}")
    print(f"Daily Budget    = {currency} {daily_budget}")
    print(f"Category        = {trip_category}")
    print(f"Transport       = {trip_transportation}")

    for destination in destinations:
      places: list = get_recommended_places(destination)

      if (len(places) > 0):
        print(f"\nRecommended Places to visit in {destination}")
        for place in places:
          print(f"- {place}")
      else:
        print(f"\nNo recommendation for {destination}.")
