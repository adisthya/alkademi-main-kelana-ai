from enum import Enum

from pydantic import BaseModel

class TripRequest(BaseModel):
  destination: str
  currency: str
  budget: float
  days: int
  travel_style: str
  travel_month: str

class TripResponse(TripRequest):
  daily_budget: float
  category: str
  travel_season: str
  recommended_places: list[str]
  recommended_transportion: str

class TripData(str, Enum):
  categories = "categories"
  places = "places"
  transportation = "transportation"
