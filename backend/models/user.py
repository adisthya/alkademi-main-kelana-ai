import os

from datetime import datetime
from typing import Optional, Self
from pydantic import BaseModel, ConfigDict, model_validator
from sqlalchemy import DateTime, func, TEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship
from config.database import Base

class User(Base):
  __tablename__ = "users"
  __table_args__ = {"schema": os.getenv('DATABASE_SCHEMA', 'kelana_ai')}

  id: Mapped[int]               = mapped_column(primary_key=True, autoincrement=True)
  fullname: Mapped[str]         = mapped_column(nullable=False)
  email: Mapped[str]            = mapped_column(nullable=False, unique=True)
  password: Mapped[str]         = mapped_column(nullable=False, deferred=True)
  avatar: Mapped[str]           = mapped_column(TEXT, nullable=True)

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

  trips = relationship("Trip", back_populates="user")

class UserPayload(BaseModel):
  fullname        : str
  email           : str
  password        : str
  confirm_password: str

  # 2. Add a model-level validator to compare fields
  @model_validator(mode="after")
  def verify_passwords_match(self) -> Self:
    password = self.password
    confirm_password = self.confirm_password

    if password != confirm_password:
      # Raising a ValueError automatically translates to a 422 error status in FastAPI
      raise ValueError("Passwords do not match")

    return self

class UserUpdatePayload(BaseModel):
  id        : int
  fullname  : Optional[str] = None
  email     : Optional[str] = None
  avatar    : Optional[str] = None
  model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
  id        : int
  fullname  : str
  email     : str
  created_at: datetime
  updated_at: datetime

  model_config = ConfigDict(from_attributes=True)
