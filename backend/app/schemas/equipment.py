from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from uuid import UUID
from datetime import datetime

class EquipmentBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    category: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = None
    price_per_day: Decimal = Field(..., gt=0)
    location: str = Field(..., min_length=2, max_length=150)
    image_url: Optional[str] = None
    is_available: bool = True

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None
    price_per_day: Optional[Decimal] = Field(None, gt=0)
    location: Optional[str] = Field(None, min_length=2, max_length=150)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None

class EquipmentResponse(EquipmentBase):
    id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
