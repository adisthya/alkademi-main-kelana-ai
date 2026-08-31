from pydantic import BaseModel

class ApiErrorResponse(BaseModel):
  status: int
  message: str
