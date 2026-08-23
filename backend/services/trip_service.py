from typing import Optional, cast

from sqlalchemy import select
from sqlalchemy.orm import Session

from services.bedrock_service import get_ai_recommendation
from models.trip import Trip, TripPayload, TripUpdatePayload

trip_categories = ["Backpacker", "Standard", "Luxury"]
trip_transportations = ["Flight", "Train", "Bus"]
trip_places = {
  "japan": [
    "Tokyo Tower",
    "Shibuya",
    "Mt. Fuji"
  ],
  "korea": [
    "Seoul",
    "Busan",
    "Jeju Island"
  ]
}

def calculate_daily_budget(budget: float, days: int):
  if days == 0:
    return 0

  return budget/days

def get_trip_categories():
  return trip_categories;

def get_trip_transportation():
  return trip_transportations;

def get_trip_places():
  places: list[str] = []

  for city in trip_places:
    city_places: list[str] = trip_places.get(city, [])
    places += city_places

  return places

def get_trip_category(budget: float):
  if (budget < 1000):
    return trip_categories[0]
  elif (budget <= 3000):
    return trip_categories[1]
  else:
    return trip_categories[2]

def get_recommended_places(destination: str):
  return trip_places.get(destination.casefold(), [])

def get_transportation(category: str):
  if (category.casefold() == "luxury"):
    return trip_transportations[0]
  elif (category.casefold() == "standard"):
    return trip_transportations[1]
  else:
    return trip_transportations[2]

def get_travel_season(travel_month: str) -> str:
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

def list_trips(db: Session) -> list[Trip]:
  return db.query(Trip).all()

def find_trip(id: int, db: Session) -> Trip | None:
  return db.get(Trip, id)

def add_trip(input: TripPayload, db: Session) -> Trip:
  category = get_trip_category(budget=input.budget)
  daily_budget = calculate_daily_budget(budget=input.budget, days=input.days)
  travel_season = get_travel_season(travel_month=input.travel_month)
  ai_recommendation = get_ai_recommendation(
    days=input.days,
    destination=input.destination,
    budget=input.budget,
    currency=input.currency,
    travel_style=input.travel_style,
    travel_month=input.travel_month
  )

  trip = Trip(
    destination=input.destination,
    days=input.days,
    currency=input.currency,
    budget=input.budget,
    category=category,
    daily_budget=daily_budget,
    travel_style=input.travel_style,
    travel_month=input.travel_month,
    travel_season=travel_season,
    ai_recommendation=ai_recommendation
  )

  db.add(trip)
  db.commit()
  db.refresh(trip)

  return trip

def update_trip(input: TripUpdatePayload, db: Session) -> Optional[Trip]:
  trip = db.query(Trip).filter(Trip.id == input.id).first()

  if trip is None:
      return None

  update_values = input.model_dump(exclude_unset=True, exclude={'id'})
  if not update_values:
      return trip

  for key, value in update_values.items():
      if hasattr(trip, key):
          setattr(trip, key, value)

  if 'travel_month' in update_values:
      trip.travel_season = get_travel_season(travel_month=trip.travel_month)

  if 'budget' in update_values:
      category = get_trip_category(trip.budget)
      trip.category = category

  if 'budget' in update_values or 'days' in update_values:
      trip.daily_budget = calculate_daily_budget(
          budget=trip.budget,
          days=trip.days
      )

  db.commit()
  db.refresh(trip)

  return trip

def remove_trip(id: int, db: Session) -> None:
  trip = find_trip(id, db)

  if (trip is None):
    return

  db.delete(trip)
  db.commit()


