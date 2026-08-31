from pydantic import BaseModel


class LoginPayload(BaseModel):
  email     : str
  password  : str

class JoinPayload(BaseModel):
  fullname          : str
  email             : str
  password          : str
  confirm_password  : str

class LoginResponse(BaseModel):
  type  : str
  status: str
