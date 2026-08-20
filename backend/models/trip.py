from typing import Optional

from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from config.database import Base

class Trip(Base):
  __tablename__  = "trips"
  # id             = Column(Integer, primary_key=True)
  # destination    = Column(String, nullable=False)
  # days           = Column(Integer, nullable=False)
  # budget         = Column(Float, nullable=False)
  # category       = Column(String, nullable=False)
  # daily_budget   = Column(Float, nullable=False)
  # travel_style   = Column(String, nullable=False)
  # travel_month   = Column(String, nullable=False)
  # travel_season  = Column(String, nullable=False)
  # transportation = Column(String, nullable=True)
  # places         = Column(JSONB, nullable=True, default=[])

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
  transportation: Mapped[str] = mapped_column(nullable=True)
  places: Mapped[list[str]]   = mapped_column(JSONB, nullable=True)

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
  budget: float
  category: str
  daily_budget: float
  travel_style: str
  travel_month: str
  travel_season: str
  places: list[str]
  transportation: str

  model_config = ConfigDict(from_attributes=True)
