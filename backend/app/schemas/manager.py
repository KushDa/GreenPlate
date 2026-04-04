# app/schemas/manager.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional

class AddStaffSchema(BaseModel):
    email: EmailStr

class UpdateStaffEmailSchema(BaseModel):
    new_email: str

class StaffStats(BaseModel):
    uid: str
    name: str
    email: str
    role: str
    month_total: int
    today_total: int
    last_active: Optional[str] = None

class StallPerformanceResponse(BaseModel):
    stall_id: str
    period: str
    staff_stats: List[StaffStats]
