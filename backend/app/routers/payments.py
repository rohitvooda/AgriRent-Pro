from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from ..database import get_db
from ..schemas.payment import PaymentCreate, PaymentResponse
from ..services import payment_service, booking_service
from ..dependencies import get_farmer, get_current_user
from ..models.user import User

router = APIRouter(prefix="/payments", tags=["payments"])

@router.post("", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def make_payment(
    payment_in: PaymentCreate,
    current_user: User = Depends(get_farmer),
    db: Session = Depends(get_db)
):
    """Process and record a payment transaction for an approved booking. Farmers only."""
    booking = booking_service.get_booking_by_id(db, payment_in.booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found."
        )
        
    if booking.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to pay for this booking."
        )
        
    # Check if booking is in pending or approved status before allowing payment
    if booking.status not in ["pending", "approved"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot pay for a booking with status: {booking.status}"
        )
        
    return payment_service.create_payment(db, payment_in)

@router.get("/booking/{booking_id}", response_model=List[PaymentResponse])
def get_booking_payments(
    booking_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch payments related to a specific booking. Access restricted to involved users/admins."""
    booking = booking_service.get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking record not found."
        )
        
    # Verify ownership/participation
    if (booking.farmer_id != current_user.id and 
        booking.equipment.owner_id != current_user.id and 
        current_user.role != "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied."
        )
        
    return payment_service.get_payments_by_booking(db, booking_id)
