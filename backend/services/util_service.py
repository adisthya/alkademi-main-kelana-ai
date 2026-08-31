from passlib.context import CryptContext

bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_text(input: str) -> str:
  return bcrypt.hash(input)

def verify_text(input: str, hashed: str) -> bool:
    return bcrypt.verify(input, hashed)
