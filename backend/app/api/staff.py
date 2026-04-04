# app/api/staff.py

from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.staff import (
    UpdateStaffProfileSchema, MenuSchema, UpdateMenuItemSchema,
    UpdateOrderStatusSchema, VerifyPickupSchema, UpdateResalePriceSchema
)
from app.services.staff_services import StaffService
from app.core.security import get_token

router = APIRouter()
staff_service = StaffService()

@router.post("/activate")
async def activate_staff(token: str = Depends(get_token)):
    return await staff_service.activate_staff(token)

@router.get("/me")
async def get_staff_me(token: str = Depends(get_token)):
    return await staff_service.get_staff_me(token)

@router.patch("/profile")
async def update_staff_profile(profile_data: UpdateStaffProfileSchema, token: str = Depends(get_token)):
    return await staff_service.update_staff_profile(profile_data, token)

@router.post("/menu")
async def upload_menu(menu_data: MenuSchema, token: str = Depends(get_token)):
    return await staff_service.upload_menu(menu_data, token)

@router.get("/menu")
async def get_staff_menu(token: str = Depends(get_token)):
    return await staff_service.get_menu(token)

@router.post("/menu/scan-image")
async def scan_menu(file: UploadFile = File(...), token: str = Depends(get_token)):
    return await staff_service.scan_menu_image(file, token)

@router.patch("/menu/{item_id}")
async def update_menu_item(item_id: str, update_data: UpdateMenuItemSchema, token: str = Depends(get_token)):
    return await staff_service.update_menu_item(item_id, update_data, token)

@router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, token: str = Depends(get_token)):
    return await staff_service.delete_menu_item(item_id, token)

@router.get("/orders")
async def get_staff_orders(status: str = "PAID", token: str = Depends(get_token)):
    return await staff_service.get_stall_orders(token, status_filter=status)

@router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, status_data: UpdateOrderStatusSchema, token: str = Depends(get_token)):
    return await staff_service.update_order_status_staff(order_id, status_data, token)

@router.post("/orders/verify-pickup")
async def verify_pickup(verify_data: VerifyPickupSchema, token: str = Depends(get_token)):
    return await staff_service.verify_order_pickup(verify_data, token)

@router.get("/resale/items")
async def get_staff_resale_items(token: str = Depends(get_token)):
    return await staff_service.get_stall_resale_items(token)

@router.patch("/resale/{resale_id}/price")
async def update_resale_price(resale_id: str, body: UpdateResalePriceSchema, token: str = Depends(get_token)):
    return await staff_service.update_resale_price(resale_id, body.new_price, token)