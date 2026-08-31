from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from config.open_api import configure_openapi
from controllers import auth, users, trips
from config.database import engine
from models.common import ApiErrorResponse
from models.trip import *
from services.trip_service import *

logger = logging.getLogger("kelanaai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Establishing database connection and perform migrations.")
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
  title="KelanaAI",
  description="Your travel companion",
  favicon="/favicon.ico",
  swagger_favicon_url="/favicon.ico",
  version=os.getenv("API_VERSION", "0.0.0"),
  lifespan=lifespan,
  responses={
    422: {"model": ApiErrorResponse, "description": "Validation Error"},
    500: {"model": ApiErrorResponse, "description": "Internal Server Error"},
  }
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=[os.getenv('FRONTEND_URL', 'http://localhost:3000')],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
  return JSONResponse(
    status_code=exc.status_code,
    content={"status": exc.status_code, "message": str(exc.detail)}
  )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
  message = "; ".join(
    f"{'.'.join(str(loc) for loc in error['loc'])}: {error['msg']}"
    for error in exc.errors()
  )
  return JSONResponse(
    status_code=422,
    content={"status": 422, "message": message}
  )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
  logger.exception("Unhandled exception while processing request")
  return JSONResponse(
    status_code=500,
    content={"status": 500, "message": "Internal server error"}
  )

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(
      path='assets/favicon.png',
      media_type='image/x-icon'
    )

@app.get(path="/", include_in_schema=False)
def index():
 return RedirectResponse('/docs', status.HTTP_308_PERMANENT_REDIRECT)

@app.get(path="/health", include_in_schema=False)
def health():
 return {
   "status": "ok"
 }
