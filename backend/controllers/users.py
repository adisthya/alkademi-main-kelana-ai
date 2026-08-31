
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from config.database import get_db
from models.user import User, UserPayload, UserUpdatePayload
from services.user_service import countByEmail, create_user
from services.auth_service import get_current_user

router = APIRouter(prefix="/v1/users", tags=["Users"])

def user_not_found(id: int | None):
  raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail=f"User {id} not found!" if id is not None else "User not found!"
  )

def user_exist():
  raise HTTPException(
    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    detail="Email already taken over."
  )

@router.get(path="/profile", description="Get authenticated user profile")
def getMyProfile(user: User = Depends(get_current_user)):
  return user

@router.put(path="", description="Update authenticated user profile")
def updateProfile(payload: UserUpdatePayload, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  return 'update user'

@router.post(path="", description="Add new User")
def addUser(payload: UserPayload, actor: User = Depends(get_current_user), db: Session = Depends(get_db)):
  email_exist = countByEmail(email=payload.email, db=db) > 0

  if email_exist:
    user_exist()

  user = create_user(payload=payload, db=db)

  return user
