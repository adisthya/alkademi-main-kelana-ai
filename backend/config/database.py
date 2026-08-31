import os
from typing import Generator

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# load .env so os.getenv() can read it
load_dotenv()
# connection string from .env — never hardcode secrets
DATABASE_URL = os.getenv("DATABASE_URL", '')

# engine = the connection pool
engine = create_engine(DATABASE_URL)

# Base = all ORM models inherit from this
Base = declarative_base()

SessionLocal = sessionmaker(bind=engine, autoflush=False)

def get_db() -> Generator[Session]:
  db = SessionLocal()

  try:
    yield db
  finally:
    db.close()

# create all tables
# def init_db() -> None:
#   """Create all SQLAlchemy tables for the configured database."""
#   Base.metadata.create_all(bind=engine)
