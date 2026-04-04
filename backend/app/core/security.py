import hashlib
from fastapi import Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    return credentials.credentials

def rate_limit_key(request: Request):
    auth_header = request.headers.get("authorization")
    if auth_header:
        token_hash = hashlib.sha256(auth_header.encode()).hexdigest()
        return f"user:{token_hash}"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return f"ip:{forwarded.split(',')[0].strip()}"
    return f"ip:{request.client.host}"