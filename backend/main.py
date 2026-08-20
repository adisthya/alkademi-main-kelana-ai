from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from config.database import init_db, get_db
from models.trip import *
from services.trip_service import *

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Establishing database connection and perform migration...")
    init_db()  # Menjalankan Base.metadata.create_all
    yield

app = FastAPI(title="KelanaAI", description="Your travel companion", version="0.4.0", lifespan=lifespan)
v1_router = APIRouter(prefix="/v1")

app.include_router(v1_router)

def trip_not_found(id: int | None):
  return HTTPException(
    status_code=404,
    detail=f"Trip {id} not found!" if id is not None else "Trip not found!"
  )

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

@v1_router.get(path="/trips", response_model=list[TripResponse], tags=["Trips"])
def get_all_trips(db: Session = Depends(get_db)):
  return list_trips(db)

@v1_router.get(path="/trips/{id}", response_model=TripResponse, tags=["Trips"])
def get_trip(id: int, db: Session = Depends(get_db)):
  trip = find_trip(id, db)

  if (trip is None):
    return trip_not_found(id)

  return trip

@v1_router.post(path="/trips", response_model=TripResponse, tags=["Trips"])
def post_trip(payload: TripPayload, db: Session = Depends(get_db)):
  trip = add_trip(payload, db)

  return trip

@v1_router.put(path="/trips", response_model=TripResponse, tags=["Trips"])
def put_trip(payload: TripUpdatePayload, db: Session = Depends(get_db)):
  trip = update_trip(payload, db)

  if (trip is None):
    return trip_not_found(id=payload.id)

  return trip

@v1_router.delete(path="/trips/{id}", status_code=204, tags=["Trips"])
def delete_trip(id: int, db: Session = Depends(get_db)):
  remove_trip(id, db)
