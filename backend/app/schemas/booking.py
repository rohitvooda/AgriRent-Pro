from pydantic import BaseModel, Field
from typing import Optional
from dateutil.parser import parse
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
from .equipment import EquipmentResponse

class BookingBase(BaseModel):
    equipment_id: UUID
    start_date: date
    end_date: date

class BookingCreate(BookingBase):
    pass

class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|approved|rejected|cancelled|completed)$")

class BookingResponse(BookingBase):
    id: UUID
    farmer_id: UUID
    total_price: Decimal
    status: str
    created_at: datetime
    updated_at: datetime
    
    # Nested relations if loaded
    equipment: Optional[EquipmentResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True
