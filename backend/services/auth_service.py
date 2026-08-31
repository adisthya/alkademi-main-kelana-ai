import logging
import os
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status, Cookie
from fastapi.security import OAuth2PasswordBearer
from jose import ExpiredSignatureError, JWTError, jwt
from sqlalchemy.orm import Session, undefer

from config.database import get_db
from models.auth import LoginPayload
from models.user import User
from services.util_service import verify_text

logger = logging.getLogger("kelanai.auth_service")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/login")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "KelanaAISecretKey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(user: User) -> str:
  expires_at = datetime.now(timezone.utc) + timedelta(
      minutes=ACCESS_TOKEN_EXPIRE_MINUTES
  )
  payload = {
      "sub": str(user.id),
      "email": user.email,
      "exp": expires_at,
  }
  return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(payload: LoginPayload, db: Session) -> str | None:
  user = db.query(User).options(
    undefer(User.password)
  ).filter(
    User.email == payload.email
  ).first()

  if (user is None or not verify_text(payload.password, user.password)):
    return

  return create_access_token(user)

async def get_current_user(db: Session = Depends(get_db), access_token: str | None = Cookie(default=None)) -> User:
    logger.info(f'access_token check: {access_token}')
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthenticated",
        )

    try:
        # 2. Decode using python-jose
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = str(payload.get("sub"))
        email: str = str(payload.get("email"))

        if id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cookie expired"
        )
    except JWTError:
        # Catch-all for malformed tokens or signature mismatches in python-jose
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    # 3. Database user verification
    user = db.query(User).filter(User.id == id, User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid account credentials"
        )

    return user
