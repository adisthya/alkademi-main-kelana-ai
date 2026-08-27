from datetime import datetime
import os
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import DateTime, func, TEXT
from sqlalchemy.orm import Mapped, mapped_column
from config.database import Base
class Trip(Base):
  __tablename__  = "trips"
  __table_args__ = {"schema": os.getenv('DATABASE_SCHEMA', 'kelana_ai')}

  id: Mapped[int]             = mapped_column(primary_key=True, autoincrement=True)
  destination: Mapped[str]    = mapped_column(nullable=False)
  currency: Mapped[str]       = mapped_column(nullable=False)
  budget: Mapped[float]       = mapped_column(nullable=False)
  daily_budget: Mapped[float] = mapped_column(nullable=False)
  days: Mapped[int]           = mapped_column(nullable=False)
  travel_month: Mapped[str]   = mapped_column(nullable=False)
  travel_season: Mapped[str]  = mapped_column(nullable=False)
  travel_style: Mapped[str]   = mapped_column(nullable=False)
  category: Mapped[str]       = mapped_column(nullable=False)
  ai_recommendation: Mapped[str] = mapped_column(TEXT, nullable=True)

  # Automatically populated on INSERT by the database
  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now()
  )

  # Automatically populated on INSERT and updated on every UPDATE
  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now()
  )

class TripPayload(BaseModel):
  destination: str
  currency: str
  budget: float
  days: int
  travel_style: str
  travel_month: str

class TripUpdatePayload(BaseModel):
  id: int
  destination: Optional[str] = None
  currency: Optional[str] = None
  budget: Optional[float] = None
  days: Optional[int] = None
  travel_style: Optional[str] = None
  travel_month: Optional[str] = None

class TripResponse(BaseModel):
  id: int
  destination: str
  days: int
  currency: str
  budget: float
  category: str
  daily_budget: float
  travel_style: str
  travel_month: str
  travel_season: str
  ai_recommendation: Optional[str] = None

  model_config = ConfigDict(from_attributes=True)

class TripSortBy(str, Enum):
  created_at_desc = "created_at_desc"
  created_at_asc  = "created_at_asc"
  budget_desc     = "budget_desc"
  budget_asc      = "budget_asc"

class TripListParams(BaseModel):
  search:       Optional[str] = None
  currency:     Optional[str] = None
  category:     Optional[str] = None
  travel_style: Optional[str] = None
  travel_month: Optional[str] = None
  sort_by:      TripSortBy    = TripSortBy.created_at_desc
  page:         int           = Field(default=1, ge=1)
  page_size:    int           = Field(default=10, ge=1, le=100)

class TripListResponse(BaseModel):
  data:        list[TripResponse]
  total:       int
  page:        int
  page_size:   int
  total_pages: int

class LabeledOption(BaseModel):
  value: str
  label: str

class TripOptionsResponse(BaseModel):
  currencies:      list[str]
  travel_styles:   list[LabeledOption]
  months:          list[LabeledOption]
  categories:      list[str]
  transportations: list[str]
