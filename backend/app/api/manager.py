# app/api/manager.py

from fastapi import APIRouter, Depends
from app.schemas.manager import AddStaffSchema, UpdateStaffEmailSchema
from app.services.manager_services import ManagerService
from app.core.security import get_token

router = APIRouter()
manager_service = ManagerService()

@router.get("/performance/overview")
async def get_performance_overview(month: int, year: int, token: str = Depends(get_token)):
    return await manager_service.get_stall_performance_overview(month, year, token)

@router.post("/add-member")
async def add_staff(staff_data: AddStaffSchema, token: str = Depends(get_token)):
    return await manager_service.add_staff_member(staff_data, token)

@router.get("/list")
async def get_staff_list(token: str = Depends(get_token)):
    return await manager_service.get_my_staff(token)

@router.delete("/{staff_uid}")
async def remove_staff(staff_uid: str, token: str = Depends(get_token)):
    return await manager_service.remove_staff_member(staff_uid, token)

@router.put("/{staff_uid}/email")
async def update_staff_email(staff_uid: str, update_data: UpdateStaffEmailSchema, token: str = Depends(get_token)):
    return await manager_service.update_staff_email(staff_uid, update_data.new_email, token)