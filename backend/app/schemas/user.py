# app/schemas/user.py

from pydantic import BaseModel, Field
from typing import List, Optional

class UpdateUserProfileSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    roll_number: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = None

class CartItemSchema(BaseModel):
    item_id: str
    quantity: int = Field(..., gt=0)

class CreateOrderSchema(BaseModel):
  stall_id: str
  items: List[CartItemSchema]
  eco_points_to_redeem: int = 0

class OrderItemSchema(BaseModel):
    name: str
    quantity: int
    price: float

class OrderResponseSchema(BaseModel):
    order_id: str
    user_id: str
    amount: float
    status: str
    items: List[OrderItemSchema]
    created_at: str

class VerifyPaymentSchema(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    internal_order_id: str

class CancelOrderResponse(BaseModel):
    message: str
    resale_created: bool = False
