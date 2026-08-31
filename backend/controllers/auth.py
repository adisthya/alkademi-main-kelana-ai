
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from config.database import get_db
from controllers.users import user_exist
from models.user import UserPayload, UserResponse, UserUpdatePayload
from models.auth import LoginPayload, LoginResponse
from services.user_service import countByEmail, create_user
from services.auth_service import authenticate_user

router = APIRouter(prefix="/v1/auth", tags=["Authentication & Authorization"])

@router.post(path="/login", status_code=status.HTTP_201_CREATED)
def loginin(payload: LoginPayload, response: Response, db: Session = Depends(get_db)) -> LoginResponse:
  token = authenticate_user(payload=payload, db=db)

  if (token is None):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Invalid email and/or password.",
    )

  response.set_cookie(
    key="access_token",
    value=str(token),
    httponly=True,
    samesite="lax",
    secure=False,
    path="/",
  )

  return LoginResponse(
    status="authenticated",
    type="cookie"
  )

@router.delete(path="/logout", status_code=status.HTTP_204_NO_CONTENT)
def logoutin(response: Response) -> None:
  response.delete_cookie(key="access_token")

@router.post(path="/join")
def daftarin(payload: UserPayload, db: Session = Depends(get_db)) -> UserResponse:
  email_exist = countByEmail(email=payload.email, db=db) > 0

  if email_exist:
    user_exist()

  user = create_user(payload=payload, db=db)

  return user
