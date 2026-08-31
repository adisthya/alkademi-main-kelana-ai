
import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from services.auth_service import get_current_user
from config.database import get_db
from models.common import ApiErrorResponse
from models.trip import *
from models.user import User
from services.trip_service import *

router = APIRouter(prefix="/v1/trips")

def trip_not_found(id: int | None):
  raise HTTPException(
    status_code=404,
    detail=f"Trip {id} not found!" if id is not None else "Trip not found!"
  )

@router.get(path="/options", response_model=TripOptionsResponse, tags=["Trip Data"])
def get_trips_options():
  return get_trip_options()

@router.get(path="/{id}", response_model=TripResponse, responses={404: {"model": ApiErrorResponse}}, tags=["Trips"])
async def get_trip(id: int, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  trip = find_trip(id, actor, db)

  if (trip is None):
    trip_not_found(id)

  return trip

@router.get(path="", response_model=TripListResponse, tags=["Trips"])
async def get_all_trips(params: TripListParams = Depends(), actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  return list_trips(params, actor, db)

@router.post(path="", response_model=TripResponse, tags=["Trips"])
def post_trip(payload: TripPayload, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  trip = add_trip(payload, actor, db)

  return trip

@router.post(path="/{id}/generate", response_model=TripResponse, responses={404: {"model": ApiErrorResponse}}, tags=["Trips"])
def post_trip_generate(id: int, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  trip = find_trip(id, actor, db)

  if trip is None:
    trip_not_found(id)

  trip = generate_ai_recommendation(trip, actor, db)

  return trip

@router.put(path="", response_model=TripResponse, responses={404: {"model": ApiErrorResponse}}, tags=["Trips"])
def put_trip(payload: TripUpdatePayload, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  trip = update_trip(payload, actor, db)

  if (trip is None):
    trip_not_found(id=payload.id)

  return trip

@router.delete(path="/{id}", status_code=204, tags=["Trips"])
def delete_trip(id: int, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  remove_trip(id, actor, db)
