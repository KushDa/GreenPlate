# app/api/auth.py

from fastapi import APIRouter, Depends
from app.services.auth_services import AuthService
from app.core.security import get_token

router = APIRouter()
auth_service = AuthService()

@router.post("/verify-student")
async def verify_student(token: str = Depends(get_token)):
    return await auth_service.authenticate_student(token)

@router.post("/verify-staff")
async def verify_staff(token: str = Depends(get_token)):
    return await auth_service.verify_staff_access(token)
