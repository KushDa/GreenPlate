from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.security import rate_limit_key
from app.api import user, staff, manager, webhook, auth

limiter = Limiter(key_func=rate_limit_key)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health", tags=["health"])
@limiter.limit("10/minute")
def health_check(request: Request):
  return {"status": "ok", "service": "greenplate-backend"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(staff.router, prefix="/staff", tags=["staff"])
app.include_router(manager.router, prefix="/manager", tags=["manager"])
app.include_router(webhook.router, prefix="/webhook", tags=["webhook"])
