# app/schemas/auth.py

from pydantic import BaseModel

class StaffAuthResponse(BaseModel):
    message: str
    role: str
    stall_id: str
    college_id: str
