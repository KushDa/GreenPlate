# app/schemas/staff.py

from pydantic import BaseModel, Field
from typing import List, Optional

class UpdateStaffProfileSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    phone: Optional[str] = None

class MenuItemSchema(BaseModel):
    name: str
    price: float = Field(..., gt=0)
    description: Optional[str] = None
    image_ref: Optional[str] = Field(
        None,
        description="Reference to menu image (URL, CDN key, or placeholder id)"
    )
    is_available: bool = True

class MenuSchema(BaseModel):
    stall_id: str
    items: List[MenuItemSchema]

class UpdateMenuItemSchema(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    image_ref: Optional[str] = None
    is_available: Optional[bool] = None

class ExtractedMenuItem(BaseModel):
    name: str = Field(..., description="The name of the food item")
    price: Optional[float] = Field(None, description="The price of the item")
    description: str = Field("", description="Short AI-generated description (6–7 words)")

class MenuScanResponse(BaseModel):
    detected_items: List[ExtractedMenuItem]
    count: int
    message: str = "Scan complete. Please verify items before saving."

class UpdateOrderStatusSchema(BaseModel):
    status: str

class VerifyPickupSchema(BaseModel):
    order_id: str
    pickup_code: str = Field(..., min_length=4, max_length=4, description="4-digit pickup code")

class ResaleItemSchema(BaseModel):
    resale_id: str
    items: List[dict]
    original_price: float
    discounted_price: float
    stall_name: str
    status: str

class UpdateResalePriceSchema(BaseModel):
    new_price: float
