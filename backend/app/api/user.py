from fastapi import APIRouter, Depends, Request
from app.schemas.user import UpdateUserProfileSchema, CreateOrderSchema, VerifyPaymentSchema
from app.services.user_services import UserService
from app.core.security import get_token

router = APIRouter()
user_service = UserService()

@router.patch("/profile")
async def update_profile(profile_data: UpdateUserProfileSchema, token: str = Depends(get_token)):
    return await user_service.update_user_profile(profile_data, token)

@router.get("/menu")
async def get_student_menu(token: str = Depends(get_token)):
    return await user_service.get_user_menu(token)

@router.get("/feed/discounted")
async def get_discounted_feed(token: str = Depends(get_token)):
    return await user_service.get_discounted_feed(token)

@router.post("/order/create")
async def create_order(order_data: CreateOrderSchema, token: str = Depends(get_token)):
    return await user_service.create_payment_order(order_data, token)

@router.get("/orders")
async def get_student_orders(token: str = Depends(get_token)):
    return await user_service.get_user_orders(token)

@router.post("/order/verify")
async def verify_order(payment_data: VerifyPaymentSchema, token: str = Depends(get_token)):
    return await user_service.verify_payment_and_update_order(payment_data, token)

@router.post("/order/{order_id}/cancel")
async def cancel_order(order_id: str, token: str = Depends(get_token)):
    return await user_service.cancel_order(order_id, token)

@router.post("/resale/{resale_id}/buy")
async def buy_resale_item(resale_id: str, token: str = Depends(get_token)):
    return await user_service.buy_resale_item(resale_id, token)