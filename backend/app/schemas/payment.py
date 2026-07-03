from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from uuid import UUID
from datetime import datetime

class PaymentBase(BaseModel):
    booking_id: UUID
    amount: Decimal = Field(..., gt=0)
    payment_method: str = Field(..., min_length=2, max_length=50) # 'UPI', 'Card', 'COD'

class PaymentCreate(PaymentBase):
    transaction_id: Optional[str] = Field(None, max_length=100)

class PaymentStatusUpdate(BaseModel):
    payment_status: str = Field(..., pattern="^(pending|completed|failed|refunded)$")

class PaymentResponse(PaymentBase):
    id: UUID
    payment_status: str
    transaction_id: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True
