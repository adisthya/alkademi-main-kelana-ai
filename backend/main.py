from fastapi import FastAPI, APIRouter
from fastapi.responses import FileResponse

from models.trip import *
from services.trip_service import *

app = FastAPI(title="KelanaAI", description="Your travel companion", version="0.3.0")
v1_router = APIRouter(prefix="/v1")

app.include_router(v1_router)

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(
      path='assets/favicon.png',
      media_type='image/x-icon'
    )

@app.get("/")
def index():
 return {
   "message" : "Welcome to KelanaAI...!"
 }

@app.get("/health")
def health():
 return {
   "status": "ok"
 }

@v1_router.get(path="/recommendations", response_model=list[str], tags=["Trip Data"])
def get_recommendations():
  return get_trip_places()

@v1_router.get(path="/transportations", response_model=list[str], tags=["Trip Data"])
def get_transportations():
  return get_trip_transportation()

@v1_router.get(path="/categories", response_model=list[str], tags=["Trip Data"])
def get_categories():
  return get_trip_categories()

@v1_router.post(path="/trips", response_model=TripResponse, tags=["Trips"])
def create_trip(request: TripRequest):
  daily_budget = calculate_daily_budget(request.budget, request.days)
  category = get_trip_category(request.budget)
  travel_season=get_travel_season(request.travel_month)
  recommended_transportation=get_transportation(category)
  recommended_places=get_recommended_places(request.destination)

  response: TripResponse = TripResponse(
    destination=request.destination,
    currency=request.currency,
    budget=request.budget,
    daily_budget=daily_budget,
    days=request.days,
    travel_month=request.travel_month,
    travel_season=travel_season,
    travel_style=request.travel_style,
    category=category,
    recommended_places=recommended_places,
    recommended_transportion=recommended_transportation
  )

  return response
