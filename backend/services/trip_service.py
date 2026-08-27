from typing import Optional, cast

from sqlalchemy import select, func, asc, desc
from sqlalchemy.orm import Session

from services.bedrock_service import get_ai_recommendation
from models.trip import Trip, TripPayload, TripUpdatePayload, TripListParams, TripListResponse, TripResponse, TripSortBy
from config.trip_options import currencies, travel_styles, categories, transportations, months, season_peak, season_holiday, season_regular

# Legacy inline data kept for backward-compatibility with existing routes
# (/v1/categories, /v1/transportations) — these still reference the config values.
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
  return categories

def get_trip_transportation():
  return transportations

def get_trip_places():
  places: list[str] = []

  for city in trip_places:
    city_places: list[str] = trip_places.get(city, [])
    places += city_places

  return places

def get_trip_options():
  return {
    "currencies": currencies,
    "travel_styles": travel_styles,
    "months": months,
    "categories": categories,
    "transportations": transportations,
  }

def get_trip_category(budget: float):
  if (budget < 1000):
    return categories[0]
  elif (budget <= 3000):
    return categories[1]
  else:
    return categories[2]

def get_recommended_places(destination: str):
  return trip_places.get(destination.casefold(), [])

def get_transportation(category: str):
  if (category.casefold() == "luxury"):
    return transportations[0]
  elif (category.casefold() == "standard"):
    return transportations[1]
  else:
    return transportations[2]

def get_travel_season(travel_month: str) -> str:
  if (travel_month.casefold() == "december"):
    return season_peak
  elif (travel_month.casefold() == "june"):
    return season_holiday
  else:
    return season_regular

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

def list_trips(params: TripListParams, db: Session) -> TripListResponse:
  query = select(Trip)

  # Search by destination (case-insensitive substring)
  if params.search:
    query = query.where(Trip.destination.ilike(f"%{params.search}%"))

  # Exact-match filters
  if params.currency:
    query = query.where(Trip.currency == params.currency)
  if params.category:
    query = query.where(Trip.category == params.category)
  if params.travel_style:
    query = query.where(Trip.travel_style == params.travel_style)
  if params.travel_month:
    query = query.where(Trip.travel_month == params.travel_month)

  # Count total matching rows before applying pagination
  count_query = select(func.count()).select_from(query.subquery())
  total: int = db.execute(count_query).scalar_one()

  # Sorting
  sort_map = {
    TripSortBy.created_at_desc: desc(Trip.created_at),
    TripSortBy.created_at_asc:  asc(Trip.created_at),
    TripSortBy.budget_desc:     desc(Trip.budget),
    TripSortBy.budget_asc:      asc(Trip.budget),
  }
  query = query.order_by(sort_map[params.sort_by])

  # Pagination
  offset = (params.page - 1) * params.page_size
  query = query.offset(offset).limit(params.page_size)

  trips = db.execute(query).scalars().all()
  total_pages = max(1, -(-total // params.page_size))  # ceiling division

  return TripListResponse(
    data=[TripResponse.model_validate(trip) for trip in trips],
    total=total,
    page=params.page,
    page_size=params.page_size,
    total_pages=total_pages,
  )

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

def generate_ai_recommendation(trip: Trip, db: Session) -> Trip:
  trip.ai_recommendation = get_ai_recommendation(
    days=trip.days,
    destination=trip.destination,
    budget=trip.budget,
    currency=trip.currency,
    travel_style=trip.travel_style,
    travel_month=trip.travel_month
  )

  db.commit()
  db.refresh(trip)

  return trip

def update_trip(input: TripUpdatePayload, db: Session) -> Optional[Trip]:
  trip = find_trip(input.id, db)

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

  trip.ai_recommendation = get_ai_recommendation(
    days=cast(int, input.days),
    destination=cast(str, input.destination),
    budget=cast(int, input.budget),
    currency=cast(str, input.currency),
    travel_style=cast(str, input.travel_style),
    travel_month=cast(str, input.travel_month)
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


