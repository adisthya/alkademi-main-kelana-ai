from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from models.user import User, UserPayload, UserUpdatePayload
from services.util_service import hash_text

def countByEmail(email: str, db: Session) -> int:
  return db.query(User).filter(User.email == email).count()

def create_user(payload: UserPayload, db: Session) -> User:
  try:
    user = User(
      fullname=payload.fullname,
      email=payload.email,
      password=hash_text(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
  except IntegrityError:
    db.rollback()
    raise ValueError("User already registered")

